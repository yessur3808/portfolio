import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export const Section = (
  {
    id,
    eyebrow,
    title,
    description,
    children,
    className,
  }: SectionProps,
) => {
  const headingId = id && title ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("mission-reveal py-14 sm:py-16 lg:py-20", className)}
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {eyebrow || title || description ? (
          <header className="mb-8 space-y-3 sm:mb-10">
            {eyebrow ? (
              <p className="glass-surface inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200/95">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={headingId}
                className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                {description}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
};
