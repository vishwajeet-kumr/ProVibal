// app/dashboard/page.tsx — Authenticated user dashboard: saved kits and account overview

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back!
          </h1>
          <p className="mt-2 text-slate-400">
            Your Promptra dashboard — manage your generated kits here.
          </p>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300">
              Your prompt kits will appear here.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Kit history is coming in v2 — for now, generate and copy directly.
            </p>
          </div>

          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-150 hover:bg-violet-500 hover:shadow-violet-500/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            Generate New Kit
          </Link>
        </div>
      </div>
    </main>
  );
}
