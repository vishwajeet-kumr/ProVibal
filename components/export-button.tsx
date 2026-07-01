"use client";

import { Download } from "lucide-react";
import type { PromptKit } from "@/features/generator/generator.types";

function buildFoundationMd(kit: PromptKit): string {
  const f = kit.foundation;
  return `## 1. Foundation Prompt\n\n**Identity:**\n${f.identity}\n\n**Architecture Rules:**\n${f.architectureRules}\n\n**Code Quality Standards:**\n${f.codeQualityStandards}\n\n**Security Requirements:**\n${f.securityRequirements}\n\n**Delivery Format:**\n${f.deliveryFormat}\n\n`;
}

function buildMapMd(kit: PromptKit): string {
  const p = kit.projectMap;
  let md = `## 2. Project Map\n\n${p.overview}\n\n`;
  md += p.fileStructure.map((f) => `- \`${f.filePath}\`: ${f.responsibility}`).join("\n");
  return md + "\n\n";
}

function buildStepsMd(kit: PromptKit): string {
  return kit.featureSequence.steps
    .map((s) => {
      let md = `### Step ${s.order}: ${s.featureName}\n**Prompt:**\n${s.prompt}\n\n`;
      if (s.filesToCreate.length > 0) {
        md += `**Files to create:**\n${s.filesToCreate.map((f) => `- \`${f}\``).join("\n")}\n\n`;
      }
      if (s.dependencies.length > 0) {
        md += `**Dependencies:**\n${s.dependencies.map((d) => `- \`${d}\``).join("\n")}\n\n`;
      }
      return md;
    })
    .join("");
}

function buildMarkdownString(kit: PromptKit): string {
  let md = `# ${kit.projectName} Prompt Kit\n\nProject Type: ${kit.projectType}\n\n`;
  md += buildFoundationMd(kit) + buildMapMd(kit) + `## 3. Build Sequence\n\n` + buildStepsMd(kit);
  if (kit.followUpChain && kit.followUpChain.prompts.length > 0) {
    md += `## 4. Follow-Up Prompts\n\n` + kit.followUpChain.prompts.map((p) => `### ${p.title}\n**Purpose:** ${p.purpose}\n\n**Prompt:**\n${p.prompt}\n\n`).join("");
  }
  return md;
}

interface ExportButtonProps {
  readonly kit: PromptKit;
  readonly projectName: string;
}

export function ExportButton({ kit, projectName }: ExportButtonProps) {
  function handleDownload(): void {
    const md = buildMarkdownString(kit);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-prompt-kit.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-lg border border-[#E2D9CF] bg-white px-3 py-1.5 text-sm font-medium text-[#6B6457] transition-colors hover:bg-[#EDE5DA] hover:text-[#111111]"
    >
      <Download className="h-4 w-4" />
      Export Markdown
    </button>
  );
}
