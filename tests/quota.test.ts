import test from "node:test";
import assert from "node:assert";
import { consumeQuota, getRemainingQuota, resolveUserId } from "../lib/ai/user-quota";

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
  const mockJwt = `eyJhbGciOiJIUzI1NiJ9.${mockPayload}.signature`;

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
