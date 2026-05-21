import type { ExperienceItem } from "@/app/(site)/_types/portfolio";

export const experienceData: ExperienceItem[] = [
  {
    company: "Northstar Labs",
    role: "Senior Frontend Engineer",
    location: "Remote",
    period: "2023 - Present",
    highlights: [
      "Led migration to App Router and improved page load performance across core marketing pages.",
      "Built reusable UI patterns that reduced feature delivery time for new pages.",
      "Partnered with product and design to ship A/B experiments and conversion-focused updates.",
    ],
  },
  {
    company: "Atlas Systems",
    role: "Frontend Engineer",
    location: "Dubai, UAE",
    period: "2021 - 2023",
    highlights: [
      "Developed internal dashboards used daily by operations and support teams.",
      "Introduced typed component contracts that cut regressions during release cycles.",
      "Improved accessibility and responsive behavior in shared UI modules.",
    ],
  },
];
