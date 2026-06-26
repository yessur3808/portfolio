"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/src/i18n/locale-context";
import { useOrbAssistant } from "@/src/hooks/useOrbAssistant";
import { executeActions } from "@/src/lib/orb/actionExecutor.client";
import { cn } from "@/src/lib/utils";

type AnimatedAssistantTextProps = {
  content: string;
  onDone?: () => void;
};

const AnimatedAssistantText = ({
  content,
  onDone,
}: AnimatedAssistantTextProps) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let finished = false;
    const total = content.length;
    const durationMs = Math.min(1400, Math.max(280, total * 9));
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.floor(total * eased);

      setVisibleChars((prev) => (next > prev ? next : prev));

      if (progress >= 1) {
        if (!finished) {
          finished = true;
          setVisibleChars(total);
          onDone?.();
        }
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [content, onDone]);

  return (
    <>
      {content.slice(0, visibleChars)}
      {visibleChars < content.length && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle bg-cyan-200/90" />
      )}
    </>
  );
};

const MARKDOWN_SANITIZE_SCHEMA = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
};

const ASSISTANT_MARKDOWN_CLASSNAME =
  "prose prose-invert prose-base max-w-none text-white prose-p:my-3 prose-p:text-white prose-p:leading-7 prose-p:tracking-[0.005em] prose-strong:font-bold prose-strong:text-white prose-em:text-white/95 prose-headings:mb-2 prose-headings:mt-5 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-li:pl-1 prose-li:text-white prose-li:marker:text-white/70 prose-blockquote:border-l-2 prose-blockquote:border-l-white/35 prose-blockquote:pl-4 prose-blockquote:text-white/90 prose-blockquote:italic prose-code:rounded-md prose-code:bg-white/[0.08] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-white prose-code:before:content-none prose-code:after:content-none prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-white/15 prose-pre:bg-[rgba(2,6,23,0.9)] prose-pre:p-4 prose-pre:text-white prose-table:my-4 prose-table:w-full prose-table:border-separate prose-table:border-spacing-0 prose-table:text-sm prose-th:border prose-th:border-white/15 prose-th:bg-white/[0.1] prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-white prose-td:border prose-td:border-white/15 prose-td:px-3 prose-td:py-2 prose-td:align-top prose-td:text-white prose-hr:my-5 prose-hr:border-white/20 prose-a:font-semibold prose-a:text-white prose-a:underline prose-a:decoration-2 prose-a:decoration-white/70 prose-a:underline-offset-4 hover:prose-a:text-white/90";

const USER_MESSAGE_CLASSNAME =
  "border border-cyan-200/25 bg-[rgba(34,211,238,0.16)] text-white";

const ASSISTANT_MESSAGE_CLASSNAME =
  "border border-white/15 bg-[rgba(15,23,42,0.66)] text-white";

const replaceUnderlineTokens = (segment: string): string => {
  let result = "";
  let i = 0;

  while (i < segment.length) {
    if (segment[i] === "\\" && segment.slice(i + 1, i + 3) === "++") {
      result += "++";
      i += 3;
      continue;
    }

    if (segment.slice(i, i + 2) === "++") {
      const close = segment.indexOf("++", i + 2);

      if (close !== -1) {
        const tokenContent = segment.slice(i + 2, close);
        if (tokenContent.trim().length > 0 && !tokenContent.includes("\n")) {
          result += `<u>${tokenContent}</u>`;
          i = close + 2;
          continue;
        }
      }
    }

    result += segment[i];
    i += 1;
  }

  return result;
};

const parseCustomMarkdownTokens = (content: string): string => {
  const fencedCodeBlockPattern = /(```[\s\S]*?```)/g;
  const inlineCodePattern = /(`[^`\n]*`)/g;

  return content
    .split(fencedCodeBlockPattern)
    .map((fencedSegment) => {
      if (fencedSegment.startsWith("```")) {
        return fencedSegment;
      }

      return fencedSegment
        .split(inlineCodePattern)
        .map((inlineSegment) => {
          if (inlineSegment.startsWith("`")) {
            return inlineSegment;
          }

          return replaceUnderlineTokens(inlineSegment);
        })
        .join("");
    })
    .join("");
};

