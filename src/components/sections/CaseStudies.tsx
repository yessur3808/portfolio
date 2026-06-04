import Link from "next/link";
import Image from "next/image";

import { getFeaturedProjects } from "@/src/data/projects";
import { Button } from "@/src/components/ui/Button";
import { PortfolioCard } from "@/src/components/ui/PortfolioCard";
import { Section } from "@/src/components/ui/Section";

export default function CaseStudies() {
  const featuredProjects = getFeaturedProjects(6);

  return (
    <Section
      id="work"
      eyebrow="FEATURED BUILDS"
      title="Selected systems and builds across fintech, digital assets, and data-rich interfaces"
      description="A focused selection of production systems, internal platforms, and interactive products."
      className="mission-section"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          href="/portfolio"
          variant="secondary"
          className="border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.66)] text-[color:var(--text-main)] hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)]"
        >
          View Full Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <PortfolioCard
            key={project.id}
            className="mission-panel mission-scan-card group relative flex h-full min-h-[27.5rem] flex-col overflow-hidden border border-[color:var(--border-soft)] p-0 transition-all duration-300 motion-reduce:transition-none md:min-h-[29rem] hover:-translate-y-1 focus-within:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 hover:border-[color:var(--border-cyan)] focus-within:border-[color:var(--border-cyan)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_28px_62px_rgba(2,6,23,0.64)] focus-within:shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_28px_62px_rgba(2,6,23,0.64)]"
          >
            <article className="flex h-full flex-col">
              <div className="relative h-52 w-full overflow-hidden bg-slate-950/50 sm:h-56">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent transition-opacity duration-300 group-hover:from-slate-950/80" />
                <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border border-[rgba(34,211,238,0.28)] bg-[rgba(2,6,23,0.72)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[color:var(--accent-cyan)] opacity-0 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_8px_rgba(34,211,238,0.85)]"
                  />
                  <span>SYSTEM SCAN ACTIVE</span>
                </span>
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={`${project.id}-tech-${tech}`}
                      className="mission-chip border-[rgba(34,211,238,0.24)] bg-[rgba(2,6,23,0.66)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--text-main)]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <span className="mission-chip border-[rgba(148,163,184,0.2)] bg-[rgba(2,6,23,0.62)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--text-muted)]">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-4.5">
                <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border-soft)]/80 pb-2.5">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="mission-label text-[10px]">
                        BUILD {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-[rgba(34,211,238,0.45)]"
                      />
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      />
                    </div>
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                      {project.company ?? "Selected Work"}
                    </p>
                  </div>
                  {project.themes[0] ? (
                    <span className="mission-chip px-2 py-1 text-[10px]">
                      {project.themes[0]}
                    </span>
                  ) : null}
                </div>

                <h3 className="line-clamp-2 text-[1rem] font-semibold leading-snug text-[color:var(--text-main)] sm:text-[1.02rem]">
                  {project.title}
                </h3>

                <p className="line-clamp-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={`${project.id}-stack-${tech}`}
                      className="mission-chip px-2 py-1 text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 ? (
                    <span className="mission-chip px-2 py-1 text-[10px] text-[color:var(--text-muted)]">
                      +{project.technologies.length - 5}
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto flex gap-2 pt-2">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    aria-label={`View details for ${project.title}`}
                    className="mission-chip mission-scanline flex-1 justify-center rounded-md border-[color:var(--border-cyan)] bg-[rgba(34,211,238,0.1)] px-2.5 py-2 text-center text-xs font-semibold text-[color:var(--accent-cyan)] transition-all duration-200 motion-reduce:transition-none hover:bg-[rgba(34,211,238,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
                  >
                    View Details
                  </Link>
                  {(project.links?.demo ||
                    project.links?.repo ||
                    project.links?.article) && (
                    <Link
                      href={
                        project.links.demo ||
                        project.links.repo ||
                        project.links.article ||
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.links.demo ? "Open live project for" : project.links.repo ? "Open source code for" : "Open article for"} ${project.title}`}
                      className="mission-chip flex-1 justify-center rounded-md border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.72)] px-2.5 py-2 text-center text-xs font-semibold text-[color:var(--text-main)] transition-all duration-200 motion-reduce:transition-none hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
                    >
                      {project.links.demo
                        ? "Open"
                        : project.links.repo
                          ? "Code"
                          : "Article"}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </PortfolioCard>
        ))}
      </div>
    </Section>
  );
}
