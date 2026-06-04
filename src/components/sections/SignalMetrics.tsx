"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BrainCircuit,
  Clock3,
  Coins,
  Gauge,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/src/components/ui/Section";
import { cn } from "@/src/lib/utils";

type MetricTone = "cyan" | "blue" | "violet" | "green";

type MetricItem = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  supportingText: string;
  tone: MetricTone;
  icon: LucideIcon;
};

const METRICS: MetricItem[] = [
  {
    label: "Projects shipped",
    value: 42,
    supportingText: "Production systems delivered with measurable outcomes.",
    tone: "cyan",
    icon: Activity,
  },
  {
    label: "Years experience",
    value: 9,
    suffix: "+",
    supportingText: "Full stack engineering across fintech and platform teams.",
    tone: "blue",
    icon: Clock3,
  },
  {
    label: "APIs integrated",
    value: 130,
    suffix: "+",
    supportingText: "Internal and third-party services connected end-to-end.",
    tone: "violet",
    icon: BrainCircuit,
  },
  {
    label: "Users impacted",
    value: 280,
    suffix: "K+",
    supportingText: "Interfaces and workflows used by global operations.",
    tone: "green",
    icon: Users,
  },
  {
    label: "Cost reduced",
    value: 31,
    suffix: "%",
    supportingText:
      "Efficiency gains from system consolidation and automation.",
    tone: "cyan",
    icon: Coins,
  },
  {
    label: "Accuracy improved",
    value: 96,
    suffix: "%",
    supportingText: "Higher signal quality through robust validation layers.",
    tone: "blue",
    icon: Gauge,
  },
];

const TONE_STYLES: Record<
  MetricTone,
  { chip: string; dot: string; icon: string }
> = {
  cyan: {
    chip: "border-[rgba(34,211,238,0.34)] bg-[rgba(34,211,238,0.12)] text-[color:var(--accent-cyan)]",
    dot: "bg-[color:var(--accent-cyan)] shadow-[0_0_10px_rgba(34,211,238,0.6)]",
    icon: "text-[color:var(--accent-cyan)]",
  },
  blue: {
    chip: "border-[rgba(56,189,248,0.34)] bg-[rgba(56,189,248,0.12)] text-[color:var(--accent-blue)]",
    dot: "bg-[color:var(--accent-blue)] shadow-[0_0_10px_rgba(56,189,248,0.55)]",
    icon: "text-[color:var(--accent-blue)]",
  },
  violet: {
    chip: "border-[rgba(139,92,246,0.34)] bg-[rgba(139,92,246,0.14)] text-[color:var(--accent-violet)]",
    dot: "bg-[color:var(--accent-violet)] shadow-[0_0_10px_rgba(139,92,246,0.58)]",
    icon: "text-[color:var(--accent-violet)]",
  },
  green: {
    chip: "border-[rgba(52,211,153,0.34)] bg-[rgba(52,211,153,0.12)] text-[color:var(--accent-green)]",
    dot: "bg-[color:var(--accent-green)] shadow-[0_0_10px_rgba(52,211,153,0.58)]",
    icon: "text-[color:var(--accent-green)]",
  },
};

function formatMetric(metric: MetricItem, progress: number) {
  const value = Math.round(metric.value * progress);
  const compactValue = value >= 1000 ? value.toLocaleString() : String(value);
  return `${metric.prefix ?? ""}${compactValue}${metric.suffix ?? ""}`;
}

export default function SignalMetrics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMediaChange = () => {
      setReducedMotion(media.matches);
    };

    handleMediaChange();
    media.addEventListener("change", handleMediaChange);

    return () => {
      media.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEntered(true);
        observer.disconnect();
      },
      {
        threshold: 0.28,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasEntered) {
      return;
    }

    if (reducedMotion) {
      setProgress(1);
      return;
    }

    const durationMs = 1200;
    const start = performance.now();

    const step = (time: number) => {
      const elapsed = time - start;
      const linear = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - linear, 3);
      setProgress(eased);

      if (linear < 1) {
        frameRef.current = window.requestAnimationFrame(step);
      }
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [hasEntered, reducedMotion]);

  const displayProgress = useMemo(() => {
    if (!hasEntered) {
      return reducedMotion ? 1 : 0;
    }

    return reducedMotion ? 1 : progress;
  }, [hasEntered, progress, reducedMotion]);

  return (
    <Section
      id="metrics"
      eyebrow="Signal Metrics"
      title="Operational impact across systems, reliability, and delivery"
      description="A live mission-style snapshot of output, performance, and product impact."
      className="mission-section"
    >
      <section
        ref={sectionRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          const tone = TONE_STYLES[metric.tone];

          return (
            <article
              key={metric.label}
              className="mission-panel mission-grid-bg mission-scanline group flex h-full min-h-[12.6rem] flex-col rounded-2xl border border-[color:var(--border-soft)] p-4 transition-all duration-300 motion-reduce:transition-none hover:border-[color:var(--border-cyan)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_22px_46px_rgba(2,6,23,0.58)]"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "mission-chip px-2 py-1 text-[10px]",
                    tone.chip,
                  )}
                >
                  {metric.label}
                </span>
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[rgba(2,6,23,0.54)]",
                    tone.icon,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    tone.dot,
                    !reducedMotion && "mission-anim-pulse",
                  )}
                  aria-hidden="true"
                />
                <p
                  className="font-mono text-[1.65rem] font-semibold leading-none tracking-tight text-[color:var(--text-main)] sm:text-[1.8rem]"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatMetric(metric, displayProgress)}
                </p>
              </div>

              <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                {metric.supportingText}
              </p>
            </article>
          );
        })}
      </section>
    </Section>
  );
}
