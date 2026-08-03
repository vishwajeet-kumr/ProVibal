"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Zap, Loader2, LogIn } from "lucide-react";
import { GeneratorForm } from "@/components/generator-form";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import type { TabId } from "@/components/prompt-kit-output";
import { GenerationLoader } from "@/components/generation-loader";
import { FollowUpCTA } from "@/components/follow-up-cta";
import { OnboardingGuide, PostGenerationHint } from "@/components/onboarding-guide";
import type { PromptKit, ProjectInput, FollowUpChain, IdeRulesBundle } from "@/features/generator/generator.types";

interface ApiGenerateResponse {
  status: "success" | "error";
  data?: PromptKit;
  error?: string;
}

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

function PageHeading() {
  return (
    <div className="mb-10 text-center">
      <h1 className="font-serif text-4xl font-normal tracking-tight text-[var(--text-primary)] sm:text-5xl">
        Generate Your <span className="italic text-[var(--accent)]">Prompt Kit</span>
      </h1>
      <p className="mt-3 text-base text-[var(--text-muted)]">
        Describe your project and get a complete vibe coding prompt kit instantly.
      </p>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 shadow-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-light)]">
          <LogIn size={24} className="text-[var(--accent)]" />
        </div>
        <h2 className="mb-2 font-serif text-xl text-[var(--text-primary)]">
          Sign in to get started
        </h2>
        <p className="mx-auto mb-6 max-w-xs text-sm text-[var(--text-muted)]">
          Create a free account to generate your first production-grade prompt kit.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-light)]"
        >
          Sign in to generate
        </Link>
      </div>
    </div>
  );
}


interface PostGenerationProps {
  readonly kit: PromptKit;
  readonly userId: string | null | undefined;
  readonly isPro: boolean;
  readonly isLoading: boolean;
  readonly followUpLoading: boolean;
  readonly ideRulesBundle: IdeRulesBundle | null;
  readonly ideRulesLoading: boolean;
  readonly outputTab: TabId;
  readonly onClear: () => void;
  readonly onSubmit: (data: ProjectInput) => Promise<void>;
  readonly onGenerateFollowUps: () => void;
  readonly onGenerateIdeRules: () => void;
}

function PostGenerationView({
  kit,
  userId,
  isPro,
  isLoading,
  followUpLoading,
  ideRulesBundle,
  ideRulesLoading,
  outputTab,
  onClear,
  onSubmit,
  onGenerateFollowUps,
  onGenerateIdeRules,
}: PostGenerationProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <div className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Regenerate
          </p>
          <button
            onClick={onClear}
            className="text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--text-primary)] hover:underline"
          >
            Clear
          </button>
        </div>
        <GeneratorForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>

      <div>
        <div className="animate-fade-in rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-lg font-normal text-[var(--text-primary)]">
                {kit.projectName}
              </h2>
              <span className="rounded-full bg-[var(--accent-light)] px-3 py-0.5 text-xs font-medium text-[var(--accent)]">
                {kit.projectType}
              </span>
            </div>
          </div>
          <PromptKitOutput
            kit={kit}
            isAuthenticated={!!userId}
            isPro={isPro}
            defaultTab={outputTab}
            ideRulesBundle={ideRulesBundle}
            ideRulesLoading={ideRulesLoading}
            onGenerateIdeRules={onGenerateIdeRules}
            projectName={kit.projectName}
          />
        </div>

        {/* Post-generation guidance hint */}
        <PostGenerationHint hasFollowUps={kit.followUpChain !== null} />

        {kit.followUpChain === null && (
          <FollowUpCTA
            userId={userId}
            followUpLoading={followUpLoading}
            onGenerate={onGenerateFollowUps}
          />
        )}
      </div>
    </div>
  );
}

export function GenerateClient() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const isPro = (user?.publicMetadata as Record<string, unknown> | undefined)?.plan === "pro";
  const [kit, setKit] = useState<PromptKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [ideRulesBundle, setIdeRulesBundle] = useState<IdeRulesBundle | null>(null);
  const [ideRulesLoading, setIdeRulesLoading] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<ProjectInput | null>(null);
  const [outputTab, setOutputTab] = useState<TabId>("foundation");

  // ─── Session persistence: restore on mount ───────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("provibal_generate_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.kit) setKit(parsed.kit);
        if (parsed.formData) setCurrentFormData(parsed.formData);
        if (parsed.ideRulesBundle) setIdeRulesBundle(parsed.ideRulesBundle);
        if (parsed.outputTab) setOutputTab(parsed.outputTab);
      }
    } catch {
      // Silently ignore parse errors
    }
  }, []);

  // ─── Session persistence: save on state changes ──────────────────
  const saveSession = useCallback(() => {
    try {
      if (kit) {
        sessionStorage.setItem(
          "provibal_generate_session",
          JSON.stringify({
            kit,
            formData: currentFormData,
            ideRulesBundle,
            outputTab,
          })
        );
      }
    } catch {
      // Silently ignore storage errors (quota, etc.)
    }
  }, [kit, currentFormData, ideRulesBundle, outputTab]);

  useEffect(() => {
    saveSession();
  }, [saveSession]);

  async function handleSubmit(data: ProjectInput): Promise<void> {
    setCurrentFormData(data);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await response.json()) as ApiGenerateResponse;
      if (json.status === "success" && json.data) {
        setKit(json.data);
        setOutputTab("foundation");
      } else {
        toast.error(json.error ?? "Generation failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateFollowUps(): Promise<void> {
    if (!kit || !currentFormData) return;
    setFollowUpLoading(true);
    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: currentFormData, kit }),
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
    if (!kit || !currentFormData) return;
    setIdeRulesLoading(true);
    try {
      const response = await fetch("/api/export/ide-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: currentFormData, kit, generationId: kit.id }),
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

  function handleClear(): void {
    setKit(null);
    setCurrentFormData(null);
    setIdeRulesBundle(null);
    setOutputTab("foundation");
    try {
      sessionStorage.removeItem("provibal_generate_session");
    } catch {
      // Silently ignore
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl">
        <PageHeading />
        {!isLoaded ? (
          <div className="mx-auto w-full max-w-md">
            <GenerationLoader />
          </div>
        ) : !userId ? (
          <SignInPrompt />
        ) : isLoading ? (
          <div className="mx-auto w-full max-w-md">
            <GenerationLoader />
          </div>
        ) : kit === null ? (
          <div className="mx-auto max-w-2xl">
            <OnboardingGuide />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-sm">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <PostGenerationView
            kit={kit}
            userId={userId}
            isPro={isPro}
            isLoading={isLoading}
            followUpLoading={followUpLoading}
            ideRulesBundle={ideRulesBundle}
            ideRulesLoading={ideRulesLoading}
            outputTab={outputTab}
            onClear={handleClear}
            onSubmit={handleSubmit}
            onGenerateFollowUps={handleGenerateFollowUps}
            onGenerateIdeRules={handleGenerateIdeRules}
          />
        )}
      </div>
    </main>
  );
}
