"use client";

// components/pricing-card.tsx — Single plan card with features list and Razorpay checkout button

import { Check } from "lucide-react";

interface PricingCardProps {
  readonly name: string;
  readonly price: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly isHighlighted: boolean;
  readonly ctaLabel: string;
  readonly onCtaClick: () => void;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isHighlighted,
  ctaLabel,
  onCtaClick,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 transition-all duration-200 ${
        isHighlighted
          ? "border border-violet-500/60 bg-slate-900 shadow-2xl shadow-violet-500/10"
          : "border border-white/10 bg-slate-900/60"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="mt-3 flex items-end gap-1.5">
          <span className="text-4xl font-extrabold text-white">{price}</span>
          {price !== "Free" && (
            <span className="mb-1 text-sm text-slate-400">/month</span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      {/* Features */}
      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className={`mt-0.5 shrink-0 ${
                isHighlighted ? "text-violet-400" : "text-slate-400"
              }`}
            />
            <span className="text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-150 ${
          isHighlighted
            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500 hover:shadow-violet-500/40"
            : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
