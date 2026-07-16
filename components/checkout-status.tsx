"use client";

// components/checkout-status.tsx — Post-checkout feedback banner
// Reads Dodo query params, polls /api/entitlements, cleans URL.
// Renders nothing if no checkout params are present.

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type Phase = "idle" | "polling" | "success" | "failed" | "timeout";

const SUCCESS_STATUSES = new Set(["succeeded", "active"]);
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_MS = 20000;

interface EntitlementsData {
  plan: string;
  topupRunsRemaining: number;
}

function hasCheckoutParams(params: URLSearchParams): boolean {
  return params.has("payment_id") || params.has("subscription_id");
}

function isSuccessStatus(params: URLSearchParams): boolean {
  const status = params.get("status");
  return typeof status === "string" && SUCCESS_STATUSES.has(status);
}

function cleanCheckoutParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("payment_id");
  url.searchParams.delete("subscription_id");
  url.searchParams.delete("status");
  url.searchParams.delete("email");
  url.searchParams.delete("checkout");
  window.history.replaceState({}, "", url.pathname);
}

async function fetchEntitlements(): Promise<EntitlementsData | null> {
  try {
    const res = await fetch("/api/entitlements", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      status: string;
      data?: EntitlementsData;
    };
    return json.status === "success" && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export function CheckoutStatus() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("idle");
  const pollingRef = useRef(false);

  const hasPurchaseParams = hasCheckoutParams(searchParams);
  const looksSuccessful = hasPurchaseParams && isSuccessStatus(searchParams);
  const hasSubscription = searchParams.has("subscription_id");

  const pollForActivation = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    setPhase("polling");

    const deadline = Date.now() + MAX_POLL_MS;

    while (Date.now() < deadline) {
      const data = await fetchEntitlements();
      if (data) {
        if (hasSubscription && data.plan === "pro") {
          setPhase("success");
          cleanCheckoutParams();
          pollingRef.current = false;
          return;
        }
        if (!hasSubscription && data.topupRunsRemaining > 0) {
          setPhase("success");
          cleanCheckoutParams();
          pollingRef.current = false;
          return;
        }
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    setPhase("timeout");
    cleanCheckoutParams();
    pollingRef.current = false;
  }, [hasSubscription]);

  useEffect(() => {
    if (!hasPurchaseParams) return;

    if (!looksSuccessful) {
      setPhase("failed");
      cleanCheckoutParams();
      return;
    }

    pollForActivation();
  }, [hasPurchaseParams, looksSuccessful, pollForActivation]);

  if (phase === "idle") return null;

  return (
    <div className="mb-8">
      {phase === "polling" && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <Loader2 size={20} className="shrink-0 animate-spin text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Payment received, activating your account…
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              This usually takes a few seconds.
            </p>
          </div>
        </div>
      )}

      {phase === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            {hasSubscription
              ? "You're now on Pro! Enjoy unlimited generations and 50 follow-up runs/month."
              : "Refill applied! Your follow-up runs have been topped up."}
          </p>
        </div>
      )}

      {phase === "failed" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <XCircle size={20} className="shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Payment didn&apos;t go through — you were not charged.
          </p>
        </div>
      )}

      {phase === "timeout" && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <AlertTriangle size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Still processing — refresh in a minute.
            </p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
              If this persists, contact support at contact.provibal@gmail.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