const containsLikelyMarkdownSyntax = (content: string): boolean => {
  return (
    /(^|\n)#{1,6}\s+/.test(content) ||
    /(^|\n)\s*[-*+]\s+/.test(content) ||
    /(^|\n)\s*\d+\.\s+/.test(content) ||
    /\[[^\]]+\]\([^\)]+\)/.test(content) ||
    /```[\s\S]*?```/.test(content) ||
    /`[^`\n]+`/.test(content) ||
    /\*\*[^*]+\*\*/.test(content) ||
    /(^|\n)\|.*\|/.test(content) ||
    /(^|\n)>\s+/.test(content)
  );
};

const AssistantMarkdown = ({ content }: { content: string }) => {
  const parsedContent = useMemo(
    () => parseCustomMarkdownTokens(content),
    [content],
  );

  return (
    <div className={ASSISTANT_MARKDOWN_CLASSNAME}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, MARKDOWN_SANITIZE_SCHEMA]]}
        components={{
          h1: (props) => (
            <h1 {...props} className="mt-6 border-b border-white/15 pb-2" />
          ),
          h2: (props) => (
            <h2 {...props} className="mt-5 border-b border-white/10 pb-1.5" />
          ),
          h3: (props) => <h3 {...props} className="mt-4" />,
          p: (props) => <p {...props} className="text-white/95" />,
          ul: (props) => <ul {...props} className="space-y-1" />,
          ol: (props) => <ol {...props} className="space-y-1" />,
          li: (props) => <li {...props} className="leading-7" />,
          strong: (props) => (
            <strong {...props} className="font-bold text-white" />
          ),
          a: (props) => (
            <a
              {...props}
              className="break-words"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      >
        {parsedContent}
      </ReactMarkdown>
    </div>
  );
};

export const OrbChat = () => {
  const { messages: i18n, locale } = useI18n();
  const { messages, orbState, lastResponse, send, reset } = useOrbAssistant({
    preload: true,
    languageMode: locale,
  });
  const [input, setInput] = useState("");
  const [expandedSuggestionsForAnswer, setExpandedSuggestionsForAnswer] =
    useState("");
  const [completedAnimationIds, setCompletedAnimationIds] = useState<
    Record<string, true>
  >({});
  const [touchRevealId, setTouchRevealId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const hideTouchRevealTimerRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        window.clearTimeout(longPressTimerRef.current);
      }
      if (hideTouchRevealTimerRef.current) {
        window.clearTimeout(hideTouchRevealTimerRef.current);
      }
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const scheduleTouchRevealHide = () => {
    if (hideTouchRevealTimerRef.current) {
      window.clearTimeout(hideTouchRevealTimerRef.current);
    }

    hideTouchRevealTimerRef.current = window.setTimeout(() => {
      setTouchRevealId(null);
    }, 1800);
  };

  const handleTouchStartMessage = (messageId: string) => {
    clearLongPressTimer();
    if (hideTouchRevealTimerRef.current) {
      window.clearTimeout(hideTouchRevealTimerRef.current);
      hideTouchRevealTimerRef.current = null;
    }

    longPressTimerRef.current = window.setTimeout(() => {
      setTouchRevealId(messageId);
    }, 450);
  };

  const handleTouchEndMessage = () => {
    clearLongPressTimer();
    scheduleTouchRevealHide();
  };

  const handleTouchMoveMessage = () => {
    clearLongPressTimer();
  };

  const copyText = async (messageId: string, content: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = content;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedMessageId(messageId);
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 1600);
    } catch {
      setCopiedMessageId(null);
    }
  };

  const hasMessages = messages.length > 0;
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const animatingAssistantId =
    lastAssistantMessage && !completedAnimationIds[lastAssistantMessage.id]
      ? lastAssistantMessage.id
      : null;
  const suggestionsExpanded =
    !!lastResponse?.answer &&
    expandedSuggestionsForAnswer === lastResponse.answer;

  return (
    <div className="relative flex h-full flex-col overflow-hidden text-slate-100">
      {/* Messages area */}
      <div className="relative z-10 flex-1 space-y-3.5 overflow-y-auto px-4 py-5 md:px-6 md:py-5">
        {!hasMessages && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-7 text-center backdrop-blur-sm">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              {i18n.orbAssistant.welcomeTitle}
            </p>
            <p className="text-xs leading-relaxed text-white/70">
              {i18n.orbAssistant.welcomeBody}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            dir="auto"
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "group relative max-w-[85%] rounded-2xl px-4.5 py-3.5 text-start text-[15px] leading-7",
                msg.role === "user"
                  ? USER_MESSAGE_CLASSNAME
                  : ASSISTANT_MESSAGE_CLASSNAME,
              )}
              onTouchStart={() => handleTouchStartMessage(msg.id)}
              onTouchEnd={handleTouchEndMessage}
              onTouchCancel={handleTouchEndMessage}
              onTouchMove={handleTouchMoveMessage}
            >
              <button
                type="button"
                onClick={() => void copyText(msg.id, msg.content)}
                aria-label={
                  copiedMessageId === msg.id
                    ? i18n.orbAssistant.copiedMessage
                    : i18n.orbAssistant.copyMessage
                }
                title={
                  copiedMessageId === msg.id
                    ? i18n.orbAssistant.copiedMessage
                    : i18n.orbAssistant.copyMessage
                }
                className={cn(
                  "absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-[rgba(2,6,23,0.78)] text-white/90 shadow-sm transition-all",
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 focus:pointer-events-auto focus:opacity-100",
                  touchRevealId === msg.id && "pointer-events-auto opacity-100",
                )}
              >
                {copiedMessageId === msg.id ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5l2.5 2.5 6-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5.25"
                      y="4.25"
                      width="7.5"
                      height="9.5"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M3.25 10.75V3.75c0-.83.67-1.5 1.5-1.5h5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
              {msg.role === "assistant" ? (
                msg.id === animatingAssistantId &&
                !containsLikelyMarkdownSyntax(msg.content) ? (
                  <AnimatedAssistantText
                    content={msg.content}
                    onDone={() => {
                      setCompletedAnimationIds((current) => {
                        if (current[msg.id]) {
                          return current;
                        }

                        return {
                          ...current,
                          [msg.id]: true,
                        };
                      });
                    }}
                  />
                ) : (
                  <AssistantMarkdown content={msg.content} />
                )
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {orbState === "thinking" && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/15 bg-[rgba(15,23,42,0.62)] px-3 py-2">
              <div className="flex items-end gap-1.5">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/85 [animation-duration:900ms]" />
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/65 [animation-delay:140ms] [animation-duration:900ms]" />
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/45 [animation-delay:280ms] [animation-duration:900ms]" />
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
      {lastResponse?.suggestions && lastResponse.suggestions.length > 0 && (
        <>
          <div
            aria-hidden="true"
            className="relative z-10 mx-4 h-px bg-white/[0.07] md:mx-5"
          />
          <div className="relative z-10 px-4 py-2 md:px-5">
            <button
              type="button"
              onClick={() => {
                setExpandedSuggestionsForAnswer((current) =>
                  current === lastResponse.answer ? "" : lastResponse.answer,
                );
              }}
              className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/20 hover:text-white"
            >
              {i18n.orbAssistant.tryNext} (
              {Math.min(lastResponse.suggestions.length, 4)})
              <span aria-hidden="true">{suggestionsExpanded ? "-" : "+"}</span>
            </button>

            {suggestionsExpanded && (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {lastResponse.suggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    dir="auto"
                    onClick={() => void handleSubmit(suggestion)}
                    disabled={orbState === "thinking"}
                    className="w-full rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-left text-[11px] text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Input area */}
      <div
        aria-hidden="true"
        className="relative z-10 mx-4 h-px bg-white/[0.07] md:mx-5"
      />
      <div className="relative z-10 px-4 py-2.5 md:px-5">
        <div className="rounded-[1.35rem] bg-[rgba(8,15,30,0.5)] p-3.5 backdrop-blur-xl md:p-4">
          <div className="flex items-stretch gap-2">
            <textarea
              ref={composerRef}
              dir="auto"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={resizeComposer}
              onKeyDown={handleKeyDown}
              placeholder={i18n.orbAssistant.composerPlaceholder}
              aria-label={i18n.orbAssistant.askAria}
              disabled={orbState === "thinking"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-h-14 max-h-56 flex-1 resize-none rounded-2xl border-none bg-[rgba(5,10,24,0.5)] px-5 py-3 text-[15px] leading-7 text-white placeholder:text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition duration-200 focus:bg-[rgba(5,10,24,0.66)] focus:placeholder:text-slate-200 focus:ring-1 focus:ring-cyan-300/40 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.24),0_0_18px_rgba(34,211,238,0.15)] disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[3.5rem]"
            />
            <button
              type="button"
              onClick={() => void handleSubmit(input)}
              disabled={orbState === "thinking" || !input.trim()}
              aria-label={i18n.orbAssistant.sendMessageAria}
              className="inline-flex min-h-14 h-auto aspect-square self-stretch items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition-all hover:border-white/35 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-white/40 md:min-h-[3.5rem]"
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
        <div className="relative z-10 px-4 pb-2.5 md:px-5">
          <button
            type="button"
            onClick={() => reset()}
            aria-label={i18n.orbAssistant.newConversation}
            className="w-full rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/65 transition-colors hover:border-white/20 hover:text-white"
          >
            {i18n.orbAssistant.newConversation}
          </button>
        </div>
      )}
    </div>
  );
};
