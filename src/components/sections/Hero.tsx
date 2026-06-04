import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";

const skillPills = [
  "React",
  "TypeScript",
  "Node.js",
  "Go",
  "GraphQL",
  "Microservices",
  "Digital Assets",
  "Cloud",
];

const currentFocus = [
  "Digital asset systems",
  "Internal platforms",
  "Distributed services",
  "Creative web experiences",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="border-b border-slate-800/80 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300/90">
              Yaser Ibrahim
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              Senior Full Stack Software Engineer
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              I design and build secure, scalable, and expressive software
              systems across fintech, digital assets, internal platforms, and
              high-traffic web experiences.
            </p>
            <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              Currently based in Hong Kong with 9+ years of experience across
              Hex Trust, Crypto.com, TradeFi, South China Morning Post, and
              PolyAsia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillPills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="#work">View Work</Button>
            <Button href="/portfolio" variant="secondary">
              Full Portfolio
            </Button>
            <Button href="#experience" variant="secondary">
              View Experience
            </Button>
            {/* <Button href="/resume.pdf" variant="secondary" external>
              Download Resume
            </Button> */}
            <Button href="#contact" variant="ghost">
              Contact
            </Button>
          </div>
        </div>

        <Card className="h-fit lg:mt-4">
          <h2 className="text-base font-semibold tracking-wide text-blue-200">
            Current Focus
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {currentFocus.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
