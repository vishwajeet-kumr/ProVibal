"use client";

// components/faq-section.tsx — FAQ accordion with warm design system

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

function FAQAccordionItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-[var(--accent)]"
      >
        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-base">
          {question}
        </h3>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {answer}
        </p>
      </div>
    </div>
  );
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Can't I just ask ChatGPT or Claude to generate prompts for me?",
    answer:
      "Technically yes — just like you can design a poster in Photoshop instead of Canva. But most people don't write well-structured, production-grade prompts. Provibal gives you a complete, structured kit (Foundation + File Map + Build Sequence + Protocol) that's been engineered to work with AI IDEs like Cursor and Windsurf. It's the difference between a random prompt and a professional architecture plan.",
  },
  {
    question: "What AI IDEs does Provibal work with?",
    answer:
      "Provibal generates prompt kits that work with any AI coding assistant — Cursor, Windsurf, Antigravity, Claude Projects, GitHub Copilot, and more. The output is plain text (Markdown, XML, or PDF) so you can paste it into any tool that accepts prompts.",
  },
  {
    question: "What's included in a prompt kit?",
    answer:
      "Every kit includes four parts: (1) Foundation Prompt — defines your AI's identity, architecture rules, code quality standards, and security requirements. (2) Project Map — every file your project needs with its single responsibility. (3) Build Sequence — 6-8 ordered steps, each with a self-contained prompt your AI IDE can execute. (4) Provibal Protocol — personalized follow-up prompts for debugging, security, performance, and deployment.",
  },
  {
    question: "Is the free tier actually useful?",
    answer:
      "Yes. Free users get a full project kit with Foundation Prompt, Project Map, and Build Sequence — the three core components you need to start building. Pro unlocks unlimited generations, the Provibal Protocol (follow-up prompts), and all export formats.",
  },
  {
    question: "Will this become obsolete when AI IDEs get smarter?",
    answer:
      "AI IDEs are getting better at code generation, but structured planning is a separate skill. Even the best AI needs context about your project's architecture, constraints, and build order. Provibal evolves with the tools — we continuously update our prompt engineering to match the latest AI capabilities.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Yes. Cancel with one click from your billing page. No hidden fees, no lock-in contracts. If you cancel, you keep Pro access until the end of your billing period.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-[var(--bg)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            FAQ
          </span>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[var(--text-primary)] sm:text-5xl">
            Common{" "}
            <span className="italic text-[var(--accent)]">questions</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-6 sm:px-8">
          {FAQ_ITEMS.map((item) => (
            <FAQAccordionItem key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
