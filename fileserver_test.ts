import { assertEquals, assertStringIncludes, assertRejects } from "jsr:@std/assert";
import { fileHandler } from "./fileserver.ts";
import { unescape } from "jsr:@std/internal@^1.0.14/diff-str";
import sanitizeFileName from "sanitize-filename";
import { fileTypeFromFile, fileTypeFromBuffer, FileTypeResult } from "file-type";
import { dir } from "node:console";


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

// Magic bytes for different file types so `file-type` detects them properly
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
  assertEquals(await res.text(), "File required but not provided.");
});

Deno.test("POST request with unsupported file type should return 400", async () => {
  const req = createUploadRequest("test.txt", MOCK_TXT, "text/plain");
  const res = await fileHandler(req);
  assertEquals(res.status, 400);
  assertEquals(await res.text(), "File type not supported");
});

Deno.test("POST request with oversized file should return 413", async () => {
  const largeData = new Uint8Array(100 * 1024 * 1024 + 1);
  const req = createUploadRequest("large.png", largeData, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 413);
  assertStringIncludes((await res.text()).toLowerCase(), "exceeds 100mb limit");
});

Deno.test("POST request with valid PNG should save file and return 200", async () => {
  const req = createUploadRequest("TestImage.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);
  assertStringIncludes(await res.text(), "Wrote ./saved/image/testImage.png");
  await Deno.remove("./saved/image/testImage.png");
});

Deno.test("POST request with valid GIF should save to gif folder and return 200", async () => {
  const req = createUploadRequest("Animated.gif", MOCK_GIF, "image/gif");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);
  assertStringIncludes(await res.text(), "Wrote ./saved/gif/animated.gif");
  await Deno.remove("./saved/gif/animated.gif");
});

Deno.test("POST request with valid Video should save to video folder and return 200", async () => {
  const req = createUploadRequest("MyVideo.mp4", MOCK_MP4, "video/mp4");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);
  assertStringIncludes(await res.text(), "Wrote ./saved/video/myVideo.mp4");
  await Deno.remove("./saved/video/myVideo.mp4");
});

Deno.test("POST request should correctly lowercase ONLY the first letter", async () => {
  const req = createUploadRequest("CAMELCaseImage.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);
  assertStringIncludes(await res.text(), "Wrote ./saved/image/cAMELCaseImage.png");
  await Deno.remove("./saved/image/cAMELCaseImage.png");
});

// =====================================================================
// NICHE AND SECURITY EDGE CASES
// =====================================================================

Deno.test("NICHE: Filename with only illegal characters results in 400", async () => {
  // Filename made entirely of characters that sanitize-filename strips
  const req = createUploadRequest("<>:|?*", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  // The server MUST return 400 here, not 500.
  // If the server crashes on `""[0].toLocaleLowerCase()`, this test will fail to remind you to fix it.
  assertEquals(res.status, 400);
});

Deno.test("NICHE: Path traversal attempts are neutered", async () => {
  // Attacker tries to save the file outside the designated directory
  const req = createUploadRequest("../../../etc/passwd.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);

  const text = await res.text();
  // Ensure the path traversal dots/slashes were completely stripped or replaced
  assertEquals(text.includes("../"), false);
  assertStringIncludes(text, "Wrote ./saved/image/");

  // Cleanup based on what sanitize-filename outputs (usually it strips slashes)
  await Deno.remove("./saved/image/..._.._.._etc_passwd.png").catch(() => {});
  await Deno.remove("./saved/image/passwd.png").catch(() => {}); // Fallback cleanup
});

Deno.test("NICHE: Uploading a 0-byte file fails gracefully", async () => {
  // A file with 0 bytes has no magic headers. `file-type` should return undefined.
  const req = createUploadRequest("empty.png", MOCK_EMPTY, "image/png");
  const res = await fileHandler(req);

  assertEquals(res.status, 400);
  assertEquals(await res.text(), "File type not supported");
});

Deno.test("NICHE: Mismatched file extensions follow magic bytes, not the name", async () => {
  // An attacker uploads a valid PNG but names it .exe.
  // Because your server relies on magic bytes, it gets grouped safely in 'image'.
  const req = createUploadRequest("malicious.exe", MOCK_PNG, "application/x-msdownload");
  const res = await fileHandler(req);

  assertEquals(res.status, 200);
  const text = await res.text();

  // Confirms the server ignored the .exe extension and routed it based on file content.
  assertStringIncludes(text, "Wrote ./saved/image/malicious.exe");

  await Deno.remove("./saved/image/malicious.exe");
});


// exclude this test because fuck windows
// Deno.test("NICHE: Windows reserved filenames are safely modified", async () => {
//   // Windows throws errors if you try to save a file named CON, PRN, AUX, etc.
//   const req = createUploadRequest("CON", MOCK_PNG, "image/png");
//   const res = await fileHandler(req);
//
//   assertEquals(res.status, 200);
//   const text = await res.text();
//
//   // `sanitize-filename` appends a string to reserved names (or handles them safely)
//   assertEquals(text.includes("/image/cON"), false); // It should not simply be "cON"
//
//   // We don't strictly test the exact output, just that it was written successfully without a server crash
//   assertStringIncludes(text, "Wrote ./saved/image/");
// });


// =====================================================================
// RUNTIME STATE & MUTATION EDGE CASES
// =====================================================================

Deno.test("STATE: Server successfully recovers and creates directory if it was deleted", async () => {
  // 1. Nuke the directory to guarantee a hostile environment
  await Deno.remove("./saved/image", { recursive: true }).catch(() => {});

  // 2. Fire the request
  const req = createUploadRequest("RecoveryTest.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);

  // 3. Assert the server handled it beautifully instead of crashing
  assertEquals(res.status, 200);

  // 4. Verify the file actually made it to the newly minted directory
  const fileExists = await Deno.stat("./saved/image/recoveryTest.png")
    .then(() => true)
    .catch(() => false);

  assertEquals(fileExists, true);

  // Cleanup
  await Deno.remove("./saved/image/recoveryTest.png");
});

Deno.test("STATE: Uploading a file overwrites existing files (Data Loss Vulnerability)", async () => {
  Deno.mkdirSync("./saved/image", { recursive: true });
  const filePath = "./saved/image/avatar.png";

  // 1. Simulate an existing file that was previously uploaded or edited
  await Deno.writeTextFile(filePath, "This is the original avatar text data.");

  // 2. A new request comes in uploading a file with the exact same name
  const req = createUploadRequest("avatar.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req);
  assertEquals(res.status, 200);

  // 3. Read the file from disk to verify what happened
  const currentDiskBytes = await Deno.readFile(filePath);

  // Deno.create() truncates existing files by default.
  // The test passes if the file content now exactly matches the MOCK_PNG bytes,
  // proving the original data was permanently destroyed and overwritten.
  assertEquals(currentDiskBytes, MOCK_PNG);

  // Cleanup
  await Deno.remove(filePath);
});
