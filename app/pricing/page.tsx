// app/pricing/page.tsx — Server component: metadata + fresh entitlements + client wrapper

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements } from "@/lib/entitlements";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free. Upgrade to Pro for 8 follow-up prompts that harden, optimize, and deploy your project.",
};

export default async function PricingPage() {
  const { userId } = await auth();

  let isAlreadyPro = false;
  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    isAlreadyPro = entitlements.plan === "pro";
  }

  return <PricingClient isAlreadyPro={isAlreadyPro} />;
}
