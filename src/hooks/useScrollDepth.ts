"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/src/lib/analytics";

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%)
 * Usage: useScrollDepth() in a page or layout component
 */
export function useScrollDepth() {
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackedMilestones.current.clear();

    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercent = Math.min(
        100,
        Math.round((scrolled / documentHeight) * 100),
      );

      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (
          scrollPercent >= milestone &&
          !trackedMilestones.current.has(milestone)
        ) {
          trackedMilestones.current.add(milestone);
          trackEvent("scroll_depth_milestone", {
            milestone,
            page_path: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
