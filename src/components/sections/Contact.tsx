import { FileText, Link2, Mail, MapPin } from "lucide-react";

import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";

const facts = [
  "Currently based in Hong Kong",
  "Hong Kong Permanent Resident",
  "American Citizen",
];

// lucide-react in this workspace version does not export brand icons for LinkedIn/GitHub.
const Linkedin = Link2;
const Github = Link2;

export default function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="OPEN TRANSMISSION"
      title="Let's Connect"
      description="I am available for senior engineering opportunities, technical collaboration, and platform-focused teams."
      className="mission-section"
    >
      <div className="mission-panel mission-grid-bg mission-scanline relative overflow-hidden rounded-3xl border border-[color:var(--border-soft)] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-x-6 top-5 flex items-center gap-3 opacity-75">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(34,211,238,0.46),rgba(34,211,238,0))]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
          <span className="h-px w-20 bg-[rgba(139,92,246,0.35)]" />
        </div>

        <div className="grid gap-7 pt-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-main)]/90 sm:text-base">
              If you are building fintech infrastructure, digital asset
              platforms, internal engineering systems, or data-rich product
              experiences, I am happy to connect and contribute.
            </p>

            <div className="mission-panel relative max-w-xl overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(2,6,23,0.76)] px-4 py-3">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(34,211,238,0),rgba(34,211,238,0.52),rgba(34,211,238,0))]" />
              <p className="mission-label mb-2 text-[10px] text-[color:var(--text-muted)]">
                SIGNAL SNAPSHOT
              </p>
              <div className="space-y-1.5 font-mono text-xs leading-5 text-[color:var(--accent-cyan)]/88">
                <p>&gt; channel.status = &quot;available&quot;</p>
                <p>&gt; focus = &quot;senior full stack engineering&quot;</p>
                <p>&gt; region = &quot;Hong Kong&quot;</p>
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Button
                href="mailto:yaser3808@gmail.com"
                variant="primary"
                className="mission-scanline w-full justify-start border-[color:var(--border-cyan)] bg-[rgba(34,211,238,0.14)] text-[color:var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.16)] hover:bg-[rgba(34,211,238,0.2)]"
              >
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Email Channel
              </Button>
              <Button
                href="https://linkedin.com/in/yaseribrahim510"
                variant="secondary"
                external
                className="w-full justify-start border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.72)] text-[color:var(--text-main)] hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)]"
              >
                <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
                LinkedIn Channel
              </Button>
              <Button
                href="https://github.com/yaser"
                variant="secondary"
                external
                className="w-full justify-start border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.72)] text-[color:var(--text-main)] hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)]"
              >
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                GitHub Channel
              </Button>
              <Button
                href="/resume.pdf"
                variant="ghost"
                className="w-full justify-start border-[color:var(--border-soft)] bg-[rgba(15,23,42,0.62)] text-[color:var(--text-main)] hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)]"
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Resume Channel
              </Button>
            </div>
          </div>

          <aside className="mission-panel space-y-4 rounded-2xl border border-[color:var(--border-soft)] p-4 sm:p-5">
            <h3 className="mission-label inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Status Block
            </h3>

            <ul className="space-y-2.5 text-sm text-[color:var(--text-main)]/90">
              <li className="flex items-start gap-2.5">
                <span
                  className="mission-status-dot is-online mission-anim-pulse mt-[0.38rem] h-2 w-2"
                  aria-hidden="true"
                />
                <span>
                  <span className="mission-label mr-2 text-[10px] text-[color:var(--text-muted)]">
                    STATUS:
                  </span>
                  <span className="text-[color:var(--text-main)]">
                    AVAILABLE
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  className="mission-status-dot mt-[0.38rem] h-2 w-2"
                  aria-hidden="true"
                />
                <span>
                  <span className="mission-label mr-2 text-[10px] text-[color:var(--text-muted)]">
                    LOCATION:
                  </span>
                  <span className="text-[color:var(--text-main)]">
                    Hong Kong
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  className="mission-status-dot mt-[0.38rem] h-2 w-2"
                  aria-hidden="true"
                />
                <span>
                  <span className="mission-label mr-2 text-[10px] text-[color:var(--text-muted)]">
                    FOCUS:
                  </span>
                  <span className="text-[color:var(--text-main)]">
                    Senior Full Stack / Platform Engineering
                  </span>
                </span>
              </li>
            </ul>

            <ul className="space-y-2 border-t border-[color:var(--border-soft)]/70 pt-3 text-xs text-[color:var(--text-muted)]">
              {facts.map((fact) => (
                <li key={fact} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 rounded-full bg-[color:var(--accent-cyan)]"
                    aria-hidden="true"
                  />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Section>
  );
}
