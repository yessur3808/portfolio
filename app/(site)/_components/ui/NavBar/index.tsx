"use client";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/app/(site)/_utils/cn";
import { SUPPORTED_LOCALES, type Locale } from "@/src/i18n/config";
import { useI18n } from "@/src/i18n/locale-context";
import { trackEvent } from "@/src/lib/analytics";
import { NavWaveFill } from "../NavWaveFill";

type NavBarProps = {
  className?: string;
};

type NavKey =
  | "about"
  | "experience"
  | "work"
  | "capabilities"
  | "metrics"
  | "contact"
  | "portfolio";

const NAV_ITEMS: Array<{ key: NavKey; href: string }> = [
  { key: "about", href: "/#about" },
  { key: "experience", href: "/#experience" },
  { key: "work", href: "/#work" },
  { key: "capabilities", href: "/#stack" },
  { key: "metrics", href: "/#metrics" },
  { key: "contact", href: "/#contact" },
  { key: "portfolio", href: "/portfolio" },
];

const LOCALE_OPTION_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR ع",
};

type LocaleDropdownProps = {
  value: Locale;
  onChange: (nextLocale: Locale) => void;
  ariaLabel: string;
  className?: string;
  panelClassName?: string;
  trackingContext?: string;
};

const LocaleDropdown = ({
  value,
  onChange,
  ariaLabel,
  className,
  panelClassName,
  trackingContext,
}: LocaleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => {
          setIsOpen((prev) => {
            const nextOpen = !prev;
            trackEvent("language_dropdown_toggle", {
              button_id: "language_dropdown_trigger",
              button_location: trackingContext ?? "unknown",
              button_state: nextOpen ? "open" : "close",
              locale_current: value,
            });
            return nextOpen;
          });
        }}
        className={cn(
          "inline-flex h-8 w-[50px] items-center justify-center rounded-full border border-[rgba(148,163,184,0.24)] bg-[rgba(10,18,32,0.82)] px-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-[color:var(--text-main)] shadow-[inset_0_1px_0_rgba(148,163,184,0.08)] transition-all duration-200 hover:border-[rgba(34,211,238,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]",
          isOpen
            ? "border-[rgba(34,211,238,0.5)] text-[color:var(--accent-cyan)]"
            : "",
        )}
      >
        <span>{LOCALE_OPTION_LABELS[value]}</span>
      </button>

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            "absolute right-0 top-[calc(100%+0.35rem)] z-[1200] w-[7rem] overflow-hidden rounded-xl border border-[rgba(148,163,184,0.2)] bg-[rgba(2,6,23,0.96)] p-1 shadow-[0_18px_42px_rgba(2,6,23,0.62)] backdrop-blur-xl",
            panelClassName,
          )}
        >
          {SUPPORTED_LOCALES.map((option) => {
            const isActive = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  trackEvent("language_selected", {
                    button_id: `language_option_${option}`,
                    button_location: trackingContext ?? "unknown",
                    locale_previous: value,
                    locale_selected: option,
                  });
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] transition-colors duration-150",
                  isActive
                    ? "bg-[rgba(34,211,238,0.16)] text-[color:var(--accent-cyan)]"
                    : "text-[color:var(--text-main)] hover:bg-[rgba(34,211,238,0.1)] hover:text-[color:var(--accent-cyan)]",
                )}
              >
                {LOCALE_OPTION_LABELS[option]}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const sanitizeSectionHash = (
  rawHash: string,
  allowedSectionIds: ReadonlySet<string>,
) => {
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
};

const sanitizeNavHref = (
  href: string,
  allowedSectionHrefs: ReadonlySet<string>,
) => {
  if (href === "/portfolio") {
    return href;
  }

  return allowedSectionHrefs.has(href) ? href : "/";
};

