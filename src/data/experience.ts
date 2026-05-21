export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};

export const experienceItems: ExperienceItem[] = [
  {
    company: "Hex Trust",
    role: "Full Stack Software Engineer",
    location: "Hong Kong",
    period: "Sep 2022 - Present",
    summary:
      "Built and maintained production full-stack systems for digital asset operations.",
    highlights: [
      "Developed backend services and frontend features for EVM-based deposits, withdrawals, staking, gas fee handling, and transaction processing.",
      "Built internal authentication, administrative, and trading tools.",
      "Contributed to system design and scalable distributed systems for wallet and digital asset platforms.",
      "Worked with Go, Node.js, React, Java, Docker, Kafka, Kubernetes, Terraform, CI/CD, Playwright, and Vitest.",
      "Produced API documentation and CLI onboarding workflows.",
      "Mentored junior engineers.",
    ],
    technologies: [
      "Go",
      "Node.js",
      "React",
      "Java",
      "Docker",
      "Kafka",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Playwright",
      "Vitest",
      "TypeScript",
      "Python",
      "Next.js",
      "MUI Design",
    ],
  },
  {
    company: "Crypto.com",
    role: "Blockchain Engineer / Full Stack Software Engineer",
    location: "Hong Kong (Remote)",
    period: "Mar 2022 - Jul 2022",
    summary:
      "Contributed to DeFi wallet workflows, internal bridging tools, and token visualization features.",
    highlights: [
      "Contributed to the Chain DeFi desktop wallet using Electron, React, and Docker.",
      "Implemented internal cross-chain bridging functionality for Cronos.",
      "Built real-time token price visualization features using D3.js for 250+ cryptocurrencies.",
      "Used TypeScript, GraphQL, Node.js, Jest, and Cypress.",
    ],
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
      "Solidity",
      "Rust",
      "ANTD Design",
      "MUI Design",
    ],
  },
  {
    company: "AI Link Group Limited / TradeFi",
    role: "Full Stack Software Engineer",
    location: "Hong Kong",
    period: "Aug 2021 - Mar 2022",
    summary:
      "Built fintech workflow systems, KYC automation, internal finance portals, and RPA tooling.",
    highlights: [
      "Rebuilt the KYC system using Node.js, Express, MongoDB, and Docker, reducing verification time by 40%.",
      "Designed an internal finance portal and RPA solutions.",
      "Redesigned database schemas.",
      "Improved CI/CD and testing using Jest and Cypress.",
      "Mentored junior engineers.",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "PostgresSQL",
      "MUI Design",
      "MongoDB",
      "Docker",
      "Jest",
      "Cypress",
      "CI/CD",
      "Python",
      "RPA",
      "PowerBI",
      "UI/UX Design",
      "Wordpress",
      "PHP",
    ],
  },
  {
    company: "South China Morning Post",
    role: "Full Stack Software Engineer",
    location: "Hong Kong",
    period: "Jul 2018 - Jul 2021",
    summary:
      "Built editorial tools, infographics, automation systems, and real-time data products.",
    highlights: [
      "Developed interactive editorial tools, infographics, and data visualizations using D3.js, JavaScript, jQuery, LoopBack.js, and Node.js.",
      "Built automation tools that reduced content production time by 70%.",
      "Developed a real-time COVID-19 tracker and reusable visualization templates.",
      "Built backend APIs, data processing workflows, and internal newsroom tools.",
    ],
    technologies: [
      "D3.js",
      "JavaScript",
      "jQuery",
      "Node.js",
      "LoopBack.js",
      "Express",
      "MySQL",
      "HTML",
      "CSS",
      "Vue",
      "AliCloud",
      "UI/UX Design",
    ],
  },
  {
    company: "PolyAsia",
    role: "Associate Systems Consultant",
    location: "Hong Kong",
    period: "Jul 2017 - Jul 2018",
    summary:
      "Delivered enterprise systems, cloud deployments, and ERP customizations.",
    highlights: [
      "Delivered enterprise systems and infrastructure solutions.",
      "Customized Microsoft ERP solutions in C#.",
      "Promoted within 3 months and led 2 developers.",
      "Managed Azure cloud deployments.",
    ],
    technologies: [
      "C#",
      "Microsoft ERP",
      "Azure",
      "Enterprise Systems",
      "HTML",
      "CSS",
      "PHP",
      "JavaScript",
      "Joomla",
      "Wordpress",
    ],
  },
];
