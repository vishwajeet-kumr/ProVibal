"use client";

// components/onboarding-guide.tsx — First-time user onboarding experience on /generate

import { useState, useEffect } from "react";
import {
  PenLine,
  Sparkles,
  Copy,
  ArrowRight,
  X,
  Lightbulb,
  FileCode2,
  Layers,
  Shield,
} from "lucide-react";

interface OnboardingStep {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: <PenLine size={20} />,
    title: "Describe your project",
    description:
      "Fill in your project name, type, tech stack, and a detailed description. The more detail you add, the better your prompts will be.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "AI generates your kit",
    description:
      "Provibal creates a Foundation Prompt (identity + architecture), Project Map (every file), and Build Sequence (ordered steps).",
  },
  {
    icon: <Copy size={20} />,
    title: "Copy & paste into your IDE",
    description:
      "Paste the prompts into Cursor, Windsurf, or any AI IDE. Follow the build sequence step by step. Export as MD, XML, or PDF.",
  },
];

const TIPS: { icon: React.ReactNode; text: string }[] = [
  {
    icon: <Lightbulb size={14} />,
    text: "Be specific about features — \"user auth with Google OAuth\" works better than just \"login\"",
  },
  {
    icon: <FileCode2 size={14} />,
    text: "Mention your preferred database, hosting, and deployment targets for tailored prompts",
  },
  {
    icon: <Layers size={14} />,
    text: "Include your target audience — it helps the AI prioritize the right features first",
  },
  {
    icon: <Shield size={14} />,
    text: "The Foundation Prompt sets your AI's coding standards — paste it before any build step",
  },
];

const STORAGE_KEY = "provibal_onboarding_dismissed";

export function OnboardingGuide() {
  const [isDismissed, setIsDismissed] = useState(true); // default hidden to avoid flash
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      setIsDismissed(dismissed === "true");
    } catch {
      setIsDismissed(false);
    }
  }, []);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleDismiss() {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Silently ignore
    }
  }

  if (isDismissed) return null;

  return (
    <div className="mb-8 animate-fade-up">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent-light)] to-[var(--bg-card)] p-6 sm:p-8">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--text-primary)]"
          aria-label="Dismiss onboarding guide"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-normal text-[var(--text-primary)] sm:text-3xl">
            Welcome to{" "}
            <span className="italic text-[var(--accent)]">Provibal</span> 👋
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[var(--text-muted)]">
            Generate a complete, production-grade prompt kit for your project in
            3 simple steps. Here&apos;s how it works:
          </p>
        </div>

        {/* Steps */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)] text-[var(--accent)]">
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--accent)]">
                    Step {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      size={10}
                      className="hidden text-[var(--text-muted)] sm:block"
                    />
                  )}
                </div>
                <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rotating tip */}
        <div className="flex items-start gap-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] px-4 py-3">
          <span className="mt-0.5 shrink-0 text-[var(--accent)]">
            {TIPS[currentTip].icon}
          </span>
          <p className="text-xs text-[var(--text-muted)] transition-opacity duration-300">
            <span className="font-semibold text-[var(--text-primary)]">
              Pro tip:
            </span>{" "}
            {TIPS[currentTip].text}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Compact post-generation guidance shown after a kit is generated */
export function PostGenerationHint({ hasFollowUps }: { hasFollowUps: boolean }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="mt-4 animate-fade-in rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-light)]/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              What to do next
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-[var(--text-muted)]">
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                Copy the <strong>Foundation Prompt</strong> and paste it into your AI IDE as the system prompt
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                Follow the <strong>Build Sequence</strong> steps one by one — each is a self-contained prompt
              </li>
              {!hasFollowUps && (
                <li className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  Generate the <strong>Provibal Protocol</strong> below for debugging, security, and deployment prompts
                </li>
              )}
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                Use <strong>Export</strong> to download the full kit as Markdown, XML, or PDF
              </li>
            </ul>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="shrink-0 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Dismiss hint"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
