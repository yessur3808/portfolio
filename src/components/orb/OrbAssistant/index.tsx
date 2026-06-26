"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/src/i18n/locale-context";
import { useOrbAssistant } from "@/src/hooks/useOrbAssistant";
import { executeActions } from "@/src/lib/orb/actionExecutor.client";

type OrbAssistantProps = {
  className?: string;
};

export const OrbAssistant = ({ className }: OrbAssistantProps) => {
  const { messages: i18n, locale } = useI18n();
  const { messages, orbState, lastResponse, send, reset } = useOrbAssistant({
    preload: true,
    languageMode: locale,
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    const response = await send(trimmed);
    if (response?.actions) {
      executeActions(response.actions);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(input);
    }
  };

  return (
    <div className={className}>
      <div aria-live="polite" className="sr-only">
        {orbState === "thinking" ? i18n.orbAssistant.thinking : ""}
      </div>

      <div role="log" aria-label={i18n.orbAssistant.conversationAria}>
        {messages.map((msg) => (
          <div key={msg.id} data-role={msg.role} dir="auto">
            {msg.content}
          </div>
        ))}
      </div>

      {lastResponse?.suggestions && lastResponse.suggestions.length > 0 && (
        <ul aria-label={i18n.orbAssistant.suggestionsAria}>
          {lastResponse.suggestions.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => void handleSubmit(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <input
          ref={inputRef}
          dir="auto"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={i18n.orbAssistant.placeholder}
          aria-label={i18n.orbAssistant.askAria}
          disabled={orbState === "thinking"}
        />
        <button
          type="button"
          onClick={() => void handleSubmit(input)}
          disabled={orbState === "thinking" || !input.trim()}
          aria-label={i18n.orbAssistant.sendAria}
        >
          {i18n.orbAssistant.send}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={i18n.orbAssistant.resetAria}
        >
          {i18n.orbAssistant.reset}
        </button>
      </div>
    </div>
  );
};
