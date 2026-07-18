"use client";

// components/hero-section.tsx — Two-column hero: headline + floating UI card preview

import Link from "next/link";
import { useState } from "react";

function EasterEgg() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-2 flex flex-col items-start w-full">
      <span
        onClick={() => setRevealed(!revealed)}
        className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--accent)] underline decoration-dotted transition-colors"
      >
        {revealed
          ? "🤫 Okay okay, you found it! Click to hide"
          : "✨ Psst... there's something interesting about this site"}
      </span>

      <div
        className={`w-full overflow-hidden transition-all duration-400 ease-in-out ${
          revealed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mt-4 max-w-md mx-auto lg:mx-0 text-center shadow-lg shadow-[var(--accent)]/5">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="font-serif text-lg text-[var(--text-primary)] mb-2">
            Built entirely by Vibe Coding
          </h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            Every single line of code on this website was generated using AI — no manual coding.
            Just clear prompts, good architecture, and a vision. That's the power of vibe coding. 🚀
          </p>
          <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] text-xs font-medium px-3 py-1 rounded-full">
            Powered by Claude + Gemini + Antigravity
          </span>
        </div>
      </div>
    </div>
  );
}

function AvatarStack() {
  const initials = ["V", "A", "M"];
  const colors = ["bg-[var(--accent)]", "bg-[#6B6457]", "bg-[#A88B70]"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {initials.map((initial, i) => (
          <div
            key={initial}
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--bg)] text-xs font-bold text-white ${colors[i]}`}
          >
            {initial}
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-3 w-3 fill-[var(--accent)]" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)]">Used by 100+ vibe coders</p>
      </div>
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
              className={`text-xs font-medium ${
                i === 0
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
              Generate Free Kit
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline"
            >
              See how it works →
            </Link>
          </div>
          
          <EasterEgg />

          {/* Social proof */}
          <AvatarStack />
        </div>

        {/* Right — 40% */}
        <div className="flex w-full items-center justify-center pb-12 lg:w-[40%] lg:pb-0">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
