const links = [
  {
    label: "Email",
    href: "mailto:yaser@example.com",
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yaser",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/yessur3808",
    external: true,
  },
  // {
  //   label: "Resume",
  //   href: "/resume.pdf",
  //   external: true,
  // },
];

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
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="mission-chip rounded-full border-[color:var(--border-soft)] bg-[rgba(2,6,23,0.5)] px-3 py-1 text-[color:var(--text-main)]/90 underline-offset-4 transition-colors hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
