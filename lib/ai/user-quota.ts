/**
 * user-quota.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Per-user daily token quota tracker.
 *
 * Stored in-memory (resets on server restart, which is fine for a hackathon).
 * For production, swap the Map for a Redis/Firestore counter.
 *
 * Quota tiers (daily reset at midnight UTC):
 *   Authenticated users  → 80 000 tokens / day
 *   Anonymous users (IP) → 20 000 tokens / day
 *
 * When a user exceeds their quota the caller should fall back to heuristics.
 */

interface UserRecord {
  tokensUsed: number;
  resetAt: number; // Unix timestamp ms
}

// In-memory store: userId|ip → record
const store = new Map<string, UserRecord>();

const DAILY_MS = 24 * 60 * 60 * 1_000;
const QUOTA_AUTH   = 80_000; // authenticated user daily cap
const QUOTA_ANON   = 20_000; // anonymous (IP-based) daily cap

function quotaFor(userId: string): number {
  // Authenticated users have a numeric Firebase UID (no dots at the start);
  // anon keys are prefixed "ip:"
  return userId.startsWith("ip:") ? QUOTA_ANON : QUOTA_AUTH;
}

function getRecord(userId: string): UserRecord {
  const now   = Date.now();
  let record  = store.get(userId);

  // Create or reset expired record
  if (!record || now >= record.resetAt) {
    record = {
      tokensUsed: 0,
      resetAt: startOfNextDayUTC(),
    };
    store.set(userId, record);
  }
  return record;
}

function startOfNextDayUTC(): number {
  const now  = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return next.getTime();
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Remaining token allowance for this user today (0 means exhausted). */
export function getRemainingQuota(userId: string): number {
  const record = getRecord(userId);
  return Math.max(0, quotaFor(userId) - record.tokensUsed);
}

/**
 * Attempt to reserve `tokens` from the user's daily quota.
 * Returns `true` if the quota was available (and is now decremented).
 * Returns `false` if the user is over-quota (caller should use heuristics).
 */
export function consumeQuota(userId: string, tokens: number): boolean {
  const record = getRecord(userId);
  const limit  = quotaFor(userId);

  if (record.tokensUsed + tokens > limit) {
    console.warn(
      `[quota] User "${userId}" is over daily limit ` +
      `(used ${record.tokensUsed}, requested ${tokens}, limit ${limit})`
    );
    return false;
  }

  record.tokensUsed += tokens;
  console.info(
    `[quota] User "${userId}" consumed ${tokens} tokens ` +
    `(${record.tokensUsed}/${limit} today)`
  );
  return true;
}

/** Snapshot of current usage — returned to client for transparency. */
export function quotaSnapshot(userId: string): {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
} {
  const record = getRecord(userId);
  const limit  = quotaFor(userId);
  return {
    used:      record.tokensUsed,
    limit,
    remaining: Math.max(0, limit - record.tokensUsed),
    resetsAt:  new Date(record.resetAt).toISOString(),
  };
}

/**
 * Derive a stable user-key from the request.
 * Priority: Firebase UID header > X-Forwarded-For > remote IP > "anon"
 */
export function resolveUserId(req: {
  headers: { get(name: string): string | null };
}): string {
  const uid = req.headers.get("x-user-id");
  if (uid && uid.trim().length > 0) return uid.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return `ip:${forwarded.split(",")[0].trim()}`;

  return "ip:unknown";
}

/** Purge expired entries (call occasionally to prevent unbounded memory growth). */
export function pruneExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now >= record.resetAt + DAILY_MS) store.delete(key);
  }
}