export const NavBar = ({ className }: NavBarProps) => {
  const { locale, setLocale, messages, isRTL } = useI18n();
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

  const navItems = useMemo(() => {
    return NAV_ITEMS.map((item) => ({
      href: item.href,
      label: messages.navBar.items[item.key],
    }));
  }, [messages]);

  const sectionHrefs = useMemo(
    () =>
      navItems.map((item) => item.href).filter((href) => href.startsWith("/#")),
    [navItems],
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
    const mediaQuery = window.matchMedia("(min-width: 821px)");

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

  const handleNavClick = (href: string, source: string, label?: string) => {
    trackEvent("navigation_click", {
      button_id: `nav_${href.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`,
      button_label: label ?? href,
      button_location: source,
      nav_target: href,
    });

    // Ensure section links still scroll when clicking the same hash repeatedly.
    if (pathname === "/" && href.startsWith("/#")) {
      const sectionId = href.slice(2);

      if (sectionId === "about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = document.getElementById(sectionId);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const nextHash = `#${sectionId}`;
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextUrl !== currentUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    }

    setActiveHref(href);
    setIsMobileMenuOpen(false);
  };

  const handleLocaleClick = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <>
      <button
        type="button"
        aria-label={messages.navBar.mobile.closeOverlay}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[990] bg-[rgba(2,6,23,0.72)] transition-[opacity,backdrop-filter] duration-300 ease-out min-[821px]:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100 backdrop-blur-sm"
            : "pointer-events-none opacity-0 backdrop-blur-none",
        )}
        onClick={() => {
          trackEvent("navigation_click", {
            button_id: "mobile_overlay_close",
            button_label: "Close overlay",
            button_location: "mobile_nav_overlay",
            nav_target: "close_mobile_menu",
          });
          setIsMobileMenuOpen(false);
        }}
      />

      <div
        className={cn(
          "fixed left-4 right-4 top-3 z-[1000] min-[821px]:hidden",
          className,
        )}
      >
        <nav
          aria-label={messages.navBar.title}
          className={cn(
            "relative rounded-[2rem] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(8,15,28,0.92),rgba(4,10,22,0.96))] shadow-[0_30px_80px_rgba(2,6,23,0.58)] ring-1 ring-white/6 backdrop-blur-2xl transition-[border-color,box-shadow,transform] duration-300 ease-out",
            isMobileMenuOpen
              ? "overflow-hidden border-[rgba(34,211,238,0.22)] shadow-[0_36px_90px_rgba(2,6,23,0.62)]"
              : "overflow-visible",
          )}
        >
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.55),transparent)]" />
          <div className="absolute inset-x-8 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_72%)]" />

          <div className="relative flex items-center gap-3 px-3 py-3">
            <Link
              href="/#about"
              onClick={() =>
                handleNavClick("/#about", "mobile_nav_logo", "Logo")
              }
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
                {messages.navBar.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                <p className="truncate text-sm font-semibold tracking-[0.04em] text-[color:var(--text-main)]">
                  {currentMobileItem.label}
                </p>
              </div>
            </div>

            <LocaleDropdown
              value={locale}
              onChange={handleLocaleClick}
              ariaLabel={messages.common.language}
              className="shrink-0"
              panelClassName="w-[7.2rem]"
              trackingContext="mobile_nav_topbar"
            />

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={
                isMobileMenuOpen
                  ? messages.navBar.mobile.closeMenu
                  : messages.navBar.mobile.openMenu
              }
              className={cn(
                "group relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] border border-[rgba(34,211,238,0.24)] bg-[rgba(13,22,38,0.9)] text-[color:var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.12)] transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.4)] hover:bg-[rgba(17,29,48,0.96)] hover:shadow-[0_0_26px_rgba(34,211,238,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)]",
                isMobileMenuOpen
                  ? "border-[rgba(34,211,238,0.42)] bg-[rgba(17,29,48,0.96)] shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                  : "",
              )}
              onClick={() => {
                setIsMobileMenuOpen((prev) => {
                  const nextOpen = !prev;
                  trackEvent("navigation_click", {
                    button_id: "mobile_hamburger_toggle",
                    button_label: nextOpen
                      ? messages.navBar.mobile.openLabel
                      : messages.navBar.mobile.closeLabel,
                    button_location: "mobile_nav_topbar",
                    nav_target: nextOpen
                      ? "open_mobile_menu"
                      : "close_mobile_menu",
                  });
                  return nextOpen;
                });
              }}
            >
              <span className="sr-only">
                {isMobileMenuOpen
                  ? messages.navBar.mobile.closeLabel
                  : messages.navBar.mobile.openLabel}
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
                        {messages.navBar.mobile.currentTrack.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[color:var(--text-main)]/88">
                        {messages.navBar.mobile.currentTrack.description}
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
                        onClick={() =>
                          handleNavClick(
                            safeHref,
                            "mobile_nav_menu",
                            item.label,
                          )
                        }
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
                              {isActive
                                ? messages.common.actions.live
                                : messages.common.actions.open}
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
        aria-label={messages.navBar.title}
        className={cn(
          "fixed left-1/2 top-2 z-[1000] hidden w-auto max-w-max -translate-x-1/2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg-panel-strong)] px-3.5 py-2.5 shadow-[0_20px_48px_rgba(2,6,23,0.55)] backdrop-blur-xl min-[821px]:block",
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 min-[821px]:justify-start min-[821px]:gap-2 min-[821px]:px-0 min-[821px]:py-0",
            isRTL ? "flex-row-reverse" : "",
          )}
        >
          <Link
            href="/#about"
            onClick={() =>
              handleNavClick("/#about", "desktop_nav_logo", "Logo")
            }
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

          <div className="hidden items-center gap-1.5 min-[821px]:flex min-[821px]:gap-2">
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
                  onClick={() =>
                    handleNavClick(safeHref, "desktop_nav_menu", item.label)
                  }
                  className={cn(
                    "group relative min-h-10 shrink-0 overflow-hidden rounded-full border border-transparent px-3.5 py-2 text-xs font-semibold tracking-[0.06em] text-[color:var(--text-main)]/90 transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-deep)] min-[821px]:px-[1.05rem]",
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

          <div className="hidden items-center min-[821px]:flex">
            <LocaleDropdown
              value={locale}
              onChange={handleLocaleClick}
              ariaLabel={messages.common.language}
              trackingContext="desktop_navbar"
            />
          </div>
        </div>
      </nav>
    </>
  );
};
