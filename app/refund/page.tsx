// app/refund/page.tsx — Refund & Cancellation Policy — server component

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
};

const CONTACT_EMAIL = "contact.provibal@gmail.com";

const sectionTitleClass = "mb-3 font-serif text-2xl text-[var(--text-primary)]";
const proseClass = "text-sm leading-relaxed text-[var(--text-primary)]";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--text-primary)]">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: July 2025</p>

        <div className="mt-12 flex flex-col gap-10">
          <section>
            <h2 className={sectionTitleClass}>1. Subscription Cancellation</h2>
            <p className={proseClass}>
              You may cancel your Pro subscription at any time from your account settings. Your Pro
              access continues until the end of the current billing period. No partial refunds are
              issued for unused days in a billing period.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>2. Refund Policy</h2>
            <p className={proseClass}>
              We offer a full refund within 7 days of your first Pro subscription payment if you
              are unsatisfied with the service. To request a refund, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              with your registered email and payment details. Refunds are processed within 5–7
              business days to your original payment method.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>3. Exceptions</h2>
            <ul className={`${proseClass} list-disc pl-5 space-y-1.5`}>
              <li>Refunds are not available after 7 days from the first payment.</li>
              <li>Subsequent monthly renewals are non-refundable.</li>
              <li>
                Accounts found to be abusing the refund policy will be permanently suspended.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={sectionTitleClass}>4. How to Cancel</h2>
            <p className={proseClass}>
              Log in to Provibal → Dashboard → Account Settings → Cancel Subscription.
              Alternatively, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              with your cancellation request.
            </p>
          </section>

          <section>
            <h2 className={sectionTitleClass}>5. Contact</h2>
            <p className={proseClass}>
              For refund or cancellation requests:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className={`${proseClass} mt-2`}>We respond within 24 business hours.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
