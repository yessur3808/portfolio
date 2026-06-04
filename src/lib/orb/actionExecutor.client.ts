"use client";

// Browser-only. Do not import in Server Components or server utilities.

import type { AssistantAction } from "./types";

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function scrollToSection(targetId: string): void {
  if (!isBrowserRuntime()) return;
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function highlightSection(targetId: string, durationMs = 1800): void {
  if (!isBrowserRuntime()) return;
  const el = document.getElementById(targetId);
  if (!el) return;

  el.classList.add("orb-highlight");
  window.setTimeout(() => {
    el.classList.remove("orb-highlight");
  }, durationMs);
}

function triggerDownload(href: string, filename?: string): void {
  if (!isBrowserRuntime()) return;
  const a = document.createElement("a");
  a.href = href;
  if (filename) a.download = filename;
  a.rel = "noopener noreferrer";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function openLink(href: string, newTab = true): void {
  if (!isBrowserRuntime()) return;
  if (newTab) {
    window.open(href, "_blank", "noopener,noreferrer");
  } else {
    window.location.assign(href);
  }
}

export async function executeAssistantAction(
  action: AssistantAction,
): Promise<void> {
  if (!isBrowserRuntime()) return;

  switch (action.type) {
    case "scroll":
      scrollToSection(action.targetId);
      break;
    case "highlight":
      highlightSection(action.targetId, action.durationMs);
      break;
    case "download":
      triggerDownload(action.href, action.filename);
      break;
    case "open":
      openLink(action.href, action.newTab);
      break;
    case "none":
      break;
  }
}

export async function executeAssistantActions(
  actions: AssistantAction[],
): Promise<void> {
  for (const action of actions) {
    await executeAssistantAction(action);
  }
}

// Add this globally (for example in app/globals.css) to visualize highlights.
export const ORB_HIGHLIGHT_CSS = `.orb-highlight {
  outline: 2px solid rgba(34, 211, 238, 0.95);
  outline-offset: 4px;
  box-shadow: 0 0 0 6px rgba(34, 211, 238, 0.16);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, outline-color 0.2s ease;
}`;

/** @deprecated Use executeAssistantAction instead. */
export const executeAction = executeAssistantAction;

/** @deprecated Use executeAssistantActions instead. */
export const executeActions = executeAssistantActions;
