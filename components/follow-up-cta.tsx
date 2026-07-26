"use client";

import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";

export interface FollowUpCTAProps {
  readonly userId: string | null | undefined;
  readonly followUpLoading: boolean;
  readonly onGenerate: () => void;
}

export function FollowUpCTA({ userId, followUpLoading, onGenerate }: FollowUpCTAProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
        <Zap size={22} className="text-[var(--accent)]" />
      </div>
      <h3 className="mb-2 font-serif text-lg text-[var(--text-primary)]">
        Unlock Provibal Protocol
      </h3>
      <p className="mx-auto mb-5 max-w-sm text-sm text-[var(--text-muted)]">
        Get personalized production-hardening prompts — tailored to your project's stack and architecture
      </p>
      {!userId ? (
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-light)]"
        >
          Sign in to generate
        </Link>
      ) : (
        <button
          onClick={onGenerate}
          disabled={followUpLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7A5C3E] disabled:opacity-60"
        >
          {followUpLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating…
            </>
          ) : (
            "Run Provibal Protocol"
          )}
        </button>
      )}
    </div>
  );
}
