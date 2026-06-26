"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/app/(site)/_data/site";
import { cn } from "@/app/(site)/_utils/cn";
import { NavWaveFill } from "../NavWaveFill";

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
  const [isShortViewport, setIsShortViewport] = useState(false);
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

  useEffect(() => {
    const checkViewportHeight = () => {
      setIsShortViewport(window.innerHeight < 732);
    };

    checkViewportHeight();
    window.addEventListener("resize", checkViewportHeight);

    return () => {
      window.removeEventListener("resize", checkViewportHeight);
    };
  }, []);

  const currentNavHref =
    pathname === "/" ? activeHref : (routeActiveHref ?? "/#about");
  const currentMobileItem =
    navItems.find(
      (item) =>
        sanitizeNavHref(item.href, allowedSectionHrefs) === currentNavHref,
    ) ?? navItems[0];

  const handleNavClick = (href: string) => {
    setActiveHref(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[990] bg-[rgba(2,6,23,0.72)] transition-[opacity,backdrop-filter] duration-300 ease-out md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100 backdrop-blur-sm"
            : "pointer-events-none opacity-0 backdrop-blur-none",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed left-4 right-4 top-3 z-[1000] md:hidden",
          className,
        )}
      >
        <nav
          aria-label="Mobile navigation"
          className={cn(
            "relative overflow-hidden rounded-[2rem] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(8,15,28,0.92),rgba(4,10,22,0.96))] shadow-[0_30px_80px_rgba(2,6,23,0.58)] ring-1 ring-white/6 backdrop-blur-2xl transition-[border-color,box-shadow,transform] duration-300 ease-out",
            isMobileMenuOpen
              ? "border-[rgba(34,211,238,0.22)] shadow-[0_36px_90px_rgba(2,6,23,0.62)]"
              : "",
          )}
        >
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.55),transparent)]" />
          <div className="absolute inset-x-8 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_72%)]" />

          <div className="relative flex items-center gap-3 px-3 py-3">
            <Link
              href="/#about"
              onClick={() => handleNavClick("/#about")}
              aria-label="Yaser mission node"
              className="group relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-[rgba(34,211,238,0.32)] bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(10,18,32,0.88))] shadow-[0_0_22px_rgba(34,211,238,0.18)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.44)] hover:shadow-[0_0_28px_rgba(34,211,238,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]"
            >
              <Image
                src="/logo.svg"
                alt="Yaser Ibrahim"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-cyan)]/72">
                Navigation
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                <p className="truncate text-sm font-semibold tracking-[0.04em] text-[color:var(--text-main)]">
                  {currentMobileItem.label}
                </p>
              </div>
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
              className={cn(
                "group relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border border-[rgba(34,211,238,0.24)] bg-[rgba(13,22,38,0.9)] text-[color:var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.12)] transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.4)] hover:bg-[rgba(17,29,48,0.96)] hover:shadow-[0_0_26px_rgba(34,211,238,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]",
                isMobileMenuOpen
                  ? "border-[rgba(34,211,238,0.42)] bg-[rgba(17,29,48,0.96)] shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                  : "",
              )}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex w-5 flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-0.5 rounded-full bg-current transition-[transform,width] duration-300 ease-out",
                    isMobileMenuOpen ? "translate-y-2 rotate-45 w-5" : "w-5",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-0.5 rounded-full bg-current transition-all duration-300 ease-out",
                    isMobileMenuOpen ? "w-0 opacity-0" : "w-3.5 opacity-100",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-auto block h-0.5 rounded-full bg-current transition-[transform,width] duration-300 ease-out",
                    isMobileMenuOpen ? "-translate-y-2 -rotate-45 w-5" : "w-5",
                  )}
                />
              </span>
            </button>
          </div>

          <div
            id="mobile-navigation-menu"
            aria-hidden={!isMobileMenuOpen}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isMobileMenuOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  "border-t border-[rgba(148,163,184,0.14)] px-3 pb-3 pt-2 transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-3 opacity-0 pointer-events-none",
                )}
              >
                {!isShortViewport && (
                  <div className="mb-2 flex items-center justify-between rounded-[1.35rem] border border-[rgba(148,163,184,0.12)] bg-[rgba(8,15,28,0.62)] px-4 py-3">
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-cyan)]/68">
                        Current track
                      </p>
                      <p className="mt-1 text-sm font-medium text-[color:var(--text-main)]/88">
                        Tap a section to jump directly through the portfolio.
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.08)] px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-cyan)]">
                      {currentMobileItem.label}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {navItems.map((item, index) => {
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
                          "group relative flex items-center gap-3 overflow-hidden rounded-[1.45rem] border px-4 py-3.5 transition-[transform,border-color,background-color,box-shadow,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]",
                          isActive
                            ? "border-[rgba(34,211,238,0.34)] bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(15,23,42,0.95))] text-[color:var(--text-main)] shadow-[0_18px_34px_rgba(34,211,238,0.12)]"
                            : "border-[rgba(148,163,184,0.12)] bg-[rgba(10,18,32,0.72)] text-[color:var(--text-main)]/88 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.24)] hover:bg-[rgba(12,24,42,0.86)] hover:text-[color:var(--text-main)] hover:shadow-[0_14px_30px_rgba(2,6,23,0.28)]",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-[rgba(148,163,184,0.14)] bg-[rgba(255,255,255,0.04)] text-[0.72rem] font-semibold tracking-[0.18em] text-[color:var(--accent-cyan)]/84">
                          {(index + 1).toString().padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-sm font-semibold tracking-[0.04em]">
                              {item.label}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-medium transition-[transform,opacity] duration-300",
                                isActive
                                  ? "translate-x-0 opacity-100 text-[color:var(--accent-cyan)]"
                                  : "translate-x-1 opacity-50 text-[color:var(--text-muted)]",
                              )}
                            >
                              {isActive ? "Live" : "Open"}
                            </span>
                          </div>
                        </div>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-y-3 right-3 w-1 rounded-full bg-[color:var(--accent-cyan)] transition-[opacity,transform] duration-300",
                            isActive
                              ? "opacity-100 scale-y-100 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                              : "opacity-0 scale-y-50",
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <nav
        aria-label="Primary navigation"
        className={cn(
          "fixed left-1/2 top-2 z-[1000] hidden w-auto max-w-max -translate-x-1/2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg-panel-strong)] px-3.5 py-2.5 shadow-[0_20px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl md:block",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2 md:justify-start md:gap-2 md:px-0 md:py-0">
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
        </div>
      </nav>
    </>
  );
}
