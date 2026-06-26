import Link from "next/link";
import { ExternalLink, Link2 } from "lucide-react";

import { workData } from "@/app/(site)/_data/work";
import { Card } from "@/app/(site)/_components/ui/Card";
import { Container } from "@/app/(site)/_components/ui/Container";
import { SectionHeading } from "@/app/(site)/_components/ui/SectionHeading";

export const WorkSection = () => {
  return (
    <section id="work" className="border-t border-sky-950/70 py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Case Studies"
          description="Selected projects with clear outcomes and practical impact."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {workData.map((item) => (
            <Card key={item.title} className="flex flex-col gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.subtitle}</p>
              </div>
              <p className="text-sm leading-6 text-slate-300">{item.summary}</p>
              <p className="text-sm font-medium text-cyan-200">{item.impact}</p>
              <div className="flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <span
                    key={`${item.title}-${tech}`}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-4 text-sm font-medium">
                {item.links.demo ? (
                  <Link
                    href={item.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                  >
                    Live Demo
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
                {item.links.repo ? (
                  <Link
                    href={item.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                  >
                    Source
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
