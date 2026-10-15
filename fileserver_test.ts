import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { FakeTime } from "jsr:@std/testing/time";
import { fileHandler } from "./fileserver.ts";

// TESTS BY LLM
// =====================================================================
// FIXTURES & HELPERS
// =====================================================================


// =====================================================================
// FIXTURES & HELPERS
// =====================================================================

const REFRESH_RATE_MS = 4_000; // 4 seconds per token
const MAX_REQUESTS = 5;
const FULL_COOLDOWN_MS = REFRESH_RATE_MS * MAX_REQUESTS; // 20 seconds

const MOCK_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);
const MOCK_GIF = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
]);
const MOCK_MP4 = new Uint8Array([
  0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
  0x6d, 0x70, 0x34, 0x32, 0x00, 0x00, 0x00, 0x00,
]);
const MOCK_TXT = new TextEncoder().encode("Hello World");
const MOCK_EMPTY = new Uint8Array(0);

let ipOctetC = 0;
let ipOctetD = 1;

/**
 * Generates a unique IP per call by default so rate-limit state
 * never bleeds between unrelated tests.
 */
function createMockInfo(customIp?: string): Deno.ServeHandlerInfo {
  if (!customIp) {
    ipOctetD++;
    if (ipOctetD > 254) {
      ipOctetD = 1;
      ipOctetC++;
    }
  }

  return {
    remoteAddr: {
      transport: "tcp",
      hostname: customIp ?? `10.0.${ipOctetC}.${ipOctetD}`,
      port: 54321,
    },
    completed: Promise.resolve(),
  };
}

function createUploadRequest(
  fileName: string,
  fileData: Uint8Array,
  mimeType: string,
  password: string | null = "vind",
): Request {
  const file = new File([fileData as unknown as BlobPart], fileName, {
    type: mimeType,
  });
  const formData = new FormData();
  formData.append("file", file);

  if (password !== null) {
    formData.append("password", password);
  }

  return new Request("http://localhost/", {
    method: "POST",
    body: formData,
  });
}

async function assertFileMatchesAndCleanup(
  filePath: string,
  expectedBytes: Uint8Array,
) {
  try {
    const diskBytes = await Deno.readFile(filePath);
    assertEquals(diskBytes, expectedBytes);
  } finally {
    await Deno.remove(filePath).catch(() => {});
  }
}

// =====================================================================
// AUTHENTICATION (PASSWORD) TESTS
// =====================================================================

Deno.test("AUTH: Password validation edge cases", async (t) => {
  await t.step("valid password ('vind') succeeds with 200", async () => {
    const req = createUploadRequest("auth-ok.png", MOCK_PNG, "image/png", "vind");
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 200);
    await assertFileMatchesAndCleanup("./saved/image/auth-ok.png", MOCK_PNG);
  });

  await t.step("missing password field returns 401 'NO!'", async () => {
    const req = createUploadRequest("test.png", MOCK_PNG, "image/png", null);
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 401);
    assertEquals(await res.text(), "NO!");
  });

  await t.step("empty string password returns 401", async () => {
    const req = createUploadRequest("test.png", MOCK_PNG, "image/png", "");
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 401);
  });

  await t.step("wrong password returns 401", async () => {
    const req = createUploadRequest("test.png", MOCK_PNG, "image/png", "hunter2");
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 401);
  });

  await t.step("password check is case-sensitive ('Vind' and 'VIND' fail)", async () => {
    for (const badCase of ["Vind", "VIND", "vInD"]) {
      const req = createUploadRequest("test.png", MOCK_PNG, "image/png", badCase);
      const res = await fileHandler(req, createMockInfo());
      assertEquals(res.status, 401);
    }
  });

  await t.step("password with leading or trailing whitespace returns 401", async () => {
    for (const padded of [" vind", "vind ", " vind "]) {
      const req = createUploadRequest("test.png", MOCK_PNG, "image/png", padded);
      const res = await fileHandler(req, createMockInfo());
      assertEquals(res.status, 401);
    }
  });

  await t.step("password check runs before file presence check (returns 401, not 400)", async () => {
    const formData = new FormData();
    formData.append("password", "wrong");
    const req = new Request("http://localhost/", { method: "POST", body: formData });
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 401);
  });

  await t.step("GET requests do not require a password", async () => {
    const req = new Request("http://localhost/", { method: "GET" });
    const res = await fileHandler(req, createMockInfo());
    assertEquals(res.status, 200);
  });
});

// =====================================================================
// RATE LIMITING & FAKETIME TESTS
// =====================================================================

Deno.test("RATE LIMIT: Burst capacity allows MAX_REQUESTS (5) and blocks 6th with 429", async () => {
  using _time = new FakeTime();
  const client = createMockInfo("192.168.10.1");

  for (let i = 1; i <= MAX_REQUESTS; i++) {
    const res = await fileHandler(new Request("http://localhost/"), client);
    assertEquals(res.status, 200, `Request ${i} should succeed`);
  }

  const blocked = await fileHandler(new Request("http://localhost/"), client);
  assertEquals(blocked.status, 429);
  assertEquals(await blocked.text(), "Too many requests");
});

