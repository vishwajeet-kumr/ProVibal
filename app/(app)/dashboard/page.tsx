import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutStatus } from "@/components/checkout-status";
import { UsageMeter } from "@/components/usage-meter";
import { GenerationHistory } from "@/components/generation-history";
import { SubscriptionCard } from "@/components/subscription-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Manage your generated kits and monitor your usage.
        </p>
      </div>

      <Suspense>
        <CheckoutStatus />
      </Suspense>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content (History) */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />}>
            <GenerationHistory />
          </Suspense>
        </div>

        {/* Sidebar (Usage & Subscription) */}
        <div className="flex flex-col gap-6">
          <Suspense fallback={<div className="h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />}>
            <UsageMeter />
          </Suspense>
          <Suspense fallback={<div className="h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />}>
            <SubscriptionCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
