"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/app/(site)/_data/site";
import { cn } from "@/app/(site)/_utils/cn";
import { NavWaveFill } from "./NavWaveFill";

type NavBarProps = {
  className?: string;
};

function sanitizeSectionHash(
  rawHash: string,
  allowedSectionIds: ReadonlySet<string>,
) {
  const trimmed = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  if (!trimmed) {
    return null;
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return null;
  }

  const normalized = decoded.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return null;
  }

  return allowedSectionIds.has(normalized) ? normalized : null;
}

function sanitizeNavHref(
  href: string,
  allowedSectionHrefs: ReadonlySet<string>,
) {
  if (href === "/portfolio") {
    return href;
  }

  return allowedSectionHrefs.has(href) ? href : "/";
}

export function NavBar({ className }: NavBarProps) {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>(() => {
    return "/#about";
  });
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, number>
  >({});
  const routeActiveHref = pathname?.startsWith("/portfolio")
    ? "/portfolio"
    : null;

  const sectionHrefs = useMemo(
    () =>
      navItems.map((item) => item.href).filter((href) => href.startsWith("/#")),
    [],
  );
  const allowedSectionIds = useMemo(
    () => new Set(sectionHrefs.map((href) => href.replace("/#", ""))),
    [sectionHrefs],
  );
  const allowedSectionHrefs = useMemo(
    () => new Set(sectionHrefs),
    [sectionHrefs],
  );

  const applySafeHash = useCallback(
    (candidateHash?: string | null) => {
      if (pathname !== "/") {
        return null;
      }

      const rawHash = candidateHash ?? window.location.hash;
      const safeId = sanitizeSectionHash(rawHash, allowedSectionIds);
      const safeHash = safeId ? `#${safeId}` : "";
      const nextUrl = `${window.location.pathname}${window.location.search}${safeHash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextUrl !== currentUrl) {
        window.history.replaceState(null, "", nextUrl);
      }

      if (safeId) {
        const nextHref = `/#${safeId}`;
        setActiveHref((prev) => (prev === nextHref ? prev : nextHref));
      }

      return safeId;
    },
    [allowedSectionIds, pathname],
  );

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const cleanupHash = () => {
      applySafeHash();
    };

    cleanupHash();
    window.addEventListener("hashchange", cleanupHash);

    return () => {
      window.removeEventListener("hashchange", cleanupHash);
    };
  }, [applySafeHash, pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = sectionHrefs
      .map((href) => ({ href, id: href.replace("/#", "") }))
      .map((entry) => ({
        ...entry,
        element: document.getElementById(entry.id),
      }))
      .filter(
        (entry): entry is { href: string; id: string; element: HTMLElement } =>
          entry.element !== null,
      );

    if (sections.length === 0) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      const probeY = window.innerHeight * 0.35;
      const nextProgress: Record<string, number> = {};

      sections.forEach(({ href, element }) => {
        const rect = element.getBoundingClientRect();
        const raw = (probeY - rect.top) / Math.max(rect.height, 1);
        nextProgress[href] = Math.min(1, Math.max(0, raw));
      });

      setSectionProgress((prev) => {
        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(nextProgress);

        if (prevKeys.length !== nextKeys.length) {
          return nextProgress;
        }

        for (const key of nextKeys) {
          if (Math.abs((prev[key] ?? 0) - nextProgress[key]) > 0.01) {
            return nextProgress;
          }
        }

        return prev;
      });

      const containing = sections.find(({ element }) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom >= probeY;
      });

      if (containing) {
        applySafeHash(`#${containing.id}`);
        return;
      }

      const nearest = sections
        .map(({ href, element }) => {
          const rect = element.getBoundingClientRect();
          return { href, distance: Math.abs(rect.top - probeY) };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      if (nearest) {
        applySafeHash(nearest.href.slice(1));
      }
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [applySafeHash, pathname, sectionHrefs]);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed left-1/2 top-2 z-[1000] flex w-[calc(100%-0.75rem)] max-w-[calc(100vw-0.75rem)] -translate-x-1/2 items-center justify-start gap-1.5 overflow-x-auto overflow-y-hidden rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg-panel-strong)] px-2 py-1.5 shadow-[0_20px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:top-4 sm:w-[calc(100%-1.25rem)] sm:max-w-max sm:justify-center sm:px-2.5 sm:py-2 md:w-auto md:gap-2 md:px-3.5 md:py-2.5",
        className,
      )}
    >
      <Link
        href="/#about"
        onClick={() => setActiveHref("/#about")}
        aria-label="Yaser mission node"
        className="group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border-cyan)] bg-[rgba(15,23,42,0.82)] text-[10px] font-semibold tracking-[0.08em] text-[color:var(--accent-cyan)] shadow-[0_0_16px_rgba(34,211,238,0.24)] transition-[border-color,box-shadow,background-color,color] duration-200 hover:bg-[rgba(34,211,238,0.1)] hover:text-[color:var(--text-main)] hover:shadow-[0_0_18px_rgba(34,211,238,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] sm:h-10 sm:w-10"
      >
        {/* <span className="relative z-10">YI</span> */}
        <img src="/logo.svg" alt="Yaser Ibrahim" className="h-12 w-12" />
        {/* <span
          aria-hidden="true"
          className="mission-status-dot mission-anim-pulse absolute -right-0.5 -top-0.5 h-2.5 w-2.5 bg-[color:var(--accent-green)] shadow-[0_0_10px_rgba(52,211,153,0.65)]"
        /> */}
      </Link>

      {navItems.map((item) => {
        const safeHref = sanitizeNavHref(item.href, allowedSectionHrefs);
        const isSectionItem = safeHref.startsWith("/#");
        const isPortfolio = safeHref === "/portfolio";
        const progress = isSectionItem ? (sectionProgress[safeHref] ?? 0) : 0;
        const isActive =
          pathname === "/"
            ? activeHref === safeHref
            : safeHref === routeActiveHref;
        // For /portfolio, always show full fill when active
        const visibleProgress = isActive
          ? isSectionItem
            ? progress
            : isPortfolio
              ? 1
              : 0
          : 0;

        return (
          <Link
            key={item.href}
            href={safeHref}
            onClick={() => setActiveHref(safeHref)}
            className={cn(
              "group relative min-h-11 shrink-0 overflow-hidden rounded-full border border-transparent px-3 py-2 text-[11px] font-semibold tracking-[0.06em] text-[color:var(--text-main)]/90 transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] sm:min-h-10 sm:px-3.5 md:px-[1.05rem] md:text-xs",
              isActive
                ? "border-[color:var(--border-cyan)] bg-[rgba(34,211,238,0.14)] text-[color:var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.2)]"
                : "hover:border-[rgba(34,211,238,0.24)] hover:bg-[rgba(34,211,238,0.08)] hover:text-[color:var(--accent-cyan)] hover:shadow-[0_0_14px_rgba(34,211,238,0.1)]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (isSectionItem || isPortfolio) ? (
              <NavWaveFill progress={visibleProgress} color="#22d3ee" />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 bottom-1 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[color:var(--accent-cyan)] transition-opacity duration-200",
                isActive
                  ? "opacity-90 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                  : "opacity-0 group-hover:opacity-65",
              )}
            />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
