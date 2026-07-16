// app/api/entitlements/route.ts — GET: return fresh user entitlements (read-only)

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements } from "@/lib/entitlements";
import { successResponse, errorResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
      { status: 401 }
    );
  }

  const entitlements = await getUserEntitlements(userId);

  return NextResponse.json(
    successResponse({
      plan: entitlements.plan,
      projectTrialUsed: entitlements.projectTrialUsed,
      freeFollowUpRunsUsed: entitlements.freeFollowUpRunsUsed,
      monthlyFollowUpRunsUsed: entitlements.monthlyFollowUpRunsUsed,
      topupRunsRemaining: entitlements.topupRunsRemaining,
    }),
    { status: 200 }
  );
}
