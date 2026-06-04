"use client";

// Browser-only. Do not import in Server Components or server utilities.

import type { AssistantResponse } from "./types";
import { buildSemanticIndex, semanticSearch } from "./semanticSearch.client";
import { detectDirectCommand } from "./directCommands";
import { composeAnswerFromResults } from "./answerComposer";

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function createInputFallback(): AssistantResponse {
  return {
    answer:
      "Please type a question to get started. You can ask about projects, skills, experience, contact details, or resume.",
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      "Show projects",
      "What skills are listed?",
      "How can I contact you?",
    ],
  };
}

function createEngineErrorFallback(): AssistantResponse {
  return {
    answer:
      "I ran into a temporary issue while searching the portfolio data. Please try again in a moment.",
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      "Show projects",
      "What skills are listed?",
      "How can I contact you?",
    ],
  };
}

export async function warmupAssistant(): Promise<void> {
  if (!isBrowserRuntime()) return;

  try {
    await buildSemanticIndex();
  } catch (error) {
    console.error("[orb-assistant] warmup failed", error);
  }
}

export async function handleAssistantInput(
  input: string,
): Promise<AssistantResponse> {
  if (!isBrowserRuntime()) {
    return createEngineErrorFallback();
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return createInputFallback();
  }

  try {
    const direct = detectDirectCommand(trimmed);
    if (direct) return direct;

    const results = await semanticSearch(trimmed, { limit: 4, minScore: 0.25 });
    return composeAnswerFromResults(trimmed, results);
  } catch (error) {
    console.error("[orb-assistant] handle input failed", error);
    return createEngineErrorFallback();
  }
}

/** @deprecated Use handleAssistantInput() instead. */
export const query = handleAssistantInput;

/** @deprecated Use warmupAssistant() instead. */
export const preload = warmupAssistant;
