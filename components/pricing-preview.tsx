"use client";

// components/pricing-preview.tsx — Compact 3-column pricing preview for landing page (Free / Starter / Pro)

import Link from "next/link";
import { Check, X } from "lucide-react";

interface Feature {
  readonly name: string;
  readonly free: boolean | string;
  readonly starter: boolean | string;
  readonly pro: boolean | string;
}

const FEATURES: Feature[] = [
  { name: "Project Kit Generations", free: "1/month", starter: "5 total", pro: "Unlimited" },
  { name: "Foundation + Map + Build", free: true, starter: true, pro: true },
  { name: "Protocol Generations", free: false, starter: "5 total", pro: "Unlimited" },
  { name: "Exports (MD/XML/PDF/ZIP)", free: false, starter: true, pro: true },
  { name: "IDE Rules (.cursorrules)", free: false, starter: false, pro: true },
  { name: "Priority Speed", free: false, starter: false, pro: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="text-xs font-medium text-[var(--text-primary)]">
        {value}
      </span>
    );
  }
  return value ? (
    <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
  ) : (
    <X size={15} className="text-[var(--text-muted)]/40" />
  );
}

export function PricingPreviewSection() {
  return (
    <section className="bg-[var(--accent-light)]/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
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
            Generate your first kit free. Try everything with a $5 Starter Pass,
            or go unlimited with Pro.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-[var(--border)] bg-[var(--bg)] px-4 py-4 sm:px-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Feature
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Free
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Starter — $5
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Pro — $7/mo
            </div>
          </div>

          {/* Rows */}
          {FEATURES.map((feature, i) => (
            <div
              key={feature.name}
              className={`grid grid-cols-4 px-4 py-3.5 sm:px-6 ${
                i < FEATURES.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <span className="text-sm text-[var(--text-primary)]">
                {feature.name}
              </span>
              <div className="flex justify-center">
                <FeatureValue value={feature.free} />
              </div>
              <div className="flex justify-center">
                <FeatureValue value={feature.starter} />
              </div>
              <div className="flex justify-center">
                <FeatureValue value={feature.pro} />
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
