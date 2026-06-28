"use client";

// app/generate/page.tsx — Main generator page — warm design system

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
    <main className="min-h-screen bg-[#F7F4F0]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-[#111111] sm:text-5xl">
            Generate Your{" "}
            <span className="italic text-[#8C6A4A]">Prompt Kit</span>
          </h1>
          <p className="mt-3 text-base text-[#6B6457]">
            Describe your project and get a complete vibe coding prompt kit instantly.
          </p>
        </div>

        {kit === null ? (
          /* Pre-generation: centered form */
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#E2D9CF] bg-white p-8 shadow-sm">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          /* Post-generation: two-column layout */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            {/* Left: collapsed form */}
            <div className="h-fit rounded-2xl border border-[#E2D9CF] bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B6457]">
                Regenerate
              </p>
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Right: tabbed output */}
            <div className="rounded-2xl border border-[#E2D9CF] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-[#E2D9CF] pb-4">
                <h2 className="font-serif text-lg font-normal text-[#111111]">
                  {kit.projectName}
                </h2>
                <span className="rounded-full bg-[#EDE5DA] px-3 py-0.5 text-xs font-medium text-[#8C6A4A]">
                  {kit.projectType}
                </span>
              </div>
              <PromptKitOutput kit={kit} isAuthenticated={!!userId} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
