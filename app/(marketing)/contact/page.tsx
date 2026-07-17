// app/contact/page.tsx — Contact page — server component

import type { Metadata } from "next";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
};

const CONTACT_EMAIL = "contact.provibal@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--text-primary)]">
          Get in Touch
        </h1>
        <p className="mt-3 text-base text-[var(--text-muted)]">
          Have a question, feedback, or need help? We&apos;re here for you.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Email card */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
              <Mail size={22} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Email Us</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 block text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Response time card */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
              <Clock size={22} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Response Time</p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">
                We typically respond within 24 hours
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">Monday to Saturday</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--text-muted)]">
          For billing or subscription issues, please include your registered email in your message.
        </p>
      </div>
    </main>
  );
}
