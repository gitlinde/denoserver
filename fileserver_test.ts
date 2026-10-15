import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { fileHandler } from "./fileserver.ts";

// TESTS BY LLM

// Helper function to create a mock FormData request
function createUploadRequest(fileName: string, fileData: Uint8Array, mimeType: string): Request {
  const file = new File([fileData as unknown as BlobPart], fileName, { type: mimeType });
  const formData = new FormData();
  formData.append("file", file);

  return new Request("http://localhost/", {
    method: "POST",
    body: formData,
  });
}

// Helper to check disk state directly and clean up
async function assertFileMatchesAndCleanup(filePath: string, expectedBytes: Uint8Array) {
  try {
    const diskBytes = await Deno.readFile(filePath);
    assertEquals(diskBytes, expectedBytes);
  } finally {
    await Deno.remove(filePath).catch(() => {});
  }
}

// Magic bytes for different file types
const MOCK_PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]);
const MOCK_GIF = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00]);
const MOCK_MP4 = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32, 0x00, 0x00, 0x00, 0x00]);
const MOCK_TXT = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]); // "Hello World"
const MOCK_EMPTY = new Uint8Array(0);

Deno.test("GET request should return HTML form", async () => {
  const req = new Request("http://localhost/", { method: "GET" });
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Content-Type"), "text/html");
  const text = await res.text();
  assertStringIncludes(text, '<form method="POST" enctype="multipart/form-data">');
});

Deno.test("POST request without file should return 400", async () => {
  const formData = new FormData();
  const req = new Request("http://localhost/", { method: "POST", body: formData });
  const res = await fileHandler(req);

  assertEquals(res.status, 400);
});

Deno.test("POST request with unsupported file type should return 400", async () => {
  const req = createUploadRequest("test.txt", MOCK_TXT, "text/plain");
  const res = await fileHandler(req);

  assertEquals(res.status, 400);
});

Deno.test("POST request with oversized file should return 413", async () => {
  const largeData = new Uint8Array(100 * 1024 * 1024 + 1);
  const req = createUploadRequest("large.png", largeData, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 413);
});

Deno.test("POST request with valid PNG should save file to disk", async () => {
  const req = createUploadRequest("TestImage.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/image/testImage.png", MOCK_PNG);
});

Deno.test("POST request with valid GIF should save to gif directory", async () => {
  const req = createUploadRequest("Animated.gif", MOCK_GIF, "image/gif");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/gif/animated.gif", MOCK_GIF);
});

Deno.test("POST request with valid Video should save to video directory", async () => {
  const req = createUploadRequest("MyVideo.mp4", MOCK_MP4, "video/mp4");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/video/myVideo.mp4", MOCK_MP4);
});

Deno.test("POST request should correctly lowercase ONLY the first letter on disk", async () => {
  const req = createUploadRequest("CAMELCaseImage.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/image/cAMELCaseImage.png", MOCK_PNG);
});

// =====================================================================
// NICHE AND SECURITY EDGE CASES
// =====================================================================

Deno.test("NICHE: Filename with only illegal characters results in 400", async () => {
  const req = createUploadRequest("<>:|?*", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 400);
});

Deno.test("NICHE: Path traversal attempts are neutered and stay in designated directory", async () => {
  const req = createUploadRequest("../../../etc/passwd.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);

  // Assert it was NOT written outside the target directory
  const escapedFileExists = await Deno.stat("./passwd.png").then(() => true).catch(() => false);
  assertEquals(escapedFileExists, false);

  // Assert it stayed safely inside ./saved/image/
  let foundInTargetDir = false;
  for await (const entry of Deno.readDir("./saved/image")) {
    if (entry.name.includes("passwd.png")) {
      foundInTargetDir = true;
      await Deno.remove(`./saved/image/${entry.name}`);
      break;
    }
  }
  assertEquals(foundInTargetDir, true);
});

Deno.test("NICHE: Uploading a 0-byte file fails gracefully with 400", async () => {
  const req = createUploadRequest("empty.png", MOCK_EMPTY, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 400);
});

Deno.test("NICHE: Mismatched file extensions follow magic bytes, not filename", async () => {
  const req = createUploadRequest("malicious.exe", MOCK_PNG, "application/x-msdownload");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);

  // File must land in the image folder based on byte signature, not the extension
  await assertFileMatchesAndCleanup("./saved/image/malicious.exe", MOCK_PNG);
});

// =====================================================================
// RUNTIME STATE & MUTATION EDGE CASES
// =====================================================================

Deno.test("STATE: Server successfully recovers and creates directory if it was deleted", async () => {
  // 1. Nuke the directory to simulate an external deletion
  await Deno.remove("./saved/image", { recursive: true }).catch(() => {});

  // 2. Fire the request
  const req = createUploadRequest("RecoveryTest.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);

  // 3. Verify the file and directory were restored
  await assertFileMatchesAndCleanup("./saved/image/recoveryTest.png", MOCK_PNG);
});

Deno.test("STATE: Uploading a file overwrites existing files (Data Loss Vulnerability)", async () => {
  Deno.mkdirSync("./saved/image", { recursive: true });
  const filePath = "./saved/image/avatar.png";

  // 1. Pre-seed a file
  await Deno.writeTextFile(filePath, "This is the original avatar text data.");

  // 2. Upload with same name
  const req = createUploadRequest("avatar.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);

  // 3. Confirm file contents match new upload rather than old text
  await assertFileMatchesAndCleanup(filePath, MOCK_PNG);
});
