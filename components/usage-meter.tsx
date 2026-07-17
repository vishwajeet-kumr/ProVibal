import { auth } from "@clerk/nextjs/server";
import { getUserEntitlements, PRO_MONTHLY_RUN_LIMIT, FREE_FOLLOWUP_RUN_LIMIT } from "@/lib/entitlements";
import Link from "next/link";

export async function UsageMeter() {
  const { userId } = await auth();
  if (!userId) return null;

  const entitlements = await getUserEntitlements(userId);
  const isPro = entitlements.plan === "pro";

  const followUpsUsed = isPro 
    ? entitlements.monthlyFollowUpRunsUsed 
    : entitlements.freeFollowUpRunsUsed;
    
  const followUpsLimit = isPro 
    ? PRO_MONTHLY_RUN_LIMIT 
    : FREE_FOLLOWUP_RUN_LIMIT;
    
  const followUpsPercent = Math.min(100, Math.round((followUpsUsed / followUpsLimit) * 100));

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Usage</h2>
        <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
          {isPro ? "Pro Plan" : "Free Plan"}
        </span>
      </div>

      <div className="space-y-6">
        {/* Project Generations */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">Project Generations</span>
            <span className="font-medium text-[var(--text-primary)]">
              {isPro ? "Unlimited" : entitlements.projectTrialUsed ? "1 / 1" : "0 / 1"}
            </span>
          </div>
          {!isPro && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div 
                className="h-full bg-[var(--accent)] transition-all" 
                style={{ width: entitlements.projectTrialUsed ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>

        {/* Follow-up Runs */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">Follow-up Runs (Monthly)</span>
            <span className="font-medium text-[var(--text-primary)]">
              {followUpsUsed} / {followUpsLimit}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div 
              className={`h-full transition-all ${followUpsPercent > 90 ? 'bg-red-500' : 'bg-[var(--accent)]'}`}
              style={{ width: `${followUpsPercent}%` }}
            />
          </div>
          
          {isPro && entitlements.topupRunsRemaining > 0 && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              + {entitlements.topupRunsRemaining} refill runs available
            </p>
          )}
        </div>
      </div>

      {!isPro && (
        <div className="mt-6">
          <Link
            href="/pricing"
            className="block w-full text-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7A5A3C]"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  );
}
