"use client";;
import { useEffect, useRef } from "react";

import { cn } from "@/src/lib/utils";

type Point = {
  x: number;
  y: number;
};

type Connection = {
  from: Point;
  to: Point;
  color: string;
  width: number;
  progress: number;
  speed: number;
};

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
};

type AnimatedMissionBackgroundProps = {
  className?: string;
};

const DEEP_BG = "#020617";
const CYAN = "#00fff7";
const BLUE = "#00b4ff";
const VIOLET = "#c084fc";
const PURPLE = "#a855f7";
const AZURE = "#38bdf8";
const ELECTRIC_BLUE = "#818cf8";
const STREAK_COLORS = [
  CYAN,
  BLUE,
  VIOLET,
  PURPLE,
  AZURE,
  ELECTRIC_BLUE,
] as const;
const MAX_ACTIVE_CONNECTIONS = 9;
const SPAWN_INTERVAL_MIN_MS = 520;
const SPAWN_INTERVAL_MAX_MS = 1250;

const rand = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

const randInt = (min: number, max: number) => {
  return Math.floor(rand(min, max + 1));
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createNodes = (width: number, height: number) => {
  const cols = Math.max(4, Math.floor(width / 220));
  const rows = Math.max(4, Math.floor(height / 190));
  const nodes: Point[] = [];
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const centerSafeWidth = width * 0.28;
  const centerSafeHeight = height * 0.34;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const baseX = ((col + 0.5) / cols) * width;
      const baseY = ((row + 0.5) / rows) * height;
      const inCenter =
        Math.abs(baseX - centerX) < centerSafeWidth * 0.5 &&
        Math.abs(baseY - centerY) < centerSafeHeight * 0.5;
      const jitterX = inCenter ? rand(-22, 22) : rand(-48, 48);
      const jitterY = inCenter ? rand(-18, 18) : rand(-42, 42);
      const x = clamp(baseX + jitterX, 16, width - 16);
      const y = clamp(baseY + jitterY, 16, height - 16);
      nodes.push({ x, y });
    }
  }

  return nodes;
};

const createStars = (width: number, height: number) => {
  const count = clamp(Math.floor((width * height) / 21000), 80, 160);
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.35, 1.15),
      a: rand(0.08, 0.24),
    });
  }

  return stars;
};

