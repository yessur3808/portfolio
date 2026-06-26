"use client";

import { useI18n } from "@/src/i18n/locale-context";
import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import { ClientMetadata } from "@/src/components/i18n/ClientMetadata";
import type { ProjectRecord } from "@/src/data/projects";

import { PortfolioGrid } from "@/app/(site)/portfolio/PortfolioGrid";

type PortfolioPageClientProps = {
  projects: ProjectRecord[];
};

const PortfolioPageClient = ({ projects }: PortfolioPageClientProps) => {
  const { messages, isRTL } = useI18n();

  return (
    <>
      <ClientMetadata
        title={messages.portfolioPage.metadataTitle}
        description={messages.portfolioPage.metadataDescription}
      />
      <Section
        eyebrow={messages.portfolioPage.eyebrow}
        title={messages.portfolioPage.title}
        description={messages.portfolioPage.description}
        className="pt-24"
      >
        <div
          className={`mb-6 flex flex-wrap gap-3 ${isRTL ? "justify-end" : ""}`}
        >
          <Button href="/#work" variant="secondary">
            {messages.portfolioPage.backToHomeShowcase}
          </Button>
        </div>

        <PortfolioGrid projects={projects} />
      </Section>
    </>
  );
};

export default PortfolioPageClient;
