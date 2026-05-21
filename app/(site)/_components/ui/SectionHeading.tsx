import { cn } from "@/app/(site)/_utils/cn";

type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 space-y-2", className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-slate-400 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
