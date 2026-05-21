import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Section } from "@/src/components/ui/Section";
import { getAllProjects, getProjectBySlug } from "@/src/data/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Section
      eyebrow="Project Detail"
      title={project.title}
      description={project.summary}
      className="pt-24"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Button href="/portfolio" variant="secondary">
          Back to Portfolio
        </Button>
        <Button href="/#work" variant="ghost">
          Back to Home
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
                Overview
              </h3>
              <p className="text-sm leading-7 text-slate-300">
                {project.description}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-semibold text-slate-100">Impact</h3>
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
                Context
              </h3>
              <p className="text-sm text-slate-300">
                {project.company ?? "Undisclosed"}
              </p>
              <p className="text-sm text-slate-400">
                {project.period ?? "Date not listed"}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-semibold text-slate-100">Themes</h3>
              <ul className="flex flex-wrap gap-2">
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
                Technologies
              </h3>
              <ul className="flex flex-wrap gap-2">
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
  );
}
