// app/pricing/page.tsx — Server component: metadata + client wrapper

import type { Metadata } from "next";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free. Upgrade to Pro for 8 follow-up prompts that harden, optimize, and deploy your project.",
};

export default function PricingPage() {
  return <PricingClient />;
}
