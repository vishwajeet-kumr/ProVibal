// components/hero-section.tsx — Two-column hero: headline + floating UI card preview

import Link from "next/link";

function AvatarStack() {
  const initials = ["V", "A", "M"];
  const colors = ["bg-[#8C6A4A]", "bg-[#6B6457]", "bg-[#A88B70]"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {initials.map((initial, i) => (
          <div
            key={initial}
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F7F4F0] text-xs font-bold text-white ${colors[i]}`}
          >
            {initial}
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-3 w-3 fill-[#8C6A4A]" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-xs text-[#6B6457]">Used by 100+ vibe coders</p>
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
    <div className="relative w-full max-w-md select-none">
      {/* Main card — floating */}
      <div className="animate-float relative z-10 rounded-2xl border border-[#E2D9CF] bg-white p-5 shadow-xl shadow-[#8C6A4A]/10">
        {/* Mock tabs */}
        <div className="mb-4 flex gap-4 border-b border-[#E2D9CF] pb-3">
          {["Foundation", "Project Map", "Build"].map((tab, i) => (
            <span
              key={tab}
              className={`text-xs font-medium ${
                i === 0
                  ? "border-b-2 border-[#8C6A4A] pb-3 -mb-3 text-[#8C6A4A]"
                  : "text-[#6B6457]"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Mock prompt content */}
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] leading-relaxed text-[#6B6457]">
            <span className="text-[#8C6A4A]">// Identity</span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[#111111]">
            You are a senior full-stack engineer
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[#111111]">
            building a production-grade SaaS app.
          </p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#6B6457]">
            <span className="text-[#8C6A4A]">// Architecture Rules</span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[#111111]">
            Feature-based folders only. One file
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-[#111111]">
            = one responsibility. Zod everywhere.
          </p>
        </div>

        {/* Build steps */}
        <div className="mt-4 space-y-1.5">
          {mockSteps.map((step) => (
            <div
              key={step}
              className="flex items-center gap-2 rounded-lg bg-[#F7F4F0] px-3 py-1.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#8C6A4A]" />
              <span className="font-mono text-[10px] text-[#111111]">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary floating file-map card */}
      <div className="animate-float-delayed absolute -bottom-10 -right-6 z-20 w-52 rotate-3 rounded-xl border border-[#E2D9CF] bg-white p-4 shadow-lg shadow-[#8C6A4A]/10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#6B6457]">
          File Map
        </p>
        {mockFiles.map((file) => (
          <div key={file} className="flex items-center gap-1.5 py-0.5">
            <div className="h-1 w-1 rounded-full bg-[#8C6A4A]" />
            <span className="font-mono text-[10px] text-[#111111]">{file}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-56px)] bg-[#F7F4F0] px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">

        {/* Left — 60% */}
        <div className="flex flex-col gap-8 lg:w-[60%]">
          {/* Eyebrow */}
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE5DA] px-4 py-1.5 text-xs font-semibold text-[#8C6A4A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8C6A4A]" />
            AI Prompt Kit Generator
          </span>

          {/* Headline */}
          <h1 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
            Build faster with{" "}
            <span className="italic text-[#8C6A4A]">production-grade</span>{" "}
            AI prompts
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-lg leading-relaxed text-[#6B6457]">
            Describe your project. Get a complete foundation prompt, file map,
            and build sequence — ready for any AI IDE.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-lg bg-[#8C6A4A] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#8C6A4A]/25 transition-all duration-150 hover:bg-[#7A5C3E] hover:-translate-y-px active:translate-y-0"
            >
              Generate Free Kit
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-[#6B6457] underline-offset-4 transition-colors hover:text-[#111111] hover:underline"
            >
              See how it works →
            </Link>
          </div>

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
