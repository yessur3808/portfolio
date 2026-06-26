import { BriefcaseBusiness } from "lucide-react";

import { experienceData } from "@/app/(site)/_data/experience";
import { Container } from "@/app/(site)/_components/ui/Container";
import { SectionHeading } from "@/app/(site)/_components/ui/SectionHeading";
import { Card } from "@/src/components/ui/Card";

export const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="border-t border-sky-950/70 py-14 sm:py-16"
    >
      <Container>
        <SectionHeading
          title="Experience"
          description="A quick timeline of roles and outcomes."
        />
        <div className="space-y-4">
          {experienceData.map((item) => (
            <Card
              key={`${item.company}-${item.period}`}
              className="border-l-4 border-l-cyan-400/70"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {item.role}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {item.company} • {item.location}
                  </p>
                </div>
                <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                  {item.period}
                </p>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300 sm:text-base">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
