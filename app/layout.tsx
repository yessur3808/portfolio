import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yaseribrahim3808.com"),
  title: "Yaser Ibrahim | Senior Full Stack Software Engineer",
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
    url: "https://yaseribrahim3808.com",
    siteName: "Yaser Ibrahim Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaser Ibrahim | Senior Full Stack Software Engineer",
    description:
      "Senior Full Stack Software Engineer based in Hong Kong building secure, scalable systems across fintech, digital assets, internal platforms, and high-traffic web experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
