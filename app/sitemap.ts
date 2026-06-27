import type { MetadataRoute } from "next";

import { getAllProjects } from "@/src/data/projects";

const SITE_URL = "https://yaseribrahim3808.com";

export const dynamic = "force-static";

const toAbsolute = (path: string): string => `${SITE_URL}${path}`;

const sitemap = (): MetadataRoute.Sitemap => {
  const now = new Date();
  const projects = getAllProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsolute("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsolute("/portfolio"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: toAbsolute(`/portfolio/${project.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
};

export default sitemap;
