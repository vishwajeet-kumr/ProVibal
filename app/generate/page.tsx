"use client";

// app/generate/page.tsx — Main generator page: form input + prompt kit output display

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { GeneratorForm } from "@/components/generator-form";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import type { PromptKit, ProjectInput } from "@/features/generator/generator.types";

interface ApiGenerateResponse {
  status: "success" | "error";
  data?: PromptKit;
  error?: string;
}

export default function GeneratePage() {
  const { userId } = useAuth();
  const [kit, setKit] = useState<PromptKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: ProjectInput): Promise<void> {
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
      } else {
        alert(json.error ?? "Generation failed. Please try again.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Generate Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Prompt Kit
            </span>
          </h1>
          <p className="mt-3 text-slate-400">
            Describe your project and get a complete vibe coding prompt kit instantly.
          </p>
        </div>

        {kit === null ? (
          /* Pre-generation: centered form */
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          /* Post-generation: two-column layout */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
            {/* Left: collapsed form */}
            <div className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Regenerate
              </p>
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Right: tabbed output */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                  {kit.projectName}
                </h2>
                <span className="rounded-full bg-violet-500/15 px-3 py-0.5 text-xs font-medium text-violet-400">
                  {kit.projectType}
                </span>
              </div>
              <PromptKitOutput
                kit={kit}
                isAuthenticated={!!userId}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
