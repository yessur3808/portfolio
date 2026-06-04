import { ArrowRight } from "lucide-react";

import { heroData } from "@/app/(site)/_data/site";
import { ButtonLink } from "@/app/(site)/_components/ui/ButtonLink";
import { Container } from "@/app/(site)/_components/ui/Container";

export function HeroSection() {
  return (
    <section id="home" className="border-b border-sky-950/70 py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-cyan-300/85">
            {heroData.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
            {heroData.role}
          </h1>
          <p className="text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {heroData.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={heroData.primaryCta.href}>
              {heroData.primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
