"use client";

// app/page.tsx — Landing page: hero + features + CTA

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/hero-section";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps & { index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 transition-all duration-700 hover:shadow-md hover:shadow-[var(--accent)]/8 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-light)] text-xl">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
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

function AnnouncementBanner() {
  return (
    <div className="w-full bg-[var(--accent-light)] border-b border-[var(--border)] py-2.5 px-4 text-center text-sm">
      <p className="text-[var(--text-primary)]">
        🚧 ProVibal is currently in development & testing. Please do not initiate any payments right now. For suggestions or collaboration, reach out — I'll respond within 6 hours.
        <br className="sm:hidden" />
        {' '}
        <a href="mailto:contact.provibal@gmail.com" className="underline text-[var(--accent)] font-medium">
          contact.provibal@gmail.com
        </a>
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[var(--bg)]">
      <AnnouncementBanner />
      <HeroSection />

      {/* Features section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            What you get
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Everything your AI IDE needs to{" "}
            <span className="italic text-[var(--accent)]">ship fast</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">
            A complete prompt kit engineered for production — not just a single
            prompt that forgets context by step three.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} index={i} {...feature} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* CTA section */}
      <section className="bg-[var(--accent-light)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Ready to build{" "}
            <span className="italic text-[var(--accent)]">faster?</span>
          </h2>
          <p className="max-w-md text-base text-[var(--text-muted)]">
            Generate your first production-grade prompt kit in under 30 seconds.
            No account required.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[var(--accent)]/25 transition-all duration-150 hover:bg-[#7A5C3E] hover:-translate-y-px active:translate-y-0"
          >
            Generate Your Free Kit →
          </Link>
          <p className="text-xs text-[var(--text-muted)]">
            Free to start · No credit card · Works with Cursor, Windsurf,
            Antigravity
          </p>
        </div>
      </section>
    </div>
  );
}
