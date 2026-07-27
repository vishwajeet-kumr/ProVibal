"use client";

// components/pricing-preview.tsx — Compact pricing comparison table for the landing page

import Link from "next/link";
import { Check, X } from "lucide-react";

interface Feature {
  readonly name: string;
  readonly free: boolean;
  readonly pro: boolean;
}

const FEATURES: Feature[] = [
  { name: "Foundation Prompt", free: true, pro: true },
  { name: "Project Map + File Structure", free: true, pro: true },
  { name: "6–8 Build Steps", free: true, pro: true },
  { name: "Unlimited Projects", free: false, pro: true },
  { name: "Provibal Protocol", free: false, pro: true },
  { name: "All Export Formats", free: false, pro: true },
];

function FeatureCheck({ available }: { available: boolean }) {
  return available ? (
    <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
  ) : (
    <X size={15} className="text-[var(--text-muted)]/40" />
  );
}

export function PricingPreviewSection() {
  return (
    <section className="bg-[var(--accent-light)]/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Pricing
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Start free,{" "}
            <span className="italic text-[var(--accent)]">upgrade when ready</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[var(--text-muted)]">
            Generate your first kit completely free. Upgrade to Pro for
            unlimited access.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--bg)] px-6 py-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Feature
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Free
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Pro — $7/mo
            </div>
          </div>

          {/* Rows */}
          {FEATURES.map((feature, i) => (
            <div
              key={feature.name}
              className={`grid grid-cols-3 px-6 py-3.5 ${
                i < FEATURES.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <span className="text-sm text-[var(--text-primary)]">
                {feature.name}
              </span>
              <div className="flex justify-center">
                <FeatureCheck available={feature.free} />
              </div>
              <div className="flex justify-center">
                <FeatureCheck available={feature.pro} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/pricing"
            className="text-sm font-medium text-[var(--accent)] underline-offset-4 transition-colors hover:underline"
          >
            View full pricing details →
          </Link>
        </div>
      </div>
    </section>
  );
}
