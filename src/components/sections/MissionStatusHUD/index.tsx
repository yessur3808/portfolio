"use client";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/src/i18n/locale-context";
import { cn } from "@/src/lib/utils";

type MissionStatusHUDProps = {
  className?: string;
};

type StatusRow = {
  label: string;
  value: string;
  dotStyle: {
    background: string;
    boxShadow: string;
  };
};

const randInt = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const DOT_CYAN = {
  background: "rgba(34, 211, 238, 0.92)",
  boxShadow: "0 0 10px rgba(34, 211, 238, 0.6)",
};

const DOT_BLUE = {
  background: "rgba(56, 189, 248, 0.92)",
  boxShadow: "0 0 10px rgba(56, 189, 248, 0.56)",
};

const DOT_GREEN = {
  background: "rgba(52, 211, 153, 0.94)",
  boxShadow: "0 0 10px rgba(52, 211, 153, 0.54)",
};

const DOT_VIOLET = {
  background: "rgba(139, 92, 246, 0.9)",
  boxShadow: "0 0 10px rgba(139, 92, 246, 0.56)",
};

const MissionStatusHUD = ({ className }: MissionStatusHUDProps) => {
  const { messages } = useI18n();
  const [latencyMs, setLatencyMs] = useState(24);
  const [signalsProcessed, setSignalsProcessed] = useState(48231);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const flashTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setReducedMotion(media.matches);
    };

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => {
      media.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setLatencyMs((prev) => clamp(prev + randInt(-2, 2), 18, 39));
      setSignalsProcessed((prev) => prev + randInt(14, 68));
      setIsUpdating(true);

      if (flashTimeoutRef.current !== null) {
        window.clearTimeout(flashTimeoutRef.current);
      }

      flashTimeoutRef.current = window.setTimeout(() => {
        setIsUpdating(false);
      }, 320);
    }, 2200);

    return () => {
      window.clearInterval(interval);
      if (flashTimeoutRef.current !== null) {
        window.clearTimeout(flashTimeoutRef.current);
      }
    };
  }, [reducedMotion]);

  const rows: StatusRow[] = [
    {
      label: messages.missionStatusHud.rows.aiEngine,
      value: messages.missionStatusHud.rows.online,
      dotStyle: DOT_GREEN,
    },
    {
      label: messages.missionStatusHud.rows.riskLayer,
      value: messages.missionStatusHud.rows.monitoring,
      dotStyle: DOT_CYAN,
    },
    {
      label: messages.missionStatusHud.rows.dataPipeline,
      value: messages.missionStatusHud.rows.synced,
      dotStyle: DOT_BLUE,
    },
    {
      label: messages.missionStatusHud.rows.signalLatency,
      value: `${latencyMs}ms`,
      dotStyle: DOT_VIOLET,
    },
    {
      label: messages.missionStatusHud.rows.systemUptime,
      value: "99.98%",
      dotStyle: DOT_GREEN,
    },
  ];

  return (
    <section
      aria-label={messages.missionStatusHud.ariaLabel}
      className={cn(
        "mission-panel relative z-20 rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(2,6,23,0.72)] p-3.5 sm:p-4",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="mission-label text-[10px] tracking-[0.18em]">
          {messages.missionStatusHud.title}
        </p>
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-muted)] transition-colors duration-300",
            !reducedMotion && isUpdating && "text-[color:var(--accent-cyan)]",
          )}
        >
          {reducedMotion
            ? messages.missionStatusHud.stable
            : messages.missionStatusHud.live}
        </p>
      </div>

      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[rgba(15,23,42,0.48)] px-2.5 py-2 text-[11px] sm:text-[12px]"
          >
            <span className="flex min-w-0 items-center gap-2 text-[color:var(--text-main)]/88">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  !reducedMotion && "mission-anim-pulse",
                )}
                style={row.dotStyle}
                aria-hidden="true"
              />
              <span className="truncate">{row.label}</span>
            </span>
            <span
              className={cn(
                "font-mono text-[10px] tracking-[0.08em] text-[color:var(--text-main)] sm:text-[11px] transition-colors duration-300",
                !reducedMotion &&
                  isUpdating &&
                  row.label === messages.missionStatusHud.rows.signalLatency
                  ? "text-[color:var(--accent-cyan)]"
                  : "",
              )}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-2.5 flex items-center justify-between border-t border-[rgba(148,163,184,0.15)] pt-2 text-[10px] text-[color:var(--text-muted)]">
        <span className="font-mono uppercase tracking-[0.14em]">
          {messages.missionStatusHud.signals}
        </span>
        <span
          className={cn(
            "font-mono tracking-[0.08em] transition-colors duration-300",
            !reducedMotion && isUpdating && "text-[color:var(--accent-blue)]",
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {signalsProcessed.toLocaleString()}
        </span>
      </div>
    </section>
  );
};

export default MissionStatusHUD;
