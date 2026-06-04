"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Globe2 } from "lucide-react";

import { experienceItems } from "@/src/data/experience";

import { Card } from "@/src/components/ui/Card";
import { Section } from "@/src/components/ui/Section";

type NodePoint = {
  x: number;
  y: number;
};

type ExperienceItem = (typeof experienceItems)[number];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type TimelineCardProps = {
  item: ExperienceItem;
  isDesktopTrack: boolean;
  isCurrent: boolean;
};

const TimelineCard = memo(function TimelineCard({
  item,
  isDesktopTrack,
  isCurrent,
}: TimelineCardProps) {
  const itemId = `${item.company}-${item.period}`;

  return (
    <li
      className={`relative ${isDesktopTrack ? "w-[min(31rem,calc(100vw-7rem))] flex-none md:h-[calc(100vh-13rem)]" : ""}`}
    >
      <Card
        className={`mission-panel glass-liquid group relative h-full overflow-hidden border-0 p-4 transition-all duration-300 sm:p-6 ${isCurrent ? "shadow-[0_30px_70px_rgb(2_6_23/0.72)]" : ""}`}
      >
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
        <article className="relative flex h-full min-h-0 flex-col space-y-4">
          <header className="space-y-2 pb-3 pt-3">
            <div className="space-y-1.5">
              <span className="block text-[16px] font-semibold uppercase tracking-[0.16em] text-blue-200/90">
                {item.role}
              </span>

              <p className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                {item.company}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Globe2
                    className="h-3.5 w-3.5 text-blue-300/85"
                    aria-hidden="true"
                  />
                  <span>{item.location}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays
                    className="h-3.5 w-3.5 text-blue-300/85"
                    aria-hidden="true"
                  />
                  <span>{item.period}</span>
                </span>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-3 pr-1">
            <section
              aria-label={`${item.company} highlights`}
              id={`${itemId}-details`}
              className="space-y-2"
            >
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Key Points
              </h4>
              <ul className="space-y-1.5 text-[15px] leading-5 text-slate-300">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 before:mt-1.5 before:h-1.25 before:w-1.25 before:shrink-0 before:rounded-full before:bg-blue-300/75 before:content-['']"
                  >
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-label={`${item.company} technologies`}
              className="space-y-1.5"
            >
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Tech
              </h4>
              <p className="text-[13px] leading-5 text-slate-400">
                {item.technologies.join(" · ")}
              </p>
            </section>
          </div>
        </article>
      </Card>
    </li>
  );
});

