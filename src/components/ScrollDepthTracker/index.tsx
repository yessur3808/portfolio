"use client";

import { useScrollDepth } from "@/src/hooks/useScrollDepth";

/**
 * Client component that tracks scroll depth
 * Place this in layouts to enable scroll tracking for that page
 */
export function ScrollDepthTracker() {
  useScrollDepth();
  return null;
}
