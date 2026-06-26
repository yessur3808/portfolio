"use client";

import Image from "next/image";

import { useI18n } from "@/src/i18n/locale-context";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Section } from "@/src/components/ui/Section";
import { ClientMetadata } from "@/src/components/i18n/ClientMetadata";
import type { ProjectRecord } from "@/src/data/projects";

type ProjectDetailClientProps = {
  project: ProjectRecord;
};

const ProjectDetailClient = ({ project }: ProjectDetailClientProps) => {
  const { messages, isRTL } = useI18n();

  return (
    <>
      <ClientMetadata
        title={`${project.title} | ${messages.projectDetailPage.metadataTitleSuffix}`}
        description={project.summary}
      />
      <Section
        eyebrow={messages.projectDetailPage.eyebrow}
        title={project.title}
        description={project.summary}
        className="pt-24"
      >
        <div
          className={`mb-6 flex flex-wrap gap-3 ${isRTL ? "justify-end" : ""}`}
        >
          <Button href="/portfolio" variant="secondary">
            {messages.projectDetailPage.backToPortfolio}
          </Button>
          <Button href="/#work" variant="ghost">
            {messages.projectDetailPage.backToHome}
          </Button>
        </div>

        <div className="grid gap-20 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <article className="space-y-5">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-blue-900/35 bg-slate-950/60 sm:aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {messages.projectDetailPage.overview}
                </h3>
                <p className="text-sm leading-7 text-slate-300">
                  {project.description}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {messages.projectDetailPage.impact}
                </h3>
                <p className="text-sm leading-7 text-slate-300">
                  {project.impact}
                </p>
              </section>
            </article>
          </Card>

          <Card>
            <article className="space-y-5">
              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {messages.projectDetailPage.context}
                </h3>
                <p className="text-sm text-slate-300">
                  {project.company ?? messages.projectDetailPage.undisclosed}
                </p>
                <p className="text-sm text-slate-400">
                  {project.period ?? messages.projectDetailPage.dateNotListed}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {messages.projectDetailPage.themes}
                </h3>
                <ul
                  className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}
                >
                  {project.themes.map((theme) => (
                    <li
                      key={theme}
                      className="glass-surface inline-flex rounded-full border border-blue-400/30 px-3 py-1 text-xs uppercase tracking-[0.1em] text-blue-100"
                    >
                      {theme}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {messages.projectDetailPage.technologies}
                </h3>
                <ul
                  className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}
                >
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="glass-surface inline-flex rounded-full border border-slate-700/70 px-3 py-1 text-xs uppercase tracking-[0.1em] text-slate-200"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default ProjectDetailClient;
