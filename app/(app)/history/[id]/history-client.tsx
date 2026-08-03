"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import type { TabId } from "@/components/prompt-kit-output";
import { FollowUpCTA } from "@/components/follow-up-cta";
import { IdeRulesExport } from "@/components/ide-rules-export";
import type { PromptKit, ProjectInput, FollowUpChain, IdeRulesBundle } from "@/features/generator/generator.types";

interface ApiFollowUpResponse {
  status: "success" | "error";
  data?: FollowUpChain;
  error?: string;
}

interface ApiIdeRulesResponse {
  status: "success" | "error";
  data?: IdeRulesBundle;
  error?: string;
}

export function HistoryClient({
  initialKit,
  userId,
  projectInput,
  savedIdeRules,
}: {
  initialKit: PromptKit;
  userId: string;
  projectInput: ProjectInput;
  savedIdeRules: IdeRulesBundle | null;
}) {
  const { user } = useUser();
  const isPro = (user?.publicMetadata as Record<string, unknown> | undefined)?.plan === "pro";
  const [kit, setKit] = useState<PromptKit>(initialKit);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [ideRulesBundle, setIdeRulesBundle] = useState<IdeRulesBundle | null>(savedIdeRules);
  const [ideRulesLoading, setIdeRulesLoading] = useState(false);
  const [outputTab, setOutputTab] = useState<TabId>("foundation");

  async function handleGenerateFollowUps(): Promise<void> {
    setFollowUpLoading(true);
    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: projectInput, kit }),
      });
      const json = (await response.json()) as ApiFollowUpResponse;
      if (json.status === "success" && json.data) {
        setKit({ ...kit, followUpChain: json.data });
        setOutputTab("follow-ups");
        toast.success("Provibal Protocol ready!");
      } else {
        toast.error(json.error ?? "Follow-up generation failed.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setFollowUpLoading(false);
    }
  }

  async function handleGenerateIdeRules(): Promise<void> {
    setIdeRulesLoading(true);
    try {
      const response = await fetch("/api/export/ide-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: projectInput,
          kit,
          generationId: kit.id,
        }),
      });
      const json = (await response.json()) as ApiIdeRulesResponse;
      if (json.status === "success" && json.data) {
        setIdeRulesBundle(json.data);
        toast.success("IDE rules generated!");
      } else {
        toast.error(json.error ?? "IDE rules generation failed.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setIdeRulesLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[var(--text-primary)]">
          {kit.projectName}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] capitalize">
          {kit.projectType.replace("-", " ")} • {kit.techStack === "default" ? "Auto-selected" : kit.techStack}
        </p>
      </div>

      <PromptKitOutput kit={kit} isAuthenticated={!!userId} isPro={isPro} defaultTab={outputTab} />

      <IdeRulesExport
        bundle={ideRulesBundle}
        isLoading={ideRulesLoading}
        isPro={isPro}
        projectName={kit.projectName}
        onGenerate={handleGenerateIdeRules}
      />

      {kit.followUpChain === null && (
        <FollowUpCTA
          userId={userId}
          followUpLoading={followUpLoading}
          onGenerate={handleGenerateFollowUps}
        />
      )}
    </>
  );
}
