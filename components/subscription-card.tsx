import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements } from "@/lib/entitlements";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export async function SubscriptionCard() {
  const { userId } = await auth();
  if (!userId) return null;

  const entitlements = await getUserEntitlements(userId);
  const isPro = entitlements.plan === "pro";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Current Plan</h2>
      
      <div className="mt-4 flex items-center gap-4 rounded-lg bg-[var(--bg)] p-4 border border-[var(--border)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
          <CheckCircle2 size={24} className="text-[var(--accent)]" />
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)] text-lg">
            {isPro ? "Pro Plan" : "Free Plan"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {isPro 
              ? "Unlimited generations + 50 follow-ups/month" 
              : "Generate your first full prompt kit for free."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {isPro ? (
          <Link
            href="/billing"
            className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-center text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg)]"
          >
            Manage Billing
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#7A5A3C]"
          >
            Upgrade to Pro
          </Link>
        )}
      </div>
    </div>
  );
}
