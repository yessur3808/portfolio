import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMessages } from "@/src/i18n/messages";
import { getAllProjects, getProjectBySlug } from "@/src/data/projects";
import ProjectDetailClient from "@/app/(site)/portfolio/[slug]/ProjectDetailClient";

const detailMessages = getMessages("en").projectDetailPage;

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

  return {
    title: `${project.title} | ${detailMessages.metadataTitleSuffix}`,
    description: project.summary,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
};

export default ProjectDetailPage;
