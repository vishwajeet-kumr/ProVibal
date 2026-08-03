import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements } from "@/lib/entitlements";
import Link from "next/link";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";

const PLAN_CONFIG = {
  free: {
    label: "Free Plan",
    description: "Generate your first full prompt kit for free.",
    icon: CheckCircle2,
    ctaLabel: "Upgrade Plan",
    ctaHref: "/pricing",
    ctaStyle: "bg-[var(--accent)] text-white hover:bg-[#7A5A3C]",
  },
  starter: {
    label: "Starter Pass",
    description: "5 kits + 5 Protocols with all exports. Buy another pass or upgrade to Pro anytime.",
    icon: Sparkles,
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/pricing",
    ctaStyle: "bg-[var(--accent)] text-white hover:bg-[#7A5A3C]",
  },
  pro: {
    label: "Pro Plan",
    description: "Unlimited generations + full Provibal Protocol access + IDE rules.",
    icon: Zap,
    ctaLabel: "Manage Billing",
    ctaHref: "/billing",
    ctaStyle: "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg)]",
  },
} as const;

export async function SubscriptionCard() {
  const { userId } = await auth();
  if (!userId) return null;

  const entitlements = await getUserEntitlements(userId);
  const config = PLAN_CONFIG[entitlements.plan];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Current Plan</h2>

      <div className="mt-4 flex items-center gap-4 rounded-lg bg-[var(--bg)] p-4 border border-[var(--border)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
          <Icon size={24} className="text-[var(--accent)]" />
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)] text-lg">
            {config.label}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {config.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={config.ctaHref}
          className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${config.ctaStyle}`}
        >
          {config.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
