// app/privacy/page.tsx — Privacy Policy — server component

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const CONTACT_EMAIL = "contact.provibal@gmail.com";

const sectionTitleClass = "mb-3 font-serif text-2xl text-[var(--text-primary)]";
const proseClass = "text-sm leading-relaxed text-[var(--text-primary)]";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--text-primary)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: July 2025</p>

        <div className="mt-12 flex flex-col gap-10">
          <section>
            <h2 className={sectionTitleClass}>1. Information We Collect</h2>
            <p className={proseClass}>
              We collect your email address and name when you sign in. We also collect usage data
              such as features used and pages visited to improve the product. We do not store your
              generated prompt kits on our servers.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>2. How We Use Your Information</h2>
            <ul className={`${proseClass} list-disc pl-5 space-y-1.5`}>
              <li>To provide and operate the Provibal service.</li>
              <li>To manage your account and subscription status.</li>
              <li>To send important service and account updates.</li>
            </ul>
            <p className={`${proseClass} mt-3`}>We never sell your data to third parties.</p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>3. Third-Party Services</h2>
            <ul className={`${proseClass} list-disc pl-5 space-y-1.5`}>
              <li>
                <strong>Clerk</strong> (clerk.com) — authentication and user management
              </li>
              <li>
                <strong>Google Gemini</strong> (ai.google) — AI prompt generation
              </li>
              <li>
                <strong>Dodo Payments</strong> (dodopayments.com) — payment processing
              </li>
              <li>
                <strong>Vercel</strong> (vercel.com) — hosting and infrastructure
              </li>
            </ul>
            <p className={`${proseClass} mt-3`}>
              Each service has its own privacy policy governing how they handle your data.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>4. Data Retention</h2>
            <p className={proseClass}>
              Your account data is retained while your account is active. Upon account deletion,
              your data is removed within 30 days. Generated prompts are stateless and not stored
              on our servers.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>5. Your Rights</h2>
            <p className={proseClass}>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>6. Changes to This Policy</h2>
            <p className={proseClass}>
              We may update this policy periodically. We will notify you of significant changes via
              email or a notice on the site.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>7. Contact</h2>
            <p className={proseClass}>
              For privacy-related questions:{" "}
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
