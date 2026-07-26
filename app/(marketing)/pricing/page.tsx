// app/pricing/page.tsx — Server component: metadata + fresh entitlements + client wrapper

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getUserEntitlements } from "@/lib/entitlements";
import { env } from "@/config/env";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free. Upgrade to Pro for the full Provibal Protocol — personalized prompts that harden, optimize, and ship your project.",
};

export default async function PricingPage() {
  const { userId } = await auth();
  
  const headersList = await headers();
  const countryHeader = headersList.get("x-vercel-ip-country");
  const isIndia = countryHeader === "IN";

  let isAlreadyPro = false;
  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    isAlreadyPro = entitlements.plan === "pro";
  }

  const paymentsEnabled = env.PAYMENTS_ENABLED === "true";

  return <PricingClient isAlreadyPro={isAlreadyPro} paymentsEnabled={paymentsEnabled} isIndia={isIndia} />;
}
