"use client";

import { useRef, useEffect, useState } from "react";
import { useOrbAssistant } from "@/src/hooks/useOrbAssistant";
import { executeActions } from "@/src/lib/orb/actionExecutor.client";
import { cn } from "@/src/lib/utils";

export function OrbChat() {
  const { messages, orbState, lastResponse, send, reset } = useOrbAssistant({
    preload: true,
  });
  const [input, setInput] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    if (composerRef.current) {
      composerRef.current.style.height = "auto";
    }
    await send(trimmed);
  };

  const resizeComposer = () => {
    const composer = composerRef.current;
    if (!composer) return;

    composer.style.height = "auto";
    composer.style.height = `${composer.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(input);
    }
  };

  useEffect(() => {
    if (lastResponse?.actions) {
      executeActions(lastResponse.actions);
    }
  }, [lastResponse]);

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden text-slate-100">
      {/* Messages area */}
      <div className="relative z-10 flex-1 space-y-3.5 overflow-y-auto px-4 py-5 md:px-6 md:py-5">
        {!hasMessages && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-7 text-center backdrop-blur-sm">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/70">
              Ask me anything
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              About my projects, experience, skills, or how I can help your
              team.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "border border-cyan-300/20 bg-[rgba(34,211,238,0.14)] text-cyan-50"
                  : "border border-white/10 bg-[rgba(15,23,42,0.52)] text-slate-200",
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {orbState === "thinking" && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.56)] px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/70" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/50 [animation-delay:120ms]" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/40 [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Divider */}
      {hasMessages && (
        <div
          aria-hidden="true"
          className="relative z-10 mx-0 h-px bg-white/[0.06]"
        />
      )}

      {/* Suggestions */}
      {!hasMessages &&
        lastResponse?.suggestions &&
        lastResponse.suggestions.length > 0 && (
          <>
            <div
              aria-hidden="true"
              className="relative z-10 mx-4 h-px bg-white/[0.07] md:mx-5"
            />
            <div className="relative z-10 space-y-2 px-4 py-3 md:px-5">
              {lastResponse.suggestions.slice(0, 3).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void handleSubmit(suggestion)}
                  disabled={orbState === "thinking"}
                  className="w-full rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 transition-all hover:border-cyan-300/30 hover:bg-cyan-400/[0.1] hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}

      {/* Input area */}
      <div
        aria-hidden="true"
        className="relative z-10 mx-4 h-px bg-white/[0.07] md:mx-5"
      />
      <div className="relative z-10 px-4 py-3 md:px-5">
        <div className="rounded-[1.35rem] bg-[rgba(8,15,30,0.5)] p-3.5 backdrop-blur-xl md:p-4">
          <div className="flex items-end gap-2.5">
            <textarea
              ref={composerRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={resizeComposer}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              aria-label="Ask the assistant"
              disabled={orbState === "thinking"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-h-16 max-h-56 flex-1 resize-none rounded-2xl border-none bg-[rgba(5,10,24,0.44)] px-4 py-3.5 text-[15px] leading-6 text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition duration-200 focus:bg-[rgba(5,10,24,0.6)] focus:placeholder:text-slate-300 focus:ring-1 focus:ring-cyan-300/35 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_18px_rgba(34,211,238,0.14)] disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[4.5rem]"
            />
            <button
              type="button"
              onClick={() => void handleSubmit(input)}
              disabled={orbState === "thinking" || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 text-cyan-100 transition-all hover:border-cyan-200/40 hover:bg-cyan-400/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 md:h-13 md:w-13"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8h11m0 0l-4-4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reset button */}
      {hasMessages && (
        <div className="relative z-10 px-4 pb-3 md:px-5">
          <button
            type="button"
            onClick={() => reset()}
            aria-label="Start a new conversation"
            className="w-full rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-slate-400 transition-colors hover:border-cyan-400/25 hover:text-cyan-200"
          >
            New conversation
          </button>
        </div>
      )}
    </div>
  );
}
