"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const syncMenuState = (event?: MediaQueryListEvent) => {
      if ((event?.matches ?? mediaQuery.matches) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    syncMenuState();
    mediaQuery.addEventListener("change", syncMenuState);

    return () => {
      mediaQuery.removeEventListener("change", syncMenuState);
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setActiveHref(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {isMobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-[990] bg-[rgba(2,6,23,0.72)] backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}

      <nav
        aria-label="Primary navigation"
        className={cn(
          "fixed left-4 right-4 top-2 z-[1000] rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg-panel-strong)] shadow-[0_20px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl md:left-1/2 md:right-auto md:w-auto md:max-w-max md:-translate-x-1/2 md:px-3.5 md:py-2.5",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 sm:px-2.5 sm:py-2 md:justify-start md:gap-2 md:px-0 md:py-0">
          <Link
            href="/#about"
            onClick={() => handleNavClick("/#about")}
            aria-label="Yaser mission node"
            className="group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border-cyan)] bg-[rgba(15,23,42,0.82)] text-[10px] font-semibold tracking-[0.08em] text-[color:var(--accent-cyan)] shadow-[0_0_16px_rgba(34,211,238,0.24)] transition-[border-color,box-shadow,background-color,color] duration-200 hover:bg-[rgba(34,211,238,0.1)] hover:text-[color:var(--text-main)] hover:shadow-[0_0_18px_rgba(34,211,238,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] sm:h-10 sm:w-10"
          >
            <Image
              src="/logo.svg"
              alt="Yaser Ibrahim"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </Link>

          <div className="hidden items-center gap-1.5 md:flex md:gap-2">
            {navItems.map((item) => {
              const safeHref = sanitizeNavHref(item.href, allowedSectionHrefs);
              const isSectionItem = safeHref.startsWith("/#");
              const isPortfolio = safeHref === "/portfolio";
              const progress = isSectionItem
                ? (sectionProgress[safeHref] ?? 0)
                : 0;
              const isActive =
                pathname === "/"
                  ? activeHref === safeHref
                  : safeHref === routeActiveHref;
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
                  onClick={() => handleNavClick(safeHref)}
                  className={cn(
                    "group relative min-h-10 shrink-0 overflow-hidden rounded-full border border-transparent px-3.5 py-2 text-xs font-semibold tracking-[0.06em] text-[color:var(--text-main)]/90 transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] md:px-[1.05rem]",
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
                      "absolute bottom-1 left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[color:var(--accent-cyan)] transition-opacity duration-200",
                      isActive
                        ? "opacity-90 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                        : "opacity-0 group-hover:opacity-65",
                    )}
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border-cyan)] bg-[rgba(15,23,42,0.82)] text-[color:var(--accent-cyan)] shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-[border-color,box-shadow,background-color,color] duration-200 hover:bg-[rgba(34,211,238,0.1)] hover:text-[color:var(--text-main)] hover:shadow-[0_0_18px_rgba(34,211,238,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">
              {isMobileMenuOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="flex w-5 flex-col gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition-transform duration-200",
                  isMobileMenuOpen ? "translate-y-2 rotate-45" : "",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition-opacity duration-200",
                  isMobileMenuOpen ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition-transform duration-200",
                  isMobileMenuOpen ? "-translate-y-2 -rotate-45" : "",
                )}
              />
            </span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div
            id="mobile-navigation-menu"
            className="border-t border-[color:var(--border-soft)] px-2 pb-2 pt-1.5 md:hidden"
          >
            <div className="flex flex-col gap-2 overflow-hidden rounded-[1.5rem] border border-[rgba(34,211,238,0.14)] bg-[rgba(7,15,28,0.94)] p-2 shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
              {navItems.map((item) => {
                const safeHref = sanitizeNavHref(
                  item.href,
                  allowedSectionHrefs,
                );
                const isActive =
                  pathname === "/"
                    ? activeHref === safeHref
                    : safeHref === routeActiveHref;

                return (
                  <Link
                    key={item.href}
                    href={safeHref}
                    onClick={() => handleNavClick(safeHref)}
                    className={cn(
                      "block w-full rounded-2xl border px-4 py-3.5 text-base font-semibold tracking-[0.04em] transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]",
                      isActive
                        ? "border-[color:var(--border-cyan)] bg-[rgba(34,211,238,0.14)] text-[color:var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.18)]"
                        : "border-transparent bg-[rgba(15,23,42,0.66)] text-[color:var(--text-main)]/92 hover:border-[rgba(34,211,238,0.24)] hover:bg-[rgba(34,211,238,0.08)] hover:text-[color:var(--accent-cyan)]",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>
    </>
  );
}
