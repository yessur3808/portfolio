"use client";

import type { ProjectRecord } from "@/src/data/projects";

export type SemanticDocument = {
  id: string;
  title: string;
  content: string;
  url?: string;
  tags?: string[];
  metadata?: Record<string, string | number | boolean | null>;
};

export type SemanticSearchResult = {
  document: SemanticDocument;
  score: number;
  source: "semantic" | "fuzzy";
};

type ExtractorFn = (
  input: string,
  options?: Record<string, unknown>,
) => Promise<unknown>;

type FuseLikeResult<T> = {
  item: T;
  score?: number;
};

type FuseLike<T> = {
  search: (query: string, options?: { limit?: number }) => FuseLikeResult<T>[];
};

const DEFAULT_MODEL = "Xenova/all-MiniLM-L6-v2";

let extractorPromise: Promise<ExtractorFn> | null = null;

function assertBrowser() {
  if (typeof window === "undefined") {
    throw new Error(
      "semanticSearch is browser-only. Call it from a client component.",
    );
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function buildSearchText(doc: SemanticDocument): string {
  return normalizeText(
    [doc.title, doc.content, doc.tags?.join(" ") ?? ""].join(" "),
  );
}

function toNumberArray(value: unknown): number[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .map((entry) => Number(entry))
      .filter(Number.isFinite);
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const maybeData = record.data;
    if (maybeData && typeof maybeData === "object") {
      const maybeArrayLike = maybeData as ArrayLike<number>;
      if (typeof maybeArrayLike.length === "number") {
        const out: number[] = [];
        for (let i = 0; i < maybeArrayLike.length; i += 1) {
          const n = Number(maybeArrayLike[i]);
          if (Number.isFinite(n)) {
            out.push(n);
          }
        }
        return out;
      }
    }
  }

  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function loadExtractor(model = DEFAULT_MODEL): Promise<ExtractorFn> {
  assertBrowser();

  if (!extractorPromise) {
    extractorPromise = (async () => {
      const transformersModule = await import("@huggingface/transformers");
      const env = transformersModule.env as {
        allowLocalModels?: boolean;
        useBrowserCache?: boolean;
      };

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const extractor = (await transformersModule.pipeline(
        "feature-extraction",
        model,
      )) as ExtractorFn;

      return extractor;
    })();
  }

  return extractorPromise;
}

export class BrowserSemanticSearch {
  private readonly docs: SemanticDocument[];
  private readonly searchTexts: string[];
  private embeddings: number[][] = [];
  private fuse: FuseLike<SemanticDocument> | null = null;
  private initialized = false;
  private semanticReady = false;

  constructor(documents: SemanticDocument[]) {
    this.docs = documents;
    this.searchTexts = documents.map(buildSearchText);
  }

  async init(model = DEFAULT_MODEL): Promise<void> {
    if (this.initialized) {
      return;
    }

    assertBrowser();
    this.initialized = true;

    await this.initFuse();

    try {
      const extractor = await loadExtractor(model);
      const vectors = await Promise.all(
        this.searchTexts.map((text) => this.embed(extractor, text)),
      );

      const valid = vectors.filter((vec) => vec.length > 0);
      if (valid.length === this.searchTexts.length && valid.length > 0) {
        this.embeddings = vectors;
        this.semanticReady = true;
      }
    } catch {
      this.semanticReady = false;
    }
  }

  async search(query: string, limit = 5): Promise<SemanticSearchResult[]> {
    const cleaned = normalizeText(query);
    if (!cleaned) {
      return [];
    }

    if (!this.initialized) {
      await this.init();
    }

    if (this.semanticReady) {
      const semanticResults = await this.semanticSearch(cleaned, limit);
      if (semanticResults.length > 0) {
        return semanticResults;
      }
    }

    return this.fuzzySearch(cleaned, limit);
  }

  private async embed(extractor: ExtractorFn, text: string): Promise<number[]> {
    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return toNumberArray(output);
  }

  private async semanticSearch(
    query: string,
    limit: number,
  ): Promise<SemanticSearchResult[]> {
    const extractor = await loadExtractor();
    const queryEmbedding = await this.embed(extractor, query);

    if (queryEmbedding.length === 0 || this.embeddings.length === 0) {
      return [];
    }

    const ranked = this.docs
      .map((document, index) => ({
        document,
        score: cosineSimilarity(queryEmbedding, this.embeddings[index] ?? []),
      }))
      .filter((entry) => Number.isFinite(entry.score) && entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => ({ ...entry, source: "semantic" as const }));

    return ranked;
  }

  private async initFuse(): Promise<void> {
    if (this.fuse) {
      return;
    }

    const fuseModule = await import("fuse.js");
    const Fuse = fuseModule.default;

    this.fuse = new Fuse(this.docs, {
      includeScore: true,
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: "title", weight: 0.5 },
        { name: "content", weight: 0.35 },
        { name: "tags", weight: 0.15 },
      ],
    }) as FuseLike<SemanticDocument>;
  }

  private fuzzySearch(query: string, limit: number): SemanticSearchResult[] {
    if (!this.fuse) {
      return [];
    }

    return this.fuse.search(query, { limit }).map((entry) => ({
      document: entry.item,
      score: 1 - (entry.score ?? 1),
      source: "fuzzy" as const,
    }));
  }
}

export function buildProjectSemanticDocuments(
  projects: ProjectRecord[],
): SemanticDocument[] {
  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    content: normalizeText(
      [
        project.summary,
        project.description,
        project.impact,
        project.company ?? "",
        project.period ?? "",
        project.themes.join(" "),
        project.technologies.join(" "),
      ].join(" "),
    ),
    url: `/portfolio/${project.slug}`,
    tags: [...project.technologies, ...project.themes],
    metadata: {
      featured: project.featured,
      slug: project.slug,
    },
  }));
}

export async function createPortfolioSemanticSearch(
  projects: ProjectRecord[],
): Promise<BrowserSemanticSearch> {
  const engine = new BrowserSemanticSearch(
    buildProjectSemanticDocuments(projects),
  );
  await engine.init();
  return engine;
}
