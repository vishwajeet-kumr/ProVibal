"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  CreditCard, 
  Settings,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate Kit", href: "/generate", icon: Sparkles },
  { label: "History", href: "/history", icon: History },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ isPro, pathname }: { isPro: boolean; pathname: string }) {
  return (
    <>
      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/20"
                  : "text-[var(--text-muted)] hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-[var(--text-muted)]"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA — only for free users */}
      {!isPro && (
        <div className="p-4 border-t border-[var(--border)]">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A5A3C]"
          >
            Upgrade to Pro
            <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
    </>
  );
}

function BrandHeader({ isPro }: { isPro: boolean }) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[var(--border)]">
      <Link
        href="/dashboard"
        className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-70"
      >
        Provibal
      </Link>
      {isPro && (
        <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
          Pro
        </span>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isPro = user?.publicMetadata?.plan === "pro";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-card)] lg:flex">
        <BrandHeader isPro={isPro} />
        <SidebarContent isPro={isPro} pathname={pathname} />
      </aside>

      {/* Mobile hamburger button — visible below lg */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile sidebar — overlay drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-[70] flex w-72 flex-col border-r border-[var(--border)] bg-[var(--bg-card)] shadow-xl animate-slide-in-left lg:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[var(--border)]">
              <Link
                href="/dashboard"
                className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Provibal
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-light)] transition-colors"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent isPro={isPro} pathname={pathname} />
          </aside>
        </>
      )}
    </>
  );
}
