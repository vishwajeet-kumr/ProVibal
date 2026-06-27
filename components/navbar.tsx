"use client";

// components/navbar.tsx — Global navigation header

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/pricing" },
] as const;

export function Navbar() {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-violet-400 transition-opacity hover:opacity-80"
        >
          Promptra
        </Link>

        {/* Nav links + auth — flex row, wraps cleanly on small screens */}
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {label}
            </Link>
          ))}

          <div className="ml-2 h-4 w-px bg-white/10" aria-hidden="true" />

          {userId ? (
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="ml-1 rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-violet-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
