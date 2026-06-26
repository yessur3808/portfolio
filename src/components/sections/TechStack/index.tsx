"use client";

import { Section } from "@/src/components/ui/Section";
import { skillGroups } from "@/src/data/skills";
import { useI18n } from "@/src/i18n/locale-context";

type CapabilityModule = {
  id: string;
  title: string;
  categories: string[];
};

const capabilityModules: CapabilityModule[] = [
  {
    id: "interface-systems",
    title: "Interface Systems",
    categories: ["Frontend"],
  },
  {
    id: "application-architecture",
    title: "Application Architecture",
    categories: ["Languages", "Testing"],
  },
  {
    id: "backend-services",
    title: "Backend Services",
    categories: ["Backend"],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud / Infrastructure",
    categories: ["Cloud / DevOps / Tools"],
  },
  {
    id: "data-workflows",
    title: "Data Workflows",
    categories: ["Databases"],
  },
  {
    id: "digital-assets-fintech",
    title: "Digital Assets / Fintech",
    categories: ["Backend", "Languages", "Cloud / DevOps / Tools"],
  },
];

const fintechFocusSet = new Set([
  "Go",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "REST APIs",
  "gRPC",
  "JSON-RPC",
  "Kafka",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "Monitoring & Logging Tools",
]);

const getSkillsByCategory = (category: string) => {
  return skillGroups.find((group) => group.title === category)?.skills ?? [];
};

const getModuleSkills = (module: CapabilityModule) => {
  if (module.id === "digital-assets-fintech") {
    return skillGroups
      .flatMap((group) => group.skills)
      .filter((skill) => fintechFocusSet.has(skill.name))
      .filter(
        (skill, index, list) =>
          list.findIndex((item) => item.name === skill.name) === index,
      );
  }

  return module.categories
    .flatMap((category) => getSkillsByCategory(category))
    .filter(
      (skill, index, list) =>
        list.findIndex((item) => item.name === skill.name) === index,
    );
};

const TechStack = () => {
  const { messages, isRTL } = useI18n();
  return (
    <Section
      id="stack"
      eyebrow={messages.techStackSection.eyebrow}
      title={messages.techStackSection.title}
      description={messages.techStackSection.description}
      className="mission-section"
    >
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {capabilityModules.map((module, index) => {
          const skills = getModuleSkills(module);

          return (
            <article
              key={module.id}
              className="mission-panel mission-grid-bg mission-scanline group flex h-full flex-col rounded-3xl border border-[color:var(--border-soft)] p-5 transition-all duration-200 motion-reduce:transition-none hover:border-[color:var(--border-cyan)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_22px_48px_rgba(2,6,23,0.56)]"
            >
              <header className="mb-4 space-y-2 border-b border-[color:var(--border-soft)]/80 pb-3">
                <div
                  className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}
                >
                  <span className="mission-label text-[10px]">
                    {messages.techStackSection.module}{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-[rgba(34,211,238,0.45)]"
                  />
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_8px_rgba(34,211,238,0.62)]"
                  />
                </div>
                <h3 className="text-base font-semibold leading-tight text-[color:var(--text-main)]">
                  {module.title}
                </h3>
                <p className="break-words text-xs uppercase leading-5 tracking-[0.12em] text-[color:var(--text-muted)] sm:text-[11px]">
                  {messages.techStackSection.categories}:{" "}
                  {module.categories.join(" · ")}
                </p>
              </header>

              <div className="mt-auto flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={`${module.id}-${skill.name}`}
                    className={`mission-chip px-2 py-1 text-[11px] ${skill.featured ? "border-[rgba(34,211,238,0.32)] bg-[rgba(34,211,238,0.12)] text-[color:var(--accent-cyan)]" : ""}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
};

export default TechStack;
