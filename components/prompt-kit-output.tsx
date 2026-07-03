"use client";

// components/prompt-kit-output.tsx — Tabbed output — warm design system

import { useState, useEffect } from "react";
import { FileText, Map, Layers, Zap } from "lucide-react";
import type { PromptKit } from "@/features/generator/generator.types";
import { CopyButton } from "@/components/copy-button";
import { PaywallGate } from "@/components/paywall-gate";

export type TabId = "foundation" | "project-map" | "build-sequence" | "follow-ups";

interface Tab {
  readonly id: TabId;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TABS: readonly Tab[] = [
  { id: "foundation",     label: "Foundation",     icon: <FileText size={14} /> },
  { id: "project-map",   label: "Project Map",    icon: <Map size={14} /> },
  { id: "build-sequence",label: "Build Sequence", icon: <Layers size={14} /> },
  { id: "follow-ups",    label: "Follow-ups",     icon: <Zap size={14} /> },
] satisfies readonly Tab[];

const FOUNDATION_SECTION_LABELS = {
  identity:             "Identity",
  architectureRules:    "Architecture Rules",
  codeQualityStandards: "Code Quality Standards",
  securityRequirements: "Security Requirements",
  deliveryFormat:       "Delivery Format",
} satisfies Record<keyof PromptKit["foundation"], string>;

interface PromptKitOutputProps {
  readonly kit: PromptKit;
  readonly isAuthenticated: boolean;
  readonly defaultTab?: TabId;
}

const sectionClass = "rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5";
const sectionTitleClass = "mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]";
const proseClass = "whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]";
const tagClass = "inline-flex rounded-md bg-[var(--accent-light)] px-2 py-0.5 font-mono text-xs text-[var(--text-muted)]";
const depTagClass = "inline-flex rounded-md bg-[var(--accent-light)] px-2 py-0.5 text-xs text-[var(--accent)]";

function buildProjectMapText(kit: PromptKit): string {
  const header = `Overview:\n${kit.projectMap.overview}\n\nFile Structure:\n`;
  const rows = kit.projectMap.fileStructure
    .map((f) => `${f.filePath.padEnd(50)} ${f.responsibility}`)
    .join("\n");
  return header + rows;
}

function FoundationTab({ kit }: { kit: PromptKit }) {
  const keys = Object.keys(FOUNDATION_SECTION_LABELS) as (keyof PromptKit["foundation"])[];
  return (
    <div className="flex flex-col gap-4">
      {keys.map((key) => (
        <div key={key} className={sectionClass}>
          <div className="mb-3 flex items-center justify-between">
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
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{kit.projectMap.overview}</p>
        <div className="ml-4 shrink-0">
          <CopyButton text={buildProjectMapText(kit)} />
        </div>
      </div>

      <div className={sectionClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                File Path
              </th>
              <th className="pb-3 pl-6 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Responsibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2D9CF]">
            {kit.projectMap.fileStructure.map((entry) => (
              <tr key={entry.filePath}>
                <td className="py-2.5 pr-6">
                  <code className="font-mono text-xs text-[var(--accent)]">
                    {entry.filePath}
                  </code>
                </td>
                <td className="py-2.5 pl-6 text-sm text-[var(--text-muted)]">
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-xs font-bold text-[var(--accent)]">
                {step.order}
              </span>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{step.featureName}</h3>
            </div>
            <CopyButton text={step.prompt} />
          </div>

          <p className={`${proseClass} mb-4`}>{step.prompt}</p>

          {step.filesToCreate.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs text-[var(--text-muted)]">Files to create</p>
              <div className="flex flex-wrap gap-1.5">
                {step.filesToCreate.map((f) => (
                  <span key={f} className={tagClass}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {step.dependencies.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-[var(--text-muted)]">Depends on</p>
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

function FollowUpsTab({ kit, isAuthenticated }: { kit: PromptKit; isAuthenticated: boolean }) {
  const placeholderContent = (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={sectionClass}>
          <div className="h-4 w-32 rounded bg-[var(--accent-light)]" />
          <div className="mt-3 h-16 w-full rounded bg-[var(--bg)]" />
        </div>
      ))}
    </div>
  );

  return (
    <PaywallGate isLocked={!isAuthenticated}>
      {kit.followUpChain === null ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
          <Zap size={22} className="text-[#E2D9CF]" />
          <p className="text-sm text-[var(--text-muted)]">Follow-up chain not generated yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {kit.followUpChain.prompts.map((followUp) => (
            <div key={followUp.order} className={sectionClass}>
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-[var(--text-muted)]">Step {followUp.order}</span>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{followUp.title}</h3>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{followUp.purpose}</p>
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

export function PromptKitOutput({ kit, isAuthenticated, defaultTab }: PromptKitOutputProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab ?? "foundation");

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] bg-[var(--bg-card)]">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                  : "border-b-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
        {activeTab === "foundation"     && <FoundationTab kit={kit} />}
        {activeTab === "project-map"    && <ProjectMapTab kit={kit} />}
        {activeTab === "build-sequence" && <BuildSequenceTab kit={kit} />}
        {activeTab === "follow-ups"     && <FollowUpsTab kit={kit} isAuthenticated={isAuthenticated} />}
      </div>
    </div>
  );
}
