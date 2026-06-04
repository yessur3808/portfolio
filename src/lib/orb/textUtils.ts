// Characters retained: alphanumerics, spaces, and useful tech symbols: # + . / _ - @
const STRIP_PUNCTUATION = /[^\w\s##+./\-@]/g;

/** Lowercase, trim, collapse whitespace, remove unhelpful punctuation. */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(STRIP_PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Common English stop words to discard during tokenization.
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "up",
  "about",
  "into",
  "through",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "i",
  "me",
  "my",
  "we",
  "our",
  "you",
  "your",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "what",
  "which",
  "who",
  "how",
  "when",
  "where",
  "can",
  "tell",
  "show",
  "give",
  "get",
  "see",
]);

/**
 * Normalizes and splits input into meaningful tokens,
 * removing stop words and single-character tokens.
 */
export function tokenize(input: string): string[] {
  return normalizeText(input)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Cosine similarity between two numeric vectors.
 * Returns 0 for empty or mismatched-length inputs.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;

  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return normA === 0 || normB === 0
    ? 0
    : dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Token-overlap score between a query and a body of text + optional tags.
 * Returns a value in [0, 1].
 */
export function keywordScore(
  query: string,
  text: string,
  tags: string[] = [],
): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const corpusTokens = new Set([
    ...tokenize(text),
    ...tags.flatMap((t) => tokenize(t)),
  ]);

  let hits = 0;
  for (const token of queryTokens) {
    if (corpusTokens.has(token)) hits++;
  }

  return hits / queryTokens.length;
}

/** Clamp a number within [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Creates a stable-enough client-side ID using a timestamp and random string.
 * Not cryptographically secure — suitable for UI keys and message IDs only.
 */
export function createId(prefix?: string): string {
  const rand = Math.random().toString(36).slice(2, 9);
  const ts = Date.now().toString(36);
  return prefix ? `${prefix}-${ts}-${rand}` : `${ts}-${rand}`;
}

/** Build a single searchable string from title, content, and tags. */
export function buildSearchText(
  title: string,
  content: string,
  tags: string[],
): string {
  return normalizeText([title, content, tags.join(" ")].join(" "));
}

/** Truncate a string to maxLength, appending an ellipsis if needed. */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}
