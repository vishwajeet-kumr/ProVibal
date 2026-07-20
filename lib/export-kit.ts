// lib/export-kit.ts — Export prompt kits in MD, XML, and PDF formats

import type { PromptKit } from "@/features/generator/generator.types";

type SectionId = "foundation" | "project-map" | "build-sequence" | "follow-ups";

// ─── Markdown builders ───────────────────────────────────────────────

function foundationToMd(kit: PromptKit): string {
  const f = kit.foundation;
  return [
    "## Foundation Prompt\n",
    `### Identity\n${f.identity}\n`,
    `### Architecture Rules\n${f.architectureRules}\n`,
    `### Code Quality Standards\n${f.codeQualityStandards}\n`,
    `### Security Requirements\n${f.securityRequirements}\n`,
    `### Delivery Format\n${f.deliveryFormat}\n`,
  ].join("\n");
}

function projectMapToMd(kit: PromptKit): string {
  const p = kit.projectMap;
  const rows = p.fileStructure
    .map((f) => `| \`${f.filePath}\` | ${f.responsibility} |`)
    .join("\n");
  return [
    "## Project Map\n",
    `${p.overview}\n`,
    "| File Path | Responsibility |",
    "| --- | --- |",
    rows,
    "",
  ].join("\n");
}

function buildSequenceToMd(kit: PromptKit): string {
  const steps = kit.featureSequence.steps.map((s) => {
    let md = `### Step ${s.order}: ${s.featureName}\n\n${s.prompt}\n`;
    if (s.filesToCreate.length > 0) {
      md += `\n**Files:** ${s.filesToCreate.map((f) => `\`${f}\``).join(", ")}\n`;
    }
    if (s.dependencies.length > 0) {
      md += `**Depends on:** ${s.dependencies.map((d) => `\`${d}\``).join(", ")}\n`;
    }
    return md;
  });
  return `## Build Sequence\n\n${steps.join("\n")}`;
}

function followUpsToMd(kit: PromptKit): string {
  if (!kit.followUpChain || kit.followUpChain.prompts.length === 0) {
    return "## Follow-up Prompts\n\n*Not generated yet.*\n";
  }
  const items = kit.followUpChain.prompts.map(
    (p) => `### ${p.order}. ${p.title}\n**Purpose:** ${p.purpose}\n\n${p.prompt}\n`
  );
  return `## Follow-up Prompts\n\n${items.join("\n")}`;
}

function fullKitToMd(kit: PromptKit): string {
  return [
    `# ${kit.projectName} — Prompt Kit`,
    `\n> **Type:** ${kit.projectType} · **Stack:** ${kit.techStack === "default" ? "Auto-selected" : kit.techStack}\n`,
    "---\n",
    foundationToMd(kit),
    "---\n",
    projectMapToMd(kit),
    "---\n",
    buildSequenceToMd(kit),
    "---\n",
    followUpsToMd(kit),
  ].join("\n");
}

// ─── XML builders ────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function foundationToXml(kit: PromptKit): string {
  const f = kit.foundation;
  return [
    "<foundation>",
    `  <identity>${escapeXml(f.identity)}</identity>`,
    `  <architectureRules>${escapeXml(f.architectureRules)}</architectureRules>`,
    `  <codeQualityStandards>${escapeXml(f.codeQualityStandards)}</codeQualityStandards>`,
    `  <securityRequirements>${escapeXml(f.securityRequirements)}</securityRequirements>`,
    `  <deliveryFormat>${escapeXml(f.deliveryFormat)}</deliveryFormat>`,
    "</foundation>",
  ].join("\n");
}

function projectMapToXml(kit: PromptKit): string {
  const entries = kit.projectMap.fileStructure
    .map(
      (f) =>
        `    <file path="${escapeXml(f.filePath)}" responsibility="${escapeXml(f.responsibility)}" />`
    )
    .join("\n");
  return [
    "<projectMap>",
    `  <overview>${escapeXml(kit.projectMap.overview)}</overview>`,
    "  <fileStructure>",
    entries,
    "  </fileStructure>",
    "</projectMap>",
  ].join("\n");
}

function buildSequenceToXml(kit: PromptKit): string {
  const steps = kit.featureSequence.steps.map((s) => {
    const files = s.filesToCreate.map((f) => `      <file>${escapeXml(f)}</file>`).join("\n");
    const deps = s.dependencies.map((d) => `      <dependency>${escapeXml(d)}</dependency>`).join("\n");
    return [
      `    <step order="${s.order}">`,
      `      <featureName>${escapeXml(s.featureName)}</featureName>`,
      `      <prompt>${escapeXml(s.prompt)}</prompt>`,
      files ? `      <filesToCreate>\n${files}\n      </filesToCreate>` : "",
      deps ? `      <dependencies>\n${deps}\n      </dependencies>` : "",
      "    </step>",
    ].filter(Boolean).join("\n");
  });
  return `<buildSequence>\n${steps.join("\n")}\n</buildSequence>`;
}

