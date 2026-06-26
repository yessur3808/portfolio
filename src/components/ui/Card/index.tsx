import { memo, type ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = memo(function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "glass-surface glass-strong rounded-2xl p-6 shadow-[0_0_0_1px_rgb(15_23_53/0.9),0_26px_64px_rgb(0_0_0/0.56)] transition-colors duration-200 hover:border-[#8A6CFF]/58",
        className,
      )}
    >
      {children}
    </article>
  );
});
