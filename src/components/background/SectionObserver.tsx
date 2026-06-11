"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/src/lib/analytics";

/**
 * Watches scroll position and writes the id of the currently-visible section
 * to `document.documentElement.dataset.section`.  This drives the
 * `html[data-section="..."]` CSS selectors that update the AiOrb color variables.
 */
const SECTION_IDS = [
  "about",
  "experience",
  "work",
  "stack",
  "metrics",
  "contact",
] as const;

export default function SectionObserver() {
  const prevSectionRef = useRef<string>("");

  useEffect(() => {
    let frameId = 0;

    const detect = () => {
      const threshold = window.scrollY + window.innerHeight * 0.38;
      let active = "";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= threshold) active = id;
      }

      if (active && document.documentElement.dataset.section !== active) {
        document.documentElement.dataset.section = active;

        if (active !== prevSectionRef.current) {
          prevSectionRef.current = active;
          trackEvent("section_view", {
            section_name: active,
            scroll_position: Math.round(window.scrollY),
          });
        }
      }
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        detect();
      });
    };

    detect();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
