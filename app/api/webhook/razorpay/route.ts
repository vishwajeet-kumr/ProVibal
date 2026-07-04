// app/api/webhook/razorpay/route.ts — POST: verify Razorpay signature → handle subscription lifecycle

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

interface RazorpaySubscriptionEntity {
  readonly id: string;
  readonly status: string;
  readonly notes: {
    readonly clerkUserId?: string;
  };
}

interface RazorpayWebhookPayload {
  readonly subscription?: {
    readonly entity: RazorpaySubscriptionEntity;
  };
}

interface RazorpayWebhookEvent {
  readonly event: string;
  readonly payload: RazorpayWebhookPayload;
}

function extractClerkUserId(event: RazorpayWebhookEvent): string | undefined {
  return event.payload.subscription?.entity.notes.clerkUserId;
}

function extractSubscriptionId(event: RazorpayWebhookEvent): string {
  return event.payload.subscription?.entity.id ?? "unknown";
}

async function activateSubscription(clerkUserId: string, subscriptionId: string): Promise<void> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { plan: "pro", subscriptionId },
    });
    console.info("[webhook] Clerk metadata updated: plan=pro", { clerkUserId, subscriptionId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown Clerk error";
    console.error("[webhook] Failed to update Clerk metadata on activation", { clerkUserId, subscriptionId, error: msg });
  }
}

async function deactivateSubscription(clerkUserId: string, subscriptionId: string): Promise<void> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { plan: "free", subscriptionId: null },
    });
    console.info("[webhook] Clerk metadata updated: plan=free", { clerkUserId, subscriptionId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown Clerk error";
    console.error("[webhook] Failed to update Clerk metadata on deactivation", { clerkUserId, subscriptionId, error: msg });
  }
}

async function handleActivated(event: RazorpayWebhookEvent): Promise<void> {
  const clerkUserId = extractClerkUserId(event);
  const subscriptionId = extractSubscriptionId(event);

  if (!clerkUserId) {
    console.warn("[webhook] subscription.activated missing clerkUserId in notes", { subscriptionId });
    return;
  }

  await activateSubscription(clerkUserId, subscriptionId);
}

async function handleCancelledOrCompleted(event: RazorpayWebhookEvent): Promise<void> {
  const clerkUserId = extractClerkUserId(event);
  const subscriptionId = extractSubscriptionId(event);

  if (!clerkUserId) {
    console.warn(`[webhook] ${event.event} missing clerkUserId in notes`, { subscriptionId });
    return;
  }

  await deactivateSubscription(clerkUserId, subscriptionId);
}

function handlePaymentFailed(event: RazorpayWebhookEvent): void {
  const clerkUserId = extractClerkUserId(event);
  const subscriptionId = extractSubscriptionId(event);
  console.warn("[webhook] payment.failed — no metadata change (Razorpay will retry)", { clerkUserId, subscriptionId });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        errorResponse("Missing x-razorpay-signature header.", "WEBHOOK_VERIFICATION_FAILED"),
        { status: 400 }
      );
    }

    try {
      verifyWebhookSignature(rawBody, signature);
    } catch (verifyError: unknown) {
      if (AppError.isAppError(verifyError)) {
        return NextResponse.json(
          errorResponse(verifyError.toClientResponse().error, verifyError.code),
          { status: 400 }
        );
      }
      return NextResponse.json(
        errorResponse("Webhook signature verification failed.", "WEBHOOK_VERIFICATION_FAILED"),
        { status: 400 }
      );
    }

    let event: RazorpayWebhookEvent;
    try {
      event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    } catch {
      return NextResponse.json(
        errorResponse("Webhook body must be valid JSON.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    switch (event.event) {
      case "subscription.activated":
        await handleActivated(event);
        break;
      case "subscription.cancelled":
      case "subscription.completed":
        await handleCancelledOrCompleted(event);
        break;
      case "payment.failed":
        handlePaymentFailed(event);
        break;
      default:
        console.info("[webhook] Unhandled event type, acknowledging", { event: event.event });
        break;
    }

    return NextResponse.json(successResponse({ received: true }), { status: 200 });
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      return NextResponse.json(
        errorResponse(error.toClientResponse().error, error.code),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      errorResponse(
        "An unexpected error occurred. Please try again later.",
        "INTERNAL_ERROR"
      ),
      { status: 500 }
    );
  }
}
