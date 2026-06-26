import type { Metadata } from "next";

import { getMessages } from "@/src/i18n/messages";
import { getAllProjects } from "@/src/data/projects";
import PortfolioPageClient from "@/app/(site)/portfolio/PortfolioPageClient";

const pageMessages = getMessages("en").portfolioPage;

export const metadata: Metadata = {
  title: pageMessages.metadataTitle,
  description: pageMessages.metadataDescription,
  alternates: {
    canonical: "/portfolio",
  },
};

const PortfolioPage = () => {
  const projects = getAllProjects();

  return <PortfolioPageClient projects={projects} />;
};

export default PortfolioPage;
