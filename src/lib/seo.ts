export const SITE_URL = "https://yaseribrahim3808.com";

export const SOCIAL_PREVIEW_IMAGE_PATH = "/social-preview-1200x630.svg";

const LOCALE_BASE_PATHS = {
  en: "/en",
  ar: "/ar",
  fr: "/fr",
} as const;

const normalizePath = (path: string): string => {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
};

export const buildLocaleAlternates = (path: string): Record<string, string> => {
  const normalizedPath = normalizePath(path);
  const suffix = normalizedPath === "/" ? "" : normalizedPath;

  return {
    en: `${LOCALE_BASE_PATHS.en}${suffix}`,
    ar: `${LOCALE_BASE_PATHS.ar}${suffix}`,
    fr: `${LOCALE_BASE_PATHS.fr}${suffix}`,
    "x-default": `${LOCALE_BASE_PATHS.en}${suffix}`,
  };
};

export const toAbsoluteSiteUrl = (path: string): string => {
  const normalizedPath = normalizePath(path);
  return `${SITE_URL}${normalizedPath}`;
};

export const toAbsoluteUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return toAbsoluteSiteUrl(url);
};
