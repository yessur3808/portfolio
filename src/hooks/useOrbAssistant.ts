"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AssistantMessage,
  AssistantResponse,
  OrbState,
} from "@/src/lib/orb/types";

type UseOrbAssistantOptions = {
  preload?: boolean;
};

type UseOrbAssistantReturn = {
  messages: AssistantMessage[];
  orbState: OrbState;
  lastResponse: AssistantResponse | null;
  send: (text: string) => Promise<void>;
  reset: () => void;
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeMessage(
  role: AssistantMessage["role"],
  content: string,
): AssistantMessage {
  return { id: makeId(), role, content, createdAt: new Date() };
}

export function useOrbAssistant(
  options: UseOrbAssistantOptions = {},
): UseOrbAssistantReturn {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(
    null,
  );
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
      void loadEngine().then((engine) => engine.warmupAssistant());
    }
  }, [loadEngine, options.preload]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || orbState === "thinking" || orbState === "answering")
        return;

      setMessages((prev) => [...prev, makeMessage("user", trimmed)]);
      setOrbState("thinking");

      try {
        const engine = await loadEngine();
        const response = await engine.handleAssistantInput(trimmed);
        setLastResponse(response);
        setOrbState("answering");
        setMessages((prev) => [
          ...prev,
          makeMessage("assistant", response.answer),
        ]);
      } catch {
        setOrbState("error");
        setMessages((prev) => [
          ...prev,
          makeMessage("assistant", "Something went wrong. Please try again."),
        ]);
      } finally {
        setOrbState((prev) =>
          prev === "answering" || prev === "error" ? "idle" : prev,
        );
      }
    },
    [loadEngine, orbState],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setOrbState("idle");
    setLastResponse(null);
  }, []);

  return { messages, orbState, lastResponse, send, reset };
}
