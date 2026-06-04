"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/lib/utils";

type AiOrbProps = {
  className?: string;
};

type SphereParticle = {
  phi: number;
  theta: number;
};

function buildParticles(count: number): SphereParticle[] {
  const golden = Math.PI * (1 + Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => ({
    phi: Math.acos(1 - (2 * (i + 0.5)) / count),
    theta: golden * i,
  }));
}

const PARTICLES = buildParticles(400);
// Pre-computed per-particle random seeds — deterministic across renders
const PARTICLE_RAND = Float32Array.from({ length: PARTICLES.length }, () =>
  Math.random(),
);
const TILT_COS = Math.cos(Math.PI * 0.18);
const TILT_SIN = Math.sin(Math.PI * 0.18);
const TAU = Math.PI * 2;

// ── Palette types & helpers ─────────────────────────────────────────────────
type RGB = [number, number, number];

type OrbPalette = {
  shadow: RGB; // back hemisphere
  mid: RGB; // back-mid zone (auto-lerped)
  secondary: RGB; // interior
  primary: RGB; // outer ring / front
  accent: RGB; // cluster zone
  bright: RGB; // bright edge (auto-lightened)
  intensity: number;
};

function parseCssColor(raw: string): RGB {
  const v = raw.trim();
  if (v.startsWith("#")) {
    const h = v.slice(1).replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  const m = v.match(/[\d.]+/g);
  if (m && m.length >= 3) return [+m[0], +m[1], +m[2]];
  return [103, 232, 249]; // fallback cyan
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function lightenRGB(c: RGB, amount: number): RGB {
  return [
    Math.round(c[0] + (255 - c[0]) * amount),
    Math.round(c[1] + (255 - c[1]) * amount),
    Math.round(c[2] + (255 - c[2]) * amount),
  ];
}

function lerpPalette(a: OrbPalette, b: OrbPalette, t: number): OrbPalette {
  return {
    shadow: lerpRGB(a.shadow, b.shadow, t),
    mid: lerpRGB(a.mid, b.mid, t),
    secondary: lerpRGB(a.secondary, b.secondary, t),
    primary: lerpRGB(a.primary, b.primary, t),
    accent: lerpRGB(a.accent, b.accent, t),
    bright: lerpRGB(a.bright, b.bright, t),
    intensity: a.intensity + (b.intensity - a.intensity) * t,
  };
}

function buildPaletteFromCSS(): OrbPalette {
  const s = getComputedStyle(document.documentElement);
  const shadow = parseCssColor(s.getPropertyValue("--ai-orb-shadow"));
  const secondary = parseCssColor(s.getPropertyValue("--ai-orb-secondary"));
  const primary = parseCssColor(s.getPropertyValue("--ai-orb-primary"));
  const accent = parseCssColor(s.getPropertyValue("--ai-orb-accent"));
  const intensity = parseFloat(s.getPropertyValue("--ai-orb-intensity")) || 1;
  return {
    shadow,
    mid: lerpRGB(shadow, secondary, 0.45),
    secondary,
    primary,
    accent,
    bright: lightenRGB(primary, 0.4),
    intensity,
  };
}

// Matches the default CSS variables in globals.css
const DEFAULT_PALETTE: OrbPalette = {
  shadow: [30, 27, 75],
  mid: [42, 100, 153],
  secondary: [56, 189, 248],
  primary: [103, 232, 249],
  accent: [34, 211, 238],
  bright: [164, 241, 251],
  intensity: 1,
};

const SUGGESTED_QUESTIONS = [
  "What projects has Yaser built?",
  "What are his strongest technical skills?",
  "Summarize his experience.",
  "How can I contact him?",
  "What are some of his key achievements?",
  "What are some of his hobbies and interests?",
] as const;

export default function AiOrb({ className }: AiOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  // Palette refs for cross-section colour lerp
  const palCurrentRef = useRef<OrbPalette>(DEFAULT_PALETTE);
  const palFromRef = useRef<OrbPalette>(DEFAULT_PALETTE);
  const palTargetRef = useRef<OrbPalette>(DEFAULT_PALETTE);
  const transStartRef = useRef<number>(0);
  const anomalyStartRef = useRef<number>(-Infinity);
  // Re-randomised on every click so each anomaly looks distinct
  const anomalyPhaseRef = useRef<number>(0); // scatter direction offset
  const anomalyScaleRef = useRef<number>(1); // displacement magnitude
  const anomalyDurRef = useRef<number>(900); // envelope duration (ms)

  const [isOpen, setIsOpen] = useState(false);
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
    anomalyStartRef.current = performance.now();
    anomalyPhaseRef.current = Math.random() * TAU; // random rotation each time
    anomalyScaleRef.current = 0.6 + Math.random() * 0.8; // 0.6 – 1.4× magnitude
    anomalyDurRef.current = 700 + Math.random() * 500; // 700 – 1200 ms
    const el = rippleRef.current;
    if (el) {
      el.classList.remove("ai-orb-ripple--active");
      void el.offsetWidth; // reflow — restarts the CSS animation
      el.classList.add("ai-orb-ripple--active");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      size = Math.max(rect.width || 64, 64);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cx = size / 2;
      cy = size / 2;
      radius = size * 0.45;
    };

    setup();

    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;
    const onMotionChange = () => {
      reducedMotion = media.matches;
    };
    media.addEventListener("change", onMotionChange);

    // ── CSS-variable palette ─────────────────────────────────────────────
    const syncPalette = () => {
      palFromRef.current = { ...palCurrentRef.current };
      palTargetRef.current = buildPaletteFromCSS();
      transStartRef.current = performance.now();
    };
    // Read initial palette (after CSS is applied)
    palTargetRef.current = buildPaletteFromCSS();
    palFromRef.current = palTargetRef.current;
    palCurrentRef.current = palTargetRef.current;

    // Update palette whenever the section changes
    const mutObs = new MutationObserver(syncPalette);
    mutObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-section"],
    });

    const draw = (now: number) => {
      ctx.clearRect(0, 0, size, size);

      const rot = reducedMotion ? 0.4 : now * 0.00022;

      // ── Per-layer animation oscillators ────────────────────────────
      // Each drives a different depth layer, creating parallax separation.
      const backDrift = reducedMotion ? 0 : Math.sin((now * TAU) / 22000); // 22 s
      const frontDrift = reducedMotion ? 0 : Math.sin((now * TAU) / 18000); // 18 s
      const vertDrift = reducedMotion ? 0 : Math.sin((now * TAU) / 12000); // 12 s
      const edgePulse = reducedMotion ? 0 : Math.sin((now * TAU) / 4800); //  4.8 s  (-1..1)
      const edgePulseP = (edgePulse + 1) * 0.5; // 0..1 for glow

      // ── Live palette (lerp toward target over 300 ms) ───────────────
      const transT = reducedMotion
        ? 1
        : Math.min(1, (now - transStartRef.current) / 300);
      const pal = lerpPalette(palFromRef.current, palTargetRef.current, transT);
      palCurrentRef.current = pal;

      // Very slow global sphere parallax
      const globDriftX = reducedMotion ? 0 : Math.sin(now / 28000) * 1.5;
      const globDriftY = reducedMotion ? 0 : Math.cos(now / 35000) * 1.0;

      // ── Anomaly effect (triggered on click) ────────────────────
      // Smooth bell envelope (sin) combined with a high-freq ripple (cos*6π)
      // gives a "glitchy disruption" quality: fast rise, oscillating decay.
      const anomalyAge = now - anomalyStartRef.current;
      const anomalyT = Math.min(1, anomalyAge / anomalyDurRef.current);
      const anomalyStrength =
        anomalyT < 1 && !reducedMotion
          ? Math.sin(anomalyT * Math.PI) *
            (1 + 0.3 * Math.cos(anomalyT * Math.PI * 6))
          : 0;
      const isAnomaly = anomalyStrength > 0.01;

      const projected = PARTICLES.map((p, i) => {
        const sp = Math.sin(p.phi);
        const cp = Math.cos(p.phi);
        const st = Math.sin(p.theta + rot);
        const ct = Math.cos(p.theta + rot);

        const x0 = sp * ct;
        const y0 = sp * st;
        const z0 = cp;

        // X-axis tilt for diagonal appearance
        const y1 = y0 * TILT_COS - z0 * TILT_SIN;
        const z1 = y0 * TILT_SIN + z0 * TILT_COS;

        // Front particles sit slightly closer via perspective
        const persp = 0.76 + (z1 + 1) * 0.12;
        const basePx = cx + x0 * radius * persp;
        const basePy = cy + y1 * radius * persp;

        // depth: 0 = back, 1 = front
        const depth = (z1 + 1) * 0.5;

        // Depth-layered parallax: back drifts right, front drifts left/up
        const layerF = depth - 0.5; // negative = back, positive = front
        const px =
          basePx +
          (layerF < 0
            ? backDrift * radius * 0.04 * Math.abs(layerF) * 2 // back  → right
            : -frontDrift * radius * 0.036 * layerF * 2); // front → left
        const py =
          basePy + (layerF > 0 ? -vertDrift * radius * 0.026 * layerF * 2 : 0); // front → up

        // Screen-space radial distance from projected centre
        const screenR = Math.hypot(px - cx, py - cy) / radius;
        const edgeness = Math.max(0, (screenR - 0.38) / 0.62);

        // ── Cluster hotspots (screen space) ──────────────────────
        // Left-front-lower
        const lfx = px - (cx - radius * 0.72);
        const lfy = py - (cy + radius * 0.42);
        const leftFront =
          Math.exp(
            -(lfx * lfx) / (radius * 0.26) ** 2 -
              (lfy * lfy) / (radius * 0.3) ** 2,
          ) *
          (0.35 + depth * 0.65); // modulated by front-ness

        // Right edge
        const rfx = px - (cx + radius * 0.8);
        const rfy = py - (cy - radius * 0.08);
        const rightEdge = Math.exp(
          -(rfx * rfx) / (radius * 0.2) ** 2 -
            (rfy * rfy) / (radius * 0.28) ** 2,
        );

        // Lower-front
        const lfbx = px - cx;
        const lfby = py - (cy + radius * 0.66);
        const lowerFront =
          Math.exp(
            -(lfbx * lfbx) / (radius * 0.38) ** 2 -
              (lfby * lfby) / (radius * 0.2) ** 2,
          ) * depth;

        const cluster = Math.max(leftFront, rightEdge, lowerFront);

        // ── Dimming terms ─────────────────────────────────────────
        // Top/centre dark pocket
        const tdx = px - cx;
        const tdy = py - (cy - radius * 0.18);
        const topDim =
          Math.exp(-(tdx * tdx + tdy * tdy) / (radius * 0.46) ** 2) * 0.58;

        // Back-hemisphere dim (3-D z)
        const backDim = Math.max(0, (0.42 - depth) * 1.3);

        // Slightly larger dots at lower-front and left-front cluster
        const pSize = 1.2 + lowerFront * 0.9 + leftFront * 0.5;

        // ── Color (palette-driven, no hardcoded values) ────────────
        let rgb: RGB;
        if (depth < 0.28 && cluster < 0.25) {
          rgb = pal.shadow; // back hemisphere
        } else if (depth < 0.45 && cluster < 0.3) {
          rgb = pal.mid; // back-mid zone
        } else if (cluster > 0.55 || (edgeness > 0.72 && depth > 0.5)) {
          rgb = pal.bright; // bright cluster core / bright front edge
        } else if (cluster > 0.3 || (leftFront > 0.2 && depth > 0.45)) {
          rgb = pal.accent; // cluster zone
        } else if (edgeness > 0.38 || depth > 0.55) {
          rgb = pal.primary; // outer ring / front half
        } else {
          rgb = pal.secondary; // interior mid-range
        }
        const [r, g, b] = rgb;

        // ── Opacity (intensity from CSS variable) ─────────────────
        const opacity = Math.min(
          0.96,
          Math.max(
            0.04,
            (0.08 +
              depth * 0.52 +
              edgeness * 0.34 +
              cluster * 0.5 -
              topDim -
              backDim +
              (edgeness > 0.5 ? edgePulse * 0.1 * edgeness : 0)) *
              pal.intensity,
          ),
        );

        // ── Anomaly jitter & flash ──────────────────────────────────
        let drawPx = px;
        let drawPy = py;
        let drawColor: RGB = [r, g, b];
        let drawSize = pSize;
        if (isAnomaly) {
          const rand = PARTICLE_RAND[i];
          // Each particle gets a unique displacement angle via an irrational
          // multiplier — avoids visible symmetry patterns in the scatter
          const dispAngle = rand * TAU * 5.618 + anomalyPhaseRef.current;
          const dispMag =
            anomalyStrength *
            radius *
            (0.06 + rand * 0.18) *
            anomalyScaleRef.current;
          drawPx += Math.cos(dispAngle) * dispMag;
          drawPy += Math.sin(dispAngle) * dispMag;
          // ~45 % of particles flash toward the palette's bright colour
          if (rand > 0.55) {
            const flashT = anomalyStrength * ((rand - 0.55) / 0.45);
            drawColor = lerpRGB(drawColor, pal.bright, flashT * 0.9);
          }
          // ~18 % of particles spike in size — visible "spark" nodes
          if (rand > 0.82) {
            drawSize =
              pSize * (1 + anomalyStrength * ((rand - 0.82) / 0.18) * 2.5);
          }
        }

        return {
          px: drawPx,
          py: drawPy,
          z: z1,
          opacity,
          r: drawColor[0],
          g: drawColor[1],
          b: drawColor[2],
          pSize: drawSize,
          edgeness,
          cluster,
          depth,
        };
      });

      // Back-to-front (painter's algorithm)
      projected.sort((pa, pb) => pa.z - pb.z);

      // Shift the entire sphere canvas by the global parallax amount
      ctx.save();
      ctx.translate(globDriftX, globDriftY);

      for (const p of projected) {
        if (p.opacity < 0.05) continue;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},${Math.min(0.9, p.opacity + 0.1)})`;
        ctx.shadowBlur =
          1.8 +
          p.edgeness * 5 +
          p.cluster * 9 +
          p.depth * 2.5 +
          (p.edgeness > 0.5 ? edgePulseP * 3.5 * p.edgeness : 0);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},1)`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.5, p.pSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Targeted top/centre dark pocket — adds volumetric depth without
      // covering the whole sphere
      const overlay = ctx.createRadialGradient(
        cx,
        cy - radius * 0.12,
        0,
        cx,
        cy - radius * 0.12,
        radius * 0.6,
      );
      overlay.addColorStop(0, "rgba(2,6,23,0.36)");
      overlay.addColorStop(0.6, "rgba(2,6,23,0.10)");
      overlay.addColorStop(1, "rgba(2,6,23,0)");
      ctx.fillStyle = overlay;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end global parallax
    };

    const loop = (now: number) => {
      draw(now);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      media.removeEventListener("change", onMotionChange);
      mutObs.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* Mobile backdrop — rendered below the wrapper (z-29 < z-30) so the
          orb and panel remain above it, but page content is dimmed */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="ai-backdrop-enter fixed inset-0 z-[29] bg-black/50 md:hidden"
        />
      )}

      {/* Wrapper: fixed anchor for both the orb and the desktop card */}
      <div
        className={cn(
          "fixed z-30 flex flex-col items-end gap-3",
          "bottom-[calc(16px+env(safe-area-inset-bottom))] right-4",
          "md:bottom-6 md:right-6",
          "lg:bottom-8 lg:right-8",
          className,
        )}
      >
        {/* AI assistant panel — temporarily hidden */}
        {false && isOpen && (
          <section
            id="ai-profile-assistant-panel"
            aria-labelledby="ai-assistant-heading"
            className={cn(
              "ai-panel-enter",
              // Mobile: full-width fixed bottom sheet
              "fixed left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom))]",
              "max-h-[75vh] overflow-x-hidden overflow-y-auto overscroll-contain",
              // Desktop: static card stacked above the orb in the flex column
              "md:static md:bottom-auto md:left-auto md:right-auto md:z-auto",
              "md:w-80 md:max-h-none md:overflow-hidden",
              // Shared visual
              "rounded-2xl border border-cyan-400/[0.18] bg-[rgba(2,8,30,0.92)]",
              "shadow-[0_0_0_1px_rgba(103,232,249,0.07),0_24px_56px_rgba(0,0,0,0.7)] backdrop-blur-xl",
            )}
          >
            {/* Mobile drag handle */}
            <div
              aria-hidden="true"
              className="mx-auto mb-0.5 mt-3 h-1 w-10 rounded-full bg-white/[0.15] md:hidden"
            />

            {/* Top accent line */}
            <div
              aria-hidden="true"
              className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
            />

            {/* Header */}
            <div className="flex items-start gap-3 px-5 pb-3 pt-4">
              <div className="min-w-0 flex-1">
                <h3
                  id="ai-assistant-heading"
                  className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400 md:text-[10px]"
                >
                  AI Profile Assistant
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 md:text-[11px]">
                  Soon you&apos;ll be able to ask me about my resume, projects,
                  experience, skills, and how I can help your team.
                </p>
              </div>
              {/* Close button — 44 × 44 px tap target on mobile */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI profile assistant"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:h-auto md:w-auto md:p-1"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div aria-hidden="true" className="mx-5 h-px bg-white/[0.06]" />

            {/* Suggested questions */}
            <div className="px-5 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 md:text-[9px]">
                Try asking
              </p>
              <ul role="list" className="space-y-2 md:space-y-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <li
                    key={q}
                    className="rounded-lg border border-slate-700/50 px-3 py-3 text-sm leading-snug text-slate-400 md:py-2 md:text-[11px]"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div aria-hidden="true" className="mx-5 h-px bg-white/[0.06]" />

            {/* Actions — min-h-[44px] tap targets on mobile */}
            <nav
              aria-label="Profile shortcuts"
              className="flex flex-wrap gap-2 px-5 py-4 md:py-3"
            >
              <a
                href="#work"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:min-h-0 md:px-3 md:py-1.5 md:text-[11px]"
              >
                View Work
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:min-h-0 md:px-3 md:py-1.5 md:text-[11px]"
              >
                View Resume
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:min-h-0 md:px-3 md:py-1.5 md:text-[11px]"
              >
                Contact Me
              </a>
            </nav>
          </section>
        )}

        {/* Orb trigger button */}
        <button
          type="button"
          aria-label="Open AI profile assistant"
          aria-expanded={isOpen}
          aria-controls="ai-profile-assistant-panel"
          onClick={handleClick}
          className={cn(
            "ai-orb group relative isolate overflow-visible rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]",
            "h-16 w-16",
            "md:h-[88px] md:w-[88px]",
            "lg:h-[112px] lg:w-[112px]",
            isOpen && "scale-[1.06]",
          )}
        >
          <span
            aria-hidden="true"
            className="ai-orb-aura pointer-events-none absolute inset-[-20%] rounded-full"
          />
          <span
            ref={rippleRef}
            aria-hidden="true"
            className="ai-orb-ripple pointer-events-none absolute inset-0 rounded-full"
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full transition-[filter] duration-300",
              isOpen && "brightness-[1.2]",
            )}
          />
        </button>
      </div>
    </>
  );
}
