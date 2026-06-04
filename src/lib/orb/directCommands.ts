import type { AssistantResponse } from "./types";
import { normalizeText } from "./textUtils";

function hasWord(text: string, word: string): boolean {
  return text.split(" ").includes(word);
}

function hasAnyWord(text: string, words: string[]): boolean {
  return words.some((word) => hasWord(text, word));
}

function hasAnyPhrase(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

function buildResponse(
  answer: string,
  confidence: number,
  actions: AssistantResponse["actions"],
  suggestions: string[],
): AssistantResponse {
  return {
    answer,
    confidence,
    matchedChunks: [],
    actions,
    suggestions,
  };
}

export function detectDirectCommand(input: string): AssistantResponse | null {
  const text = normalizeText(input);
  if (!text) return null;

  if (
    hasAnyWord(text, ["contact", "email", "reach", "hire"]) ||
    hasAnyPhrase(text, ["get in touch", "contact me", "reach out"])
  ) {
    return buildResponse(
      "Taking you to the contact section.",
      0.95,
      [
        { type: "scroll", targetId: "contact" },
        { type: "highlight", targetId: "contact", durationMs: 1600 },
      ],
      [
        "Show my projects",
        "Tell me about your experience",
        "How can I contact you?",
      ],
    );
  }

  if (
    hasAnyWord(text, ["project", "projects", "portfolio", "work"]) ||
    hasAnyPhrase(text, ["show projects", "view projects"])
  ) {
    return buildResponse(
      "Jumping to featured projects.",
      0.93,
      [
        { type: "scroll", targetId: "work" },
        { type: "highlight", targetId: "work", durationMs: 1600 },
      ],
      [
        "Tell me about your experience",
        "What skills do you use?",
        "How can I contact you?",
      ],
    );
  }

  if (
    hasAnyWord(text, ["experience", "background", "career", "journey"]) ||
    hasAnyPhrase(text, ["work history", "professional experience"])
  ) {
    return buildResponse(
      "Taking you to the experience section.",
      0.92,
      [
        { type: "scroll", targetId: "experience" },
        { type: "highlight", targetId: "experience", durationMs: 1600 },
      ],
      ["Show my projects", "What skills do you use?", "How can I contact you?"],
    );
  }

  if (
    hasAnyWord(text, [
      "skills",
      "skill",
      "stack",
      "technology",
      "technologies",
      "tools",
    ])
  ) {
    return buildResponse(
      "Opening the skills and tech stack section.",
      0.9,
      [
        { type: "scroll", targetId: "stack" },
        { type: "highlight", targetId: "stack", durationMs: 1600 },
      ],
      [
        "Show my projects",
        "Tell me about your experience",
        "How can I contact you?",
      ],
    );
  }

  if (
    hasAnyWord(text, ["about", "profile", "bio", "who"]) ||
    hasAnyPhrase(text, ["about you", "your profile", "who are you"])
  ) {
    return buildResponse(
      "Taking you to the profile overview section.",
      0.9,
      [
        { type: "scroll", targetId: "about" },
        { type: "highlight", targetId: "about", durationMs: 1600 },
      ],
      ["Show my experience", "Show my projects", "How can I contact you?"],
    );
  }

  if (
    hasAnyWord(text, ["top", "hero", "home", "start"]) ||
    hasAnyPhrase(text, ["go to top", "back to top", "go home"])
  ) {
    return buildResponse(
      "Returning to the top of the page.",
      0.9,
      [
        { type: "scroll", targetId: "home" },
        { type: "highlight", targetId: "home", durationMs: 1400 },
      ],
      [
        "Show my projects",
        "Tell me about your experience",
        "How can I contact you?",
      ],
    );
  }

  return null;
}
