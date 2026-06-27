// lib/gemini.ts — Gemini Flash client: typed generateContent wrapper

import { GoogleGenAI } from "@google/genai";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";

const GEMINI_MODEL = "gemini-2.5-flash" as const;

const MAX_OUTPUT_TOKENS = 8192;
const DEFAULT_TEMPERATURE = 0.7;

interface GeminiRequest {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly temperature?: number;
  readonly maxOutputTokens?: number;
}

interface GeminiResponse {
  readonly text: string;
}

function getClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export async function generateContent(
  request: GeminiRequest
): Promise<GeminiResponse> {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: request.userPrompt,
      config: {
        systemInstruction: request.systemPrompt,
        responseMimeType: "application/json",
        temperature: request.temperature ?? DEFAULT_TEMPERATURE,
        maxOutputTokens: request.maxOutputTokens ?? MAX_OUTPUT_TOKENS,
      },
    });

    const text = response.text ?? "";

    if (!text.trim()) {
      throw AppError.generationFailed(
        "Gemini returned empty response",
        { model: GEMINI_MODEL, promptLength: request.userPrompt.length }
      );
    }

    return { text };
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown Gemini API error";
    throw AppError.generationFailed(
      `Gemini API call failed: ${message}`,
      { model: GEMINI_MODEL, promptLength: request.userPrompt.length }
    );
  }
}
