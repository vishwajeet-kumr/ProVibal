// app/api/webhook/dodo/route.ts — POST: verify Dodo webhook → update Clerk metadata

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyDodoWebhook } from "@/lib/dodo";
import { env } from "@/config/env";
import { TOPUP_RUN_GRANT, getUserEntitlements } from "@/lib/entitlements";
import { errorResponse } from "@/types/api";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface DodoWebhookPayload {
  type: string;
  data: {
    product_id?: string;
    metadata?: Record<string, string>;
    [key: string]: unknown;
  };
}

function isDodoPayload(value: unknown): value is DodoWebhookPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj["type"] === "string" && typeof obj["data"] === "object" && obj["data"] !== null;
}

function extractClerkUserId(payload: DodoWebhookPayload): string | null {
  return payload.data.metadata?.["clerkUserId"] ?? null;
}

async function handlePaymentSucceeded(payload: DodoWebhookPayload): Promise<void> {
  const clerkUserId = extractClerkUserId(payload);
  if (!clerkUserId) {
    console.warn("[dodo-webhook] payment.succeeded missing clerkUserId in metadata", payload.data);
    return;
  }

  const productId = payload.data.product_id;

  if (productId === env.DODO_PRO_PRODUCT_ID) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { plan: "pro", monthlyFollowUpRunsUsed: 0 },
    });

    await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: clerkUserId,
        dodo_subscription_id: typeof payload.data.subscription_id === "string" ? payload.data.subscription_id : "unknown",
        dodo_customer_id: typeof payload.data.customer_id === "string" ? payload.data.customer_id : "unknown",
        status: "active",
        plan_id: productId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    console.info("[dodo-webhook] Pro activated/renewed", { clerkUserId });
    return;
  }

  if (productId === env.DODO_REFILL_PRODUCT_ID) {
    const entitlements = await getUserEntitlements(clerkUserId);
    const newBalance = entitlements.topupRunsRemaining + TOPUP_RUN_GRANT;
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { topupRunsRemaining: newBalance },
    });
    console.info("[dodo-webhook] Refill applied", { clerkUserId, newBalance });
    return;
  }

  console.warn("[dodo-webhook] payment.succeeded for unknown product", { productId });
}

async function handleSubscriptionEnd(payload: DodoWebhookPayload): Promise<void> {
  const clerkUserId = extractClerkUserId(payload);
  if (!clerkUserId) {
    console.warn("[dodo-webhook] subscription end event missing clerkUserId", payload.data);
    return;
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { plan: "free" },
  });

  await supabaseAdmin
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("user_id", clerkUserId);

  console.info("[dodo-webhook] Downgraded to free", { clerkUserId });
}

export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text();

  const webhookId = request.headers.get("webhook-id");
  const webhookSignature = request.headers.get("webhook-signature");
  const webhookTimestamp = request.headers.get("webhook-timestamp");

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json(
      errorResponse("Missing webhook headers.", "WEBHOOK_VERIFICATION_FAILED"),
      { status: 400 }
    );
  }

  let payload: unknown;
  try {
    payload = verifyDodoWebhook(rawBody, {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    });
  } catch {
    return NextResponse.json(
      errorResponse("Webhook signature verification failed.", "WEBHOOK_VERIFICATION_FAILED"),
      { status: 400 }
    );
  }

  if (!isDodoPayload(payload)) {
    console.warn("[dodo-webhook] Unexpected payload shape", payload);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    switch (payload.type) {
      case "payment.succeeded":
        await handlePaymentSucceeded(payload);
        break;

      case "subscription.cancelled":
      case "subscription.expired":
      case "subscription.on_hold":
        await handleSubscriptionEnd(payload);
        break;

      case "payment.failed":
        console.warn("[dodo-webhook] Payment failed", {
          clerkUserId: extractClerkUserId(payload),
          data: payload.data,
        });
        break;

      default:
        console.info("[dodo-webhook] Unhandled event type", payload.type);
    }
  } catch (err: unknown) {
    console.error("[dodo-webhook] Failed to process event", {
      type: payload.type,
      err,
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
