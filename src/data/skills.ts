export type Skill = {
  name: string;
  featured?: boolean;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

const featuredSkills = new Set([
  "Go",
  "TypeScript",
  "React",
  "Node.js",
  "GraphQL",
  "Kafka",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Playwright",
  "D3.js",
]);

const toSkill = (name: string): Skill => {
  return featuredSkills.has(name) ? { name, featured: true } : { name };
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: ["Go", "TypeScript", "JavaScript", "Python", "SQL", "Java"].map(
      toSkill,
    ),
  },
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Electron",
      "D3.js",
      "HTML",
      "CSS",
      "SASS",
      "SCSS",
      "LESS",
      "jQuery",
    ].map(toSkill),
  },
  {
    title: "Backend",
    skills: [
      "Node.js",
      "Express",
      "GraphQL",
      "REST APIs",
      "Microservices",
      "gRPC",
      "JSON-RPC",
      "Kafka",
    ].map(toSkill),
  },
  {
    title: "Testing",
    skills: [
      "Unit Testing",
      "Integration Testing",
      "End-to-End Testing",
      "Jest",
      "Cypress",
      "Playwright",
      "Vitest",
    ].map(toSkill),
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB"].map(toSkill),
  },
  {
    title: "Cloud / DevOps / Tools",
    skills: [
      "AWS",
      "Azure",
      "AliCloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Monitoring & Logging Tools",
      "Git",
      "GitHub",
      "GitLab",
      "Bash",
      "Linux",
    ].map(toSkill),
  },
];
