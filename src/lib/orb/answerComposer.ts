import type {
  AssistantAction,
  AssistantLanguage,
  AssistantResponse,
  KnowledgeChunk,
  SemanticSearchResult,
} from "./types";
import { interpolate, t } from "./i18n";
const WEAK_SCORE_THRESHOLD = 0.25;
type BriefStyle = "executive" | "technical";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function dedupeSuggestions(suggestions: string[]): string[] {
  return Array.from(new Set(suggestions));
}

function uniqueById(chunks: KnowledgeChunk[]): KnowledgeChunk[] {
  const seen = new Set<string>();
  return chunks.filter((chunk) => {
    if (seen.has(chunk.id)) return false;
    seen.add(chunk.id);
    return true;
  });
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

function chunksToUse(
  query: string,
  results: SemanticSearchResult[],
): SemanticSearchResult[] {
  const detailedQuery =
    /\b(deep|in depth|detailed|details|explain|breakdown|walk me through|verbatim|exact wording|original wording|source wording|as written|word for word|full details)\b/i.test(
      query,
    );
  const topScore = results[0]?.score ?? 0;
  const languagePriorityQuery =
    /\b(best|strongest|primary|main|top|favorite)\b.*\b(programming\s+language|language|languages|tech\s+stack|stack)\b|\b(programming\s+language|language|languages)\b.*\b(best|strongest|primary|main|top|favorite)\b/i.test(
      query,
    );
  const projectListQuery =
    /\b(what|which|some|list|show)\b.*\b(project|projects)\b|\b(project|projects)\b.*\b(worked on|during|at|from|built)\b/i.test(
      query,
    );
  const deepQuery =
    /\b(deep|in depth|detailed|details|explain|breakdown|walk me through|tell me about|hex trust|crypto\.com|ai link|tradefi|scmp|polyasia|creative coding hk)\b/i.test(
      query,
    );
  const verbatimQuery =
    /\b(verbatim|exact wording|original wording|source wording|as written|word for word)\b/i.test(
      query,
    );
  const sourceResults = projectListQuery
    ? results.filter((result) => result.chunk.type === "project")
    : results;
  const candidateResults = sourceResults.length > 0 ? sourceResults : results;

  const maxChunks = languagePriorityQuery
    ? topScore >= 0.8
      ? 1
      : 2
    : projectListQuery && !detailedQuery
      ? 3
      : deepQuery
        ? topScore >= 0.8
          ? 5
          : topScore >= 0.55
            ? 7
            : 8
        : verbatimQuery
          ? topScore >= 0.8
            ? 6
            : topScore >= 0.55
              ? 8
              : 10
          : topScore >= 0.8
            ? 1
            : topScore >= 0.55
              ? 2
              : 3;
  return candidateResults.slice(0, maxChunks);
}

function truncateForSummary(content: string, maxLength = 150): string {
  const firstSentence = content.split(/(?<=[.!?])\s+/)[0] ?? content;
  const normalized = firstSentence.trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function splitProjectContent(content: string): {
  whatItWas: string;
  whatHeDid: string;
} {
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const whatItWas = sentences[0] ?? content.trim();
  const whatHeDid =
    sentences.slice(1).join(" ") ||
    "Contributed to the project as part of the broader portfolio work.";

  return {
    whatItWas: whatItWas.replace(/^The\s+/i, "The ").trim(),
    whatHeDid: whatHeDid.trim(),
  };
}

function buildProjectListNote(
  query: string,
  confidence: number,
  language: AssistantLanguage,
  firstChunk: KnowledgeChunk,
): string {
  const confidenceText = confidenceLabel(confidence, language);
  const variants = [
    `I matched this in the projects section for "${query}".`,
    `This came up as a ${confidenceText} match in the projects section for "${query}".`,
    `I found a ${confidenceText} projects-section match for "${query}".`,
  ];
  const variantIndex =
    Math.abs(query.length + firstChunk.id.length) % variants.length;
  const lead = variants[variantIndex];
  const detail = `${firstChunk.title}: ${truncateForSummary(firstChunk.content, 110)}`;

  // Keep the second paragraph concise and conversational.
  return `${lead} ${detail}`;
}

function isDetailedQuery(query: string): boolean {
  return /\b(deep|in depth|detailed|details|explain|breakdown|walk me through|verbatim|exact wording|original wording|source wording|as written|word for word|full details)\b/i.test(
    query,
  );
}

function isProjectListQuery(query: string): boolean {
  return /\b(what|which|some|list|show)\b.*\b(project|projects)\b|\b(project|projects)\b.*\b(worked on|during|at|from|built)\b/i.test(
    query,
  );
}

function isQuestionStyleQuery(query: string): boolean {
  return /\b(what|which|who|how|why|when|where|can you|could you|would you|tell me)\b/i.test(
    query,
  );
}

function detectBriefStyle(query: string): BriefStyle {
  const technicalSignal =
    /\b(technical|tech|implementation|implement|architecture|system|design|api|code|coding|algorithm|data\s+model|schema|database|backend|frontend|latency|performance|optimi[sz]e|debug|integration|framework|library|stack|pipeline|security)\b/i.test(
      query,
    );
  const executiveSignal =
    /\b(executive|summary|overview|high\s*level|business|impact|outcome|value|brief|quick\s+read|snapshot|strategy|priorities)\b/i.test(
      query,
    );

  if (technicalSignal) return "technical";
  if (executiveSignal) return "executive";
  return isDetailedQuery(query) ? "technical" : "executive";
}

function confidenceLabel(
  confidence: number,
  language: AssistantLanguage,
): string {
  const l = t(language);
  if (confidence >= 0.8) return l.confidenceHigh;
  if (confidence >= 0.55) return l.confidenceModerate;
  return l.confidenceLow;
}

function typeLabel(
  type: KnowledgeChunk["type"],
  language: AssistantLanguage,
): string {
  const l = t(language);
  switch (type) {
    case "project":
      return l.sectionProjects;
    case "experience":
      return l.sectionExperience;
    case "skill":
      return l.sectionSkills;
    case "capability":
      return l.sectionCapabilities;
    case "contact":
      return l.sectionContact;
    case "resume":
      return l.sectionResume;
    default:
      return l.sectionProfile;
  }
}

function sectionLabels(
  language: AssistantLanguage,
  style: BriefStyle,
): {
  summary: string;
  keyPoints: string;
  details: string;
  links: string;
} {
  switch (language) {
    case "fr":
      return {
        summary: "Resume",
        keyPoints: "Points Cles",
        details: "Details",
        links: "Liens",
      };
    case "ar":
      return {
        summary: "Summary",
        keyPoints: "Key Points",
        details: "Details",
        links: "Links",
      };
    case "en":
    default:
      return {
        summary: "Summary",
        keyPoints: style === "executive" ? "Key Takeaways" : "Key Points",
        details: style === "executive" ? "Details" : "Technical Details",
        links: style === "executive" ? "Links" : "References",
      };
  }
}

function extractReferenceLinks(chunks: KnowledgeChunk[]): Array<{
  label: string;
  href: string;
}> {
  const seen = new Set<string>();
  const links: Array<{ label: string; href: string }> = [];

  for (const chunk of chunks) {
    for (const action of chunk.relatedActions ?? []) {
      if (
        (action.type === "open" || action.type === "download") &&
        action.href
      ) {
        const key = action.href.trim();
        if (!key || seen.has(key)) continue;

        seen.add(key);
        links.push({
          href: key,
          label:
            action.type === "download"
              ? (action.filename ?? `Download ${chunk.title}`)
              : chunk.title,
        });
      }
    }
  }

  return links.slice(0, 4);
}

function renderDocumentAnswer(options: {
  summary: string;
  keyPoints: string[];
  details: string[];
  links?: Array<{ label: string; href: string }>;
  language: AssistantLanguage;
  style: BriefStyle;
}): string {
  const labels = sectionLabels(options.language, options.style);
  const normalizedKeyPoints = options.keyPoints.filter(Boolean);
  const normalizedDetails = options.details.filter(Boolean);
  const normalizedLinks = (options.links ?? []).filter(
    (link) => link.label && link.href,
  );

  const parts: string[] = [];

  parts.push(`### ${labels.summary}`);
  parts.push(options.summary.trim());

  if (normalizedKeyPoints.length > 0) {
    parts.push(`### ${labels.keyPoints}`);
    parts.push(normalizedKeyPoints.map((point) => `- ${point}`).join("\n"));
  }

  if (normalizedDetails.length > 0) {
    parts.push(`### ${labels.details}`);
    parts.push(normalizedDetails.join("\n\n"));
  }

  if (normalizedLinks.length > 0) {
    parts.push(`### ${labels.links}`);
    parts.push(
      normalizedLinks
        .map((link) => `- [${link.label}](${link.href})`)
        .join("\n"),
    );
  }

  return parts.join("\n\n");
}

function buildAnswerFromChunks(
  query: string,
  chunks: KnowledgeChunk[],
  confidence: number,
  language: AssistantLanguage,
): string {
  const l = t(language);
  const detailed = isDetailedQuery(query);
  const style = detectBriefStyle(query);
  const projectListQuery = isProjectListQuery(query);
  const firstChunk = chunks[0];
  const label = firstChunk
    ? typeLabel(firstChunk.type, language)
    : l.sectionProfile;
  const links = extractReferenceLinks(chunks);
  const summaryLength =
    style === "technical" ? (detailed ? 220 : 180) : detailed ? 180 : 130;
  const keyPointLength = style === "technical" ? 130 : 95;
  const detailLength =
    style === "technical" ? (detailed ? 420 : 260) : detailed ? 260 : 170;

  if (projectListQuery && chunks.length > 0) {
    const conciseChunks = detailed ? chunks : chunks.slice(0, 3);
    const keyPoints = conciseChunks.map(
      (chunk) =>
        `**${chunk.title}** (${typeLabel(chunk.type, language)}): ${truncateForSummary(chunk.content, keyPointLength)}`,
    );
    const details = conciseChunks.map((chunk) => {
      const { whatItWas, whatHeDid } = splitProjectContent(chunk.content);
      const itWas = truncateForSummary(
        whatItWas,
        style === "technical" ? (detailed ? 210 : 150) : detailed ? 150 : 115,
      );
      const did = truncateForSummary(
        whatHeDid,
        style === "technical" ? (detailed ? 250 : 170) : detailed ? 180 : 125,
      );

      return [
        `#### ${chunk.title}`,
        `- **What it was:** ${itWas}`,
        `- **What he did:** ${did}`,
      ].join("\n");
    });

    const summary =
      conciseChunks.length === 1
        ? style === "technical"
          ? `Technical brief: this is the strongest project match for "${query}" in ${label}.`
          : `Executive brief: this is the strongest project match for "${query}" in ${label}.`
        : style === "technical"
          ? `Technical brief: these are the strongest project matches for "${query}" in ${label}.`
          : `Executive brief: these are the strongest project matches for "${query}" in ${label}.`;

    const note = conciseChunks[0]
      ? buildProjectListNote(query, confidence, language, conciseChunks[0])
      : "";

    return renderDocumentAnswer({
      summary: note
        ? `${summary} ${truncateForSummary(note, summaryLength)}`
        : summary,
      keyPoints,
      details,
      links,
      language,
      style,
    });
  }

  if (chunks.length === 1) {
    return renderDocumentAnswer({
      summary:
        style === "technical"
          ? `Technical brief: strongest match for "${query}" is in ${label} (${confidenceLabel(confidence, language)} confidence).`
          : `Executive brief: top match for "${query}" is in ${label}.`,
      keyPoints: [
        `**Section:** ${label}`,
        `**Confidence:** ${confidenceLabel(confidence, language)}`,
      ],
      details: [
        `#### ${chunks[0].title}`,
        detailed
          ? chunks[0].content
          : truncateForSummary(chunks[0].content, detailLength),
      ],
      links,
      language,
      style,
    });
  }

  const conciseChunks = detailed ? chunks : chunks.slice(0, 3);
  const keyPoints = conciseChunks.map(
    (chunk) =>
      `**${chunk.title}** (${typeLabel(chunk.type, language)}): ${truncateForSummary(chunk.content, keyPointLength)}`,
  );
  const details = conciseChunks.map((chunk) => {
    const detail = detailed
      ? chunk.content
      : truncateForSummary(chunk.content, detailLength);
    return [`#### ${chunk.title}`, detail].join("\n");
  });

  return renderDocumentAnswer({
    summary:
      style === "technical"
        ? `Technical brief for "${query}": matched ${conciseChunks.length} relevant items in ${label.toLowerCase()} with ${confidenceLabel(confidence, language)} confidence.`
        : `Executive brief for "${query}": matched ${conciseChunks.length} relevant items in ${label.toLowerCase()}.`,
    keyPoints,
    details,
    links,
    language,
    style,
  });
}

function buildSuggestionsFromTypes(
  chunks: KnowledgeChunk[],
  language: AssistantLanguage,
): string[] {
  const l = t(language);
  const suggestions: string[] = [];
  const types = new Set(chunks.map((chunk) => chunk.type));

  if (types.has("project")) {
    suggestions.push(l.suggestions.showProjects, l.suggestions.projectsTech);
  }
  if (types.has("skill")) {
    suggestions.push(l.suggestions.showSkills, l.suggestions.backendExperience);
  }
  if (types.has("contact")) {
    suggestions.push(l.suggestions.openContact, l.suggestions.contactHow);
  }
  if (types.has("capability")) {
    suggestions.push(l.suggestions.workAuthorization);
  }
  if (types.has("resume")) {
    suggestions.push(l.suggestions.downloadResume);
  }

  if (chunks.some((chunk) => chunk.sectionId === "work")) {
    suggestions.push(l.suggestions.showFeaturedWork, l.suggestions.whatBuilt);
  }
  if (chunks.some((chunk) => chunk.sectionId === "experience")) {
    suggestions.push(
      l.suggestions.moreExperience,
      l.suggestions.mostRecentRole,
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      l.suggestions.showProjects,
      l.suggestions.skillsListed,
      l.suggestions.contact,
    );
  }

  return dedupeSuggestions(suggestions);
}

function mergeActions(
  chunks: KnowledgeChunk[],
  options: { allowOpenActions?: boolean } = {},
): AssistantAction[] {
  const allowOpenActions = options.allowOpenActions ?? true;
  const actions: AssistantAction[] = [];

  for (const chunk of chunks) {
    if (chunk.relatedActions?.length) {
      actions.push(
        ...chunk.relatedActions.filter(
          (action) => allowOpenActions || action.type !== "open",
        ),
      );
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
  language: AssistantLanguage = "en",
): AssistantResponse {
  const l = t(language);
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const confidence = clamp(topScore, 0, 1);

  if (sorted.length === 0 || topScore < WEAK_SCORE_THRESHOLD) {
    return {
      answer: interpolate(l.fallbackNotEnough, { query }),
      language,
      confidence,
      matchedChunks: [],
      actions: [{ type: "none" }],
      suggestions: [
        l.suggestions.showProjects,
        l.suggestions.skillsListed,
        l.suggestions.contact,
      ],
    };
  }

  const selected = chunksToUse(query, sorted);
  const matchedChunks = uniqueById(selected.map((result) => result.chunk));
  const projectListQuery = isProjectListQuery(query);
  const questionStyleQuery = isQuestionStyleQuery(query);

  return {
    answer: buildAnswerFromChunks(query, matchedChunks, confidence, language),
    language,
    confidence,
    matchedChunks,
    actions: mergeActions(matchedChunks, {
      allowOpenActions: !(projectListQuery || questionStyleQuery),
    }),
    suggestions: buildSuggestionsFromTypes(matchedChunks, language),
  };
}

export function composeAnswer(
  results: SemanticSearchResult[],
): AssistantResponse {
  return composeAnswerFromResults("your request", results, "en");
}

export function composeFallback(
  language: AssistantLanguage = "en",
): AssistantResponse {
  const l = t(language);
  return {
    answer: l.fallbackGeneric,
    language,
    confidence: 0,
    matchedChunks: [],
    actions: [{ type: "none" }],
    suggestions: [
      l.suggestions.showProjects,
      l.suggestions.moreExperience,
      l.suggestions.contact,
    ],
  };
}
