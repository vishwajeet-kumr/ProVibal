"use client";

// components/who-its-for.tsx — Target audience personas section

import { useEffect, useRef, useState } from "react";
import { Rocket, GraduationCap, Building2 } from "lucide-react";

interface PersonaProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly useCase: string;
  readonly index: number;
}

function PersonaCard({ icon, title, description, useCase, index }: PersonaProps) {
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
      className={`flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 transition-all duration-700 hover:shadow-md hover:shadow-[var(--accent)]/8 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
        {icon}
      </div>
      <div>
        <h3 className="mb-1.5 text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      </div>
      <div className="mt-auto rounded-lg bg-[var(--bg)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--accent)]">
          💡 {useCase}
        </p>
      </div>
    </div>
  );
}

const PERSONAS: Omit<PersonaProps, "index">[] = [
  {
    icon: <Rocket size={20} />,
    title: "Indie Hackers & Solo Founders",
    description:
      "Ship your MVP in days, not weeks. Get a complete architecture plan and build sequence that any AI IDE can execute — without hiring a CTO.",
    useCase:
      "\"I used Provibal to plan my SaaS before writing a single line. My Cursor workflow was 3x faster.\"",
  },
  {
    icon: <GraduationCap size={20} />,
    title: "Students & Learners",
    description:
      "Learn production-grade architecture by studying the prompts Provibal generates. See how a senior engineer would structure your project.",
    useCase:
      "\"Provibal taught me more about project structure than any tutorial I've watched.\"",
  },
  {
    icon: <Building2 size={20} />,
    title: "Agencies & Freelancers",
    description:
      "Start every client project with a professional architecture plan. Standardize your team's approach to AI-assisted development.",
    useCase:
      "\"We generate a kit for every new client project. It saves hours of planning.\"",
  },
];

export function WhoItsForSection() {
  return (
    <section className="bg-[var(--bg)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Built for builders
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Who uses{" "}
            <span className="italic text-[var(--accent)]">Provibal?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[var(--text-muted)]">
            Whether you&apos;re building your first project or your fiftieth,
            structured prompts make every build faster.
          </p>
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PERSONAS.map((persona, i) => (
            <PersonaCard key={persona.title} index={i} {...persona} />
          ))}
        </div>
      </div>
    </section>
  );
}
