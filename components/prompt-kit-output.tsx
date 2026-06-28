"use client";

// components/prompt-kit-output.tsx — Tabbed output — warm design system

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
}

const sectionClass = "rounded-xl border border-[#E2D9CF] bg-white p-5";
const sectionTitleClass = "mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8C6A4A]";
const proseClass = "whitespace-pre-wrap text-sm leading-relaxed text-[#111111]";
const tagClass = "inline-flex rounded-md bg-[#EDE5DA] px-2 py-0.5 font-mono text-xs text-[#6B6457]";
const depTagClass = "inline-flex rounded-md bg-[#EDE5DA] px-2 py-0.5 text-xs text-[#8C6A4A]";

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
        <p className="text-sm leading-relaxed text-[#6B6457]">{kit.projectMap.overview}</p>
        <div className="ml-4 shrink-0">
          <CopyButton text={buildProjectMapText(kit)} />
        </div>
      </div>

      <div className={sectionClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2D9CF]">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6B6457]">
                File Path
              </th>
              <th className="pb-3 pl-6 text-left text-xs font-semibold uppercase tracking-wider text-[#6B6457]">
                Responsibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2D9CF]">
            {kit.projectMap.fileStructure.map((entry) => (
              <tr key={entry.filePath}>
                <td className="py-2.5 pr-6">
                  <code className="font-mono text-xs text-[#8C6A4A]">
                    {entry.filePath}
                  </code>
                </td>
                <td className="py-2.5 pl-6 text-sm text-[#6B6457]">
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDE5DA] text-xs font-bold text-[#8C6A4A]">
                {step.order}
              </span>
              <h3 className="text-sm font-semibold text-[#111111]">{step.featureName}</h3>
            </div>
            <CopyButton text={step.prompt} />
          </div>

          <p className={`${proseClass} mb-4`}>{step.prompt}</p>

          {step.filesToCreate.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs text-[#6B6457]">Files to create</p>
              <div className="flex flex-wrap gap-1.5">
                {step.filesToCreate.map((f) => (
                  <span key={f} className={tagClass}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {step.dependencies.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-[#6B6457]">Depends on</p>
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
          <div className="h-4 w-32 rounded bg-[#EDE5DA]" />
          <div className="mt-3 h-16 w-full rounded bg-[#F7F4F0]" />
        </div>
      ))}
    </div>
  );

  return (
    <PaywallGate isLocked={!isAuthenticated}>
      {kit.followUpChain === null ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#E2D9CF] py-16 text-center">
          <Zap size={22} className="text-[#E2D9CF]" />
          <p className="text-sm text-[#6B6457]">Follow-up chain not generated yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {kit.followUpChain.prompts.map((followUp) => (
            <div key={followUp.order} className={sectionClass}>
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-[#6B6457]">Step {followUp.order}</span>
                  <h3 className="text-sm font-semibold text-[#111111]">{followUp.title}</h3>
                  <p className="mt-0.5 text-xs text-[#6B6457]">{followUp.purpose}</p>
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
      <div className="flex border-b border-[#E2D9CF] bg-white">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "border-b-2 border-[#8C6A4A] text-[#8C6A4A]"
                  : "border-b-2 border-transparent text-[#6B6457] hover:text-[#111111]"
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
