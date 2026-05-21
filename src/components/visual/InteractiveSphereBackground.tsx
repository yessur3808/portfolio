"use client";

import { useEffect, useRef } from "react";
import { QualityManager } from "@/src/lib/qualityManager";
import type { QualityConfig } from "@/src/lib/qualityManager";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
};

type StarLayer = {
  stars: Star[];
  color: string;
  parallax: number;
  twinkleSpeed: number;
  glow: number;
};

type NetworkNode = {
  x: number; // 0–1 normalised
  y: number;
  depth: number;
  phase: number;
};

type NetworkEdge = { from: number; to: number };

const SECTION_ACCENT_MAP: Record<string, [number, number, number]> = {
  home: [79, 195, 247],
  about: [138, 108, 255],
  experience: [79, 195, 247],
  work: [138, 108, 255],
  stack: [79, 195, 247],
  contact: [138, 108, 255],
};

const STAR_LAYER_CONFIG = [
  {
    minSize: 0.35,
    maxSize: 1.0,
    alphaMin: 0.16,
    alphaMax: 0.45,
    color: "rgba(228, 248, 255, 1)",
    parallax: 8,
    twinkleSpeed: 0.0007,
    glow: 0,
  },
  {
    minSize: 0.45,
    maxSize: 1.35,
    alphaMin: 0.12,
    alphaMax: 0.32,
    color: "rgba(79, 195, 247, 1)",
    parallax: 14,
    twinkleSpeed: 0.001,
    glow: 2,
  },
  {
    minSize: 0.55,
    maxSize: 1.65,
    alphaMin: 0.1,
    alphaMax: 0.26,
    color: "rgba(138, 108, 255, 1)",
    parallax: 20,
    twinkleSpeed: 0.0012,
    glow: 3,
  },
] as const;

const NETWORK_NODE_COUNT = 22;
const BURST_DURATION_MS = 1200;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - chroma / 2;

  let rp = 0,
    gp = 0,
    bp = 0;

  if (hue < 60) {
    rp = chroma;
    gp = x;
  } else if (hue < 120) {
    rp = x;
    gp = chroma;
  } else if (hue < 180) {
    gp = chroma;
    bp = x;
  } else if (hue < 240) {
    gp = x;
    bp = chroma;
  } else if (hue < 300) {
    rp = x;
    bp = chroma;
  } else {
    rp = chroma;
    bp = x;
  }

  return [
    Math.round((rp + m) * 255),
    Math.round((gp + m) * 255),
    Math.round((bp + m) * 255),
  ];
}

function createSphereParticles(count: number): Particle[] {
  const pts: Particle[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      size: 0.22 + Math.random() * 0.62,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return pts;
}

function createStarLayers(
  w: number,
  h: number,
  counts: readonly [number, number, number],
): StarLayer[] {
  return STAR_LAYER_CONFIG.map((cfg, i) => {
    const stars: Star[] = [];

    for (let j = 0; j < counts[i]; j++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize),
        alpha: cfg.alphaMin + Math.random() * (cfg.alphaMax - cfg.alphaMin),
        phase: Math.random() * Math.PI * 2,
      });
    }

    return {
      stars,
      color: cfg.color,
      parallax: cfg.parallax,
      twinkleSpeed: cfg.twinkleSpeed,
      glow: cfg.glow,
    };
  });
}

function createNetworkNodes(count: number): NetworkNode[] {
  const nodes: NetworkNode[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const angle = t * Math.PI * 7 + Math.random() * 0.5;
    const radius = 0.14 + Math.random() * 0.72;
    nodes.push({
      x: clamp(0.5 + Math.cos(angle) * radius * 0.44, 0.04, 0.96),
      y: clamp(0.5 + Math.sin(angle) * radius * 0.36, 0.06, 0.94),
      depth: Math.random(),
      phase: Math.random() * Math.PI * 2,
    });
  }

  return nodes;
}

function createNetworkEdges(nodes: NetworkNode[]): NetworkEdge[] {
  const edgeSet = new Set<string>();

  nodes.forEach((n, i) => {
    nodes.forEach((o, j) => {
      if (i >= j) return;
      if (Math.hypot(n.x - o.x, n.y - o.y) <= 0.28) edgeSet.add(`${i}-${j}`);
    });
  });

  return Array.from(edgeSet)
    .slice(0, 36)
    .map((k) => {
      const [from, to] = k.split("-").map(Number);
      return { from, to };
    });
}