Deno.test("RATE LIMIT: Per-IP isolation ensures one throttled IP does not block others", async () => {
  using _time = new FakeTime();
  const attacker = createMockInfo("192.168.10.2");
  const normalUser = createMockInfo("192.168.10.3");

  // Exhaust attacker's bucket
  for (let i = 0; i < MAX_REQUESTS; i++) {
    await fileHandler(new Request("http://localhost/"), attacker);
  }
  const attackerBlocked = await fileHandler(new Request("http://localhost/"), attacker);
  assertEquals(attackerBlocked.status, 429);

  // Normal user on a different IP is unaffected
  const normalRes = await fileHandler(new Request("http://localhost/"), normalUser);
  assertEquals(normalRes.status, 200);
});

Deno.test("RATE LIMIT: Failed POST auth attempts (401) still consume rate limit tokens", async () => {
  using _time = new FakeTime();
  const bruteForcer = createMockInfo("192.168.10.4");

  for (let i = 0; i < MAX_REQUESTS; i++) {
    const req = createUploadRequest("test.png", MOCK_PNG, "image/png", "wrong-guess");
    const res = await fileHandler(req, bruteForcer);
    assertEquals(res.status, 401);
  }

  // 6th attempt is blocked by rate limiter before even checking password
  const sixthAttempt = createUploadRequest("test.png", MOCK_PNG, "image/png", "vind");
  const blockedRes = await fileHandler(sixthAttempt, bruteForcer);
  assertEquals(blockedRes.status, 429);
});

Deno.test("RATE LIMIT: Full recovery after waiting MAX_REQUESTS * REFRESH_RATE (20s)", async () => {
  using time = new FakeTime();
  const client = createMockInfo("192.168.10.5");

  // Exhaust all 5 tokens at t = 0
  for (let i = 0; i < MAX_REQUESTS; i++) {
    await fileHandler(new Request("http://localhost/"), client);
  }
  assertEquals((await fileHandler(new Request("http://localhost/"), client)).status, 429);

  // Advance full 20 seconds -> bucket resets to MAX_REQUESTS
  time.tick(FULL_COOLDOWN_MS);

  // Should be able to fire another full burst of 5 requests
  for (let i = 1; i <= MAX_REQUESTS; i++) {
    const res = await fileHandler(new Request("http://localhost/"), client);
    assertEquals(res.status, 200, `Post-recovery request ${i} should succeed`);
  }

  // 6th request after recovery is blocked again
  assertEquals((await fileHandler(new Request("http://localhost/"), client)).status, 429);
});

Deno.test("RATE LIMIT: Spam penalty resets cooldown timer on premature requests", async () => {
  using time = new FakeTime();
  const spammer = createMockInfo("192.168.10.6");

  // Exhaust all 5 tokens
  for (let i = 0; i < MAX_REQUESTS; i++) {
    await fileHandler(new Request("http://localhost/"), spammer);
  }
  assertEquals((await fileHandler(new Request("http://localhost/"), spammer)).status, 429);

  // Spammer keeps hammering every 3.5 seconds (less than the 4s single-token refresh)
  // Even after 35 seconds total, they should remain blocked because bucket.last keeps resetting
  for (let attempt = 0; attempt < 10; attempt++) {
    time.tick(3_500);
    const res = await fileHandler(new Request("http://localhost/"), spammer);
    assertEquals(res.status, 429, `Spam attempt ${attempt + 1} should remain blocked`);
  }

  // Once they finally wait the full 20s without spamming, they are allowed through
  time.tick(FULL_COOLDOWN_MS);
  const recoveredRes = await fileHandler(new Request("http://localhost/"), spammer);
  assertEquals(recoveredRes.status, 200);
});

Deno.test("RATE LIMIT: Partial token refill while tokens remain greater than 0", async () => {
  using time = new FakeTime();
  const client = createMockInfo("192.168.10.7");

  // Spend 4 tokens (1 token left in bucket)
  for (let i = 0; i < 4; i++) {
    const res = await fileHandler(new Request("http://localhost/"), client);
    assertEquals(res.status, 200);
  }

  // Wait 8 seconds -> refills 2 tokens (1 + 2 = 3 tokens available)
  time.tick(REFRESH_RATE_MS * 2);

  // All 3 available tokens should succeed
  for (let i = 1; i <= 3; i++) {
    const res = await fileHandler(new Request("http://localhost/"), client);
    assertEquals(res.status, 200, `Refilled token ${i} should succeed`);
  }

  // 4th request should now hit 429
  const blocked = await fileHandler(new Request("http://localhost/"), client);
  assertEquals(blocked.status, 429);
});

Deno.test("RATE LIMIT: Partial token refill from 0 tokens after 1 REFRESH_RATE (4s)", async () => {
  using time = new FakeTime();
  const client = createMockInfo("192.168.10.8");

  // Spend all 5 tokens -> 0 tokens left
  for (let i = 0; i < MAX_REQUESTS; i++) {
    await fileHandler(new Request("http://localhost/"), client);
  }

  // Wait 4 seconds (enough for 1 new token)
  time.tick(REFRESH_RATE_MS);

  // NOTE: Fails on current fileserver.ts unless newRequests is added before checking (bucket.tokens > 0)
  const singleRefillRes = await fileHandler(new Request("http://localhost/"), client);
  assertEquals(singleRefillRes.status, 200);

  const nextRes = await fileHandler(new Request("http://localhost/"), client);
  assertEquals(nextRes.status, 429);
});

