/**
 * Removes dangerous HTML/script content and normalizes text input.
 * Useful for contact forms, search fields, comments, and displayed user text.
 */
export const sanitizeText = (input: unknown, maxLength = 500): string => {
  if (typeof input !== "string") return "";

  return input
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "") // Remove control chars
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "") // Remove script blocks
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "") // Remove style blocks
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Remove javascript protocol
    .replace(/data:/gi, "") // Remove data protocol
    .replace(/vbscript:/gi, "") // Remove old unsafe protocol
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};

/**
 * Basic email sanitizer/validator.
 */
export const sanitizeEmail = (input: unknown): string => {
  if (typeof input !== "string") return "";

  const email = input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F\s]/g, "")
    .slice(0, 254);

  const validEmail =
    /^[^\s@<>()[\]\\.,;:\"]+(\.[^\s@<>()[\]\\.,;:\"]+)*@[^\s@<>()[\]\\.,;:\"]+(\.[^\s@<>()[\]\\.,;:\"]+)+$/.test(
      email,
    );

  return validEmail ? email : "";
};

/**
 * Sanitizes URLs and only allows safe protocols.
 */
export const sanitizeUrl = (input: unknown): string => {
  if (typeof input !== "string") return "";

  const value = input.normalize("NFKC").trim().slice(0, 2048);

  try {
    const url = new URL(value);

    const allowedProtocols = ["https:", "http:", "mailto:"];

    if (!allowedProtocols.includes(url.protocol)) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
};

/**
 * Escapes text before putting it inside HTML manually.
 * In React, normal text rendering is already escaped, but this is useful
 * for rare cases where you generate raw HTML strings.
 */
export const escapeHtml = (input: unknown): string => {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Sanitizes a contact form payload.
 */
export const sanitizeContactPayload = (
  payload: {
    name?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
  },
) => {
  return {
    name: sanitizeText(payload.name, 80),
    email: sanitizeEmail(payload.email),
    subject: sanitizeText(payload.subject, 120),
    message: sanitizeText(payload.message, 2000),
  };
};
