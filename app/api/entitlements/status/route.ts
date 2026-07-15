// app/api/entitlements/status/route.ts — GET: fresh entitlements for polling after checkout

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements } from "@/lib/entitlements";
import { successResponse, errorResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const entitlements = await getUserEntitlements(userId);

    return NextResponse.json(successResponse(entitlements), { status: 200 });
  } catch {
    return NextResponse.json(
      errorResponse("Failed to fetch entitlements.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
