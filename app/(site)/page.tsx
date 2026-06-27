import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { siteConfig } from "@/app/(site)/_data/site";
import ProfileOverview from "@/src/components/sections/ProfileOverview";
import {
  SITE_URL,
  SOCIAL_PREVIEW_IMAGE_PATH,
  buildLocaleAlternates,
} from "@/src/lib/seo";

const Experience = dynamic(
  () => import("@/src/components/sections/Experience"),
  {
    loading: () => <SectionSkeleton className="min-h-[720px]" />,
  },
);

const SignalMetrics = dynamic(
  () => import("@/src/components/sections/SignalMetrics"),
  {
    loading: () => <SectionSkeleton className="min-h-[420px]" />,
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

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Yaser Ibrahim Portfolio",
      inLanguage: "en",
      description:
        "Senior Full Stack Software Engineer based in Hong Kong building secure, scalable systems across fintech, digital assets, internal platforms, and high-traffic web experiences.",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Yaser Ibrahim",
      url: SITE_URL,
      jobTitle: "Senior Full Stack Software Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Independent",
      },
      sameAs: [
        "https://linkedin.com/in/yaseribrahim510",
        "https://github.com/yessur3808",
      ],
    },
  ],
};

const SectionSkeleton = ({ className }: { className?: string }) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        className={`animate-pulse motion-reduce:animate-none rounded-2xl border border-slate-800/60 bg-slate-900/40 ${className ?? "min-h-[320px]"}`}
      />
    </section>
  );
};

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Software Engineer`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    languages: buildLocaleAlternates("/"),
  },
  openGraph: {
    title: `${siteConfig.siteName} | Software Engineer`,
    description: siteConfig.description,
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: SOCIAL_PREVIEW_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Yaser Ibrahim portfolio social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName} | Software Engineer`,
    description: siteConfig.description,
    images: [SOCIAL_PREVIEW_IMAGE_PATH],
  },
  icons: {
    icon: "/logo.svg",
  },
};

const HomePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ProfileOverview />
      <Suspense fallback={<SectionSkeleton className="min-h-[720px]" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="min-h-[560px]" />}>
        <CaseStudies />
      </Suspense>
      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<SectionSkeleton className="min-h-[500px]" />}>
          <TechStack />
        </Suspense>
      </div>
      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<SectionSkeleton className="min-h-[420px]" />}>
          <SignalMetrics />
        </Suspense>
      </div>
      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<SectionSkeleton className="min-h-[420px]" />}>
          <Contact />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
