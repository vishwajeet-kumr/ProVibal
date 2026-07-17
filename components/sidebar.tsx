"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  CreditCard, 
  Settings 
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate Kit", href: "/generate", icon: Sparkles },
  { label: "History", href: "/history", icon: History },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[var(--border)]">
        <Link
          href="/dashboard"
          className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-70"
        >
          Provibal
        </Link>
      </div>

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
    </aside>
  );
}
