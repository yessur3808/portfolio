import { Card } from "@/src/components/ui/Card";
import { Section } from "@/src/components/ui/Section";

const areas = [
  "Production Web Applications",
  "Digital Asset Systems",
  "Internal Platforms",
  "Data Visualization",
  "Testing & DevOps",
  "System Design",
];

const facts = [
  "Currently based in Hong Kong",
  "Hong Kong Permanent Resident",
  "American Citizen",
];

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Engineering reliable systems with thoughtful product experiences."
      description="I’m a Senior Full Stack Software Engineer based in Hong Kong with 8+ years of experience building production web applications, backend services, internal platforms, and digital asset systems."
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-5">
          <p className="text-sm leading-7 text-slate-300 sm:text-base">
            My work spans React, TypeScript, Node.js, Go, GraphQL,
            microservices, cloud infrastructure, testing, automation, and data
            visualization. I’ve contributed to wallet infrastructure, asset
            operation platforms, KYC systems, trading tools, editorial
            workflows, and real-time data products.
          </p>
          <p className="text-sm leading-7 text-slate-300 sm:text-base">
            I enjoy working at the intersection of reliable engineering and
            thoughtful product experience - where architecture, performance,
            usability, and creativity all matter.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-200">
            Facts
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {facts.map((fact) => (
              <li key={fact} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300"
                  aria-hidden="true"
                />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Card key={area} className="p-4">
            <p className="text-sm font-medium text-slate-200">{area}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
