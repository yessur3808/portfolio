export type NavItem = {
  label: string;
  href: string;
};

export type HeroData = {
  eyebrow: string;
  name: string;
  role: string;
  summary: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export type AboutData = {
  title: string;
  paragraphs: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
};

export type WorkItem = {
  title: string;
  subtitle: string;
  summary: string;
  impact: string;
  stack: string[];
  links: {
    demo?: string;
    repo?: string;
  };
};

export type TechCategory = {
  title: string;
  items: string[];
};

export type ContactLink = {
  label: string;
  href: string;
  icon: "mail" | "link";
};

export type SiteConfig = {
  siteName: string;
  url: string;
  description: string;
  location: string;
  resumeHref: string;
};
