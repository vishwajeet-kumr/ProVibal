// app/terms/page.tsx — Terms of Service — server component

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const CONTACT_EMAIL = "contact.provibal@gmail.com";

const sectionTitleClass = "mb-3 font-serif text-2xl text-[var(--text-primary)]";
const proseClass = "text-sm leading-relaxed text-[var(--text-primary)]";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--text-primary)]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: July 2025</p>

        <div className="mt-12 flex flex-col gap-10">
          <section>
            <h2 className={sectionTitleClass}>1. Acceptance of Terms</h2>
            <p className={proseClass}>
              By using Provibal, you agree to these terms. If you do not agree, please do not use
              the service.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>2. Description of Service</h2>
            <p className={proseClass}>
              Provibal is an AI-powered prompt kit generator that helps developers generate
              production-grade foundation prompts, file maps, and build sequences for their
              software projects.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>3. Free Tier</h2>
            <p className={proseClass}>
              Free accounts receive one trial generation. The trial includes a complete foundation
              prompt, project map, and feature build sequence.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>4. Pro Tier</h2>
            <p className={proseClass}>
              Pro subscribers receive unlimited generations and access to 8 follow-up prompts per
              kit covering debugging, optimization, security, and deployment. Pro access is billed
              at ₹239/month.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>5. Prohibited Uses</h2>
            <ul className={`${proseClass} list-disc pl-5 space-y-1.5`}>
              <li>
                You may not use Provibal to generate content that is harmful, illegal, or violates
                third-party rights.
              </li>
              <li>
                Automated scraping, reselling, or redistributing generated content without
                attribution is prohibited.
              </li>
              <li>Abuse of free tier limits via multiple accounts is not permitted.</li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleClass}>6. Intellectual Property</h2>
            <p className={proseClass}>
              Generated prompt kits belong to you, the user. Provibal retains all rights to the
              platform, design, and underlying technology.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>7. Limitation of Liability</h2>
            <p className={proseClass}>
              Provibal is provided as-is without warranty. We are not liable for any damages
              arising from use of the service or generated content.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>8. Changes to Terms</h2>
            <p className={proseClass}>
              We reserve the right to modify these terms. Continued use of the service constitutes
              acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>9. Contact</h2>
            <p className={proseClass}>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
