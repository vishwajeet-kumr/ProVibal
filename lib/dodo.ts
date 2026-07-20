// lib/dodo.ts — Dodo Payments client: checkout sessions + webhook verification

import DodoPayments from "dodopayments";
import { Webhook } from "standardwebhooks";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";

const dodo = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.DODO_ENVIRONMENT,
});

export async function createCheckoutSession(
  productId: string,
  clerkUserId: string,
  customerEmail: string
): Promise<{ checkoutUrl: string }> {
  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: customerEmail },
      return_url: "https://provibal.com/dashboard?checkout=complete",
      cancel_url: "https://provibal.com/pricing",
      metadata: { clerkUserId },
    });

    if (!session.checkout_url) {
      throw new Error("Dodo returned no checkout URL");
    }

    return { checkoutUrl: session.checkout_url };
  } catch (error: unknown) {
    if (AppError.isAppError(error)) throw error;
    const message =
      error instanceof Error ? error.message : "Payment session creation failed";
    throw AppError.paymentError(message, { productId });
  }
}

interface WebhookHeaders {
  "webhook-id": string;
  "webhook-signature": string;
  "webhook-timestamp": string;
}

export function verifyDodoWebhook(rawBody: string, headers: WebhookHeaders): unknown {
  const webhook = new Webhook(env.DODO_WEBHOOK_SECRET);
  return webhook.verify(rawBody, headers);
}
