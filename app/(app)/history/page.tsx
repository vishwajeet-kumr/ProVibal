import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { GenerationHistory } from "@/components/generation-history";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          Kit History
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          All your generated prompt kits in one place.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />}>
        {/* We can just reuse the component we built for the dashboard! */}
        <GenerationHistory />
      </Suspense>
    </div>
  );
}
