"use client";
// Browser-only. Do not import in Server Components or server utilities.

import type { AssistantResponse } from "./types";
import type { AssistantLanguage, AssistantLanguageMode } from "./types";
import { t } from "./i18n";
import { semanticSearch } from "./semanticSearch.client";
import { loadEmbeddingModel } from "./embeddingService.client";
import { detectDirectCommand } from "./directCommands";
import { composeAnswerFromResults } from "./answerComposer";
import { detectAssistantLanguage } from "./textUtils";

type AssistantContext = {
  lastResponse: AssistantResponse | null;
  lastQuery: string;
  turnCount: number;
  languageMode?: AssistantLanguageMode;
};

const isBrowserRuntime = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

const resolveLanguage = (
  input: string,
  mode: AssistantLanguageMode = "auto",
): AssistantLanguage => {
  if (mode === "auto") return detectAssistantLanguage(input);
  return mode;
};

const createInputFallback = (
  language: AssistantLanguage,
): AssistantResponse => {
  const l = t(language);
  return {
    answer: l.inputFallback,
    language,
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      l.suggestions.showProjects,
      l.suggestions.skillsListed,
      l.suggestions.contact,
    ],
  };
};

const createEngineErrorFallback = (
  language: AssistantLanguage,
): AssistantResponse => {
  const l = t(language);
  return {
    answer: l.engineErrorFallback,
    language,
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      l.suggestions.showProjects,
      l.suggestions.skillsListed,
      l.suggestions.contact,
    ],
  };
};

const isFollowUpQuery = (input: string): boolean => {
  return /\b(more|more about it|tell me more|what about that|expand on that|and then|next|continue|go deeper|elaborate)\b/i.test(
    input,
  );
};

const resolveContextualQuery = (
  input: string,
  context: AssistantContext,
): string => {
  const trimmed = input.trim();
  const lastChunk = context.lastResponse?.matchedChunks?.[0];
  const lastSection = lastChunk?.sectionId;

  if (!trimmed || !isFollowUpQuery(trimmed) || !lastChunk) {
    return trimmed;
  }

  const contextLabel = lastChunk.title;

  if (lastSection === "experience") {
    return `${trimmed} about ${contextLabel} and the related role experience`;
  }

  if (lastSection === "work") {
    return `${trimmed} about ${contextLabel} and the project details`;
  }

  if (lastSection === "stack") {
    return `${trimmed} about the ${contextLabel} technology stack`;
  }

  if (lastSection === "contact") {
    return `${trimmed} about contact and ways to reach ${contextLabel}`;
  }

  return `${trimmed} about ${contextLabel}`;
};

export const warmupAssistant = async (): Promise<void> => {
  if (!isBrowserRuntime()) return;

  try {
    // Keep orb-open warmup lightweight: preload model only.
    // Full corpus indexing occurs lazily when the first semantic query runs.
    await loadEmbeddingModel();
  } catch (error) {
    console.error("[orb-assistant] warmup failed", error);
  }
};

export const handleAssistantInput = async (
  input: string,
  context: AssistantContext = {
    lastResponse: null,
    lastQuery: "",
    turnCount: 0,
  },
): Promise<AssistantResponse> => {
  if (!isBrowserRuntime()) {
    return createEngineErrorFallback("en");
  }

  const trimmed = input.trim();
  const language = resolveLanguage(trimmed, context.languageMode ?? "auto");
  if (!trimmed) {
    return createInputFallback(language);
  }

  const resolvedQuery = resolveContextualQuery(trimmed, context);

  try {
    const direct = detectDirectCommand(resolvedQuery, language);
    if (direct) return direct;

    const results = await semanticSearch(resolvedQuery, {
      limit: 4,
      minScore: 0.25,
    });
    return composeAnswerFromResults(resolvedQuery, results, language);
  } catch (error) {
    console.error("[orb-assistant] handle input failed", error);
    return createEngineErrorFallback(language);
  }
};

/** @deprecated Use handleAssistantInput() instead. */
export const query = handleAssistantInput;

/** @deprecated Use warmupAssistant() instead. */
export const preload = warmupAssistant;
