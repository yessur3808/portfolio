export type CaseStudy = {
  id: string;
  title: string;
  summary: string;
  description: string;
  impact: string;
  technologies: string[];
  themes: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "defi-wallet-workflows-and-token-visualizations",
    title: "DeFi Wallet Workflows and Token Visualizations",
    summary:
      "Wallet workflows, internal Cronos bridging tools, and token visualization features.",
    description:
      "Contributed to desktop wallet experiences, cross-chain bridging functionality, and real-time token price visualization for 250+ cryptocurrencies.",
    impact: "Improved wallet usability and market visibility.",
    technologies: [
      "Electron",
      "React",
      "TypeScript",
      "GraphQL",
      "Node.js",
      "Docker",
      "D3.js",
      "Jest",
      "Cypress",
    ],
    themes: ["Blockchain", "Wallet UX", "Data Visualization"],
  },
  {
    id: "kyc-automation-and-finance-portal",
    title: "KYC Automation and Finance Portal",
    summary: "Fintech onboarding and finance operations tooling.",
    description:
      "Rebuilt a KYC platform, improved client onboarding workflows, designed finance portal features, and streamlined internal operations.",
    impact: "Reduced verification time by 40%.",
    technologies: [
      "Node.js",
      "Express",
      "MongoDB",
      "Docker",
      "Jest",
      "Cypress",
      "CI/CD",
    ],
    themes: ["Fintech", "Automation", "Workflow Optimization"],
  },
  {
    id: "editorial-visualization-and-newsroom-tooling",
    title: "Editorial Visualization and Newsroom Tooling",
    summary:
      "Interactive graphics, automation tools, and real-time data products.",
    description:
      "Built editorial visualizations, automation systems, reusable infographic templates, backend APIs, and a real-time COVID-19 tracker.",
    impact: "Reduced content production time by 70%.",
    technologies: [
      "D3.js",
      "JavaScript",
      "jQuery",
      "Node.js",
      "LoopBack.js",
      "HTML",
      "CSS",
    ],
    themes: ["Data Visualization", "Media", "Automation", "High-Traffic Web"],
  },
];