const drawBase = (ctx: CanvasRenderingContext2D, width: number, height: number, stars: Star[]) => {
  ctx.save();

  ctx.fillStyle = DEEP_BG;
  ctx.fillRect(0, 0, width, height);

  const cyanGlow = ctx.createRadialGradient(
    width * 0.2,
    height * 0.18,
    0,
    width * 0.2,
    height * 0.18,
    Math.max(width, height) * 0.64,
  );
  cyanGlow.addColorStop(0, "rgba(103, 232, 249, 0.24)");
  cyanGlow.addColorStop(0.45, "rgba(56, 189, 248, 0.16)");
  cyanGlow.addColorStop(1, "rgba(56, 189, 248, 0)");

  const violetGlow = ctx.createRadialGradient(
    width * 0.82,
    height * 0.3,
    0,
    width * 0.82,
    height * 0.3,
    Math.max(width, height) * 0.58,
  );
  violetGlow.addColorStop(0, "rgba(167, 139, 250, 0.22)");
  violetGlow.addColorStop(0.5, "rgba(167, 139, 250, 0.12)");
  violetGlow.addColorStop(1, "rgba(139, 92, 246, 0)");

  const blueGlow = ctx.createRadialGradient(
    width * 0.56,
    height * 0.84,
    0,
    width * 0.56,
    height * 0.84,
    Math.max(width, height) * 0.48,
  );
  blueGlow.addColorStop(0, "rgba(56, 189, 248, 0.16)");
  blueGlow.addColorStop(1, "rgba(56, 189, 248, 0)");

  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = violetGlow;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = blueGlow;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(star.a * 1.35, 0.8)})`;
    ctx.fill();
  }

  ctx.restore();
};

const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Point[], connections: Connection[]) => {
  const hotNodes = new Set<string>();
  for (const connection of connections) {
    hotNodes.add(
      `${Math.round(connection.from.x)}:${Math.round(connection.from.y)}`,
    );
    hotNodes.add(
      `${Math.round(connection.to.x)}:${Math.round(connection.to.y)}`,
    );
  }

  for (const node of nodes) {
    const key = `${Math.round(node.x)}:${Math.round(node.y)}`;
    const boosted = hotNodes.has(key);

    ctx.save();
    if (boosted) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(0, 255, 247, 0.9)";
    }
    ctx.beginPath();
    ctx.fillStyle = boosted
      ? "rgba(0, 255, 247, 0.85)"
      : "rgba(148, 163, 184, 0.3)";
    ctx.arc(node.x, node.y, boosted ? 2.2 : 1.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = boosted
      ? "rgba(0, 255, 247, 1.0)"
      : "rgba(103, 232, 249, 0.4)";
    ctx.arc(node.x, node.y, boosted ? 1.3 : 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

const findTargetNode = (nodes: Point[], from: Point, width: number) => {
  const maxDx = width * 0.24;
  const candidates = nodes.filter((node) => {
    const dy = node.y - from.y;
    const dx = Math.abs(node.x - from.x);
    return dy > 36 && dy < 320 && dx < maxDx;
  });

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
};

const isInsideCenterSafeZone = (node: Point, width: number, height: number) => {
  const safeHalfWidth = width * 0.14;
  const safeHalfHeight = height * 0.17;
  return (
    Math.abs(node.x - width * 0.5) <= safeHalfWidth &&
    Math.abs(node.y - height * 0.5) <= safeHalfHeight
  );
};

const zoneKey = (node: Point, width: number, height: number) => {
  const col = node.x < width / 3 ? 0 : node.x > (width * 2) / 3 ? 2 : 1;
  const row = node.y < height / 2 ? 0 : 1;
  return `${row}-${col}`;
};

const pickStartNode = (nodes: Point[], connections: Connection[], width: number, height: number) => {
  const starts = nodes.filter(
    (node) =>
      node.y < height * 0.8 && !isInsideCenterSafeZone(node, width, height),
  );

  if (starts.length === 0) {
    return null;
  }

  const load = new Map<string, number>();
  for (const connection of connections) {
    const key = zoneKey(connection.from, width, height);
    load.set(key, (load.get(key) ?? 0) + 1);
  }

  let minLoad = Number.POSITIVE_INFINITY;
  for (const node of starts) {
    const count = load.get(zoneKey(node, width, height)) ?? 0;
    if (count < minLoad) {
      minLoad = count;
    }
  }

  const candidates = starts.filter(
    (node) => (load.get(zoneKey(node, width, height)) ?? 0) <= minLoad,
  );
  return candidates[randInt(0, candidates.length - 1)] ?? null;
};

export const AnimatedMissionBackground = (
  {
    className,
  }: AnimatedMissionBackgroundProps,
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const connectionsRef = useRef<Connection[]>([]);
  const nodesRef = useRef<Point[]>([]);
  const starsRef = useRef<Star[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setReducedMotion = () => {
      reducedMotionRef.current = media.matches;
    };

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      nodesRef.current = createNodes(width, height);
      starsRef.current = createStars(width, height);
      connectionsRef.current = [];
      drawBase(ctx, width, height, starsRef.current);
      drawNodes(ctx, nodesRef.current, connectionsRef.current);
    };

    const spawnConnection = () => {
      const nodes = nodesRef.current;
      if (
        nodes.length < 2 ||
        connectionsRef.current.length >= MAX_ACTIVE_CONNECTIONS
      ) {
        return;
      }

      const from = pickStartNode(nodes, connectionsRef.current, width, height);
      if (!from) {
        return;
      }

      const firstTarget = findTargetNode(nodes, from, width);
      const to =
        firstTarget && !isInsideCenterSafeZone(firstTarget, width, height)
          ? firstTarget
          : null;
      if (!to) {
        return;
      }

      const color = STREAK_COLORS[randInt(0, STREAK_COLORS.length - 1)] ?? CYAN;

      connectionsRef.current.push({
        from,
        to,
        color,
        width: rand(1.8, 3.0),
        progress: 0,
        speed: rand(0.24, 0.42),
      });
    };

    const scheduleSpawn = () => {
      if (reducedMotionRef.current) {
        return;
      }

      const delay = randInt(SPAWN_INTERVAL_MIN_MS, SPAWN_INTERVAL_MAX_MS);
      spawnTimerRef.current = window.setTimeout(() => {
        spawnConnection();
        scheduleSpawn();
      }, delay);
    };

    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      drawBase(ctx, width, height, starsRef.current);

      const nextConnections: Connection[] = [];

      for (const connection of connectionsRef.current) {
        const nextProgress = connection.progress + connection.speed * dt;
        if (nextProgress >= 1) {
          continue;
        }

        const alpha = Math.sin(nextProgress * Math.PI) * 0.92;
        const lineAlpha = clamp(alpha, 0.45, 0.88);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.lineWidth = connection.width;
        ctx.strokeStyle = hexToRgba(connection.color, lineAlpha);
        ctx.shadowBlur = 48;
        ctx.shadowColor = hexToRgba(connection.color, lineAlpha * 1.4);
        ctx.stroke();
        // second pass for stronger glow core
        ctx.lineWidth = connection.width * 0.45;
        ctx.strokeStyle = hexToRgba(
          connection.color,
          Math.min(lineAlpha + 0.25, 1.0),
        );
        ctx.shadowBlur = 20;
        ctx.stroke();

        const pulseX =
          connection.from.x +
          (connection.to.x - connection.from.x) * nextProgress;
        const pulseY =
          connection.from.y +
          (connection.to.y - connection.from.y) * nextProgress;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 4.0, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(
          connection.color,
          clamp(alpha + 0.3, 0.55, 1.0),
        );
        ctx.shadowBlur = 56;
        ctx.shadowColor = hexToRgba(connection.color, 1.0);
        ctx.fill();
        // bright white core on pulse dot
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
        ctx.shadowBlur = 12;
        ctx.shadowColor = hexToRgba(connection.color, 1.0);
        ctx.fill();
        ctx.restore();

        nextConnections.push({ ...connection, progress: nextProgress });
      }

      connectionsRef.current = nextConnections;
      drawNodes(ctx, nodesRef.current, connectionsRef.current);
      rafRef.current = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (spawnTimerRef.current !== null) {
        window.clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }

      drawBase(ctx, width, height, starsRef.current);
      drawNodes(ctx, nodesRef.current, connectionsRef.current);

      if (reducedMotionRef.current) {
        return;
      }

      scheduleSpawn();

      last = performance.now();
      rafRef.current = window.requestAnimationFrame(render);
    };

    const onMotionPreferenceChange = () => {
      setReducedMotion();
      connectionsRef.current = [];
      start();
    };

    setReducedMotion();
    resize();
    start();

    window.addEventListener("resize", resize);
    media.addEventListener("change", onMotionPreferenceChange);

    return () => {
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", onMotionPreferenceChange);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (spawnTimerRef.current !== null) {
        window.clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default AnimatedMissionBackground;
