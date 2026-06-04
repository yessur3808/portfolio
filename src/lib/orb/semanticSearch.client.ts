"use client";

import { getPortfolioKnowledge as portfolioKnowledge } from "./portfolioKnowledge";
import type { KnowledgeChunk, SemanticSearchResult } from "./types";
import { embedText, embedTexts } from "./embeddingService.client";
import { cosineSimilarity, keywordScore } from "./textUtils";

const SEMANTIC_WEIGHT = 0.8;
const KEYWORD_WEIGHT = 0.2;
const DEFAULT_LIMIT = 4;
const DEFAULT_MIN_SCORE = 0.25;

// Cache keyed by KnowledgeChunk.id so chunk embeddings are reused between searches.
const cachedChunkEmbeddings = new Map<string, number[]>();
let indexingPromise: Promise<void> | null = null;

function assertBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error(
      "[semanticSearch] This module is browser-only. Do not call from SSR code.",
    );
  }
}

function buildChunkEmbeddingInput(chunk: KnowledgeChunk): string {
  return `${chunk.title}\n${chunk.content}\nTags: ${chunk.tags.join(", ")}`;
}

function rankKeywordOnly(
  chunks: KnowledgeChunk[],
  query: string,
  limit: number,
  minScore: number,
): SemanticSearchResult[] {
  return chunks
    .map((chunk) => ({
      chunk,
      score: keywordScore(
        query,
        `${chunk.title}\n${chunk.content}`,
        chunk.tags,
      ),
    }))
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function buildSemanticIndex(): Promise<void> {
  assertBrowser();

  if (!indexingPromise) {
    indexingPromise = (async () => {
      const chunks = portfolioKnowledge();
      if (chunks.length === 0) return;

      const missing = chunks.filter(
        (chunk) => !cachedChunkEmbeddings.has(chunk.id),
      );
      if (missing.length === 0) return;

      const inputs = missing.map((chunk) => buildChunkEmbeddingInput(chunk));
      const vectors = await embedTexts(inputs);

      missing.forEach((chunk, index) => {
        const vector = vectors[index] ?? [];
        if (vector.length > 0) {
          cachedChunkEmbeddings.set(chunk.id, vector);
        }
      });
    })().catch((error) => {
      // Reset promise so callers can retry if loading fails.
      indexingPromise = null;
      throw error;
    });
  }

  return indexingPromise;
}

export async function semanticSearch(
  query: string,
  options: { limit?: number; minScore?: number } = {},
): Promise<SemanticSearchResult[]> {
  assertBrowser();

  const limit = options.limit ?? DEFAULT_LIMIT;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
  const chunks = portfolioKnowledge();

  if (chunks.length === 0 || query.trim().length === 0) {
    return [];
  }

  try {
    await buildSemanticIndex();
    const queryEmbedding = await embedText(query);

    if (queryEmbedding.length === 0) {
      return rankKeywordOnly(chunks, query, limit, minScore);
    }

    const ranked = chunks
      .map((chunk) => {
        const chunkEmbedding = cachedChunkEmbeddings.get(chunk.id) ?? [];
        const semantic = cosineSimilarity(queryEmbedding, chunkEmbedding);
        const keyword = keywordScore(
          query,
          `${chunk.title}\n${chunk.content}`,
          chunk.tags,
        );
        const score = semantic * SEMANTIC_WEIGHT + keyword * KEYWORD_WEIGHT;

        return {
          chunk,
          score,
        };
      })
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return ranked;
  } catch {
    // Graceful fallback when embeddings fail (model load/network/runtime).
    return rankKeywordOnly(chunks, query, limit, minScore);
  }
}

export function clearSemanticIndex(): void {
  cachedChunkEmbeddings.clear();
  indexingPromise = null;
}
