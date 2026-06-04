"use client";

// Browser-only embedding service using Transformers.js (Xenova/all-MiniLM-L6-v2).
// @huggingface/transformers is dynamically imported so it is never bundled into
// the server build, and the model loads lazily the first time it is needed.
//
// WebGPU acceleration can be enabled later by passing device options to pipeline(),
// e.g.: pipeline("feature-extraction", MODEL_ID, { device: "webgpu" })
// Check navigator.gpu !== undefined before doing so.

// ─── Narrow local type aliases to avoid `any` propagation ────────────────────

type ExtractorOptions = { pooling: "mean"; normalize: boolean };

/** Minimal shape returned by Transformers.js feature-extraction pipeline. */
type TensorLike = {
  data?: ArrayLike<number>;
  tolist?: () => number[][] | number[];
};

/** Callable extractor returned by pipeline(). */
type Extractor = (
  text: string | string[],
  options?: ExtractorOptions,
) => Promise<TensorLike | TensorLike[]>;

// ─── Status tracking ─────────────────────────────────────────────────────────

export type EmbeddingStatus = "idle" | "loading" | "ready" | "error";

let status: EmbeddingStatus = "idle";
let modelPromise: Promise<Extractor> | null = null;

export function getEmbeddingStatus(): EmbeddingStatus {
  return status;
}

// ─── SSR guard ───────────────────────────────────────────────────────────────

function assertBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error(
      "[embeddingService] This module is browser-only. Do not call it in Server Components or server utilities.",
    );
  }
}

// ─── Tensor → number[] conversion ────────────────────────────────────────────

/**
 * Safely flattens the varied output shapes from Transformers.js into a plain
 * number[]. The pipeline can return a Tensor with a `.data` TypedArray or a
 * nested array via `.tolist()`.
 */
function tensorToFloatArray(output: TensorLike): number[] {
  // Prefer tolist() when available (gives pooled [embedding] or [[...]])
  if (typeof output.tolist === "function") {
    const list = output.tolist();
    if (Array.isArray(list)) {
      const flat = (list as unknown[]).flat(Infinity);
      return (flat as number[]).filter(Number.isFinite);
    }
  }

  // Fall back to the raw TypedArray-like .data property
  if (
    output.data &&
    typeof (output.data as ArrayLike<number>).length === "number"
  ) {
    const arr = output.data as ArrayLike<number>;
    const result: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      const n = Number(arr[i]);
      if (Number.isFinite(n)) result.push(n);
    }
    return result;
  }

  return [];
}

// ─── Model loading ────────────────────────────────────────────────────────────

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

/**
 * Loads the embedding model exactly once (singleton promise).
 * Safe to call concurrently — multiple callers share the same promise.
 */
export function loadEmbeddingModel(): Promise<Extractor> {
  assertBrowser();

  if (!modelPromise) {
    status = "loading";
    modelPromise = (async () => {
      try {
        const { pipeline, env } = await import("@huggingface/transformers");

        // Disable local model lookup; rely on HuggingFace CDN + browser cache.
        (env as Record<string, unknown>).allowLocalModels = false;
        (env as Record<string, unknown>).useBrowserCache = true;

        // feature-extraction returns pooled sentence embeddings.
        // To enable WebGPU later, add: { device: "webgpu" } as third argument
        // after checking `typeof navigator !== "undefined" && "gpu" in navigator`.
        const extractor = await pipeline("feature-extraction", MODEL_ID);
        status = "ready";
        return extractor as unknown as Extractor;
      } catch (err) {
        status = "error";
        modelPromise = null; // allow retry on next call
        throw new Error(
          `[embeddingService] Failed to load model "${MODEL_ID}": ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    })();
  }

  return modelPromise;
}

// ─── Public embedding API ─────────────────────────────────────────────────────

/**
 * Embeds a single string and returns a plain number[] vector.
 * The model produces 384-dimensional embeddings (all-MiniLM-L6-v2).
 */
export async function embedText(text: string): Promise<number[]> {
  assertBrowser();
  const extractor = await loadEmbeddingModel();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  const tensor = Array.isArray(output) ? output[0] : output;
  return tensorToFloatArray(tensor);
}

/**
 * Embeds multiple strings in parallel.
 * Each item is embedded independently to avoid batching shape surprises.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  assertBrowser();
  return Promise.all(texts.map((t) => embedText(t)));
}

// ─── Legacy export alias (used by semanticSearch.client.ts) ──────────────────

/** @deprecated Use embedText() instead. */
export const embed = embedText;

/** @deprecated Use loadEmbeddingModel() instead. */
export const loadEmbeddingPipeline = loadEmbeddingModel;

export type EmbeddingVector = number[];
