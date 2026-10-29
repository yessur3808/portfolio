import type { ProjectReleaseStatus as ProjectReleaseStatusItem } from "@/src/data/projects";

type ProjectReleaseStatusProps = {
  items?: ProjectReleaseStatusItem[];
  label: string;
};

export const ProjectReleaseStatus = ({
  items,
  label,
}: ProjectReleaseStatusProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={`${item.platform}-${item.status}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-100"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_7px_rgba(252,211,77,0.7)]"
          />
          <span>{item.platform}</span>
          <span aria-hidden="true" className="text-amber-200/55">
            ·
          </span>
          <span className="text-amber-50/80">{item.status}</span>
        </li>
      ))}
    </ul>
  );
};
