"use client";

// components/generator-form.tsx — React Hook Form + Zod resolver — warm design system

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { projectInputSchema } from "@/features/generator/generator.schema";
import {
  PROJECT_TYPES,
  TECH_STACK_OPTIONS,
} from "@/features/generator/generator.types";
import type { ProjectInput } from "@/features/generator/generator.types";

interface GeneratorFormProps {
  readonly onSubmit: (data: ProjectInput) => Promise<void>;
  readonly isLoading: boolean;
}

const PROJECT_TYPE_LABELS: Record<(typeof PROJECT_TYPES)[number], string> = {
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "api-backend": "API Backend",
  "chrome-extension": "Chrome Extension",
  "cli-tool": "CLI Tool",
} satisfies Record<(typeof PROJECT_TYPES)[number], string>;

const TECH_STACK_LABELS: Record<(typeof TECH_STACK_OPTIONS)[number], string> = {
  default: "Auto-select (recommended)",
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
} satisfies Record<(typeof TECH_STACK_OPTIONS)[number], string>;

const fieldClass =
  "w-full rounded-lg border border-[#E2D9CF] bg-white px-4 py-2.5 text-sm text-[#111111] placeholder-[#6B6457]/50 outline-none transition focus:border-[#8C6A4A] focus:ring-1 focus:ring-[#8C6A4A]/30";
const labelClass = "mb-1.5 block text-sm font-medium text-[#111111]";
const errorClass = "mt-1.5 text-xs text-red-600";

export function GeneratorForm({ onSubmit, isLoading }: GeneratorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: { techStack: "default" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className={labelClass}>
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          placeholder="e.g. TaskFlow, RecipeHub, ShipFast"
          autoComplete="off"
          className={fieldClass}
          {...register("projectName")}
        />
        {errors.projectName && (
          <p className={errorClass} role="alert">{errors.projectName.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Project Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe what your app does, who it's for, and the key features you want. The more detail, the better the generated prompts."
          className={`${fieldClass} resize-y`}
          {...register("description")}
        />
        {errors.description && (
          <p className={errorClass} role="alert">{errors.description.message}</p>
        )}
      </div>

      {/* Project Type + Tech Stack */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className={labelClass}>
            Project Type
          </label>
          <select id="projectType" className={fieldClass} {...register("projectType")}>
            <option value="" disabled>Select type…</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>{PROJECT_TYPE_LABELS[type]}</option>
            ))}
          </select>
          {errors.projectType && (
            <p className={errorClass} role="alert">{errors.projectType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="techStack" className={labelClass}>
            Tech Stack
          </label>
          <select id="techStack" className={fieldClass} {...register("techStack")}>
            {TECH_STACK_OPTIONS.map((stack) => (
              <option key={stack} value={stack}>{TECH_STACK_LABELS[stack]}</option>
            ))}
          </select>
          {errors.techStack && (
            <p className={errorClass} role="alert">{errors.techStack.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8C6A4A] py-3 text-sm font-semibold text-white shadow-sm shadow-[#8C6A4A]/20 transition-all duration-150 hover:bg-[#7A5A3C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating…
          </>
        ) : (
          "Generate Prompt Kit"
        )}
      </button>
    </form>
  );
}
