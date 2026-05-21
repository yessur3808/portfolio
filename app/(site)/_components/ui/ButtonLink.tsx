import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/app/(site)/_utils/cn";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  target?: "_blank" | "_self";
  rel?: string;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  target,
  rel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        variant === "primary"
          ? "border border-cyan-400/35 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25"
          : "border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800/80",
        className,
      )}
    >
      {children}
    </Link>
  );
}
