"use client";

// components/navbar.tsx — Global navigation header — warm white + brown + black

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const { userId } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)] dark:bg-[var(--bg)] dark:border-[var(--border)] transition-all duration-200 ease-out ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-70"
        >
          Provibal
        </Link>

        {/* Center nav links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right auth area */}
        <div className="flex items-center gap-3">
          {userId ? (
            <>
              {/* Mobile nav links when signed in */}
              <div className="flex items-center gap-1 sm:hidden">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-7 w-7" },
                }}
              />
            </>
          ) : (
            <>
              {/* Mobile nav links when signed out */}
              <div className="flex items-center gap-1 sm:hidden">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                Sign In
              </Link>
              <Link
                href="/generate"
                className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#7A5C3E]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
