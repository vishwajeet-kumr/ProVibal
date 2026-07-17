import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { UsageMeter } from "@/components/usage-meter";
import { SubscriptionCard } from "@/components/subscription-card";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          Billing & Usage
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Manage your subscription and view your current usage limits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SubscriptionCard />
          <UsageMeter />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 h-fit">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Subscription Details</h2>
          
          {subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Status</span>
                <span className={`text-sm font-semibold capitalize ${
                  subscription.status === 'active' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {subscription.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Plan ID</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {subscription.plan_id === 'pdt_0NjEpzRFtM7GDC0wiNcM0' ? 'Pro Monthly' : subscription.plan_id}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Customer ID</span>
                <span className="text-sm font-medium text-[var(--text-primary)] font-mono">
                  {subscription.dodo_customer_id}
                </span>
              </div>

              <div className="mt-8 pt-4">
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Need to change your payment method or cancel your subscription?
                </p>
                <a 
                  href="mailto:contact.provibal@gmail.com?subject=Subscription%20Management" 
                  className="block w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-center text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg)]"
                >
                  Contact Support
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--text-muted)]">
                No active subscription found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
