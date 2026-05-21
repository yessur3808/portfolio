import type { ReactNode } from "react";

import { NavBar } from "@/app/(site)/_components/ui/NavBar";
import Footer from "@/src/components/layout/Footer";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-transparent text-slate-100">
      <NavBar />
      <main className="content-veil relative z-10 flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
