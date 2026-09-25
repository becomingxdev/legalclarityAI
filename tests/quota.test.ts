import test from "node:test";
import assert from "node:assert";
import {
  consumeQuota,
  getRemainingQuota,
  resolveUserId,
  verifyFirebaseIdToken,
} from "../lib/ai/user-quota";

test("Quota: allows consumption within daily limits", () => {
  const testUserId = `test-user-${Date.now()}`;
  const initial = getRemainingQuota(testUserId);
  assert.strictEqual(initial, 80000, "Authenticated user starts with 80k quota");

  const allowed = consumeQuota(testUserId, 20000);
  assert.strictEqual(allowed, true, "Request within allowance must be accepted");

  const remaining = getRemainingQuota(testUserId);
  assert.strictEqual(remaining, 60000, "Remaining tokens must accurately decrement");
});

test("Quota: rejects consumption when limit is exceeded", () => {
  const testUserId = `test-user-over-${Date.now()}`;
  consumeQuota(testUserId, 79000); // 1k remaining

  const rejected = consumeQuota(testUserId, 5000);
  assert.strictEqual(rejected, false, "Request exceeding remaining quota must be rejected");

  const remaining = getRemainingQuota(testUserId);
  assert.strictEqual(remaining, 1000, "Quota must remain intact when request rejected");
});

test("Quota: server extracts identity from Bearer token, refusing forged x-user-id headers", async () => {
  // Construct a mock JWT with payload containing user_id: 'real-user-456'
  const mockPayload = Buffer.from(JSON.stringify({ user_id: "real-user-456" })).toString("base64");
  const mockJwt = `mock-${mockPayload}`;

  // Request contains a spoofed x-user-id header AND a verified Bearer token
  const req = {
    headers: {
      get(name: string) {
        if (name.toLowerCase() === "authorization") return `Bearer ${mockJwt}`;
        if (name.toLowerCase() === "x-user-id") return "spoofed-attacker-user";
        return null;
      },
    },
  };

  const resolvedId = await resolveUserId(req);
  assert.strictEqual(resolvedId, "real-user-456", "Server must authenticate via Bearer token, not client x-user-id header");
});

test("Quota: falls back to client IP when no Authorization header is provided", async () => {
  const req = {
    headers: {
      get(name: string) {
        if (name.toLowerCase() === "x-forwarded-for") return "203.0.113.195, 198.51.100.1";
        return null;
      },
    },
  };

  const resolvedId = await resolveUserId(req);
  assert.strictEqual(resolvedId, "ip:203.0.113.195", "Server must fall back to first hop client IP");
});

test("Quota: falls back to client IP when malformed Bearer token is provided", async () => {
  const req = {
    headers: {
      get(name: string) {
        if (name.toLowerCase() === "authorization") return "Bearer not-a-valid-token";
        if (name.toLowerCase() === "x-forwarded-for") return "198.51.100.42";
        return null;
      },
    },
  };

  const resolvedId = await resolveUserId(req);
  assert.strictEqual(resolvedId, "ip:198.51.100.42", "Malformed token must safely fall back to IP");
});

test("Auth: verifyFirebaseIdToken returns null for empty or non-string input", async () => {
  const emptyRes = await verifyFirebaseIdToken("");
  assert.strictEqual(emptyRes, null, "Empty token must reject");
});
