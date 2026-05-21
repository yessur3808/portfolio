import { techStackData } from "@/app/(site)/_data/tech-stack";
import { Card } from "@/app/(site)/_components/ui/Card";
import { Container } from "@/app/(site)/_components/ui/Container";
import { SectionHeading } from "@/app/(site)/_components/ui/SectionHeading";

export function TechStackSection() {
  return (
    <section id="stack" className="border-t border-sky-950/70 py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Tech Stack"
          description="Tools I use to design, build, and ship production-ready products."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStackData.map((category) => (
            <Card key={category.title}>
              <h3 className="mb-3 text-base font-semibold text-slate-100">
                {category.title}
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {category.items.map((item) => (
                  <li key={`${category.title}-${item}`}>• {item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
