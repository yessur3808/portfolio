import Link from "next/link";
import { Link2, Mail, MapPin } from "lucide-react";

import { contactLinks } from "@/app/(site)/_data/contact";
import { siteConfig } from "@/app/(site)/_data/site";
import { Card } from "@/app/(site)/_components/ui/Card";
import { Container } from "@/app/(site)/_components/ui/Container";
import { SectionHeading } from "@/app/(site)/_components/ui/SectionHeading";

const iconByName = {
  mail: Mail,
  link: Link2,
};

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-sky-950/70 py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Contact"
          description="If you are building something ambitious, I would love to hear about it."
        />
        <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-medium text-slate-100">
              Open to product and platform roles
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {siteConfig.location}
            </p>
          </div>
          <ul className="flex flex-wrap gap-4">
            {contactLinks.map((link) => {
              const Icon = iconByName[link.icon];

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-cyan-200"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </Container>
    </section>
  );
}
