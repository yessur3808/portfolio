import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/src/components/CookieConsent";
import { LocaleProvider } from "@/src/i18n/locale-context";
import {
  SITE_URL,
  SOCIAL_PREVIEW_IMAGE_PATH,
  buildLocaleAlternates,
} from "@/src/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Yaser Ibrahim | Senior Full Stack Software Engineer",
  alternates: {
    canonical: "/",
    languages: buildLocaleAlternates("/"),
  },
  icons: {
    icon: "/logo.svg",
  },
  description:
    "Senior Full Stack Software Engineer based in Hong Kong building secure, scalable systems across fintech, digital assets, internal platforms, and high-traffic web experiences.",
  keywords: [
    "Yaser Ibrahim",
    "Senior Full Stack Software Engineer",
    "React",
    "TypeScript",
    "Node.js",
    "Go",
    "GraphQL",
    "Microservices",
    "Blockchain Engineer",
    "Digital Assets",
    "Fintech",
    "Hong Kong Software Engineer",
  ],
  openGraph: {
    title: "Yaser Ibrahim | Senior Full Stack Software Engineer",
    description:
      "Senior Full Stack Software Engineer based in Hong Kong building secure, scalable systems across fintech, digital assets, internal platforms, and high-traffic web experiences.",
    url: SITE_URL,
    siteName: "Yaser Ibrahim Portfolio",
    type: "website",
    locale: "en_US",
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
    title: "Yaser Ibrahim | Senior Full Stack Software Engineer",
    description:
      "Senior Full Stack Software Engineer based in Hong Kong building secure, scalable systems across fintech, digital assets, internal platforms, and high-traffic web experiences.",
    images: [SOCIAL_PREVIEW_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans antialiased`}
      >
        <LocaleProvider>
          {children}
          <CookieConsent />
        </LocaleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
