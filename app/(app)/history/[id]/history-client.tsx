"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import type { TabId } from "@/components/prompt-kit-output";
import { FollowUpCTA } from "@/components/follow-up-cta";
import type { PromptKit, ProjectInput, FollowUpChain } from "@/features/generator/generator.types";

interface ApiFollowUpResponse {
  status: "success" | "error";
  data?: FollowUpChain;
  error?: string;
}

export function HistoryClient({
  initialKit,
  userId,
  projectInput,
}: {
  initialKit: PromptKit;
  userId: string;
  projectInput: ProjectInput;
}) {
  const [kit, setKit] = useState<PromptKit>(initialKit);
  const [followUpLoading, setFollowUpLoading] = useState(false);
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

      <PromptKitOutput kit={kit} isAuthenticated={!!userId} defaultTab={outputTab} />

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
