import { Download } from "lucide-react";

import { siteConfig } from "@/app/(site)/_data/site";
import { ButtonLink } from "@/app/(site)/_components/ui/ButtonLink";
import { Container } from "@/app/(site)/_components/ui/Container";

export function ResumeSection() {
  return (
    <section className="border-t border-sky-950/70 py-14 sm:py-16">
      <Container>
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgb(15_23_42/0.25),0_18px_45px_rgb(2_6_23/0.35)] sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">
              Resume
            </h2>
            <p className="text-sm text-slate-400">
              Download a PDF summary of experience, projects, and skills.
            </p>
          </div>
          <ButtonLink
            href={siteConfig.resumeHref}
            className="w-fit"
            variant="primary"
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Download Resume
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
