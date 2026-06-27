import type { MetadataRoute } from "next";

const SITE_URL = "https://yaseribrahim3808.com";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
};

export default robots;
