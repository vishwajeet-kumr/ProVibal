"use client";

// app/pricing/pricing-client.tsx — Three-tier pricing: Free / Pro / Refill — Dodo checkout

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PricingCard } from "@/components/pricing-card";

const FREE_FEATURES = [
  "1–2 project kits",
  "2 follow-up runs",
  "Project map + file structure",
  "6–8 ordered build steps",
] as const;

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited project generations",
  "50 follow-up runs/month",
  "Debug + optimize + deploy prompts",
  "Security hardening prompts",
  "Priority generation speed",
] as const;

const REFILL_FEATURES = [
  "+15 follow-up runs",
  "Use anytime — no expiry",
  "Stacks with monthly runs",
  "Available to all users",
] as const;

interface CheckoutApiResponse {
  status: "success" | "error";
  data?: { checkoutUrl: string };
  error?: string;
}

type ProductType = "pro_subscription" | "refill_pack";

async function postCheckout(
  productType: ProductType
): Promise<{ checkoutUrl: string } | { error: string }> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productType }),
  });
  const json = (await response.json()) as CheckoutApiResponse;

  if (json.status === "success" && json.data) {
    return { checkoutUrl: json.data.checkoutUrl };
  }
  return { error: json.error ?? "Checkout failed. Please try again." };
}

export function PricingClient() {
  const router = useRouter();
  const { userId } = useAuth();
  const [loadingProduct, setLoadingProduct] = useState<ProductType | null>(null);

  function handleFreeClick(): void {
    router.push("/generate");
  }

  async function handleCheckout(productType: ProductType): Promise<void> {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    setLoadingProduct(productType);
    try {
      const result = await postCheckout(productType);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.checkoutUrl;
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setLoadingProduct(null);
    }
  }

  const isProLoading = loadingProduct === "pro_subscription";
  const isRefillLoading = loadingProduct === "refill_pack";
  const isAnyLoading = loadingProduct !== null;

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h1 className="font-serif text-5xl font-normal tracking-tight text-[var(--text-primary)] sm:text-6xl">
            Simple,{" "}
            <span className="italic text-[var(--accent)]">Honest</span>{" "}
            Pricing
          </h1>
          <p className="mt-4 text-base text-[var(--text-muted)]">
            Start free. Upgrade when you need more firepower.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <PricingCard
            name="Free"
            price="Free"
            description="Everything you need to generate your first production-grade prompt kit."
            features={FREE_FEATURES}
            isHighlighted={false}
            ctaLabel="Start Free"
            onCtaClick={handleFreeClick}
          />
          <PricingCard
            name="Pro"
            price="$15"
            description="Unlimited projects + 50 follow-up runs per month for serious builders."
            features={PRO_FEATURES}
            isHighlighted={true}
            ctaLabel={isProLoading ? "Redirecting…" : "Upgrade to Pro"}
            onCtaClick={() => handleCheckout("pro_subscription")}
            disabled={isAnyLoading}
          />
          <PricingCard
            name="Refill"
            price="$5"
            description="One-time top-up. 15 extra follow-up runs that never expire."
            features={REFILL_FEATURES}
            isHighlighted={false}
            ctaLabel={isRefillLoading ? "Redirecting…" : "Buy 15-Run Top-Up"}
            onCtaClick={() => handleCheckout("refill_pack")}
            disabled={isAnyLoading}
          />
        </div>

        {/* Loader indicator */}
        {isAnyLoading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
            Setting up your checkout…
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          All prices in USD · Cancel anytime · No hidden fees
        </p>
      </div>
    </main>
  );
}
