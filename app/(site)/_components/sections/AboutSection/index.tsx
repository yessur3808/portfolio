import { aboutData } from "@/app/(site)/_data/about";
import { Container } from "@/app/(site)/_components/ui/Container";
import { SectionHeading } from "@/app/(site)/_components/ui/SectionHeading";

export function AboutSection() {
  return (
    <section id="about" className="py-14 sm:py-16">
      <Container>
        <SectionHeading title={aboutData.title} />
        <div className="max-w-3xl space-y-4 text-slate-300">
          {aboutData.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7 sm:text-lg sm:leading-8">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
