"use client";

// components/navbar.tsx — Global navigation header — warm white + brown + black

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/pricing" },
] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-lg p-1.5 text-[#6B6457] transition-colors hover:bg-[#EDE5DA] hover:text-[#111111] dark:hover:bg-[#333] dark:hover:text-white"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function Navbar() {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2D9CF] bg-white transition-colors dark:border-[#333] dark:bg-black">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-[#111111] transition-opacity hover:opacity-70"
        >
          Promptra
        </Link>

        {/* Center nav links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#6B6457] transition-colors hover:text-[#111111]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right auth area */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {userId ? (
            <>
              {/* Mobile nav links when signed in */}
              <div className="flex items-center gap-1 sm:hidden">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#6B6457] hover:text-[#111111]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
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
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#6B6457] hover:text-[#111111]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#6B6457] transition-colors hover:text-[#111111]"
              >
                Sign In
              </Link>
              <Link
                href="/generate"
                className="rounded-lg bg-[#8C6A4A] px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#7A5C3E]"
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
