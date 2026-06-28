// app/page.tsx — Landing page: hero + features + CTA

import Link from "next/link";
import { HeroSection } from "@/components/hero-section";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E2D9CF] bg-white p-7 transition-shadow duration-200 hover:shadow-md hover:shadow-[#8C6A4A]/8">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDE5DA] text-xl">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-base font-semibold text-[#111111]">{title}</h3>
        <p className="text-sm leading-relaxed text-[#6B6457]">{description}</p>
      </div>
    </div>
  );
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: "⬡",
    title: "Foundation Prompt",
    description:
      "Identity, architecture rules, and quality standards all in one paste — your AI knows exactly who it is and how to build before writing a single line.",
  },
  {
    icon: "◫",
    title: "Project Map",
    description:
      "Every file listed with its single responsibility before you write code. Your AI IDE understands the full structure from day one.",
  },
  {
    icon: "⌥",
    title: "Build Sequence",
    description:
      "6–8 ordered, self-contained steps each with its own prompt. Execute them one by one — no context loss, no drift, no broken dependencies.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#F7F4F0]">
      <HeroSection />

      {/* Features section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#EDE5DA] px-3 py-1 text-xs font-semibold text-[#8C6A4A]">
            What you get
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[#111111] sm:text-5xl">
            Everything your AI IDE needs to{" "}
            <span className="italic text-[#8C6A4A]">ship fast</span>
          </h2>
          <p className="mt-4 text-lg text-[#6B6457]">
            A complete prompt kit engineered for production — not just a single
            prompt that forgets context by step three.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#E2D9CF]" />
      </div>

      {/* CTA section */}
      <section className="bg-[#EDE5DA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-normal leading-tight text-[#111111] sm:text-5xl">
            Ready to build{" "}
            <span className="italic text-[#8C6A4A]">faster?</span>
          </h2>
          <p className="max-w-md text-base text-[#6B6457]">
            Generate your first production-grade prompt kit in under 30 seconds.
            No account required.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-[#8C6A4A] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#8C6A4A]/25 transition-all duration-150 hover:bg-[#7A5C3E] hover:-translate-y-px active:translate-y-0"
          >
            Generate Your Free Kit →
          </Link>
          <p className="text-xs text-[#6B6457]">
            Free to try · No credit card · Works with Cursor, Windsurf,
            Antigravity
          </p>
        </div>
      </section>
    </div>
  );
}
