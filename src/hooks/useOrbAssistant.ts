"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AssistantLanguage,
  AssistantLanguageMode,
  AssistantMessage,
  AssistantResponse,
  OrbState,
} from "@/src/lib/orb/types";
import {
  detectAssistantLanguage,
  parseDisabledLanguageCommand,
  parseLanguageCommand,
} from "@/src/lib/orb/textUtils";
import { trackEvent } from "@/src/lib/analytics";

type UseOrbAssistantOptions = {
  preload?: boolean;
  languageMode?: AssistantLanguageMode;
};

type UseOrbAssistantReturn = {
  messages: AssistantMessage[];
  orbState: OrbState;
  lastResponse: AssistantResponse | null;
  languageMode: AssistantLanguageMode;
  send: (text: string) => Promise<AssistantResponse | null>;
  reset: () => void;
};

type AssistantSessionMemory = {
  lastQuery: string;
  lastSectionId: string;
  lastTopic: string;
  turnCount: number;
};

type OrbStateEventDetail = {
  state: OrbState;
  confidence: number;
  topic: string;
  turnCount: number;
};

const makeId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const makeMessage = (
  role: AssistantMessage["role"],
  content: string,
  language?: AssistantLanguage,
): AssistantMessage => {
  return { id: makeId(), role, content, createdAt: new Date(), language };
};

const languageModeAck = (
  mode: AssistantLanguageMode,
  language: AssistantLanguage,
): string => {
  if (mode === "auto") {
    return {
      en: "Language mode set to auto-detect (fallback: English).",
      ar: "تم ضبط وضع اللغة على الكشف التلقائي (اللغة الاحتياطية: الإنجليزية).",
      fr: "Le mode de langue est défini sur détection automatique (repli: anglais).",
    }[language];
  }

  return {
    en: `Language set to ${mode.toUpperCase()}.`,
    ar:
      mode === "ar"
        ? "تم ضبط اللغة إلى العربية."
        : mode === "fr"
          ? "تم ضبط اللغة إلى الفرنسية."
          : "تم ضبط اللغة إلى الإنجليزية.",
    fr:
      mode === "ar"
        ? "La langue est définie sur l'arabe."
        : mode === "fr"
          ? "La langue est définie sur le français."
          : "La langue est définie sur l'anglais.",
  }[language];
};

const makeDefaultMemory = (): AssistantSessionMemory => {
  return {
    lastQuery: "",
    lastSectionId: "",
    lastTopic: "",
    turnCount: 0,
  };
};

const getResponseTopic = (response: AssistantResponse | null): string => {
  if (!response || response.matchedChunks.length === 0) return "";
  return response.matchedChunks[0]?.title ?? "";
};

const getResponseSection = (response: AssistantResponse | null): string => {
  if (!response || response.matchedChunks.length === 0) return "";
  return response.matchedChunks[0]?.sectionId ?? "";
};

const publishOrbState = (detail: OrbStateEventDetail): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OrbStateEventDetail>("orb-state-change", { detail }),
  );
};

