"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/src/components/ui/Badge";
import { PortfolioCard } from "@/src/components/ui/PortfolioCard";
import type { ProjectRecord } from "@/src/data/projects";

type PortfolioGridProps = {
  projects: ProjectRecord[];
};

function getSortYear(period?: string) {
  if (!period) {
    return 0;
  }

  if (period.includes("Present")) {
    return 9999;
  }

  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [sortBy, setSortBy] = useState("latest");

  const filteredProjects = useMemo(() => {
    const filtered = projects;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "latest") {
        return getSortYear(b.period) - getSortYear(a.period);
      }

      if (sortBy === "oldest") {
        return getSortYear(a.period) - getSortYear(b.period);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      return a.title.localeCompare(b.title);
    });

    return sorted;
  }, [projects, sortBy]);

  return (
    <div className="space-y-5">
      <div className="glass-surface rounded-2xl border border-blue-900/35 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Sort Order
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-400"
            >
              <option value="latest">Latest to earliest</option>
              <option value="oldest">Earliest to latest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-20">
        {filteredProjects.map((project) => (
          <PortfolioCard
            key={project.id}
            className="group h-[450px] w-[350px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-[0_0_0_1px_rgb(96_165_250/0.45),0_34px_72px_rgb(2_6_23/0.7)]"
          >
            <article className="flex h-full flex-col">
              <div className="relative h-1/2 w-full overflow-hidden bg-slate-950/60">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent transition-opacity duration-300 group-hover:from-slate-950/78" />
                <p className="absolute bottom-3 left-3 rounded bg-slate-950/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 backdrop-blur-sm">
                  {project.company}
                </p>
              </div>

              <div className="flex h-1/2 flex-col gap-2.5 px-3 py-3 sm:px-3.5">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/70 pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                    {project.period ?? "Date not listed"}
                  </p>
                </div>

                <header className="space-y-1.5">
                  <h3 className="line-clamp-2 text-base font-semibold text-slate-100 sm:text-[17px]">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-5 text-slate-300">
                    {project.summary}
                  </p>
                </header>

                <ul className="flex flex-wrap gap-1.5">
                  {project.themes.slice(0, 2).map((theme) => (
                    <li key={`${project.id}-theme-${theme}`}>
                      <Badge featured>{theme}</Badge>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/portfolio/${project.slug}`}
                  className="mt-auto inline-flex items-center justify-center rounded-md border border-blue-900/45 px-3 py-2 text-sm font-semibold text-blue-200 transition-all duration-200 hover:border-blue-500/65 hover:bg-blue-500/12 hover:text-blue-100"
                >
                  Read full project details
                </Link>
              </div>
            </article>
          </PortfolioCard>
        ))}
      </div>
    </div>
  );
}
