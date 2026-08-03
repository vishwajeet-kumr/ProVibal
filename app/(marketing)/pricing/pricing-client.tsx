"use client";

// app/pricing/pricing-client.tsx — Four-tier pricing: Free / Starter Pass / Pro / Team (coming soon)
// Monthly/Annual toggle with savings display

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PricingCard } from "@/components/pricing-card";

// ─── Plan Feature Lists ─────────────────────────────────────────────

const FREE_FEATURES = [
  "1 kit per month",
  "Foundation Prompt + Project Map + Build Steps",
  "Basic export (Markdown only)",
  "Generation history",
] as const;

const STARTER_FEATURES = [
  "Everything in Free",
  "5 project kit generations",
  "5 Protocol generations",
  "All exports (MD / XML / PDF / ZIP)",
  "Buy refills when exhausted",
  "Upgrade to Pro anytime — keep all data",
] as const;

const PRO_FEATURES = [
  "Everything in Starter",
  "Unlimited project generations",
  "Unlimited Protocol runs",
  "IDE rules export (.cursorrules / .windsurfrules / AGENTS.md)",
  "Priority generation speed",
  "Buy refills for top-ups",
] as const;

const TEAM_FEATURES = [
  "Everything in Pro",
  "Shared team workspace",
  "Team prompt template library",
  "Collaborative kit editing",
  "Team analytics",
] as const;

const REFILL_FEATURES = [
  "+5 Protocol runs",
  "Use anytime — no expiry",
  "Stacks with existing runs",
  "Available to Starter & Pro users",
] as const;

// ─── Pricing Data ────────────────────────────────────────────────────

interface PriceTier {
  monthly: { usd: string; inr: string };
  annual: { usd: string; inr: string; suffix: string; savings: string };
}

const PRO_PRICE: PriceTier = {
  monthly: { usd: "$7", inr: "₹299" },
  annual: { usd: "$59", inr: "₹2,499", suffix: "/year", savings: "Save $25" },
};

const STARTER_PRICE = {
  usd: "$5",
  inr: "₹199",
};

const REFILL_PRICE = {
  usd: "$3",
  inr: "₹99",
};

// ─── Billing Toggle ──────────────────────────────────────────────────

function BillingToggle({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
        }`}
      >
        Monthly
      </span>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--bg)] transition-colors duration-200 focus:outline-none"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle annual billing"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full shadow-sm transition-transform duration-200 ${
            isAnnual
              ? "translate-x-6 bg-[var(--accent)]"
              : "translate-x-0.5 bg-[var(--text-muted)]"
          }`}
        />
      </button>

      <span
        className={`text-sm font-medium transition-colors ${
          isAnnual ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
        }`}
      >
        Annual
      </span>

      {isAnnual && (
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Save $25
        </span>
      )}
    </div>
  );
}

// ─── Checkout Helper ─────────────────────────────────────────────────

interface CheckoutApiResponse {
  status: "success" | "error";
  data?: { checkoutUrl: string };
  error?: string;
}

type ProductType = "pro_subscription" | "pro_annual_subscription" | "starter_pass" | "refill_pack";

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

// ─── Main Component ──────────────────────────────────────────────────

