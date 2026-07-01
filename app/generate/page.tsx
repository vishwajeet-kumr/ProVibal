"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratorForm } from "@/components/generator-form";
import { PromptKitOutput } from "@/components/prompt-kit-output";
import { GenerationLoader } from "@/components/generation-loader";
import { ExportButton } from "@/components/export-button";
import type { PromptKit, ProjectInput } from "@/features/generator/generator.types";

interface ApiGenerateResponse {
  status: "success" | "error";
  data?: PromptKit;
  error?: string;
}

const CACHE_KEY = "promptra_cached_kit";

function PageHeading() {
  return (
    <div className="mb-10 text-center">
      <h1 className="font-serif text-4xl font-normal tracking-tight text-[#111111] dark:text-white sm:text-5xl">
        Generate Your <span className="italic text-[#8C6A4A]">Prompt Kit</span>
      </h1>
      <p className="mt-3 text-base text-[#6B6457] dark:text-[#CCC]">
        Describe your project and get a complete vibe coding prompt kit instantly.
      </p>
    </div>
  );
}

interface PostGenerationProps {
  readonly kit: PromptKit;
  readonly userId: string | null | undefined;
  readonly isLoading: boolean;
  readonly onClear: () => void;
  readonly onSubmit: (data: ProjectInput) => Promise<void>;
}

function PostGenerationView({ kit, userId, isLoading, onClear, onSubmit }: PostGenerationProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <motion.div layoutId="generator-card" className="h-fit rounded-2xl border border-[#E2D9CF] bg-white p-6 shadow-sm dark:border-[#333] dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6457] dark:text-[#CCC]">
            Regenerate
          </p>
          <button
            onClick={onClear}
            className="text-xs font-medium text-[#8C6A4A] transition-colors hover:text-[#111111] hover:underline dark:hover:text-white"
          >
            Clear
          </button>
        </div>
        <GeneratorForm onSubmit={onSubmit} isLoading={isLoading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-[#E2D9CF] bg-white p-6 shadow-sm dark:border-[#333] dark:bg-black"
      >
        <div className="mb-5 flex items-center justify-between border-b border-[#E2D9CF] pb-4 dark:border-[#333]">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-normal text-[#111111] dark:text-white">
              {kit.projectName}
            </h2>
            <span className="rounded-full bg-[#EDE5DA] px-3 py-0.5 text-xs font-medium text-[#8C6A4A] dark:bg-[#333] dark:text-[#A38563]">
              {kit.projectType}
            </span>
          </div>
          <ExportButton kit={kit} projectName={kit.projectName} />
        </div>
        <PromptKitOutput kit={kit} isAuthenticated={!!userId} />
      </motion.div>
    </div>
  );
}

export default function GeneratePage() {
  const { userId } = useAuth();
  const [kit, setKit] = useState<PromptKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setKit(JSON.parse(cached));
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, []);

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
        localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
      } else {
        toast.error(json.error ?? "Generation failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    setKit(null);
  }

  return (
    <main className="min-h-screen bg-[#F7F4F0] dark:bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeading />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" layoutId="generator-card" className="mx-auto w-full max-w-md">
              <GenerationLoader />
            </motion.div>
          ) : kit === null ? (
            <motion.div key="form" layoutId="generator-card" className="mx-auto max-w-2xl rounded-2xl border border-[#E2D9CF] bg-white p-8 shadow-sm dark:border-[#333] dark:bg-black">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div key="results" layout>
              <PostGenerationView
                kit={kit}
                userId={userId}
                isLoading={isLoading}
                onClear={handleClearCache}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
