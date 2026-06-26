import { cn } from "@/src/lib/utils";

type MissionOrbProps = {
  className?: string;
  initials?: string;
};

export function MissionOrb({ className, initials = "YI" }: MissionOrbProps) {
  return (
    <div
      className={cn(
        "relative flex h-[min(230px,72vw)] w-[min(230px,72vw)] items-center justify-center sm:h-[280px] sm:w-[280px]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="mission-anim-pulse motion-reduce:animate-none absolute inset-[18%] rounded-full border border-[rgba(34,211,238,0.24)] bg-[radial-gradient(circle_at_42%_38%,rgba(34,211,238,0.24),rgba(56,189,248,0.1)_42%,rgba(139,92,246,0.1)_62%,rgba(2,6,23,0.52)_80%)] shadow-[inset_0_0_24px_rgba(34,211,238,0.28),0_0_44px_rgba(34,211,238,0.18),0_0_28px_rgba(139,92,246,0.12)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <g className="mission-anim-orbit origin-center motion-reduce:animate-none [transform-origin:50%_50%]">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(139,92,246,0.34)"
            strokeWidth="0.55"
          />
        </g>
        <g
          className="mission-anim-orbit origin-center motion-reduce:animate-none [transform-origin:50%_50%]"
          style={{ animationDuration: "30s", animationDirection: "reverse" }}
        >
          <circle
            cx="50"
            cy="50"
            r="37"
            fill="none"
            stroke="rgba(34,211,238,0.3)"
            strokeWidth="0.6"
          />
        </g>
        <g
          className="mission-anim-orbit origin-center motion-reduce:animate-none [transform-origin:50%_50%]"
          style={{ animationDuration: "35s" }}
        >
          <circle
            cx="50"
            cy="50"
            r="29"
            fill="none"
            stroke="rgba(56,189,248,0.34)"
            strokeWidth="0.58"
          />
        </g>
      </svg>

      <div className="mission-anim-orbit motion-reduce:animate-none absolute inset-0 [animation-duration:22s]">
        <span className="mission-status-dot absolute left-1/2 top-[5.5%] h-2.5 w-2.5 -translate-x-1/2" />
        <span className="mission-status-dot is-online absolute bottom-[10%] right-[16%] h-2 w-2" />
      </div>

      <div
        className="mission-anim-orbit motion-reduce:animate-none absolute inset-[7%] [animation-duration:29s]"
        style={{ animationDirection: "reverse" }}
      >
        <span className="mission-status-dot absolute left-[8%] top-[42%] h-2 w-2" />
        <span className="mission-status-dot absolute right-[9%] top-[34%] h-2.5 w-2.5" />
      </div>

      <div className="mission-anim-orbit motion-reduce:animate-none absolute inset-[16%] [animation-duration:34s]">
        <span className="mission-status-dot is-online absolute left-[20%] bottom-[14%] h-2 w-2" />
        <span className="mission-status-dot absolute right-[25%] top-[8%] h-2 w-2" />
      </div>

      <div className="mission-panel relative z-20 rounded-2xl px-4 py-2 text-center">
        <p className="mission-label justify-center">Core Node</p>
        <p className="text-sm font-semibold tracking-[0.08em] text-[color:var(--accent-cyan)]">
          {initials}
        </p>
      </div>
    </div>
  );
}
