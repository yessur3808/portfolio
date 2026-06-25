"use client";

import { MapPin } from "lucide-react";

import { socialLinks } from "@/app/(site)/_data/site";

import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import { SocialIcon } from "@/src/components/ui/SocialIcon";
import { trackEvent } from "@/src/lib/analytics";

const facts = [
  "Currently based in Hong Kong",
  "Hong Kong Permanent Resident",
  "American Citizen",
];

const contactLinks = socialLinks.filter((link) => link.id !== "portfolio");

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

            <div className="grid gap-2.5 sm:grid-cols-2">
              {contactLinks.map((link) => (
                <Button
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    trackEvent("social_click", {
                      social_id: link.id,
                      social_label: link.label,
                      location: "contact",
                      href: link.href,
                    });

                    if (
                      link.id === "email" ||
                      link.id === "linkedin" ||
                      link.id === "github"
                    ) {
                      trackEvent("contact_click", {
                        contact_type: link.id,
                      });
                    }
                  }}
                  variant={link.id === "email" ? "primary" : "secondary"}
                  external={link.external}
                  className={
                    link.id === "email"
                      ? "w-full justify-start rounded-xl border-[color:var(--border-cyan)]/90 bg-[linear-gradient(140deg,rgba(56,189,248,0.9),rgba(34,211,238,0.84),rgba(139,92,246,0.7))] text-[#F8FDFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_24px_rgba(2,6,23,0.46),0_0_16px_rgba(34,211,238,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-cyan)] hover:shadow-[0_10px_22px_rgba(2,6,23,0.42),0_0_18px_rgba(34,211,238,0.18)]"
                      : "w-full justify-start rounded-xl border border-[color:var(--border-soft)]/85 bg-[linear-gradient(145deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] text-[color:var(--text-main)] shadow-[inset_0_1px_0_rgba(148,163,184,0.12),0_6px_16px_rgba(2,6,23,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-cyan)] hover:text-[color:var(--accent-cyan)] hover:shadow-[0_10px_22px_rgba(2,6,23,0.42),0_0_18px_rgba(34,211,238,0.18)]"
                  }
                >
                  <SocialIcon
                    icon={link.icon}
                    variant="brand"
                    className="mr-2 h-[18px] w-[18px]"
                  />
                  {link.label} Channel
                </Button>
              ))}
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
