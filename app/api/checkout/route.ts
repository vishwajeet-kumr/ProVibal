// app/api/checkout/route.ts — POST: auth → entitlement guard → Dodo checkout session → return checkoutUrl

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/dodo";
import { getUserEntitlements } from "@/lib/entitlements";
import { env } from "@/config/env";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const checkoutBodySchema = z.object({
  productType: z.enum(["pro_subscription", "refill_pack"]),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
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

    const { productType } = parsed.data;

    const entitlements = await getUserEntitlements(userId);

    if (productType === "pro_subscription" && entitlements.plan === "pro") {
      throw AppError.validation("You already have an active Pro subscription.", {});
    }

    if (productType === "refill_pack" && entitlements.plan !== "pro") {
      throw AppError.validation("Upgrade to Pro before buying a refill pack.", {});
    }

    const productId =
      productType === "pro_subscription"
        ? env.DODO_PRO_PRODUCT_ID
        : env.DODO_REFILL_PRODUCT_ID;

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
