"use client";

// components/how-it-works.tsx — Three-step animated explainer section

import { useEffect, useRef, useState } from "react";
import { PenLine, Sparkles, Copy } from "lucide-react";

interface StepProps {
  readonly number: number;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly detail: string;
  readonly index: number;
}

function Step({ number, icon, title, description, detail, index }: StepProps) {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center gap-5 text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step number + icon */}
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] transition-transform duration-200 hover:scale-110">
          {icon}
        </div>
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white shadow-sm">
          {number}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
        <p className="mt-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2.5 text-xs font-medium text-[var(--accent)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

const STEPS: Omit<StepProps, "index">[] = [
  {
    number: 1,
    icon: <PenLine size={26} />,
    title: "Describe Your Project",
    description:
      "Tell us what you're building — the project name, type, tech stack, and a description. The more detail you add, the better the output.",
    detail: "Takes about 30 seconds",
  },
  {
    number: 2,
    icon: <Sparkles size={26} />,
    title: "AI Generates Your Kit",
    description:
      "Provibal's engine analyzes your description and generates a complete Foundation Prompt, Project Map, and Build Sequence.",
    detail: "Powered by Gemini 2.5 Flash",
  },
  {
    number: 3,
    icon: <Copy size={26} />,
    title: "Copy & Build",
    description:
      "Paste the prompts into Cursor, Windsurf, Claude, or any AI IDE. Follow the build sequence step by step. Ship your project faster.",
    detail: "Export as MD, XML, or PDF",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--bg)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            How it works
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Three steps to{" "}
            <span className="italic text-[var(--accent)]">production-ready</span>{" "}
            prompts
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[var(--text-muted)]">
            No prompt engineering expertise needed. Describe what you want to
            build and let Provibal handle the rest.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8 sm:items-start">
          {STEPS.map((step, i) => (
            <Step key={step.number} index={i} {...step} />
          ))}
        </div>

      </div>
    </section>
  );
}
