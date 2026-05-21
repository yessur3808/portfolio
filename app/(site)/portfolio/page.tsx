import type { Metadata } from "next";

import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import { getAllProjects } from "@/src/data/projects";
import { PortfolioGrid } from "@/app/(site)/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A full portfolio of engineering work spanning digital assets, fintech, media systems, and internal platforms.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  const projects = getAllProjects();

  return (
    <Section
      eyebrow="Full Portfolio"
      title="Project Archive"
      description="A deeper view into shipped systems, architecture trade-offs, and execution outcomes."
      className="pt-24"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Button href="/#work" variant="secondary">
          Back to Home Showcase
        </Button>
      </div>

      <PortfolioGrid projects={projects} />
    </Section>
  );
}
