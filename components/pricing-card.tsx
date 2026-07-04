"use client";

// components/pricing-card.tsx — Plan card with features list — warm design system

import { Check } from "lucide-react";

interface PricingCardProps {
  readonly name: string;
  readonly price: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly isHighlighted: boolean;
  readonly ctaLabel: string;
  readonly onCtaClick: () => void;
  readonly disabled?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isHighlighted,
  ctaLabel,
  onCtaClick,
  disabled = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-[var(--bg-card)] p-8 transition-shadow duration-200 ${
        isHighlighted
          ? "border-2 border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10"
          : "border border-[var(--border)] hover:shadow-md hover:shadow-[var(--accent)]/8"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{name}</h3>
        <div className="mt-3 flex items-end gap-1.5">
          <span className="font-serif text-4xl font-normal text-[var(--text-primary)]">
            {price}
          </span>
          {price !== "Free" && (
            <span className="mb-1 text-sm text-[var(--text-muted)]">/month</span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>

      {/* Feature list */}
      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={15}
              className="mt-0.5 shrink-0 text-[var(--accent)]"
            />
            <span className="text-sm text-[var(--text-primary)]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        disabled={disabled}
        className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
          isHighlighted
            ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/20 hover:bg-[#7A5A3C]"
            : "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
