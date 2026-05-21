import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { siteConfig } from "@/app/(site)/_data/site";
import ProfileOverview from "@/src/components/sections/ProfileOverview";

const Experience = dynamic(
  () => import("@/src/components/sections/Experience"),
  {
    loading: () => <SectionSkeleton className="min-h-[720px]" />,
  },
);

const CaseStudies = dynamic(
  () => import("@/src/components/sections/CaseStudies"),
  {
    loading: () => <SectionSkeleton className="min-h-[560px]" />,
  },
);

const TechStack = dynamic(() => import("@/src/components/sections/TechStack"), {
  loading: () => <SectionSkeleton className="min-h-[500px]" />,
});

const Contact = dynamic(() => import("@/src/components/sections/Contact"), {
  loading: () => <SectionSkeleton className="min-h-[420px]" />,
});

function SectionSkeleton({ className }: { className?: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        className={`animate-pulse motion-reduce:animate-none rounded-2xl border border-slate-800/60 bg-slate-900/40 ${className ?? "min-h-[320px]"}`}
      />
    </section>
  );
}

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Software Engineer`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <ProfileOverview />
      <Suspense fallback={<SectionSkeleton className="min-h-[720px]" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="min-h-[560px]" />}>
        <CaseStudies />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="min-h-[500px]" />}>
        <TechStack />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="min-h-[420px]" />}>
        <Contact />
      </Suspense>
    </>
  );
}
