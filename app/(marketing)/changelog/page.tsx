// app/(marketing)/changelog/page.tsx — Changelog page showing product updates

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "See what's new in Provibal — product updates, new features, and improvements.",
};

interface ChangelogEntry {
  readonly date: string;
  readonly version: string;
  readonly title: string;
  readonly changes: readonly string[];
  readonly tag: "feature" | "improvement" | "fix";
}

const TAG_STYLES = {
  feature: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  improvement: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  fix: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const TAG_LABELS = {
  feature: "New Feature",
  improvement: "Improvement",
  fix: "Bug Fix",
};

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "July 2026",
    version: "v0.5",
    title: "Landing Page Overhaul & Trust Improvements",
    tag: "improvement",
    changes: [
      "Redesigned landing page with How It Works, Who It's For, FAQ, and Pricing Preview sections",
      "Added live kits-generated counter for real social proof",
      "Added global error boundary for graceful error handling",
      "Created About and Changelog pages for transparency",
      "Expanded features grid from 3 to 6 cards",
      "Added IDE compatibility badges (Cursor, Windsurf, Antigravity, Claude)",
    ],
  },
  {
    date: "July 2026",
    version: "v0.4",
    title: "Smart Protocol + Export Overhaul",
    tag: "feature",
    changes: [
      "Replaced static 8-category follow-ups with personalized, project-aware Smart Protocol",
      "Added difficulty badges and time estimates to Protocol prompts",
      "Added Copy Full Kit button for one-click clipboard export",
      "Added section-level and full-kit exports in MD, XML, and PDF formats",
      "Rebranded 'Follow-ups' to 'Provibal Protocol'",
    ],
  },
  {
    date: "July 2026",
    version: "v0.3",
    title: "Payments & Localization",
    tag: "feature",
    changes: [
      "Integrated Dodo Payments with checkout sessions and webhook verification",
      "Added India-specific pricing (₹299/mo Pro, ₹99 Refill)",
      "Added buy refill pack on billing page for Pro users",
      "Fixed webhook issues where payment status wasn't syncing",
    ],
  },
  {
    date: "June 2026",
    version: "v0.2",
    title: "Core Features Launch",
    tag: "feature",
    changes: [
      "Built complete prompt kit generator with Gemini 2.5 Flash",
      "Implemented Foundation Prompt, Project Map, and Build Sequence generation",
      "Added Clerk authentication with entitlement system",
      "Created generation history with Supabase persistence",
      "Added rate limiting for free tier users",
      "Deployed to Vercel with custom domain provibal.com",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Changelog
          </span>
          <h1 className="font-serif text-5xl font-normal tracking-tight text-[var(--text-primary)] sm:text-6xl">
            What&apos;s{" "}
            <span className="italic text-[var(--accent)]">new</span>
          </h1>
          <p className="mt-4 text-base text-[var(--text-muted)]">
            Product updates, new features, and improvements — all in one place.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-8">
          {CHANGELOG.map((entry) => (
            <article
              key={entry.version}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8"
            >
              {/* Header */}
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-[var(--accent-light)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
                  {entry.version}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${TAG_STYLES[entry.tag]}`}>
                  {TAG_LABELS[entry.tag]}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {entry.date}
                </span>
              </div>

              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                {entry.title}
              </h2>

              {/* Changes list */}
              <ul className="flex flex-col gap-2.5">
                {entry.changes.map((change) => (
                  <li
                    key={change}
                    className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {change}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