function followUpsToXml(kit: PromptKit): string {
  if (!kit.followUpChain || kit.followUpChain.prompts.length === 0) {
    return "<followUps />";
  }
  const items = kit.followUpChain.prompts.map(
    (p) => [
      `    <followUp order="${p.order}">`,
      `      <title>${escapeXml(p.title)}</title>`,
      `      <purpose>${escapeXml(p.purpose)}</purpose>`,
      `      <prompt>${escapeXml(p.prompt)}</prompt>`,
      "    </followUp>",
    ].join("\n")
  );
  return `<followUps>\n${items.join("\n")}\n</followUps>`;
}

function fullKitToXml(kit: PromptKit): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<promptKit projectName="${escapeXml(kit.projectName)}" projectType="${escapeXml(kit.projectType)}" techStack="${escapeXml(kit.techStack)}">`,
    foundationToXml(kit),
    projectMapToXml(kit),
    buildSequenceToXml(kit),
    followUpsToXml(kit),
    "</promptKit>",
  ].join("\n");
}

// ─── PDF builder (HTML → print) ──────────────────────────────────────

function markdownToPdfHtml(md: string, projectName: string): string {
  // Convert MD to simple styled HTML for print
  let html = md
    .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;margin:24px 0 8px;font-family:Georgia,serif;">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:20px;margin:20px 0 8px;color:#8B6F47;font-family:Georgia,serif;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;margin:16px 0 6px;color:#5C4A32;">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code style="background:#F5F0EB;padding:1px 4px;border-radius:3px;font-size:12px;">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #8B6F47;padding-left:12px;color:#6B5B4A;margin:8px 0;">$1</blockquote>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #E2D9CF;margin:16px 0;" />')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td style="padding:4px 8px;border:1px solid #E2D9CF;font-size:13px;">${c}</td>`).join("")}</tr>`;
    })
    .replace(/^\| ---/gm, "")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${projectName} — Prompt Kit</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #2C2418; line-height: 1.6; font-size: 14px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  @media print { body { padding: 0; } }
</style></head><body><p>${html}</p></body></html>`;
}

// ─── Download helpers ────────────────────────────────────────────────

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPdf(htmlContent: string, filename: string): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback: download as HTML
    downloadBlob(htmlContent, filename.replace(".pdf", ".html"), "text/html");
    return;
  }
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ─── Section-level exports ───────────────────────────────────────────

const SECTION_MD_BUILDERS: Record<SectionId, (kit: PromptKit) => string> = {
  "foundation": foundationToMd,
  "project-map": projectMapToMd,
  "build-sequence": buildSequenceToMd,
  "follow-ups": followUpsToMd,
};

const SECTION_XML_BUILDERS: Record<SectionId, (kit: PromptKit) => string> = {
  "foundation": foundationToXml,
  "project-map": projectMapToXml,
  "build-sequence": buildSequenceToXml,
  "follow-ups": followUpsToXml,
};

const SECTION_LABELS: Record<SectionId, string> = {
  "foundation": "Foundation",
  "project-map": "Project Map",
  "build-sequence": "Build Sequence",
  "follow-ups": "Follow-ups",
};

export function exportSection(kit: PromptKit, section: SectionId, format: "md" | "xml"): void {
  const slug = slugify(kit.projectName);
  const label = SECTION_LABELS[section].toLowerCase().replace(/\s+/g, "-");

  if (format === "md") {
    const content = SECTION_MD_BUILDERS[section](kit);
    downloadBlob(content, `${slug}-${label}.md`, "text/markdown");
  } else {
    const xmlBody = SECTION_XML_BUILDERS[section](kit);
    const content = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlBody}`;
    downloadBlob(content, `${slug}-${label}.xml`, "application/xml");
  }
}

// ─── Full kit exports ────────────────────────────────────────────────

export function exportFullKit(kit: PromptKit, format: "md" | "xml" | "pdf"): void {
  const slug = slugify(kit.projectName);

  switch (format) {
    case "md": {
      const md = fullKitToMd(kit);
      downloadBlob(md, `${slug}-prompt-kit.md`, "text/markdown");
      break;
    }
    case "xml": {
      const xml = fullKitToXml(kit);
      downloadBlob(xml, `${slug}-prompt-kit.xml`, "application/xml");
      break;
    }
    case "pdf": {
      const md = fullKitToMd(kit);
      const html = markdownToPdfHtml(md, kit.projectName);
      downloadPdf(html, `${slug}-prompt-kit.pdf`);
      break;
    }
  }
}

export function exportAllFormats(kit: PromptKit): void {
  const slug = slugify(kit.projectName);
  // Download MD
  downloadBlob(fullKitToMd(kit), `${slug}-prompt-kit.md`, "text/markdown");
  // Download XML (small delay so browser doesn't block multiple downloads)
  setTimeout(() => {
    downloadBlob(fullKitToXml(kit), `${slug}-prompt-kit.xml`, "application/xml");
  }, 300);
  // Open PDF print dialog
  setTimeout(() => {
    const md = fullKitToMd(kit);
    const html = markdownToPdfHtml(md, kit.projectName);
    downloadPdf(html, `${slug}-prompt-kit.pdf`);
  }, 600);
}

export type { SectionId };
