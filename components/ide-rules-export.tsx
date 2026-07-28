"use client";

// components/ide-rules-export.tsx — Generate and download IDE-specific rule files

import { useState } from "react";
import { Download, Loader2, Lock, ChevronDown, ChevronUp, Archive, Check } from "lucide-react";
import type { IdeRulesBundle } from "@/features/generator/generator.types";
import { downloadIdeRule, downloadIdeRulesZip } from "@/lib/export-kit";
import { toast } from "sonner";

interface IdeRulesExportProps {
  readonly bundle: IdeRulesBundle | null;
  readonly isLoading: boolean;
  readonly isPro: boolean;
  readonly projectName: string;
  readonly onGenerate: () => void;
}

interface RuleCardProps {
  readonly ideName: string;
  readonly ideIcon: string;
  readonly fileName: string;
  readonly description: string;
  readonly content: string | null;
  readonly accentColor: string;
}

function RuleCard({ ideName, ideIcon, fileName, description, content, accentColor }: RuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${fileName} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all duration-200 hover:border-[var(--accent)]" style={{ "--card-accent": accentColor } as React.CSSProperties}>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-2xl">{ideIcon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{ideName}</h4>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <code className="mb-3 block rounded-lg bg-[var(--accent-light)] px-3 py-1.5 font-mono text-xs text-[var(--accent)]">
        {fileName}
      </code>

      {content ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => downloadIdeRule(content, fileName)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Download size={12} />
              Download
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)]"
            >
              {copied ? <Check size={12} /> : "Copy"}
            </button>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)]"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Hide Preview" : "Preview"}
          </button>

          {expanded && (
            <div className="mt-1 max-h-64 overflow-auto rounded-lg bg-[var(--bg-card)] border border-[var(--border)] p-3">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--text-muted)]">
                {content}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-[var(--accent-light)] px-3 py-2 text-center text-xs text-[var(--text-muted)]">
          Generate to see content
        </div>
      )}
    </div>
  );
}

export function IdeRulesExport({ bundle, isLoading, isPro, projectName, onGenerate }: IdeRulesExportProps) {
  const [zipDownloading, setZipDownloading] = useState(false);

  async function handleDownloadZip() {
    if (!bundle) return;
    setZipDownloading(true);
    try {
      await downloadIdeRulesZip(bundle, projectName);
      toast.success("IDE rules ZIP downloaded!");
    } catch {
      toast.error("Failed to create ZIP file");
    } finally {
      setZipDownloading(false);
    }
  }

  return (
    <div className="animate-fade-in mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-normal text-[var(--text-primary)]">
              IDE Rules Files
            </h3>
            <span className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[#B8825A] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Pro
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Generate personalized configuration files for your AI coding assistant
          </p>
        </div>

        {bundle && (
          <button
            onClick={handleDownloadZip}
            disabled={zipDownloading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-light)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            {zipDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Archive size={14} />
            )}
            Download ZIP
          </button>
        )}
      </div>

      {/* Pro gate overlay for free users */}
      {!isPro ? (
        <div className="relative">
          <div className="pointer-events-none opacity-40">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <RuleCard
                ideName="Cursor"
                ideIcon="⚡"
                fileName=".cursorrules"
                description="Configure Cursor's AI assistant"
                content={null}
                accentColor="#7C3AED"
              />
              <RuleCard
                ideName="Windsurf"
                ideIcon="🌊"
                fileName=".windsurfrules"
                description="Configure Windsurf's Cascade AI"
                content={null}
                accentColor="#0EA5E9"
              />
              <RuleCard
                ideName="Claude / Antigravity"
                ideIcon="🧠"
                fileName="AGENTS.md"
                description="Configure Claude & Antigravity"
                content={null}
                accentColor="#F59E0B"
              />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--bg-card)]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)]">
                <Lock size={20} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Pro Feature
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  Upgrade to generate personalized IDE rule files
                </p>
              </div>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      ) : !bundle ? (
        /* Generate button for Pro users */
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--border)] py-10">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-[var(--bg)] px-4 py-3">
              <span className="text-xl">⚡</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">.cursorrules</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-[var(--bg)] px-4 py-3">
              <span className="text-xl">🌊</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">.windsurfrules</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-[var(--bg)] px-4 py-3">
              <span className="text-xl">🧠</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">AGENTS.md</span>
            </div>
          </div>

          <p className="max-w-xs text-center text-sm text-[var(--text-muted)]">
            Generate rule files tailored to <strong className="text-[var(--text-primary)]">{projectName}</strong> for your favorite AI IDE
          </p>

          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating Rules...
              </>
            ) : (
              <>
                Generate IDE Rules
              </>
            )}
          </button>
        </div>
      ) : (
        /* Generated cards */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RuleCard
            ideName="Cursor"
            ideIcon="⚡"
            fileName=".cursorrules"
            description="Configure Cursor's AI assistant"
            content={bundle.cursorRules}
            accentColor="#7C3AED"
          />
          <RuleCard
            ideName="Windsurf"
            ideIcon="🌊"
            fileName=".windsurfrules"
            description="Configure Windsurf's Cascade AI"
            content={bundle.windsurfRules}
            accentColor="#0EA5E9"
          />
          <RuleCard
            ideName="Claude / Antigravity"
            ideIcon="🧠"
            fileName="AGENTS.md"
            description="Configure Claude & Antigravity"
            content={bundle.agentsMd}
            accentColor="#F59E0B"
          />
        </div>
      )}
    </div>
  );
}
