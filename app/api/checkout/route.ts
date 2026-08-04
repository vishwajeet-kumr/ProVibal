// app/api/checkout/route.ts — POST: auth → Dodo checkout session → return checkoutUrl

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/dodo";
import { env } from "@/config/env";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";
import { getUserEntitlements } from "@/lib/entitlements";
import { z } from "zod";

export const dynamic = "force-dynamic";

const checkoutBodySchema = z.object({
  productType: z.enum(["pro_subscription", "pro_annual_subscription", "starter_pass", "refill_pack"]),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (env.PAYMENTS_ENABLED === "false") {
      throw AppError.serviceUnavailable(
        "Upgrades are temporarily paused for maintenance. Please check back shortly.",
        {}
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      throw AppError.validation("No email address on account.", {});
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        errorResponse("Request body must be valid JSON.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const parsed = checkoutBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse("Invalid product type.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Check if user is already Pro for subscription products
    if (parsed.data.productType === "pro_subscription" || parsed.data.productType === "pro_annual_subscription") {
      const entitlements = await getUserEntitlements(userId);
      if (entitlements.plan === "pro") {
        throw AppError.conflict("You're already on the Pro plan.", { userId });
      }
    }

    // Map product type to Dodo product ID
    let productId: string;
    switch (parsed.data.productType) {
      case "pro_subscription":
        productId = env.DODO_PRO_PRODUCT_ID;
        break;
      case "pro_annual_subscription":
        productId = env.DODO_PRO_ANNUAL_PRODUCT_ID;
        break;
      case "starter_pass":
        productId = env.DODO_STARTER_PRODUCT_ID;
        break;
      case "refill_pack":
        productId = env.DODO_REFILL_PRODUCT_ID;
        break;
    }

    const { checkoutUrl } = await createCheckoutSession(productId, userId, email);

    return NextResponse.json(
      successResponse({ checkoutUrl }),
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
