// app/(marketing)/about/page.tsx — About page: solo founder story

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Provibal",
  description:
    "The story behind Provibal — built by a solo developer in India to help vibe coders ship faster with production-grade AI prompts.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            About
          </span>
          <h1 className="font-serif text-5xl font-normal tracking-tight text-[var(--text-primary)] sm:text-6xl">
            Built by a{" "}
            <span className="italic text-[var(--accent)]">solo developer</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
            Provibal started as a personal frustration. I was spending more time
            writing prompts for my AI IDE than actually building my projects.
            Every new project meant re-engineering the same architecture rules,
            file structures, and build sequences from scratch.
          </p>
        </div>

        {/* Story sections */}
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              The Problem
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Vibe coding is powerful — but only when your AI has the right
              context. Most people paste vague descriptions into Cursor or
              Claude and wonder why the output is inconsistent. The secret
              isn&apos;t better AI — it&apos;s better prompts. Structured, detailed,
              production-grade prompts that tell your AI exactly how to build.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              The Solution
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Provibal generates a complete prompt kit for any project in
              seconds. Not just one prompt — a full Foundation Prompt (identity
              + architecture + quality standards), a Project Map (every file
              with its responsibility), a Build Sequence (ordered steps with
              self-contained prompts), and a Protocol (follow-up prompts for
              hardening and deployment).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
              Built In Public
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              I&apos;m a student developer from India building Provibal as a solo
              project. Every feature is built, tested, and shipped by one
              person. I believe in transparency — this product doesn&apos;t pretend
              to be a big company. It&apos;s a real tool built by a real person
              solving a real problem.
            </p>
          </section>

          {/* Tech stack */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Built With
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { name: "Next.js 16", role: "Framework" },
                { name: "TypeScript", role: "Language" },
                { name: "Tailwind CSS 4", role: "Styling" },
                { name: "Gemini 2.5 Flash", role: "AI Engine" },
                { name: "Clerk", role: "Authentication" },
                { name: "Supabase", role: "Database" },
                { name: "Dodo Payments", role: "Payments" },
                { name: "Vercel", role: "Hosting" },
                { name: "Framer Motion", role: "Animations" },
              ].map((tech) => (
                <div key={tech.name} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {tech.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {tech.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
