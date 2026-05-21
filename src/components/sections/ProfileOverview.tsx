import { heroData } from "@/app/(site)/_data/site";
import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import { MissionOrb } from "@/src/components/visual/MissionOrb";

const currentFocus = [
  "Digital asset systems",
  "Internal platform workflows",
  "Reliable distributed services",
];

const facts = [
  "Based in Hong Kong",
  "Hong Kong Permanent Resident",
  "American Citizen",
];

const areas = [
  "Frontend Architecture",
  "Backend Services",
  "System Design",
  "Developer Tooling",
  "Data Visualization",
];

const floatingSignals = [
  {
    label: "ONLINE",
    className: "left-2 top-6 hidden min-[360px]:inline-flex sm:left-6",
  },
  {
    label: "9+ YEARS",
    className: "right-2 top-10 hidden min-[390px]:inline-flex sm:right-8",
  },
  {
    label: "FINTECH",
    className: "left-4 bottom-14 hidden min-[440px]:inline-flex sm:left-10",
  },
  {
    label: "DIGITAL ASSETS",
    className: "right-2 bottom-10 hidden min-[470px]:inline-flex sm:right-6",
  },
  {
    label: "FULL STACK",
    className: "left-1/2 top-2 inline-flex -translate-x-1/2",
  },
];

export default function ProfileOverview() {
  return (
    <Section
      id="about"
      className="mission-section pt-[124px] sm:pt-[138px] lg:pt-[150px]"
    >
      <div className="grid items-start gap-7 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-6">
          <header className="space-y-4">
            <p className="mission-label">MISSION PROFILE</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-main)] sm:text-4xl lg:text-[2.65rem]">
              Yaser Ibrahim
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--text-main)]/92 sm:text-lg">
              Senior Full Stack Engineer building secure, scalable platforms for
              fintech, digital assets, and internal systems.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)] sm:text-base">
              I design interface architecture and backend workflows that make
              complex operations feel clear, reliable, and actionable.
            </p>
          </header>

          <ul className="flex flex-wrap gap-2.5">
            <li>
              <span className="mission-chip">
                <span
                  className="mission-status-dot is-online"
                  aria-hidden="true"
                />
                ONLINE
              </span>
            </li>
            {facts.map((fact) => (
              <li key={fact}>
                <span className="mission-chip">{fact}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              href={heroData.primaryCta.href}
              variant="primary"
              className="w-full border-[color:var(--border-cyan)] bg-[linear-gradient(120deg,rgba(34,211,238,0.9),rgba(56,189,248,0.82),rgba(139,92,246,0.78))] text-[#031224] shadow-[0_14px_30px_rgba(2,6,23,0.55),0_0_24px_rgba(34,211,238,0.2)] hover:shadow-[0_16px_34px_rgba(2,6,23,0.62),0_0_30px_rgba(139,92,246,0.24)] sm:w-auto"
            >
              {heroData.primaryCta.label}
            </Button>
            <Button
              href={heroData.secondaryCta.href}
              variant="secondary"
              className="w-full border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.66)] text-[color:var(--text-main)] hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] sm:w-auto"
            >
              {heroData.secondaryCta.label}
            </Button>
          </div>

          <div className="mission-panel mission-grid-bg space-y-4 rounded-3xl p-5 sm:p-6">
            <h3 className="mission-label">Operational Focus</h3>
            <ul className="space-y-2.5 text-sm text-[color:var(--text-main)]/88 sm:text-[0.95rem]">
              {currentFocus.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mission-status-dot mt-[0.46rem] h-1.5 w-1.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li key={area}>
                  <span className="mission-chip text-xs">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="mission-panel mission-grid-bg mission-scanline mission-anim-float relative isolate min-h-[320px] rounded-3xl p-4 sm:min-h-[430px] sm:p-6">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_48%,rgba(34,211,238,0.14),transparent_58%)]" />

          <MissionOrb
            className="relative z-10 mx-auto mt-8 sm:mt-12"
            initials="YI"
          />

          {floatingSignals.map((chip) => (
            <span
              key={chip.label}
              className={`mission-chip mission-anim-float absolute z-20 text-[10px] tracking-[0.08em] ${chip.className}`}
            >
              {chip.label}
            </span>
          ))}
        </aside>
      </div>
    </Section>
  );
}
