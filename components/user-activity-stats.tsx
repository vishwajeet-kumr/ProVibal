"use client";

// components/user-activity-stats.tsx — User-facing activity stats card for the dashboard

import { useState, useEffect } from "react";
import { FileCode2, Zap, Layers, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserStats {
  totalKitsGenerated: number;
  totalProtocolRuns: number;
  mostUsedStack: string | null;
  mostUsedProjectType: string | null;
  memberSince: string | null;
  lastGeneratedAt: string | null;
}

interface StatItemProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[var(--bg)] p-3 border border-[var(--border)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)] text-[var(--accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatProjectType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatStack(stack: string): string {
  const labels: Record<string, string> = {
    "react-next": "React + Next.js",
    "vue-nuxt": "Vue + Nuxt",
    "svelte-kit": "SvelteKit",
    "react-native": "React Native",
    flutter: "Flutter",
    "express-node": "Express + Node.js",
    "fastapi-python": "FastAPI + Python",
    django: "Django",
    "spring-boot": "Spring Boot",
    "go-fiber": "Go + Fiber",
    "Auto-selected": "Auto-selected",
  };
  return labels[stack] ?? stack;
}

export function UserActivityStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fail silently
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-[var(--border)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalKitsGenerated === 0) {
    return null; // Don't show stats if user hasn't generated anything yet
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Your Activity
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <TrendingUp size={12} />
          <span>
            {stats.memberSince
              ? `Member for ${formatDistanceToNow(new Date(stats.memberSince))}`
              : "New member"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={<FileCode2 size={16} />}
          label="Kits Generated"
          value={stats.totalKitsGenerated.toString()}
        />
        <StatItem
          icon={<Zap size={16} />}
          label="Protocol Runs"
          value={stats.totalProtocolRuns.toString()}
        />
        {stats.mostUsedStack && (
          <StatItem
            icon={<Layers size={16} />}
            label="Top Stack"
            value={formatStack(stats.mostUsedStack)}
          />
        )}
        {stats.lastGeneratedAt && (
          <StatItem
            icon={<Clock size={16} />}
            label="Last Generated"
            value={formatDistanceToNow(new Date(stats.lastGeneratedAt), {
              addSuffix: true,
            })}
          />
        )}
      </div>
    </div>
  );
}
