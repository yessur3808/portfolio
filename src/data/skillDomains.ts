export type SkillDomain = {
  id: string;
  title: string;
  confidence: number;
  keyTools: string[];
  impactHeadline: string;
  details: {
    scope: string;
    patterns: string[];
    outcomes: string[];
  };
};

export const skillDomains: SkillDomain[] = [
  {
    id: "frontend",
    title: "UI Systems and Frontend Delivery",
    confidence: 5,
    keyTools: ["React", "Next.js", "TypeScript", "D3.js", "Tailwind CSS"],
    impactHeadline:
      "Shipped data-heavy interfaces used by 100K+ users with fast interaction performance.",
    details: {
      scope:
        "Build expressive product interfaces that stay maintainable under constant iteration and cross-team delivery pressure.",
      patterns: [
        "Composable component architecture",
        "Client/server rendering boundaries",
        "Accessibility-first interaction design",
        "Progressive enhancement for complex UI",
        "Performance budgets and code-splitting",
      ],
      outcomes: [
        "Reduced rendering bottlenecks in dashboard views",
        "Standardized reusable UI patterns across teams",
        "Improved first-load and interaction consistency",
      ],
    },
  },
  {
    id: "backend",
    title: "Backend Platforms and APIs",
    confidence: 5,
    keyTools: ["Node.js", "Go", "GraphQL", "REST", "Kafka"],
    impactHeadline:
      "Architected backend services powering high-volume transaction and operational workflows.",
    details: {
      scope:
        "Design reliable service boundaries and API contracts that support rapid product growth without operational fragility.",
      patterns: [
        "Contract-first API design",
        "Service decomposition and boundary ownership",
        "Idempotent job and event handling",
        "Observability for production debugging",
        "Backward-compatible API evolution",
      ],
      outcomes: [
        "Improved service reliability under peak load",
        "Enabled faster onboarding for internal consumers",
        "Reduced change risk through contract discipline",
      ],
    },
  },
  {
    id: "data",
    title: "Data Architecture and Performance",
    confidence: 4,
    keyTools: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Query Optimization",
      "Indexing",
    ],
    impactHeadline:
      "Drove measurable latency reductions through indexing, caching, and query strategy refinement.",
    details: {
      scope:
        "Shape data models and query paths that scale with product complexity while preserving correctness and developer velocity.",
      patterns: [
        "Schema design for workload fit",
        "Query plan inspection and optimization",
        "Caching and invalidation strategy",
        "Data lifecycle and retention decisions",
        "Read/write path separation",
      ],
      outcomes: [
        "Lowered median and tail latency in critical endpoints",
        "Improved stability during data growth phases",
        "Reduced operational incidents from query regressions",
      ],
    },
  },
  {
    id: "infrastructure",
    title: "Infrastructure and Delivery Engineering",
    confidence: 4,
    keyTools: ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD"],
    impactHeadline:
      "Automated releases and infrastructure workflows to shorten delivery cycles dramatically.",
    details: {
      scope:
        "Build deployable systems with repeatable environments, strong release confidence, and actionable production telemetry.",
      patterns: [
        "Infrastructure as code",
        "Environment parity across stages",
        "Progressive rollout and rollback safety",
        "Build pipeline optimization",
        "Cost-aware scaling decisions",
      ],
      outcomes: [
        "Cut release friction and manual deployment effort",
        "Improved platform resilience during rollout windows",
        "Raised confidence in daily delivery cadence",
      ],
    },
  },
  {
    id: "quality",
    title: "Quality Engineering and Testing",
    confidence: 4,
    keyTools: ["Playwright", "Jest", "Cypress", "Integration Tests", "Vitest"],
    impactHeadline:
      "Implemented multi-layer testing strategy to protect critical user and ops flows.",
    details: {
      scope:
        "Balance shipping speed with reliability through layered tests, clear quality gates, and regression-focused automation.",
      patterns: [
        "Risk-based test planning",
        "Contract and integration verification",
        "End-to-end path coverage",
        "Test data and fixture strategy",
        "CI quality gate enforcement",
      ],
      outcomes: [
        "Improved release confidence across teams",
        "Caught high-impact regressions earlier in CI",
        "Reduced time spent on repetitive manual QA",
      ],
    },
  },
  {
    id: "leadership",
    title: "Architecture Leadership and Mentorship",
    confidence: 4,
    keyTools: [
      "System Design",
      "RFCs",
      "Code Review",
      "Mentoring",
      "Documentation",
    ],
    impactHeadline:
      "Led technical direction and engineering standards adopted by multiple teams.",
    details: {
      scope:
        "Translate product goals into durable technical decisions while enabling engineers to ship with clarity and ownership.",
      patterns: [
        "Architecture decision records",
        "Cross-team design alignment",
        "Mentorship through implementation review",
        "Incident learning and postmortem culture",
        "Technical documentation as leverage",
      ],
      outcomes: [
        "Raised implementation quality and design consistency",
        "Accelerated growth of mid-level engineers",
        "Reduced long-term maintenance overhead",
      ],
    },
  },
];
