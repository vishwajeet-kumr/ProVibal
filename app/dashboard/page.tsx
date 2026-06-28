// app/dashboard/page.tsx — Authenticated user dashboard — warm design system

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#F7F4F0] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-[#111111] sm:text-5xl">
            Welcome back!
          </h1>
          <p className="mt-3 text-base text-[#6B6457]">
            Your Promptra dashboard — manage your generated kits here.
          </p>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-[#E2D9CF] bg-white py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE5DA]">
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
              className="text-[#8C6A4A]"
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
            <p className="text-sm font-medium text-[#111111]">
              Your prompt kits will appear here.
            </p>
            <p className="mt-1 text-xs text-[#6B6457]">
              Kit history is coming in v2 — for now, generate and copy directly.
            </p>
          </div>

          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-[#8C6A4A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#8C6A4A]/20 transition-all duration-150 hover:bg-[#7A5A3C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C6A4A]"
          >
            Generate New Kit
          </Link>
        </div>
      </div>
    </main>
  );
}