function rotateX(p: { x: number; y: number; z: number }, a: number) {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function rotateY(p: { x: number; y: number; z: number }, a: number) {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

export default function InteractiveSphereBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // ── Quality manager ──────────────────────────────────────────────────
    const qm = new QualityManager();
    let config: QualityConfig = qm.getConfig();

    // ── Mutable canvas state ─────────────────────────────────────────────
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);

    // ── Buffers (rebuilt on tier change) ─────────────────────────────────
    let particles: Particle[] = [];
    let starLayers: StarLayer[] = [];
    let networkNodes: NetworkNode[] = [];
    let networkEdges: NetworkEdge[] = [];

    const rebuildAll = () => {
      config = qm.getConfig();
      particles = createSphereParticles(config.particleCount);
      starLayers = createStarLayers(width, height, config.starCounts);
      if (config.enableNetworkNodes) {
        networkNodes = createNetworkNodes(NETWORK_NODE_COUNT);
        networkEdges = createNetworkEdges(networkNodes);
      } else {
        networkNodes = [];
        networkEdges = [];
      }
    };

    const applyCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── Scroll / section tracking ────────────────────────────────────────
    const accentTarget: [number, number, number] = [
      ...SECTION_ACCENT_MAP.home,
    ] as [number, number, number];
    const accentCurrent: [number, number, number] = [
      ...SECTION_ACCENT_MAP.home,
    ] as [number, number, number];

    let scrollTravelTarget = 0;
    let scrollTravelCurrent = 0;
    let scrollVelocity = 0;
    let prevSectionId = "home";
    let burstUntil = 0;

    const detectSection = () => {
      for (const el of document.querySelectorAll("section[id]")) {
        const id = el.getAttribute("id");
        if (!id) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.46 && rect.bottom > 0) {
          const c = SECTION_ACCENT_MAP[id] ?? SECTION_ACCENT_MAP.home;
          accentTarget[0] = c[0];
          accentTarget[1] = c[1];
          accentTarget[2] = c[2];

          if (id !== prevSectionId) {
            prevSectionId = id;
            burstUntil = performance.now() + BURST_DURATION_MS;
          }

          break;
        }
      }
    };

    const updateScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - height,
        0,
      );

      if (maxScroll <= 0) {
        scrollVelocity = 0;
        scrollTravelTarget = 0;
        return;
      }

      const next = clamp((window.scrollY / maxScroll) * 180, 0, 180);
      scrollVelocity = clamp(next - scrollTravelTarget, -18, 18);
      scrollTravelTarget = next;
    };

    // ── Event handlers ───────────────────────────────────────────────────
    let needsRedraw = true;
    let pageVisible = true;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      applyCanvasSize();
      starLayers = createStarLayers(width, height, config.starCounts);
      needsRedraw = true;
    };

    const handleScroll = () => {
      detectSection();
      updateScroll();
      needsRedraw = true;
    };

    const handleVisibility = () => {
      pageVisible = !document.hidden;
    };

    // ── Draw loop ────────────────────────────────────────────────────────
    let lastFrameTime = 0;
    let rafId: number | null = null;

    const draw = (time: number) => {
      rafId = window.requestAnimationFrame(draw);

      if (!pageVisible) return;
      if (config.staticFrameMode && !needsRedraw) return;
      if (time - lastFrameTime < 1000 / config.targetFps) return;

      const frameStart = performance.now();
      needsRedraw = false;
      lastFrameTime = time;

      // ── Lerp accent color & scroll ─────────────────────────────────────
      for (let i = 0; i < 3; i++) {
        accentCurrent[i] = lerp(accentCurrent[i], accentTarget[i], 0.05);
      }
      scrollTravelCurrent = lerp(scrollTravelCurrent, scrollTravelTarget, 0.1);

      const st = scrollTravelCurrent;
      const sv = scrollVelocity;

      // Slowly shift accent hue for color life on mid/high
      let ar: string;

      if (config.accentLayerCount >= 2) {
        const live = hslToRgb((time * 0.004) % 360, 0.66, 0.58);
        ar = `${Math.round(lerp(accentCurrent[0], live[0], 0.08))}, ${Math.round(lerp(accentCurrent[1], live[1], 0.08))}, ${Math.round(lerp(accentCurrent[2], live[2], 0.08))}`;
      } else {
        ar = `${Math.round(accentCurrent[0])}, ${Math.round(accentCurrent[1])}, ${Math.round(accentCurrent[2])}`;
      }

      const cX = width * 0.5;
      const cY = height * 0.42;
      const minSide = Math.min(width, height);
      const sphereR =
        width < 640 ? minSide * 0.12 : Math.min(minSide * 0.145, 150);

      const spinX = -0.18 + st * 0.0048 + sv * 0.08 + time * 0.00005;
      const spinY = time * 0.00006 + st * 0.028 + sv * 0.16;

      const burstFactor = config.enableBloom
        ? Math.max(0, (burstUntil - performance.now()) / BURST_DURATION_MS)
        : 0;

      const maxDim = Math.max(width, height);

      // ── Background ────────────────────────────────────────────────────
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(cX, cY, 0, cX, cY, maxDim * 0.84);
      bg.addColorStop(0, "rgba(11, 16, 28, 1)");
      bg.addColorStop(0.45, "rgba(5, 8, 18, 1)");
      bg.addColorStop(1, "rgba(2, 4, 10, 1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ── Accent gradient overlays ──────────────────────────────────────
      const gA = ctx.createRadialGradient(
        width * 0.18,
        height * 0.14 + st * 0.1,
        0,
        width * 0.18,
        height * 0.14 + st * 0.1,
        maxDim * 0.44,
      );
      gA.addColorStop(0, `rgba(${ar}, 0.09)`);
      gA.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gA;
      ctx.fillRect(0, 0, width, height);

      if (config.accentLayerCount >= 2) {
        const gB = ctx.createRadialGradient(
          width * 0.84,
          height * 0.18 + st * 0.04,
          0,
          width * 0.84,
          height * 0.18 + st * 0.04,
          maxDim * 0.34,
        );
        gB.addColorStop(0, "rgba(79, 195, 247, 0.07)");
        gB.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gB;
        ctx.fillRect(0, 0, width, height);
      }

      if (config.accentLayerCount >= 3) {
        const gC = ctx.createRadialGradient(
          width * 0.5,
          height * 0.86 + st * 0.06,
          0,
          width * 0.5,
          height * 0.86 + st * 0.06,
          maxDim * 0.28,
        );
        gC.addColorStop(0, "rgba(138, 108, 255, 0.07)");
        gC.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gC;
        ctx.fillRect(0, 0, width, height);
      }

      // ── Network nodes/edges (high tier, single-pass batched) ──────────
      if (config.enableNetworkNodes && networkEdges.length > 0) {
        const drift = time * 0.00006;

        ctx.globalAlpha = 0.16;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        for (const edge of networkEdges) {
          const fn = networkNodes[edge.from];
          const tn = networkNodes[edge.to];
          if (!fn || !tn) continue;
          ctx.moveTo(
            fn.x * width + Math.cos(drift + fn.phase) * 5,
            fn.y * height + st * 0.18 + Math.sin(drift + fn.phase) * 3,
          );
          ctx.lineTo(
            tn.x * width + Math.cos(drift + tn.phase) * 5,
            tn.y * height + st * 0.18 + Math.sin(drift + tn.phase) * 3,
          );
        }

        ctx.stroke();

        ctx.fillStyle = `rgba(${ar}, 0.78)`;
        ctx.beginPath();

        for (const node of networkNodes) {
          const nx = node.x * width + Math.cos(drift + node.phase) * 5;
          const ny =
            node.y * height + st * 0.18 + Math.sin(drift + node.phase) * 3;
          const nr = 0.7 + node.depth * 1.35;
          ctx.moveTo(nx + nr, ny);
          ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ── Stars ─────────────────────────────────────────────────────────
      for (const layer of starLayers) {
        ctx.fillStyle = layer.color;
        ctx.shadowBlur = config.enableStarGlow ? layer.glow : 0;
        ctx.shadowColor = layer.color;

        for (const star of layer.stars) {
          const sx =
            star.x +
            Math.sin(time * layer.twinkleSpeed + star.phase) *
              layer.parallax *
              0.18;
          const sy =
            star.y +
            st * 0.22 +
            Math.cos(time * layer.twinkleSpeed + star.phase) *
              layer.parallax *
              0.12;

          if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) {
            continue;
          }

          ctx.globalAlpha =
            star.alpha *
            (0.82 + Math.sin(time * layer.twinkleSpeed + star.phase) * 0.18);
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // ── Atmospheric corona — soft halo defining the sphere volume ──────
      const coronaR = sphereR * 1.38;
      const corona = ctx.createRadialGradient(cX, cY, 0, cX, cY, coronaR);
      corona.addColorStop(0.0, `rgba(${ar}, 0.07)`);
      corona.addColorStop(0.55, `rgba(${ar}, 0.04)`);
      corona.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = corona;
      ctx.fillRect(cX - coronaR, cY - coronaR, coronaR * 2, coronaR * 2);

      // ── Sphere body shading — directional light + soft terminator ────
      const lightX =
        cX - sphereR * 0.42 + Math.sin(spinY * 0.8) * sphereR * 0.08;
      const lightY =
        cY - sphereR * 0.36 + Math.sin(spinX * 1.1) * sphereR * 0.05;
      const termX = Math.sin(spinY * 0.95);
      const termY = Math.sin(spinX * 0.9) * 0.32;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cX, cY, sphereR, 0, Math.PI * 2);
      ctx.clip();

      const body = ctx.createRadialGradient(
        lightX,
        lightY,
        sphereR * 0.08,
        cX,
        cY,
        sphereR * 1.1,
      );
      body.addColorStop(0, "rgba(255, 255, 255, 0.09)");
      body.addColorStop(0.35, "rgba(79, 195, 247, 0.06)");
      body.addColorStop(1, "rgba(2, 8, 24, 0.22)");
      ctx.fillStyle = body;
      ctx.fillRect(cX - sphereR, cY - sphereR, sphereR * 2, sphereR * 2);

      const terminator = ctx.createLinearGradient(
        cX - termX * sphereR,
        cY - termY * sphereR,
        cX + termX * sphereR,
        cY + termY * sphereR,
      );
      terminator.addColorStop(0, "rgba(1, 4, 12, 0.46)");
      terminator.addColorStop(0.45, "rgba(1, 4, 12, 0.1)");
      terminator.addColorStop(0.7, "rgba(255, 255, 255, 0.02)");
      terminator.addColorStop(1, "rgba(255, 255, 255, 0.12)");
      ctx.fillStyle = terminator;
      ctx.fillRect(cX - sphereR, cY - sphereR, sphereR * 2, sphereR * 2);

      const depthShadow = ctx.createRadialGradient(
        cX + termX * sphereR * 0.45,
        cY + termY * sphereR * 0.38,
        sphereR * 0.08,
        cX,
        cY,
        sphereR * 1.06,
      );
      depthShadow.addColorStop(0, "rgba(2, 8, 24, 0.02)");
      depthShadow.addColorStop(0.58, "rgba(2, 8, 24, 0.1)");
      depthShadow.addColorStop(1, "rgba(1, 4, 12, 0.34)");
      ctx.fillStyle = depthShadow;
      ctx.fillRect(cX - sphereR, cY - sphereR, sphereR * 2, sphereR * 2);
      ctx.restore();

      // ── Particles — sphere surface with quadratic limb darkening ──────
      // Quadratic falloff makes edge particles ~4× dimmer than the front pole,
      // which is the primary visual cue that this is a solid sphere.
      const projected = particles.map((p) => {
        let rot = rotateX(p, spinX);
        rot = rotateY(rot, spinY);

        const persp = 1.9;
        const scale = persp / (rot.z + persp);
        const front = (rot.z + 1) / 2;
        const limb = front * front;
        const depthScale = 0.68 + front * 0.56;

        return {
          x: cX + rot.x * sphereR * scale,
          y: cY + rot.y * sphereR * scale,
          z: rot.z,
          front,
          alpha: 0.008 + limb * 0.992,
          size: p.size * (2.55 + limb * 2.35) * scale * depthScale,
          phase: p.phase,
        };
      });

      if (config.enableDepthSort) projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const twinkle = 0.8 + Math.sin(time * 0.001 + p.phase) * 0.2;
        const depthFade = 0.28 + p.front * 0.72;
        ctx.globalAlpha = p.alpha * twinkle * depthFade;
        ctx.fillStyle =
          p.z > 0.5
            ? "rgba(248, 250, 252, 1)"
            : p.z > 0.1
              ? "rgba(79, 195, 247, 1)"
              : "rgba(14, 42, 71, 1)";
        const sz = Math.max(0.26, p.size);
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // ── Bloom glow — batched front particles (mid/high) ───────────────
      if (config.enableBloom) {
        const frontPts = projected.filter((p) => p.z > 0.3);
        const boost = 1 + burstFactor * 0.6;

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${ar}, 0.85)`;
        ctx.fillStyle = `rgba(220, 240, 255, ${Math.min(1, 0.5 * boost)})`;
        ctx.beginPath();

        for (const p of frontPts.slice(0, config.bloomParticleLimit)) {
          const sz = Math.max(0.8, p.size * 1.4);
          ctx.moveTo(p.x + sz, p.y);
          ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.restore();
      }

      // ── Specular highlight — top-left bright spot (mid/high) ─────────
      if (config.enableBloom) {
        const specX = cX - sphereR * 0.3;
        const specY = cY - sphereR * 0.38;
        const spec = ctx.createRadialGradient(
          specX,
          specY,
          0,
          specX,
          specY,
          sphereR * 0.48,
        );
        spec.addColorStop(0, "rgba(255, 255, 255, 0.22)");
        spec.addColorStop(0.38, "rgba(220, 240, 255, 0.07)");
        spec.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = spec;
        ctx.fillRect(cX - sphereR, cY - sphereR, sphereR * 2, sphereR * 2);
      }

      // ── Adaptive quality ──────────────────────────────────────────────
      if (qm.sampleFrame(performance.now() - frameStart, time)) {
        rebuildAll();
        applyCanvasSize();
      }
    };

    // ── Initialise ───────────────────────────────────────────────────────
    rebuildAll();
    applyCanvasSize();
    detectSection();
    updateScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen bg-slate-950"
    />
  );
}
