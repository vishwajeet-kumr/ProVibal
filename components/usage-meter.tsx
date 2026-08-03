import { auth } from "@clerk/nextjs/server";
import {
  getUserEntitlements,
  PRO_MONTHLY_RUN_LIMIT,
  FREE_FOLLOWUP_RUN_LIMIT,
  STARTER_KIT_LIMIT,
  STARTER_PROTOCOL_LIMIT,
} from "@/lib/entitlements";
import Link from "next/link";
import { BuyRefillButton } from "./buy-refill-button";

function ProgressBar({ used, total, label }: { used: number; total: number | "∞"; label: string }) {
  const percent = total === "∞" ? 0 : Math.min(100, Math.round((used / total) * 100));
  const isNearLimit = total !== "∞" && percent > 90;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-medium text-[var(--text-primary)]">
          {total === "∞" ? "Unlimited" : `${used} / ${total}`}
        </span>
      </div>
      {total !== "∞" && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className={`h-full transition-all ${isNearLimit ? "bg-red-500" : "bg-[var(--accent)]"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

export async function UsageMeter() {
  const { userId } = await auth();
  if (!userId) return null;

  const entitlements = await getUserEntitlements(userId);
  const plan = entitlements.plan;

  // Determine plan display label
  const planLabel =
    plan === "pro" ? "Pro Plan" : plan === "starter" ? "Starter Pass" : "Free Plan";

  // Project generation stats
  let genUsed: number;
  let genTotal: number | "∞";
  if (plan === "pro") {
    genUsed = 0;
    genTotal = "∞";
  } else if (plan === "starter") {
    genUsed = entitlements.starterKitsUsed;
    genTotal = STARTER_KIT_LIMIT;
  } else {
    genUsed = entitlements.projectTrialUsed ? 1 : 0;
    genTotal = 1;
  }

  // Protocol run stats
  let protocolUsed: number;
  let protocolTotal: number | "∞";
  let protocolLabel: string;
  if (plan === "pro") {
    protocolUsed = entitlements.monthlyFollowUpRunsUsed;
    protocolTotal = PRO_MONTHLY_RUN_LIMIT;
    protocolLabel = "Protocol Runs (Monthly)";
  } else if (plan === "starter") {
    protocolUsed = entitlements.starterProtocolsUsed;
    protocolTotal = STARTER_PROTOCOL_LIMIT;
    protocolLabel = "Protocol Runs";
  } else {
    protocolUsed = entitlements.freeFollowUpRunsUsed;
    protocolTotal = FREE_FOLLOWUP_RUN_LIMIT;
    protocolLabel = "Protocol Runs";
  }

  // CTA logic
  const showRefill = plan === "starter" || plan === "pro";
  const showUpgrade = plan === "free" || plan === "starter";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Usage</h2>
        <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
          {planLabel}
        </span>
      </div>

      <div className="space-y-6">
        {/* Project Generations */}
        <ProgressBar
          used={genUsed}
          total={genTotal}
          label="Project Generations"
        />

        {/* Protocol Runs */}
        <ProgressBar
          used={protocolUsed}
          total={protocolTotal}
          label={protocolLabel}
        />

        {/* Topup runs */}
        {(plan === "pro" || plan === "starter") && entitlements.topupRunsRemaining > 0 && (
          <p className="text-xs text-[var(--text-muted)]">
            + {entitlements.topupRunsRemaining} refill runs available
          </p>
        )}
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-2">
        {showRefill && <BuyRefillButton />}
        {showUpgrade && (
          <Link
            href="/pricing"
            className={`block w-full text-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              plan === "free"
                ? "bg-[var(--accent)] text-white hover:bg-[#7A5A3C]"
                : "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
            }`}
          >
            {plan === "free" ? "Upgrade Plan" : "Upgrade to Pro"}
          </Link>
        )}
      </div>
    </div>
  );
}
