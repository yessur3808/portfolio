import type { ContactLink } from "@/app/(site)/_types/portfolio";

import { socialLinks } from "@/app/(site)/_data/site";

export const contactLinks: ContactLink[] = socialLinks.filter(
  (link) => link.id !== "portfolio",
);
