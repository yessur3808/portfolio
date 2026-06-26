import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type BadgeProps = {
  children: ReactNode;
  featured?: boolean;
  className?: string;
};

export const Badge = ({ children, featured = false, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "glass-surface inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em]",
        featured
          ? "border-[#4FC3F7]/55 bg-gradient-to-r from-[#4FC3F7]/24 to-[#8A6CFF]/24 text-[#4FC3F7] shadow-[0_0_18px_rgb(79_195_247/0.28)]"
          : "border-[#1F446C]/70 bg-[#0E2A47]/60 text-slate-300",
        className,
      )}
    >
      {children}
    </span>
  );
};
