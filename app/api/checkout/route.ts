// app/api/checkout/route.ts — POST: auth → create Razorpay subscription → return subscription ID + key

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSubscription } from "@/lib/razorpay";
import { env } from "@/config/env";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const subscription = await createSubscription(env.RAZORPAY_PLAN_ID, userId);

    return NextResponse.json(
      successResponse({
        subscriptionId: subscription.id,
        keyId: env.RAZORPAY_KEY_ID,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      return NextResponse.json(
        errorResponse(error.toClientResponse().error, error.code),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      errorResponse("An unexpected error occurred. Please try again later.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
