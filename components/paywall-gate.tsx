"use client";

// components/paywall-gate.tsx — Blur overlay with upgrade CTA for free tier users

import Link from "next/link";
import { Lock } from "lucide-react";

interface PaywallGateProps {
  readonly isLocked: boolean;
  readonly children: React.ReactNode;
}

export function PaywallGate({ isLocked, children }: PaywallGateProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm" aria-hidden="true">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/90 px-8 py-8 text-center shadow-2xl backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 ring-1 ring-violet-500/40">
            <Lock size={22} className="text-violet-400" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Pro Feature
            </span>
            <p className="max-w-xs text-sm text-slate-300">
              Upgrade to Pro to unlock 8 follow-up prompts that harden, optimize, and deploy your project.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-150 hover:bg-violet-500 hover:shadow-violet-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}
