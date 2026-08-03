"use client";

// components/pricing-card.tsx — Plan card with features list, savings badge, and secondary CTA — warm design system

import { Check } from "lucide-react";

interface PricingCardProps {
  readonly name: string;
  readonly price: string;
  readonly originalPrice?: string;
  readonly priceSuffix?: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly isHighlighted: boolean;
  readonly highlightLabel?: string;
  readonly ctaLabel: string;
  readonly onCtaClick: () => void;
  readonly disabled?: boolean;
  readonly secondaryCta?: { label: string; onClick: () => void };
  readonly savingsBadge?: string;
  readonly isComingSoon?: boolean;
}

export function PricingCard({
  name,
  price,
  originalPrice,
  priceSuffix,
  description,
  features,
  isHighlighted,
  highlightLabel,
  ctaLabel,
  onCtaClick,
  disabled = false,
  secondaryCta,
  savingsBadge,
  isComingSoon = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-[var(--bg-card)] p-8 transition-shadow duration-200 ${
        isComingSoon
          ? "border border-dashed border-[var(--border)] opacity-75"
          : isHighlighted
            ? "border-2 border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10"
            : "border border-[var(--border)] hover:shadow-md hover:shadow-[var(--accent)]/8"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
            {highlightLabel ?? "Most Popular"}
          </span>
        </div>
      )}

      {isComingSoon && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[var(--text-muted)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
            Coming Soon
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{name}</h3>
        <div className="mt-3 flex items-end gap-1.5">
          {originalPrice && (
            <span className="mb-1 text-lg text-[var(--text-muted)] line-through">
              {originalPrice}
            </span>
          )}
          <span className="font-serif text-4xl font-normal text-[var(--text-primary)]">
            {price}
          </span>
          {priceSuffix && (
            <span className="mb-1 text-sm text-[var(--text-muted)]">{priceSuffix}</span>
          )}
        </div>
        {savingsBadge && (
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {savingsBadge}
          </span>
        )}
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
        disabled={disabled || isComingSoon}
        className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
          isHighlighted
            ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/20 hover:bg-[#7A5A3C]"
            : "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
        }`}
      >
        {ctaLabel}
      </button>

      {/* Secondary CTA */}
      {secondaryCta && (
        <button
          onClick={secondaryCta.onClick}
          disabled={disabled}
          className="mt-2 w-full rounded-lg py-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {secondaryCta.label}
        </button>
      )}
    </div>
  );
}
