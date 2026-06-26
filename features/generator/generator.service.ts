// features/generator/generator.service.ts — Calls Gemini Flash, parses response, returns typed PromptKit

import { generateContent } from "@/lib/gemini";
import { AppError } from "@/lib/errors";
import { FOUNDATION_SYSTEM_PROMPT } from "@/features/meta-prompt/foundation";
import { FOLLOWUP_SYSTEM_PROMPT } from "@/features/meta-prompt/followup";
import type {
  ProjectInput,
  PromptKit,
  FollowUpChain,
} from "@/features/generator/generator.types";

const FOUNDATION_TEMPERATURE = 0.4;
const FOLLOWUP_TEMPERATURE = 0.6;

function buildFoundationUserMessage(input: ProjectInput): string {
  return [
    `Project Name: ${input.projectName}`,
    `Project Type: ${input.projectType}`,
    `Tech Stack: ${input.techStack}`,
    `Description: ${input.description}`,
  ].join("\n");
}

function buildFollowUpUserMessage(input: ProjectInput, kit: PromptKit): string {
  return [
    "ORIGINAL PROJECT DESCRIPTION:",
    `Project Name: ${input.projectName}`,
    `Project Type: ${input.projectType}`,
    `Tech Stack: ${input.techStack}`,
    `Description: ${input.description}`,
    "",
    "GENERATED PROMPT KIT:",
    JSON.stringify(kit, null, 2),
  ].join("\n");
}

function parseJsonResponse(text: string, context: string): unknown {
  try {
    return JSON.parse(text);
  } catch (cause: unknown) {
    const message =
      cause instanceof Error ? cause.message : "Invalid JSON response";
    throw AppError.generationFailed(
      `Failed to parse Gemini JSON for ${context}: ${message}`,
      { context, responseLength: text.length }
    );
  }
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw AppError.generationFailed(
      `PromptKit validation failed: "${field}" must be a non-empty string`,
      { field, received: typeof value }
    );
  }
  return value;
}

function assertObject(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw AppError.generationFailed(
      `PromptKit validation failed: "${field}" must be an object`,
      { field, received: typeof value }
    );
  }
  return value as Record<string, unknown>;
}

function assertArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw AppError.generationFailed(
      `PromptKit validation failed: "${field}" must be an array`,
      { field, received: typeof value }
    );
  }
  return value;
}

function validatePromptKit(raw: unknown): PromptKit {
  const root = assertObject(raw, "root");

  const projectName = assertString(root["projectName"], "projectName");
  const projectType = assertString(root["projectType"], "projectType");

  const foundation = assertObject(root["foundation"], "foundation");
  const validatedFoundation = {
    identity: assertString(foundation["identity"], "foundation.identity"),
    architectureRules: assertString(foundation["architectureRules"], "foundation.architectureRules"),
    codeQualityStandards: assertString(foundation["codeQualityStandards"], "foundation.codeQualityStandards"),
    securityRequirements: assertString(foundation["securityRequirements"], "foundation.securityRequirements"),
    deliveryFormat: assertString(foundation["deliveryFormat"], "foundation.deliveryFormat"),
  };

  const projectMap = assertObject(root["projectMap"], "projectMap");
  const fileStructureRaw = assertArray(projectMap["fileStructure"], "projectMap.fileStructure");
  const fileStructure = fileStructureRaw.map((entry, index) => {
    const e = assertObject(entry, `projectMap.fileStructure[${index}]`);
    return {
      filePath: assertString(e["filePath"], `projectMap.fileStructure[${index}].filePath`),
      responsibility: assertString(e["responsibility"], `projectMap.fileStructure[${index}].responsibility`),
    };
  });
  const validatedProjectMap = {
    overview: assertString(projectMap["overview"], "projectMap.overview"),
    fileStructure,
  };

  const featureSequence = assertObject(root["featureSequence"], "featureSequence");
  const stepsRaw = assertArray(featureSequence["steps"], "featureSequence.steps");
  const steps = stepsRaw.map((step, index) => {
    const s = assertObject(step, `featureSequence.steps[${index}]`);
    if (typeof s["order"] !== "number") {
      throw AppError.generationFailed(
        `PromptKit validation failed: "featureSequence.steps[${index}].order" must be a number`,
        { field: `steps[${index}].order`, received: typeof s["order"] }
      );
    }
    return {
      order: s["order"] as number,
      featureName: assertString(s["featureName"], `featureSequence.steps[${index}].featureName`),
      prompt: assertString(s["prompt"], `featureSequence.steps[${index}].prompt`),
      filesToCreate: assertArray(s["filesToCreate"], `featureSequence.steps[${index}].filesToCreate`) as string[],
      dependencies: assertArray(s["dependencies"], `featureSequence.steps[${index}].dependencies`) as string[],
    };
  });
  const validatedFeatureSequence = { steps };

  return {
    projectName,
    projectType: projectType as PromptKit["projectType"],
    foundation: validatedFoundation,
    projectMap: validatedProjectMap,
    featureSequence: validatedFeatureSequence,
    followUpChain: null,
  };
}

function validateFollowUpChain(raw: unknown): FollowUpChain {
  const root = assertObject(raw, "root");
  const promptsRaw = assertArray(root["prompts"], "prompts");

  if (promptsRaw.length !== 8) {
    throw AppError.generationFailed(
      `FollowUpChain validation failed: expected exactly 8 prompts, got ${promptsRaw.length}`,
      { received: promptsRaw.length }
    );
  }

  const prompts = promptsRaw.map((item, index) => {
    const p = assertObject(item, `prompts[${index}]`);
    if (typeof p["order"] !== "number") {
      throw AppError.generationFailed(
        `FollowUpChain validation failed: "prompts[${index}].order" must be a number`,
        { field: `prompts[${index}].order`, received: typeof p["order"] }
      );
    }
    return {
      order: p["order"] as number,
      title: assertString(p["title"], `prompts[${index}].title`),
      prompt: assertString(p["prompt"], `prompts[${index}].prompt`),
      purpose: assertString(p["purpose"], `prompts[${index}].purpose`),
    };
  });

  return { prompts };
}

export async function generatePromptKit(input: ProjectInput): Promise<PromptKit> {
  const userMessage = buildFoundationUserMessage(input);

  const { text } = await generateContent({
    systemPrompt: FOUNDATION_SYSTEM_PROMPT,
    userPrompt: userMessage,
    temperature: FOUNDATION_TEMPERATURE,
  });

  const raw = parseJsonResponse(text, "PromptKit");
  return validatePromptKit(raw);
}

export async function generateFollowUpChain(
  input: ProjectInput,
  kit: PromptKit
): Promise<FollowUpChain> {
  const userMessage = buildFollowUpUserMessage(input, kit);

  const { text } = await generateContent({
    systemPrompt: FOLLOWUP_SYSTEM_PROMPT,
    userPrompt: userMessage,
    temperature: FOLLOWUP_TEMPERATURE,
  });

  const raw = parseJsonResponse(text, "FollowUpChain");
  return validateFollowUpChain(raw);
}