Deno.test("RATE LIMIT: Waiting with 4 tokens does not overflow MAX_REQUESTS cap", async () => {
  using time = new FakeTime();
  const client = createMockInfo("192.168.10.9");

  // Spend 1 token (4 tokens remaining)
  await fileHandler(new Request("http://localhost/"), client);

  // Wait 16 seconds (+4 tokens). Total should cap at MAX_REQUESTS (5), not 4 + 4 = 8.
  time.tick(REFRESH_RATE_MS * 4);

  for (let i = 1; i <= MAX_REQUESTS; i++) {
    const res = await fileHandler(new Request("http://localhost/"), client);
    assertEquals(res.status, 200);
  }

  // NOTE: Fails on current fileserver.ts unless Math.min(MAX_REQUESTS, ...) is used
  const overflowRes = await fileHandler(new Request("http://localhost/"), client);
  assertEquals(overflowRes.status, 429);
});

// =====================================================================
// CORE ROUTES & UPLOAD VALIDATION
// =====================================================================

Deno.test("GET request should return HTML form", async () => {
  const req = new Request("http://localhost/", { method: "GET" });
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Content-Type"), "text/html");
  const text = await res.text();
  assertStringIncludes(text, '<form method="POST" enctype="multipart/form-data">');
});

Deno.test("POST request without file should return 400", async () => {
  const formData = new FormData();
  formData.append("password", "vind");
  const req = new Request("http://localhost/", { method: "POST", body: formData });
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 400);
});

Deno.test("POST request with unsupported file type should return 400", async () => {
  const req = createUploadRequest("test.txt", MOCK_TXT, "text/plain");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 400);
});

Deno.test("POST request with oversized file should return 413", async () => {
  const largeData = new Uint8Array(100 * 1024 * 1024 + 1);
  const req = createUploadRequest("large.png", largeData, "image/png");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 413);
});

Deno.test("POST request routes valid media files and formats filenames", async (t) => {
  const cases = [
    { name: "TestImage.png", data: MOCK_PNG, mime: "image/png", path: "./saved/image/testImage.png" },
    { name: "Animated.gif", data: MOCK_GIF, mime: "image/gif", path: "./saved/gif/animated.gif" },
    { name: "MyVideo.mp4", data: MOCK_MP4, mime: "video/mp4", path: "./saved/video/myVideo.mp4" },
    { name: "CAMELCaseImage.png", data: MOCK_PNG, mime: "image/png", path: "./saved/image/cAMELCaseImage.png" },
  ];

  for (const c of cases) {
    await t.step(`saves ${c.name} to ${c.path}`, async () => {
      const req = createUploadRequest(c.name, c.data, c.mime);
      const res = await fileHandler(req, createMockInfo());

      assertEquals(res.status, 200);
      await assertFileMatchesAndCleanup(c.path, c.data);
    });
  }
});

// =====================================================================
// NICHE AND SECURITY EDGE CASES
// =====================================================================

Deno.test("NICHE: Filename with only illegal characters results in 400", async () => {
  const req = createUploadRequest("<>:|?*", MOCK_PNG, "image/png");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 400);
});

Deno.test("NICHE: Path traversal attempts are neutered and stay in designated directory", async () => {
  const req = createUploadRequest("../../../etc/passwd.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 200);

  const escapedFileExists = await Deno.stat("./passwd.png")
    .then(() => true)
    .catch(() => false);
  assertEquals(escapedFileExists, false);

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
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 400);
});

Deno.test("NICHE: Mismatched file extensions follow magic bytes, not filename", async () => {
  const req = createUploadRequest("malicious.exe", MOCK_PNG, "application/x-msdownload");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/image/malicious.exe", MOCK_PNG);
});

// =====================================================================
// RUNTIME STATE & MUTATION EDGE CASES
// =====================================================================

Deno.test("STATE: Server successfully recovers and creates directory if it was deleted", async () => {
  await Deno.remove("./saved/image", { recursive: true }).catch(() => {});

  const req = createUploadRequest("RecoveryTest.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req, createMockInfo());

  assertEquals(res.status, 200);
  await assertFileMatchesAndCleanup("./saved/image/recoveryTest.png", MOCK_PNG);
});

Deno.test("STATE: Uploading a file overwrites existing files (Data Loss Vulnerability)", async () => {
  Deno.mkdirSync("./saved/image", { recursive: true });
  const filePath = "./saved/image/avatar.png";

  await Deno.writeTextFile(filePath, "This is the original avatar text data.");

  const req = createUploadRequest("avatar.png", MOCK_PNG, "image/png");
  const res = await fileHandler(req, createMockInfo());
  assertEquals(res.status, 200);

  await assertFileMatchesAndCleanup(filePath, MOCK_PNG);
});
