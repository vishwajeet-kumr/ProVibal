"use client";

// app/pricing/page.tsx — Plan comparison: Free vs Pro — Razorpay checkout

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PricingCard } from "@/components/pricing-card";

const FREE_FEATURES = [
  "1 foundation prompt kit",
  "Project map + file structure",
  "6–8 ordered build steps",
  "Basic tech stack support",
] as const;

const PRO_FEATURES = [
  "Everything in Free",
  "8 follow-up prompts per kit",
  "Debug + optimize + deploy prompts",
  "Security hardening prompts",
  "Priority generation speed",
] as const;

interface CheckoutApiResponse {
  status: "success" | "error";
  data?: { subscriptionId: string; keyId: string };
  error?: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export function PricingClient() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  function handleFreeClick(): void {
    router.push("/generate");
  }

  async function handleProClick(): Promise<void> {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = (await response.json()) as CheckoutApiResponse;

      if (json.status !== "success" || !json.data) {
        toast.error(json.error ?? "Checkout failed. Please try again.");
        return;
      }

      await loadRazorpayScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: json.data.keyId,
        subscription_id: json.data.subscriptionId,
        name: "Promptra",
        description: "Pro Plan — ₹239/month",
        theme: { color: "#8C6A4A" },
        handler: function () {
          toast.success("Payment successful! Pro access activating...");
          router.push("/dashboard");
        },
        modal: {
          ondismiss: function () {
            setIsCheckoutLoading(false);
          },
        },
      });
      rzp.open();
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setIsCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            price="₹239"
            description="Unlock the full prompt kit — from debugging to deployment, all in one place."
            features={PRO_FEATURES}
            isHighlighted={true}
            ctaLabel={isCheckoutLoading ? "Processing…" : "Upgrade to Pro"}
            onCtaClick={handleProClick}
            disabled={isCheckoutLoading}
          />
        </div>

        {/* Loader indicator below cards */}
        {isCheckoutLoading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
            Setting up your checkout…
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          All prices in INR · Cancel anytime · No hidden fees
        </p>
      </div>
    </main>
  );
}
