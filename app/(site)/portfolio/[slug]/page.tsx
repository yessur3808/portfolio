import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMessages } from "@/src/i18n/messages";
import {
  getAllProjects,
  getProjectBySlug,
  type ProjectRecord,
} from "@/src/data/projects";
import ProjectDetailClient from "@/app/(site)/portfolio/[slug]/ProjectDetailClient";
import { SITE_URL, buildLocaleAlternates, toAbsoluteUrl } from "@/src/lib/seo";

const detailMessages = getMessages("en").projectDetailPage;

const buildProjectSchema = (project: ProjectRecord) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/portfolio/${project.slug}#project`,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    name: project.title,
    description: project.summary,
    image: toAbsoluteUrl(project.image),
    creator: {
      "@type": "Person",
      name: "Yaser Ibrahim",
      url: SITE_URL,
    },
    keywords: project.technologies,
  };
};

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => {
  return getAllProjects().map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: detailMessages.metadataNotFoundTitle,
    };
  }

  const absoluteProjectUrl = `${SITE_URL}/portfolio/${project.slug}`;
  const projectImage = toAbsoluteUrl(project.image);

  return {
    title: `${project.title} | ${detailMessages.metadataTitleSuffix}`,
    description: project.summary,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
      languages: buildLocaleAlternates(`/portfolio/${project.slug}`),
    },
    openGraph: {
      title: `${project.title} | ${detailMessages.metadataTitleSuffix}`,
      description: project.summary,
      type: "article",
      url: absoluteProjectUrl,
      images: [
        {
          url: projectImage,
          alt: `${project.title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${detailMessages.metadataTitleSuffix}`,
      description: project.summary,
      images: [projectImage],
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProjectSchema(project)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <ProjectDetailClient project={project} />
    </>
  );
};

export default ProjectDetailPage;
