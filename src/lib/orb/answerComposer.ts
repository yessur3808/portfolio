import type {
  AssistantAction,
  AssistantResponse,
  KnowledgeChunk,
  SemanticSearchResult,
} from "./types";
const WEAK_SCORE_THRESHOLD = 0.25;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function dedupeSuggestions(suggestions: string[]): string[] {
  return Array.from(new Set(suggestions));
}

function actionKey(action: AssistantAction): string {
  if (action.type === "scroll") return `scroll:${action.targetId}`;
  if (action.type === "highlight") return `highlight:${action.targetId}`;
  if (action.type === "download") {
    return `download:${action.href}:${action.filename ?? ""}`;
  }
  if (action.type === "open")
    return `open:${action.href}:${action.newTab ?? true}`;
  return "none";
}

function dedupeActions(actions: AssistantAction[]): AssistantAction[] {
  const seen = new Set<string>();
  const deduped: AssistantAction[] = [];
  for (const action of actions) {
    const key = actionKey(action);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(action);
    }
  }
  return deduped;
}

function chunksToUse(results: SemanticSearchResult[]): SemanticSearchResult[] {
  const topScore = results[0]?.score ?? 0;
  const maxChunks = topScore >= 0.8 ? 1 : topScore >= 0.55 ? 2 : 3;
  return results.slice(0, maxChunks);
}

function buildAnswerFromChunks(
  query: string,
  chunks: KnowledgeChunk[],
): string {
  if (chunks.length === 1) {
    return `Based on your question about \"${query}\", ${chunks[0].title}: ${chunks[0].content}`;
  }

  const summaries = chunks
    .map((chunk) => `${chunk.title}: ${chunk.content}`)
    .join(" ");
  return `Here is what the portfolio shows: ${summaries}`;
}

function buildSuggestionsFromTypes(chunks: KnowledgeChunk[]): string[] {
  const suggestions: string[] = [];
  const types = new Set(chunks.map((chunk) => chunk.type));

  if (types.has("project")) {
    suggestions.push("Show me projects", "What technologies were used?");
  }
  if (types.has("skill")) {
    suggestions.push("Show skills", "What backend experience is listed?");
  }
  if (types.has("contact")) {
    suggestions.push("Go to contact");
  }
  // if (types.has("resume")) {
  //   suggestions.push("Download resume");
  // }

  if (suggestions.length === 0) {
    suggestions.push(
      "Show projects",
      "What skills are listed?",
      "How can I contact you?",
    );
  }

  return dedupeSuggestions(suggestions);
}

function mergeActions(chunks: KnowledgeChunk[]): AssistantAction[] {
  const actions: AssistantAction[] = [];

  for (const chunk of chunks) {
    if (chunk.relatedActions?.length) {
      actions.push(...chunk.relatedActions);
    }
  }

  const topChunk = chunks[0];
  if (topChunk?.sectionId) {
    const hasScroll = actions.some(
      (action) =>
        action.type === "scroll" && action.targetId === topChunk.sectionId,
    );
    const hasHighlight = actions.some(
      (action) =>
        action.type === "highlight" && action.targetId === topChunk.sectionId,
    );

    if (!hasScroll) {
      actions.push({ type: "scroll", targetId: topChunk.sectionId });
    }
    if (!hasHighlight) {
      actions.push({
        type: "highlight",
        targetId: topChunk.sectionId,
        durationMs: 1500,
      });
    }
  }

  return dedupeActions(actions);
}

export function composeAnswerFromResults(
  query: string,
  results: SemanticSearchResult[],
): AssistantResponse {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const confidence = clamp(topScore, 0, 1);

  if (sorted.length === 0 || topScore < WEAK_SCORE_THRESHOLD) {
    return {
      answer:
        "I could not find enough information in the portfolio data to answer that confidently.",
      confidence,
      matchedChunks: [],
      actions: [{ type: "none" }],
      suggestions: [
        "Show projects",
        "What skills are listed?",
        "How can I contact you?",
      ],
    };
  }

  const selected = chunksToUse(sorted);
  const matchedChunks = selected.map((result) => result.chunk);

  return {
    answer: buildAnswerFromChunks(query, matchedChunks),
    confidence,
    matchedChunks,
    actions: mergeActions(matchedChunks),
    suggestions: buildSuggestionsFromTypes(matchedChunks),
  };
}

export function composeAnswer(
  results: SemanticSearchResult[],
): AssistantResponse {
  return composeAnswerFromResults("your request", results);
}

export function composeFallback(): AssistantResponse {
  return {
    answer:
      "I couldn't find a strong match for that. Try asking about projects, experience, skills, or how to get in touch.",
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      "What projects have you built?",
      "Tell me about your experience",
      "How can I contact you?",
    ],
  };
}