export const useOrbAssistant = (
  options: UseOrbAssistantOptions = {},
): UseOrbAssistantReturn => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [languageMode, setLanguageMode] = useState<AssistantLanguageMode>(
    options.languageMode ?? "auto",
  );
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(
    null,
  );
  const sessionMemoryRef = useRef<AssistantSessionMemory>(makeDefaultMemory());
  const engineRef = useRef<
    typeof import("@/src/lib/orb/assistantEngine.client") | null
  >(null);

  const loadEngine = useCallback(async () => {
    if (!engineRef.current) {
      engineRef.current = await import("@/src/lib/orb/assistantEngine.client");
    }
    return engineRef.current;
  }, []);

  useEffect(() => {
    if (options.preload) {
      const scheduleWarmup = () => {
        void loadEngine().then((engine) => engine.warmupAssistant());
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(scheduleWarmup, {
          timeout: 1200,
        });
        return () => window.cancelIdleCallback(handle);
      }

      const timer = globalThis.setTimeout(scheduleWarmup, 250);
      return () => globalThis.clearTimeout(timer);
    }
  }, [loadEngine, options.preload]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || orbState === "thinking" || orbState === "answering")
        return null;

      const activeLanguageMode = options.languageMode ?? languageMode;

      const disabledLanguage = parseDisabledLanguageCommand(trimmed);
      if (disabledLanguage) {
        const answer =
          disabledLanguage === "ar"
            ? "Arabic is temporarily disabled. Keeping assistant responses in English for now."
            : "French is temporarily disabled. Keeping assistant responses in English for now.";
        setLanguageMode("en");
        setMessages((prev) => [
          ...prev,
          makeMessage("user", trimmed, "en"),
          makeMessage("assistant", answer, "en"),
        ]);
        const disabledLanguageResponse: AssistantResponse = {
          answer,
          language: "en",
          confidence: 1,
          matchedChunks: [],
          actions: [{ type: "none" }],
          suggestions: [],
        };
        return disabledLanguageResponse;
      }

      const nextLanguageMode = parseLanguageCommand(trimmed);
      if (nextLanguageMode) {
        const ackLanguage: AssistantLanguage =
          nextLanguageMode === "auto"
            ? detectAssistantLanguage(trimmed)
            : nextLanguageMode;
        setLanguageMode(nextLanguageMode);
        setMessages((prev) => [
          ...prev,
          makeMessage("user", trimmed, ackLanguage),
          makeMessage(
            "assistant",
            languageModeAck(nextLanguageMode, ackLanguage),
            ackLanguage,
          ),
        ]);
        const languageModeResponse: AssistantResponse = {
          answer: languageModeAck(nextLanguageMode, ackLanguage),
          language: ackLanguage,
          confidence: 1,
          matchedChunks: [],
          actions: [{ type: "none" }],
          suggestions: [],
        };
        return languageModeResponse;
      }

      const previousResponse = lastResponse;
      const memorySnapshot = sessionMemoryRef.current;

      // Track query submission
      trackEvent("orb_query_submitted", {
        query_length: trimmed.length,
        has_context: messages.length > 0,
      });

      publishOrbState({
        state: "thinking",
        confidence: previousResponse?.confidence ?? 0,
        topic: memorySnapshot.lastTopic,
        turnCount: memorySnapshot.turnCount + 1,
      });

      setMessages((prev) => [...prev, makeMessage("user", trimmed)]);
      setOrbState("thinking");

      try {
        const engine = await loadEngine();
        const response = await engine.handleAssistantInput(trimmed, {
          lastResponse: previousResponse,
          lastQuery: memorySnapshot.lastQuery,
          turnCount: memorySnapshot.turnCount,
          languageMode: activeLanguageMode,
        });
        setLastResponse(response);
        setOrbState("answering");
        setMessages((prev) => [
          ...prev,
          makeMessage("assistant", response.answer, response.language),
        ]);

        sessionMemoryRef.current = {
          lastQuery: trimmed,
          lastSectionId: getResponseSection(response),
          lastTopic: getResponseTopic(response),
          turnCount: memorySnapshot.turnCount + 1,
        };

        publishOrbState({
          state: "answering",
          confidence: response.confidence,
          topic: sessionMemoryRef.current.lastTopic,
          turnCount: sessionMemoryRef.current.turnCount,
        });

        // Track successful response
        trackEvent("orb_search_result", {
          result_count: response.matchedChunks?.length || 0,
          search_type:
            response.matchedChunks?.length > 0 ? "semantic" : "keyword",
          confidence: Math.round(response.confidence * 100),
        });

        return response;
      } catch (error) {
        setOrbState("error");
        setMessages((prev) => [
          ...prev,
          makeMessage(
            "assistant",
            "Something went wrong. Please try again.",
            activeLanguageMode === "auto"
              ? detectAssistantLanguage(trimmed)
              : activeLanguageMode,
          ),
        ]);

        publishOrbState({
          state: "error",
          confidence: 0,
          topic: memorySnapshot.lastTopic,
          turnCount: memorySnapshot.turnCount + 1,
        });

        // Track error
        trackEvent("orb_assistant_error", {
          error_type: error instanceof Error ? error.name : "unknown",
        });

        return null;
      } finally {
        setOrbState((prev) =>
          prev === "answering" || prev === "error" ? "idle" : prev,
        );
      }
    },
    [
      languageMode,
      loadEngine,
      orbState,
      messages.length,
      lastResponse,
      options.languageMode,
    ],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setOrbState("idle");
    setLanguageMode(options.languageMode ?? "auto");
    setLastResponse(null);
    sessionMemoryRef.current = makeDefaultMemory();

    publishOrbState({
      state: "idle",
      confidence: 0,
      topic: "",
      turnCount: 0,
    });
  }, [options.languageMode]);

  return {
    messages,
    orbState,
    lastResponse,
    languageMode: options.languageMode ?? languageMode,
    send,
    reset,
  };
};
