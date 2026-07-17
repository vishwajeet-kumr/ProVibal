"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end gap-4 border-b border-[var(--border)] bg-[var(--bg-card)]/80 px-6 backdrop-blur-md">
      <ThemeToggle />
      <div className="h-4 w-px bg-[var(--border)]" />
      <UserButton 
        appearance={{
          elements: { avatarBox: "h-8 w-8" },
        }}
      />
    </header>
  );
}
