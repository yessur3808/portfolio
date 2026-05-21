import type { WorkItem } from "@/app/(site)/_types/portfolio";

export const workData: WorkItem[] = [
  {
    title: "Operations Analytics Platform",
    subtitle: "Multi-team analytics portal",
    summary:
      "Designed and implemented a consolidated analytics workspace for support, fulfillment, and leadership teams.",
    impact:
      "Reduced report turnaround time by 40% and improved cross-team visibility.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/example/repo",
    },
  },
  {
    title: "B2B Client Onboarding Flow",
    subtitle: "Guided onboarding experience",
    summary:
      "Built a step-by-step onboarding flow with validation, progress persistence, and admin review tooling.",
    impact: "Increased onboarding completion rate by 23% within one quarter.",
    stack: ["Next.js", "React", "TypeScript", "Zod"],
    links: {
      demo: "https://example.com",
    },
  },
];
