import rawProjects from "@/src/data/projects.json";

export type ProjectLinkSet = {
  demo?: string;
  repo?: string;
  article?: string;
};

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  image: string;
  summary: string;
  description: string;
  impact: string;
  technologies: string[];
  themes: string[];
  company?: string;
  period?: string;
  featured: boolean;
  links: ProjectLinkSet;
};

type RawProjectRecord = Partial<ProjectRecord> & {
  id: string;
  slug: string;
  title: string;
};

const PROJECT_PLACEHOLDER_IMAGE = "/projects/noimg.png";

const getDefaultProjectImage = (slug: string): string =>
  `/projects/featured/${slug}.svg`;

const normalizeProject = (input: RawProjectRecord): ProjectRecord => ({
  id: input.id,
  slug: input.slug,
  title: input.title,
  image: input.image ?? getDefaultProjectImage(input.slug),
  summary: input.summary ?? "Summary coming soon.",
  description: input.description ?? "Description coming soon.",
  impact: input.impact ?? "Impact details coming soon.",
  technologies: Array.isArray(input.technologies) ? input.technologies : [],
  themes: Array.isArray(input.themes) ? input.themes : [],
  company: input.company,
  period: input.period,
  featured: Boolean(input.featured),
  links: input.links ?? {},
});

const projects: ProjectRecord[] = (rawProjects as RawProjectRecord[]).map(
  normalizeProject,
);

const slugSet = new Set<string>();
for (const project of projects) {
  if (slugSet.has(project.slug)) {
    throw new Error(`Duplicate project slug detected: ${project.slug}`);
  }
  slugSet.add(project.slug);

  if (!project.image || !project.image.trim()) {
    project.image = PROJECT_PLACEHOLDER_IMAGE;
  }
}

export const getAllProjects = (): ProjectRecord[] => projects;

export const getFeaturedProjects = (limit = 6): ProjectRecord[] => {
  const prioritized = [...projects].sort((a, b) => {
    if (a.featured === b.featured) {
      return 0;
    }
    return a.featured ? -1 : 1;
  });

  return prioritized.slice(0, limit);
};

export const getProjectBySlug = (slug: string): ProjectRecord | undefined =>
  projects.find((project) => project.slug === slug);
