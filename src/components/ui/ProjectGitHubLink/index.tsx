import Link from "next/link";
import type { MouseEventHandler } from "react";

import { SocialIcon } from "@/src/components/ui/SocialIcon";

type ProjectGitHubLinkProps = {
  href: string;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export const ProjectGitHubLink = ({
  href,
  label,
  onClick,
}: ProjectGitHubLinkProps) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.72)] text-[color:var(--text-main)] transition-all duration-200 motion-reduce:transition-none hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
  >
    <SocialIcon icon="github" className="h-4 w-4" />
  </Link>
);
