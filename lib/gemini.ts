// lib/gemini.ts — Gemini Flash client: typed generateContent wrapper

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";

const GEMINI_MODEL = "gemini-2.0-flash-001" as const;

const MAX_OUTPUT_TOKENS = 65536;
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

function getClient(): GoogleGenerativeAI {
  return new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

export async function generateContent(
  request: GeminiRequest
): Promise<GeminiResponse> {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: request.systemPrompt,
    generationConfig: {
      temperature: request.temperature ?? DEFAULT_TEMPERATURE,
      maxOutputTokens: request.maxOutputTokens ?? MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json",
    },
  });

  try {
    const result = await model.generateContent(request.userPrompt);
    const text = result.response.text();

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
