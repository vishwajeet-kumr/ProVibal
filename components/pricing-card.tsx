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
      className={`relative flex flex-col rounded-2xl bg-white p-8 transition-shadow duration-200 ${
        isHighlighted
          ? "border-2 border-[#8C6A4A] shadow-lg shadow-[#8C6A4A]/10"
          : "border border-[#E2D9CF] hover:shadow-md hover:shadow-[#8C6A4A]/8"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[#8C6A4A] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#111111]">{name}</h3>
        <div className="mt-3 flex items-end gap-1.5">
          <span className="font-serif text-4xl font-normal text-[#111111]">
            {price}
          </span>
          {price !== "Free" && (
            <span className="mb-1 text-sm text-[#6B6457]">/month</span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#6B6457]">{description}</p>
      </div>

      {/* Feature list */}
      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={15}
              className="mt-0.5 shrink-0 text-[#8C6A4A]"
            />
            <span className="text-sm text-[#111111]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 ${
          isHighlighted
            ? "bg-[#8C6A4A] text-white shadow-sm shadow-[#8C6A4A]/20 hover:bg-[#7A5A3C]"
            : "border border-[#E2D9CF] text-[#111111] hover:bg-[#EDE5DA]"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
