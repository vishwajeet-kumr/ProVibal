"use client";

// components/paywall-gate.tsx — Blur overlay with upgrade CTA — warm design system

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
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#E2D9CF] bg-white px-8 py-9 text-center shadow-xl shadow-[#8C6A4A]/8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE5DA]">
            <Lock size={20} className="text-[#8C6A4A]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center justify-center rounded-full bg-[#EDE5DA] px-3 py-1 text-xs font-semibold text-[#8C6A4A]">
              Pro Feature
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-[#6B6457]">
              Upgrade to Pro to unlock 8 follow-up prompts that harden,
              optimize, and deploy your project.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-[#8C6A4A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#8C6A4A]/20 transition-all duration-150 hover:bg-[#7A5A3C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C6A4A]"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}
