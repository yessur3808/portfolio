export type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "answering"
  | "navigating"
  | "error";

export type AssistantLanguage = "en" | "ar" | "fr";
export type AssistantLanguageMode = AssistantLanguage | "auto";

export type KnowledgeChunkType =
  | "profile"
  | "experience"
  | "project"
  | "skill"
  | "capability"
  | "metric"
  | "contact"
  | "resume";

export type AssistantAction =
  | { type: "scroll"; targetId: string }
  | { type: "highlight"; targetId: string; durationMs?: number }
  | { type: "download"; href: string; filename?: string }
  | { type: "open"; href: string; newTab?: boolean }
  | { type: "none" };

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  sectionId: string;
  type: KnowledgeChunkType;
  tags: string[];
  relatedActions?: AssistantAction[];
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  language?: AssistantLanguage;
};

export type SemanticSearchResult = {
  chunk: KnowledgeChunk;
  score: number;
};

export type AssistantResponse = {
  answer: string;
  language?: AssistantLanguage;
  confidence: number;
  matchedChunks: KnowledgeChunk[];
  actions: AssistantAction[];
  suggestions: string[];
};
