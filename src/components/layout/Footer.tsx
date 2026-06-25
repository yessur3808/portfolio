import { socialLinks } from "@/app/(site)/_data/site";

import { TrackedSocialLink } from "@/src/components/ui/TrackedSocialLink";

export default function Footer() {
  return (
    <footer className="relative mt-12 py-8 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(34,211,238,0),rgba(34,211,238,0.54),rgba(139,92,246,0.48),rgba(34,211,238,0))]"
      />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mission-panel rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.62)] px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-4 sm:gap-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[color:var(--text-muted)]">
                © {new Date().getFullYear()} Yaser Ibrahim
              </p>
              <p className="text-sm text-[color:var(--text-muted)]">
                Built with Next.js, TypeScript, and Tailwind CSS.
              </p>
            </div>
            <nav
              aria-label="Footer links"
              className="flex flex-wrap items-center gap-2.5 text-sm"
            >
              {socialLinks.map((link) => (
                <TrackedSocialLink
                  key={link.id}
                  link={link}
                  location="footer"
                  iconVariant="brand"
                  iconClassName="h-4 w-4"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[color:var(--border-soft)]/85 bg-[linear-gradient(145deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] px-3.5 text-[color:var(--text-main)] shadow-[inset_0_1px_0_rgba(148,163,184,0.12),0_6px_16px_rgba(2,6,23,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] hover:shadow-[0_10px_22px_rgba(2,6,23,0.42),0_0_18px_rgba(34,211,238,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
