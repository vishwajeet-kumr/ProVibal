// components/hero-section.tsx — Above-fold section with headline, subheadline, and CTA

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-center">
      {/* Radial ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* Badge */}
      <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
        AI Prompt Engineering
      </div>

      {/* Headline */}
      <h1 className="relative max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Generate{" "}
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
          Production-Grade
        </span>{" "}
        Vibe Coding Prompts
      </h1>

      {/* Subheadline */}
      <p className="relative mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        Describe your app. Get a complete prompt kit — foundation prompt, file
        map, and build sequence — ready to paste into any AI IDE.
      </p>

      {/* CTA group */}
      <div className="relative mt-10 flex flex-col items-center gap-3">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/50 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 active:translate-y-0"
        >
          Generate Your Prompt Kit →
        </Link>
        <p className="text-sm text-slate-500">Free to try. No account required.</p>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"
      />
    </section>
  );
}
