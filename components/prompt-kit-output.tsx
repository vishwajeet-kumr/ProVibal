"use client";

// components/prompt-kit-output.tsx — Tabbed output: Foundation / Project Map / Build Sequence / Follow-ups

import { useState } from "react";
import { FileText, Map, Layers, Zap } from "lucide-react";
import type { PromptKit } from "@/features/generator/generator.types";
import { CopyButton } from "@/components/copy-button";
import { PaywallGate } from "@/components/paywall-gate";

type TabId = "foundation" | "project-map" | "build-sequence" | "follow-ups";

interface Tab {
  readonly id: TabId;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TABS: readonly Tab[] = [
  { id: "foundation", label: "Foundation", icon: <FileText size={14} /> },
  { id: "project-map", label: "Project Map", icon: <Map size={14} /> },
  { id: "build-sequence", label: "Build Sequence", icon: <Layers size={14} /> },
  { id: "follow-ups", label: "Follow-ups", icon: <Zap size={14} /> },
] satisfies readonly Tab[];

const FOUNDATION_SECTION_LABELS: Record<
  keyof Omit<PromptKit["foundation"], never>,
  string
> = {
  identity: "Identity",
  architectureRules: "Architecture Rules",
  codeQualityStandards: "Code Quality Standards",
  securityRequirements: "Security Requirements",
  deliveryFormat: "Delivery Format",
} satisfies Record<keyof PromptKit["foundation"], string>;

interface PromptKitOutputProps {
  readonly kit: PromptKit;
  readonly isAuthenticated: boolean;
}

const sectionClass =
  "rounded-xl border border-white/10 bg-slate-800/60 p-5";
const sectionTitleClass =
  "mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400";
const proseClass =
  "whitespace-pre-wrap text-sm leading-relaxed text-slate-300";
const tagClass =
  "inline-flex rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300";
const depTagClass =
  "inline-flex rounded-md bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300";

function buildProjectMapText(kit: PromptKit): string {
  const header = `Overview:\n${kit.projectMap.overview}\n\nFile Structure:\n`;
  const rows = kit.projectMap.fileStructure
    .map((f) => `${f.filePath.padEnd(50)} ${f.responsibility}`)
    .join("\n");
  return header + rows;
}

function FoundationTab({ kit }: { kit: PromptKit }) {
  const keys = Object.keys(
    FOUNDATION_SECTION_LABELS
  ) as (keyof PromptKit["foundation"])[];

  return (
    <div className="flex flex-col gap-4">
      {keys.map((key) => (
        <div key={key} className={sectionClass}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className={sectionTitleClass}>{FOUNDATION_SECTION_LABELS[key]}</h3>
            <CopyButton text={kit.foundation[key]} />
          </div>
          <p className={proseClass}>{kit.foundation[key]}</p>
        </div>
      ))}
    </div>
  );
}

function ProjectMapTab({ kit }: { kit: PromptKit }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{kit.projectMap.overview}</p>
        <div className="ml-4 shrink-0">
          <CopyButton text={buildProjectMapText(kit)} />
        </div>
      </div>

      <div className={sectionClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                File Path
              </th>
              <th className="pb-3 pl-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Responsibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {kit.projectMap.fileStructure.map((entry) => (
              <tr key={entry.filePath} className="group">
                <td className="py-2.5 pr-6">
                  <code className="font-mono text-xs text-violet-300">
                    {entry.filePath}
                  </code>
                </td>
                <td className="py-2.5 pl-6 text-slate-400">
                  {entry.responsibility}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BuildSequenceTab({ kit }: { kit: PromptKit }) {
  return (
    <div className="flex flex-col gap-4">
      {kit.featureSequence.steps.map((step) => (
        <div key={step.order} className={sectionClass}>
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
                {step.order}
              </span>
              <h3 className="text-sm font-semibold text-white">{step.featureName}</h3>
            </div>
            <CopyButton text={step.prompt} />
          </div>

          <p className={`${proseClass} mb-4`}>{step.prompt}</p>

          {step.filesToCreate.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs text-slate-500">Files to create</p>
              <div className="flex flex-wrap gap-1.5">
                {step.filesToCreate.map((f) => (
                  <span key={f} className={tagClass}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {step.dependencies.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-slate-500">Depends on</p>
              <div className="flex flex-wrap gap-1.5">
                {step.dependencies.map((d) => (
                  <span key={d} className={depTagClass}>{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FollowUpsTab({
  kit,
  isAuthenticated,
}: {
  kit: PromptKit;
  isAuthenticated: boolean;
}) {
  const placeholderContent = (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={sectionClass}>
          <div className="h-4 w-32 rounded bg-slate-700/60" />
          <div className="mt-3 h-16 w-full rounded bg-slate-700/40" />
        </div>
      ))}
    </div>
  );

  return (
    <PaywallGate isLocked={!isAuthenticated}>
      {kit.followUpChain === null ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 py-16 text-center">
          <Zap size={24} className="text-slate-600" />
          <p className="text-sm text-slate-500">Follow-up chain not generated yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {kit.followUpChain.prompts.map((followUp) => (
            <div key={followUp.order} className={sectionClass}>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500">
                    Step {followUp.order}
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    {followUp.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">{followUp.purpose}</p>
                </div>
                <CopyButton text={followUp.prompt} />
              </div>
              <p className={proseClass}>{followUp.prompt}</p>
            </div>
          ))}
        </div>
      )}
      {!isAuthenticated && placeholderContent}
    </PaywallGate>
  );
}

export function PromptKitOutput({ kit, isAuthenticated }: PromptKitOutputProps) {
  const [activeTab, setActiveTab] = useState<TabId>("foundation");

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-white/10">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "border-b-2 border-violet-500 text-violet-400"
                  : "border-b-2 border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-5">
        {activeTab === "foundation" && <FoundationTab kit={kit} />}
        {activeTab === "project-map" && <ProjectMapTab kit={kit} />}
        {activeTab === "build-sequence" && <BuildSequenceTab kit={kit} />}
        {activeTab === "follow-ups" && (
          <FollowUpsTab kit={kit} isAuthenticated={isAuthenticated} />
        )}
      </div>
    </div>
  );
}
