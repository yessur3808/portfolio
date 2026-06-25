import { heroData, socialLinks } from "@/app/(site)/_data/site";
import MissionStatusHUD from "@/src/components/sections/MissionStatusHUD";
import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import { TrackedSocialLink } from "@/src/components/ui/TrackedSocialLink";
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
    label: "FULL STACK",
    className: "left-1/2 top-2 inline-flex -translate-x-1/2",
  },
];

const profileSocialLinks = socialLinks.filter(
  (link) => link.id !== "portfolio",
);

export default function ProfileOverview() {
  return (
    <Section id="about" className="mission-section !pt-[140px]">
      <div className="grid items-start gap-7 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-6">
          <header className="space-y-4">
            <p className="mission-label">MISSION PROFILE</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-main)] sm:text-4xl lg:text-[2.65rem]">
              Yaser Ibrahim
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--text-main)]/92 sm:text-lg">
              Senior Full Stack Software Engineer building secure, scalable
              platforms for fintech, digital assets, and internal systems.
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
            <nav aria-label="Profile social links">
              <ul className="flex flex-wrap gap-2.5">
                {profileSocialLinks.map((link) => (
                  <li key={link.id}>
                    <TrackedSocialLink
                      link={link}
                      location="about"
                      showLabel={false}
                      iconVariant="brand"
                      iconClassName="h-5 w-5"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border-soft)]/85 bg-[linear-gradient(145deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] shadow-[inset_0_1px_0_rgba(148,163,184,0.12),0_6px_16px_rgba(2,6,23,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-cyan)] hover:shadow-[0_10px_22px_rgba(2,6,23,0.42),0_0_18px_rgba(34,211,238,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
                    />
                  </li>
                ))}
              </ul>
            </nav>
            <Button
              href={heroData.primaryCta.href}
              variant="primary"
              className="w-full rounded-xl border-[color:var(--border-cyan)]/90 bg-[linear-gradient(140deg,rgba(56,189,248,0.96),rgba(34,211,238,0.9),rgba(139,92,246,0.8))] text-[#F8FDFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_14px_30px_rgba(2,6,23,0.52),0_0_24px_rgba(34,211,238,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-cyan)] hover:shadow-[0_10px_22px_rgba(2,6,23,0.42),0_0_18px_rgba(34,211,238,0.18)] sm:w-auto"
            >
              {heroData.primaryCta.label}
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

          <MissionStatusHUD className="relative z-20 mx-auto mt-8 w-full max-w-[26rem]" />

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
