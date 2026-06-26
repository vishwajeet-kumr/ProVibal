// lib/razorpay.ts — Razorpay subscription creation + webhook signature verification

import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

interface RazorpaySubscription {
  readonly id: string;
  readonly plan_id: string;
  readonly status: string;
  readonly current_start: number | null;
  readonly current_end: number | null;
  readonly created_at: number;
}

function buildBasicAuthHeader(): string {
  const credentials = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`;
  const encoded = Buffer.from(credentials).toString("base64");
  return `Basic ${encoded}`;
}

export async function createSubscription(
  planId: string
): Promise<RazorpaySubscription> {
  const response = await fetch(`${RAZORPAY_API_BASE}/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: buildBasicAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      quantity: 1,
      total_count: 12,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw AppError.paymentError(
      `Razorpay subscription creation failed with status ${response.status}`,
      { status: response.status, responseBody: body }
    );
  }

  const data = (await response.json()) as RazorpaySubscription;
  return data;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): void {
  const expectedHex = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(signature, "hex");

  const signaturesMatch =
    expected.length === received.length &&
    timingSafeEqual(expected, received);

  if (!signaturesMatch) {
    throw AppError.webhookVerificationFailed(
      "Razorpay webhook signature mismatch",
      { signatureLength: signature.length }
    );
  }
}
