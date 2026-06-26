import type { ReactNode } from "react";

import { cn } from "@/app/(site)/_utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <article
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgb(15_23_42/0.25),0_18px_45px_rgb(2_6_23/0.35)]",
        className,
      )}
    >
      {children}
    </article>
  );
};