export default function Experience() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pinHeight, setPinHeight] = useState(1200);
  const [translateStart, setTranslateStart] = useState(0);
  const [translateDistance, setTranslateDistance] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [nodePoints, setNodePoints] = useState<NodePoint[]>([]);

  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const metricsRef = useRef({
    scrollDistance: 0,
    sectionStart: 0,
  });
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const SCROLL_SLOWDOWN = 2.75;
  const SCROLL_EASING = 0.16;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setPrefersReducedMotion(media.matches);
    };

    onChange();
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const updateTargetProgress = () => {
      if (window.innerWidth < 768 || metricsRef.current.scrollDistance <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const rawProgress =
        (window.scrollY - metricsRef.current.sectionStart) /
        metricsRef.current.scrollDistance;

      targetProgressRef.current = clamp(rawProgress, 0, 1);
    };

    const animateProgress = () => {
      const delta = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(delta) < 0.0007) {
        currentProgressRef.current = targetProgressRef.current;
        setScrollProgress(currentProgressRef.current);
        isAnimatingRef.current = false;
        animationFrameRef.current = 0;
        return;
      }

      currentProgressRef.current += delta * SCROLL_EASING;
      setScrollProgress(currentProgressRef.current);
      animationFrameRef.current = window.requestAnimationFrame(animateProgress);
    };

    const startAnimation = () => {
      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;
      animationFrameRef.current = window.requestAnimationFrame(animateProgress);
    };

    const scheduleUpdate = () => {
      updateTargetProgress();

      if (prefersReducedMotion) {
        currentProgressRef.current = targetProgressRef.current;
        setScrollProgress(targetProgressRef.current);
        return;
      }

      startAnimation();
    };

    const measure = () => {
      const pinSection = pinSectionRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;

      if (!pinSection || !sticky || !track) {
        return;
      }

      if (window.innerWidth < 768) {
        metricsRef.current = { scrollDistance: 0, sectionStart: 0 };
        setPinHeight(window.innerHeight + 240);
        setTranslateStart(0);
        setTranslateDistance(0);
        setTrackWidth(0);
        setNodePoints([]);
        targetProgressRef.current = 0;
        currentProgressRef.current = 0;
        setScrollProgress(0);
        return;
      }

      const trackItems = Array.from(track.children) as HTMLElement[];
      const firstItem = trackItems[0];
      const lastItem = trackItems[trackItems.length - 1];

      if (!firstItem || !lastItem) {
        return;
      }

      const viewportCenter = sticky.clientWidth / 2;
      const firstCenter = firstItem.offsetLeft + firstItem.offsetWidth / 2;
      const lastCenter = lastItem.offsetLeft + lastItem.offsetWidth / 2;

      const startTranslate = firstCenter - viewportCenter;
      const endTranslate = lastCenter - viewportCenter;
      const timelineTranslateDistance = Math.max(
        endTranslate - startTranslate,
        0,
      );
      const scrollDistance = timelineTranslateDistance * SCROLL_SLOWDOWN;
      const sectionTop =
        window.scrollY + pinSection.getBoundingClientRect().top;
      const stickyTop = 112;

      metricsRef.current = {
        scrollDistance,
        sectionStart: sectionTop - stickyTop,
      };

      setPinHeight(window.innerHeight + scrollDistance + 180);
      setTranslateStart(startTranslate);
      setTranslateDistance(timelineTranslateDistance);
      setTrackWidth(track.scrollWidth);
      setNodePoints(
        Array.from(track.children).map((child) => {
          const element = child as HTMLElement;
          return {
            x: element.offsetLeft + element.offsetWidth / 2,
            y: 34,
          };
        }),
      );

      updateTargetProgress();
      currentProgressRef.current = targetProgressRef.current;
      setScrollProgress(currentProgressRef.current);
    };

    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      isAnimatingRef.current = false;
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [prefersReducedMotion]);

  const activeStep = scrollProgress * Math.max(experienceItems.length - 1, 0);
  const translateX = translateStart + translateDistance * scrollProgress;

  const getTimelineCard = useCallback(
    (item: ExperienceItem, index: number, isDesktopTrack = false) => {
      return (
        <TimelineCard
          key={`${item.company}-${item.period}`}
          item={item}
          isDesktopTrack={isDesktopTrack}
          isCurrent={Math.round(activeStep) === index}
        />
      );
    },
    [activeStep],
  );

  return (
    <Section
      id="experience"
      eyebrow="CAREER TIMELINE"
      description="Selected roles and key contributions. Review the timeline as you scroll."
    >
      <div
        ref={pinSectionRef}
        className="relative left-1/2 hidden w-screen -translate-x-1/2 md:block"
        style={{ height: pinHeight }}
      >
        <div
          ref={stickyRef}
          className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-hidden rounded-none bg-slate-950/12 px-0 py-5 lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:py-6"
        >
          <p className="pointer-events-none absolute right-8 top-2 z-10 text-[11px] tracking-[0.08em] text-slate-400/90">
            Scroll to move through the timeline
          </p>
          <div className="relative overflow-hidden pt-16">
            {nodePoints.length > 1 ? (
              <svg
                className="pointer-events-none absolute left-0 top-0 h-16"
                width={trackWidth}
                viewBox={`0 0 ${trackWidth} 68`}
                aria-hidden="true"
                style={{ transform: `translate3d(${-translateX}px, 0, 0)` }}
              >
                {nodePoints.slice(0, -1).map((point, index) => {
                  const nextPoint = nodePoints[index + 1];
                  const segmentProgress = clamp(activeStep - index, 0, 1);
                  const drawX =
                    point.x + (nextPoint.x - point.x) * segmentProgress;

                  return (
                    <g key={`segment-${point.x}-${nextPoint.x}`}>
                      <path
                        d={`M ${point.x} ${point.y} C ${point.x + 80} ${point.y - 28}, ${nextPoint.x - 80} ${nextPoint.y + 28}, ${nextPoint.x} ${nextPoint.y}`}
                        fill="none"
                        stroke="rgba(147, 197, 253, 0.72)"
                        strokeWidth="2"
                        strokeDasharray="999"
                        strokeDashoffset={999 - 999 * segmentProgress}
                        pathLength={999}
                      />
                      <circle
                        cx={drawX}
                        cy={point.y + (nextPoint.y - point.y) * segmentProgress}
                        r="4"
                        fill="rgba(219, 234, 254, 0.95)"
                      />
                    </g>
                  );
                })}

                {nodePoints.map((point, index) => {
                  const isReached = activeStep >= index - 0.08;
                  return (
                    <g key={`node-${point.x}-${index}`}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="12"
                        fill={
                          isReached
                            ? "rgba(96, 165, 250, 0.14)"
                            : "rgba(51, 65, 85, 0.18)"
                        }
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isReached ? "4.5" : "3.2"}
                        fill={
                          isReached
                            ? "rgba(219, 234, 254, 0.95)"
                            : "rgba(148, 163, 184, 0.55)"
                        }
                      />
                    </g>
                  );
                })}
              </svg>
            ) : null}

            <ol
              ref={trackRef}
              className="relative flex items-stretch gap-6 will-change-transform"
              aria-label="Professional experience timeline"
              style={{ transform: `translate3d(${-translateX}px, 0, 0)` }}
            >
              {experienceItems.map((item, index) =>
                getTimelineCard(item, index, true),
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        <ol
          className="space-y-4"
          aria-label="Professional experience timeline mobile view"
        >
          {experienceItems.map((item, index) => getTimelineCard(item, index))}
        </ol>
      </div>
    </Section>
  );
}
