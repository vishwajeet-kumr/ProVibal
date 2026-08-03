"use client";

// components/prompt-kit-output.tsx — Tabbed output with consolidated export dropdown — warm design system

import { useState, useEffect, useRef } from "react";
import { FileText, Map, Layers, Zap, FileCode, Download, ChevronDown, Clipboard, Check as CheckIcon, Lock } from "lucide-react";
import type { PromptKit, IdeRulesBundle } from "@/features/generator/generator.types";
import type { SmartProtocolPrompt, ProtocolDifficulty } from "@/features/generator/generator.types";
import { CopyButton } from "@/components/copy-button";
import { PaywallGate } from "@/components/paywall-gate";
import { IdeRulesExport } from "@/components/ide-rules-export";
import { exportFullKit, exportAllFormats, exportSection, kitToCursorText } from "@/lib/export-kit";
import type { SectionId } from "@/lib/export-kit";
import { toast } from "sonner";

export type TabId = "foundation" | "project-map" | "build-sequence" | "follow-ups" | "ide-rules";

interface Tab {
  readonly id: TabId;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TABS: readonly Tab[] = [
  { id: "foundation",      label: "Foundation",          icon: <FileText size={14} /> },
  { id: "project-map",     label: "Project Map",         icon: <Map size={14} /> },
  { id: "build-sequence",  label: "Build Sequence",      icon: <Layers size={14} /> },
  { id: "follow-ups",      label: "Protocol",            icon: <Zap size={14} /> },
  { id: "ide-rules",       label: "Export to IDE Rules",  icon: <FileCode size={14} /> },
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
  readonly isPro: boolean;
  readonly defaultTab?: TabId;
  // IDE Rules props (passed through to the IDE Rules tab)
  readonly ideRulesBundle?: IdeRulesBundle | null;
  readonly ideRulesLoading?: boolean;
  readonly onGenerateIdeRules?: () => void;
  readonly projectName?: string;
}

const sectionClass = "rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5";
const sectionTitleClass = "mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]";
const proseClass = "whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]";
const tagClass = "inline-flex rounded-md bg-[var(--accent-light)] px-2 py-0.5 font-mono text-xs text-[var(--text-muted)]";
const depTagClass = "inline-flex rounded-md bg-[var(--accent-light)] px-2 py-0.5 text-xs text-[var(--accent)]";

const DIFFICULTY_STYLES: Record<ProtocolDifficulty, { bg: string; text: string; label: string }> = {
  easy:   { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", label: "Easy" },
  medium: { bg: "bg-amber-100 dark:bg-amber-950",   text: "text-amber-700 dark:text-amber-300",   label: "Medium" },
  hard:   { bg: "bg-red-100 dark:bg-red-950",       text: "text-red-700 dark:text-red-300",       label: "Hard" },
};

function DifficultyBadge({ difficulty }: { difficulty: ProtocolDifficulty }) {
  const style = DIFFICULTY_STYLES[difficulty];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

// ─── Consolidated Export Dropdown ─────────────────────────────────────

function ExportDropdown({ kit, isPro, activeTab }: { kit: PromptKit; isPro: boolean; activeTab: TabId }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleCopyFullKit() {
    if (!isPro) {
      toast.error("Upgrade to Pro to copy full kit", { description: "Export features are available on the Pro plan." });
      setOpen(false);
      return;
    }
    try {
      const text = kitToCursorText(kit);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Full kit copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy kit");
    }
    setOpen(false);
  }

  function handleSectionExport(format: "md" | "xml") {
    if (!isPro) {
      toast.error("Upgrade to Pro to export sections", { description: "Export features are available on the Pro plan." });
      setOpen(false);
      return;
    }
    if (activeTab !== "ide-rules") {
      exportSection(kit, activeTab as SectionId, format);
    }
    setOpen(false);
  }

  function handleFullExport(format: "md" | "xml" | "pdf") {
    if (!isPro) {
      toast.error("Upgrade to Pro to export kits", { description: "Export features are available on the Pro plan." });
      setOpen(false);
      return;
    }
    exportFullKit(kit, format);
    setOpen(false);
  }

  function handleExportAll() {
    if (!isPro) {
      toast.error("Upgrade to Pro to export kits", { description: "Export features are available on the Pro plan." });
      setOpen(false);
      return;
    }
    exportAllFormats(kit);
    setOpen(false);
  }

  const sectionName = TABS.find(t => t.id === activeTab)?.label ?? "Section";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)]"
      >
        {isPro ? <Download size={14} /> : <Lock size={14} />}
        Export
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-1 shadow-lg">
          {/* Copy full kit */}
          <button
            onClick={handleCopyFullKit}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
          >
            {copied ? <CheckIcon size={14} /> : <Clipboard size={14} />}
            {copied ? "Copied!" : "Copy Full Kit"}
          </button>

          <div className="my-1 border-t border-[var(--border)]" />

          {/* Section export — only when on a content tab (not ide-rules) */}
          {activeTab !== "ide-rules" && (
            <>
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Export {sectionName}
              </p>
              <button
                onClick={() => handleSectionExport("md")}
                className="block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
              >
                Export as .md
              </button>
              <button
                onClick={() => handleSectionExport("xml")}
                className="block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
              >
                Export as .xml
              </button>
              <div className="my-1 border-t border-[var(--border)]" />
            </>
          )}

          {/* Full kit export */}
          <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Export Full Kit
          </p>
          <button
            onClick={() => handleFullExport("md")}
            className="block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
          >
            Download as .md
          </button>
          <button
            onClick={() => handleFullExport("xml")}
            className="block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
          >
            Download as .xml
          </button>
          <button
            onClick={() => handleFullExport("pdf")}
            className="block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
          >
            Save as PDF
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={handleExportAll}
            className="block w-full px-4 py-2 text-left text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent-light)]"
          >
            Download All Formats
          </button>
          {!isPro && (
            <>
              <div className="my-1 border-t border-[var(--border)]" />
              <a
                href="/pricing"
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent-light)]"
              >
                ✨ Upgrade to Pro
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab content components ──────────────────────────────────────────

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
  const mapText = `Overview:\n${kit.projectMap.overview}\n\nFile Structure:\n` +
    kit.projectMap.fileStructure.map((f) => `${f.filePath.padEnd(50)} ${f.responsibility}`).join("\n");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{kit.projectMap.overview}</p>
        <div className="ml-4 shrink-0">
          <CopyButton text={mapText} />
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

  const isSmartProtocol =
    kit.followUpChain !== null &&
    kit.followUpChain.prompts.length > 0 &&
    "difficulty" in kit.followUpChain.prompts[0];

  return (
    <PaywallGate isLocked={!isAuthenticated}>
      {kit.followUpChain === null ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
          <Zap size={22} className="text-[#E2D9CF]" />
          <p className="text-sm text-[var(--text-muted)]">Provibal Protocol not generated yet.</p>
        </div>
      ) : isSmartProtocol ? (
        <div className="flex flex-col gap-4">
          {(kit.followUpChain.prompts as readonly SmartProtocolPrompt[]).map((item) => (
            <div key={item.order} className={sectionClass}>
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-xs font-bold text-[var(--accent)]">
                      {item.order}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.purpose}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <DifficultyBadge difficulty={item.difficulty} />
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                      ⏱ {item.timeEstimate}
                    </span>
                  </div>
                </div>
                <CopyButton text={item.prompt} />
              </div>
              <p className={proseClass}>{item.prompt}</p>
            </div>
          ))}
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

// ─── Main component ──────────────────────────────────────────────────

export function PromptKitOutput({
  kit,
  isAuthenticated,
  isPro,
  defaultTab,
  ideRulesBundle,
  ideRulesLoading,
  onGenerateIdeRules,
  projectName,
}: PromptKitOutputProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab ?? "foundation");

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="flex flex-col">
      {/* Tab bar + consolidated export dropdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] bg-[var(--bg-card)] pb-0">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-150 ${
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

        {/* Single consolidated Export dropdown */}
        <div className="flex items-center gap-2 px-4 pb-3 sm:pb-0">
          <ExportDropdown kit={kit} isPro={isPro} activeTab={activeTab} />
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-5">
        {activeTab === "foundation"     && <FoundationTab kit={kit} />}
        {activeTab === "project-map"    && <ProjectMapTab kit={kit} />}
        {activeTab === "build-sequence" && <BuildSequenceTab kit={kit} />}
        {activeTab === "follow-ups"     && <FollowUpsTab kit={kit} isAuthenticated={isAuthenticated} />}
        {activeTab === "ide-rules"      && (
          <IdeRulesExport
            bundle={ideRulesBundle ?? null}
            isLoading={ideRulesLoading ?? false}
            isPro={isPro}
            projectName={projectName ?? kit.projectName}
            onGenerate={onGenerateIdeRules ?? (() => {})}
          />
        )}
      </div>
    </div>
  );
}
