import type { ReactNode } from "react";

import { cn } from "@/app/(site)/_utils/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
