import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import type { PromptKit } from "@/features/generator/generator.types";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryKitPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("generations")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    notFound();
  }

  const promptKit: PromptKit = {
    id: data.id,
    projectName: data.project_name,
    projectType: data.project_type,
    techStack: data.tech_stack,
    foundation: data.foundation_prompt,
    projectMap: data.file_map,
    featureSequence: data.build_steps,
    followUpChain:
      data.follow_up_runs && data.follow_up_runs.length > 0
        ? data.follow_up_runs[data.follow_up_runs.length - 1]
        : null,
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          {promptKit.projectName}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] capitalize">
          {promptKit.projectType.replace('-', ' ')} • {promptKit.techStack === 'default' ? 'Auto-selected' : promptKit.techStack}
        </p>
      </div>

      <PromptKitOutput kit={promptKit} isAuthenticated={true} />
    </div>
  );
}
