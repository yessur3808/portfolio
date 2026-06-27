import type { Metadata } from "next";

import { getMessages } from "@/src/i18n/messages";
import { getAllProjects } from "@/src/data/projects";
import PortfolioPageClient from "@/app/(site)/portfolio/PortfolioPageClient";
import {
  SOCIAL_PREVIEW_IMAGE_PATH,
  buildLocaleAlternates,
  toAbsoluteSiteUrl,
} from "@/src/lib/seo";

const pageMessages = getMessages("en").portfolioPage;

export const metadata: Metadata = {
  title: pageMessages.metadataTitle,
  description: pageMessages.metadataDescription,
  alternates: {
    canonical: "/portfolio",
    languages: buildLocaleAlternates("/portfolio"),
  },
  openGraph: {
    title: pageMessages.metadataTitle,
    description: pageMessages.metadataDescription,
    url: toAbsoluteSiteUrl("/portfolio"),
    siteName: "Yaser Ibrahim Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: SOCIAL_PREVIEW_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Yaser Ibrahim portfolio social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageMessages.metadataTitle,
    description: pageMessages.metadataDescription,
    images: [SOCIAL_PREVIEW_IMAGE_PATH],
  },
};

const PortfolioPage = () => {
  const projects = getAllProjects();

  return <PortfolioPageClient projects={projects} />;
};

export default PortfolioPage;
