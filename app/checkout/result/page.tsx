"use client";

// app/checkout/result/page.tsx — Checkout result: poll entitlements → confirm Pro → redirect

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

type PollState = "polling" | "success" | "timeout";

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;

interface EntitlementsResponse {
  status: "success" | "error";
  data?: { plan: string };
}

export default function CheckoutResultPage() {
  const router = useRouter();
  const { session } = useSession();
  const [state, setState] = useState<PollState>("polling");
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll(): Promise<void> {
      try {
        const res = await fetch("/api/entitlements/status");
        const json = (await res.json()) as EntitlementsResponse;

        if (json.status === "success" && json.data?.plan === "pro") {
          if (timerRef.current) clearInterval(timerRef.current);
          setState("success");

          try {
            await session?.reload();
          } catch {
            // session refresh failed — not critical, token will auto-refresh
          }

          setTimeout(() => router.push("/dashboard"), 1500);
          return;
        }
      } catch {
        // network error — keep polling
      }

      attemptRef.current += 1;
      if (attemptRef.current >= MAX_ATTEMPTS) {
        if (timerRef.current) clearInterval(timerRef.current);
        setState("timeout");
      }
    }

    timerRef.current = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router, session]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="mx-auto max-w-md text-center">
        {state === "polling" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-light)]">
              <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
            </div>
            <h1 className="font-serif text-3xl font-normal text-[var(--text-primary)]">
              Confirming your payment…
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              This usually takes a few seconds. Please don&apos;t close this page.
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="font-serif text-3xl font-normal text-[var(--text-primary)]">
              Welcome to Pro!
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Redirecting you to your dashboard…
            </p>
          </div>
        )}

        {state === "timeout" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="font-serif text-3xl font-normal text-[var(--text-primary)]">
              Payment not confirmed yet
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
              We couldn&apos;t confirm this payment. If you were charged, please
              contact support — if you cancelled, no charge was made.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/pricing"
                className="rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card)]"
              >
                Back to Pricing
              </Link>
              <Link
                href="/contact"
                className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
