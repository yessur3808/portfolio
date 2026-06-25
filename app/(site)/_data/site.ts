import type {
  ContactLink,
  HeroData,
  NavItem,
  SiteConfig,
} from "@/app/(site)/_types/portfolio";

export const siteConfig: SiteConfig = {
  siteName: "Yaser Portfolio",
  url: "https://example.com",
  description:
    "Portfolio of Yaser: product-minded software engineer building fast, reliable web experiences.",
  location: "Remote",
};

export const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Capabilities", href: "/#stack" },
  { label: "Metrics", href: "/#metrics" },
  { label: "Contact", href: "/#contact" },
  { label: "Portfolio", href: "/portfolio" },
];

export const heroData: HeroData = {
  eyebrow: "Software Engineer",
  name: "Yaser",
  role: "I build clean, practical web products.",
  summary:
    "I focus on shipping reliable interfaces and maintainable systems with strong attention to product detail.",
  primaryCta: {
    label: "View Work",
    href: "/#work",
  },
};

export const socialLinks: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:yaser3808@gmail.com",
    icon: "mail",
    external: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/yaseribrahim510",
    icon: "linkedin",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/yessur3808",
    icon: "github",
    external: true,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    href: "/portfolio",
    icon: "portfolio",
    external: false,
  },
];
