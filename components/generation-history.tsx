import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileCode2, ChevronRight } from "lucide-react";

export async function GenerationHistory() {
  const { userId } = await auth();
  if (!userId) return null;

  const { data: generations, error } = await supabaseAdmin
    .from("generations")
    .select("id, project_name, project_type, tech_stack, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Failed to load kit history.
      </div>
    );
  }

  if (!generations || generations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-12 text-center">
        <FileCode2 size={32} className="text-[var(--text-muted)] opacity-50" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">No kits generated yet</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Your generated projects will appear here.</p>
        </div>
        <Link
          href="/generate"
          className="mt-2 text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Generate your first kit
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Kits</h2>
        <Link href="/history" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          View all
        </Link>
      </div>
      
      <div className="divide-y divide-[var(--border)]">
        {generations.map((gen) => (
          <Link
            key={gen.id}
            href={`/history/${gen.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-[var(--bg)] transition-colors group"
          >
            <div>
              <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {gen.project_name}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="capitalize">{gen.project_type.replace('-', ' ')}</span>
                <span>•</span>
                <span>{gen.tech_stack === 'default' ? 'Auto-selected' : gen.tech_stack}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
