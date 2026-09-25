import { NextRequest, NextResponse } from "next/server";
import { resolveUserId, quotaSnapshot } from "@/lib/ai/user-quota";

/** GET /api/quota — returns the caller's current daily token quota status. */
export async function GET(req: NextRequest) {
  const userId = resolveUserId(req);
  const snapshot = quotaSnapshot(userId);
  return NextResponse.json({ success: true, userId, quota: snapshot });
}
