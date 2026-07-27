"use client";

// components/hero-section.tsx — Two-column hero: headline + floating UI card preview with real social proof

import Link from "next/link";
import { useState, useEffect } from "react";

function LiveKitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (typeof data.kitsGenerated === "number") {
          setCount(data.kitsGenerated);
        }
      } catch {
        // Fail silently — counter just won't show
      }
    }
    fetchCount();
  }, []);

  if (count === null || count === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {count.toLocaleString()} kits generated
        </span>
      </div>
      <span className="text-xs text-[var(--text-muted)]">and counting</span>
    </div>
  );
}

function SoloBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--text-muted)]">
        🇮🇳 Built by a solo developer in India
      </span>
    </div>
  );
}

function CompatibilityBadges() {
  const ides = [
    { name: "Cursor", icon: "⌘" },
    { name: "Windsurf", icon: "🌊" },
    { name: "Antigravity", icon: "🚀" },
    { name: "Claude", icon: "◈" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[var(--text-muted)]">Works with:</span>
      {ides.map((ide) => (
        <span
          key={ide.name}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
        >
          <span>{ide.icon}</span>
          {ide.name}
        </span>
      ))}
    </div>
  );
}

function HeroCard() {
  const mockSteps = [
    "1. Setup project scaffold",
    "2. Implement auth layer",
    "3. Build core API routes",
  ];
  const mockFiles = [
    "app/layout.tsx",
    "lib/errors.ts",
    "features/auth/",
  ];

  return (
    <div className="relative w-full max-w-md select-none" style={{ animation: 'fadeIn 400ms ease-out 200ms forwards', opacity: 0 }}>
      {/* Main card — floating */}
      <div className="animate-float relative z-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-xl shadow-[var(--accent)]/10">
        {/* Mock tabs */}
        <div className="mb-4 flex gap-4 border-b border-[var(--border)] pb-3">
          {["Foundation", "Project Map", "Build"].map((tab, i) => (
            <span
              key={tab}
              className={`text-xs font-medium ${i === 0
                  ? "border-b-2 border-[var(--accent)] pb-3 -mb-3 text-[var(--accent)]"
                  : "text-[var(--text-muted)]"
                }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Mock prompt content */}
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">// Identity</span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-primary)]">
            You are a senior full-stack engineer
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-primary)]">
            building a production-grade SaaS app.
          </p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">// Architecture Rules</span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-primary)]">
            Feature-based folders only. One file
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[var(--text-primary)]">
            = one responsibility. Zod everywhere.
          </p>
        </div>

        {/* Build steps */}
        <div className="mt-4 space-y-1.5">
          {mockSteps.map((step) => (
            <div
              key={step}
              className="flex items-center gap-2 rounded-lg bg-[var(--bg)] px-3 py-1.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="font-mono text-[10px] text-[var(--text-primary)]">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary floating file-map card */}
      <div className="animate-float-delayed absolute -bottom-10 -right-6 z-20 w-52 rotate-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-lg shadow-[var(--accent)]/10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          File Map
        </p>
        {mockFiles.map((file) => (
          <div key={file} className="flex items-center gap-1.5 py-0.5">
            <div className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[10px] text-[var(--text-primary)]">{file}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-56px)] bg-[var(--bg)] px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">

        {/* Left — 60% */}
        <div className="flex flex-col gap-8 lg:w-[60%] animate-fade-up">
          {/* Eyebrow */}
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent-light)] px-4 py-1.5 text-xs font-semibold text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            AI Prompt Kit Generator
          </span>

          {/* Headline */}
          <h1 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
            Build faster with{" "}
            <span className="italic text-[var(--accent)]">production-grade</span>{" "}
            AI prompts
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
            Describe your project. Get a complete foundation prompt, file map,
            and build sequence — ready for any AI IDE.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--accent)]/25 transition-all duration-150 hover:bg-[#7A5C3E] hover:-translate-y-px active:translate-y-0"
            >
              Generate Free Kit →
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline"
            >
              See how it works
            </Link>
          </div>

          {/* Real social proof */}
          <div className="flex flex-col gap-3">
            <LiveKitCounter />
            <CompatibilityBadges />
            <SoloBadge />
          </div>
        </div>

        {/* Right — 40% */}
        <div className="flex w-full items-center justify-center pb-12 lg:w-[40%] lg:pb-0">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