export function PricingClient({
  isAlreadyPro,
  paymentsEnabled,
  isIndia,
}: {
  isAlreadyPro: boolean;
  paymentsEnabled: boolean;
  isIndia: boolean;
}) {
  const router = useRouter();
  const { userId } = useAuth();
  const [loadingProduct, setLoadingProduct] = useState<ProductType | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  function handleFreeClick(): void {
    router.push("/generate");
  }

  async function handleCheckout(productType: ProductType): Promise<void> {
    if (!paymentsEnabled) return;
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

  const isAnyLoading = loadingProduct !== null;
  const proProductType: ProductType = isAnnual ? "pro_annual_subscription" : "pro_subscription";

  const proPrice = isAnnual
    ? (isIndia ? PRO_PRICE.annual.inr : PRO_PRICE.annual.usd)
    : (isIndia ? PRO_PRICE.monthly.inr : PRO_PRICE.monthly.usd);

  const proPriceSuffix = isAnnual ? PRO_PRICE.annual.suffix : "/month";

  // Show strikethrough monthly equivalent when annual is selected
  const proOriginalPrice = isAnnual
    ? (isIndia ? "₹3,588" : "$84")
    : undefined;

  const proSavingsBadge = isAnnual
    ? (isIndia ? "Save ₹1,089" : PRO_PRICE.annual.savings)
    : undefined;

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-5xl font-normal tracking-tight text-[var(--text-primary)] sm:text-6xl">
            Simple,{" "}
            <span className="italic text-[var(--accent)]">Honest</span>{" "}
            Pricing
          </h1>
          <p className="mt-4 text-base text-[var(--text-muted)]">
            Start free. Upgrade when you need more firepower.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-10">
          <BillingToggle
            isAnnual={isAnnual}
            onToggle={() => setIsAnnual(!isAnnual)}
          />
        </div>

        {!paymentsEnabled && (
          <div className="mb-10 rounded-xl border border-[var(--accent-light)] bg-[var(--accent-light)]/20 p-4 text-center">
            <p className="text-sm font-medium text-[var(--accent)]">
              Upgrades are temporarily paused while we finish some backend work — back soon.
            </p>
          </div>
        )}

        {/* Cards — 4 columns */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <PricingCard
            name="Free"
            price="Free"
            description="Generate your first kit and explore what Provibal can do."
            features={FREE_FEATURES}
            isHighlighted={false}
            ctaLabel="Get Started Free"
            onCtaClick={handleFreeClick}
          />

          {/* Starter Pass */}
          <PricingCard
            name="Starter Pass"
            price={isIndia ? STARTER_PRICE.inr : STARTER_PRICE.usd}
            priceSuffix="one-time"
            description="5 kits + 5 Protocols with full exports. Perfect for trying everything out."
            features={STARTER_FEATURES}
            isHighlighted={false}
            ctaLabel={
              loadingProduct === "starter_pass"
                ? "Redirecting…"
                : "Buy Starter Pass"
            }
            onCtaClick={() => handleCheckout("starter_pass")}
            disabled={isAnyLoading || !paymentsEnabled}
            secondaryCta={{
              label: "Or upgrade to Pro →",
              onClick: () => handleCheckout(proProductType),
            }}
          />

          {/* Pro */}
          <PricingCard
            name="Pro"
            price={proPrice}
            originalPrice={proOriginalPrice}
            priceSuffix={proPriceSuffix}
            savingsBadge={proSavingsBadge}
            description="Unlimited everything + exclusive IDE rules generation for serious builders."
            features={PRO_FEATURES}
            isHighlighted={true}
            highlightLabel="Most Popular"
            ctaLabel={
              isAlreadyPro
                ? "You're on Pro ✓"
                : loadingProduct === "pro_subscription" || loadingProduct === "pro_annual_subscription"
                  ? "Redirecting…"
                  : `Upgrade to Pro`
            }
            onCtaClick={() => handleCheckout(proProductType)}
            disabled={isAlreadyPro || isAnyLoading || !paymentsEnabled}
          />

          {/* Team (Coming Soon) */}
          <PricingCard
            name="Team"
            price="$29"
            priceSuffix="/month"
            description="Shared workspaces and team templates for agencies and dev teams."
            features={TEAM_FEATURES}
            isHighlighted={false}
            isComingSoon={true}
            ctaLabel="Coming Soon"
            onCtaClick={() => {}}
          />
        </div>

        {/* Refill Pack — below main cards */}
        <div className="mx-auto mt-8 max-w-sm">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Need more runs?
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Buy a refill pack: <span className="font-semibold text-[var(--text-primary)]">{isIndia ? "₹99" : "$3"}</span> for +5 Protocol runs.
              Never expires. Available to Starter & Pro users.
            </p>
            <button
              onClick={() => handleCheckout("refill_pack")}
              disabled={isAnyLoading || !paymentsEnabled}
              className="mt-4 w-full rounded-lg border border-[var(--border)] py-2 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--accent-light)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProduct === "refill_pack" ? "Redirecting…" : "Buy 5-Run Refill"}
            </button>
          </div>
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
          All prices in {isIndia ? "INR" : "USD"} · Cancel anytime · No hidden fees
        </p>
      </div>
    </main>
  );
}
