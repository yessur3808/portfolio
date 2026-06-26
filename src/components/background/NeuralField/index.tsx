"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/src/lib/utils";

type NeuralFieldProps = {
  className?: string;
};

type NeuralNode = {
  x: number;
  y: number;
  bx: number;
  by: number;
  z: number;
  act: number;
  ph: number;
  dir: number;
  spd: number;
  turn: number;
  jph: number;
  js: number;
  ja: number;
  edges: number[];
};

type NeuralEdge = {
  a: number;
  b: number;
  cur: number;
  tgt: number;
  timer: number;
};

type NeuralPulse = {
  a: number;
  b: number;
  t: number;
  spd: number;
  col: string;
  gen: number;
};

type NeuralShock = {
  x: number;
  y: number;
  r: number;
  max: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const CY = "94,234,212";
const SK = "56,189,248";
const VI = "129,140,248";
const MG = "217,140,250";
const WT = "255,255,255";

function clampAlpha(value: number) {
  return value > 0 ? (value < 1 ? value : 1) : 0;
}

export default function NeuralField({ className }: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const canvasElement = canvas;

    const ctx = canvasElement.getContext("2d", { alpha: false });
    if (!ctx) {
      return;
    }
    const drawingContext = ctx;

    const bgCanvas = document.createElement("canvas");
    const bgCtx = bgCanvas.getContext("2d");
    if (!bgCtx) {
      return;
    }
    const bgContext = bgCtx;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = media.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let tick = 0;
    let last = 0;
    let marginX = 0;
    let marginY = 0;

    const pointer: PointerState = { x: -9999, y: -9999, active: false };

    let nodes: NeuralNode[] = [];
    let edges: NeuralEdge[] = [];
    let pulses: NeuralPulse[] = [];
    let shocks: NeuralShock[] = [];

    function build() {
      nodes = [];
      edges = [];

      const target = Math.max(
        48,
        Math.min(140, Math.round((width * height) / 22000)),
      );
      const aspect = width / height;
      const cols = Math.max(4, Math.round(Math.sqrt(target * aspect)));
      const rows = Math.max(4, Math.round(target / cols));
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      marginX = cellWidth;
      marginY = cellHeight;

      for (let gridY = -1; gridY <= rows; gridY += 1) {
        for (let gridX = -1; gridX <= cols; gridX += 1) {
          const x = (gridX + 0.5 + (Math.random() - 0.5) * 0.5) * cellWidth;
          const y = (gridY + 0.5 + (Math.random() - 0.5) * 0.5) * cellHeight;
          const z = 0.3 + Math.random() * 0.7;
          const dir = Math.random() * Math.PI * 2;

          nodes.push({
            x,
            y,
            bx: x,
            by: y,
            z,
            act: 0,
            ph: Math.random() * Math.PI * 2,
            dir,
            spd: (0.08 + Math.random() * 0.22) * (0.4 + z * 0.6),
            turn: 0.004 + Math.random() * 0.01,
            jph: Math.random() * Math.PI * 2,
            js: 0.01 + Math.random() * 0.02,
            ja: 0.6 + Math.random() * 1.2,
            edges: [],
          });
        }
      }

      const cell = Math.min(cellWidth, cellHeight);
      const radius = cell * 1.45;
      const radiusSquared = radius * radius;
      const seen = new Set<string>();
      const maxCandidates = 4;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const nearby: Array<[number, number]> = [];

        for (let j = 0; j < nodes.length; j += 1) {
          if (i === j) {
            continue;
          }

          const otherNode = nodes[j];
          const distanceSquared =
            (node.bx - otherNode.bx) ** 2 + (node.by - otherNode.by) ** 2;

          if (distanceSquared < radiusSquared) {
            nearby.push([distanceSquared, j]);
          }
        }

        nearby.sort((left, right) => left[0] - right[0]);
        const candidateCount = Math.min(nearby.length, maxCandidates);

        for (let index = 0; index < candidateCount; index += 1) {
          const targetIndex = nearby[index]?.[1];
          if (targetIndex === undefined) {
            continue;
          }

          const key =
            i < targetIndex ? `${i}_${targetIndex}` : `${targetIndex}_${i}`;
          if (seen.has(key)) {
            continue;
          }

          seen.add(key);
          const edgeIndex = edges.length;
          edges.push({
            a: i,
            b: targetIndex,
            cur: Math.random(),
            tgt: Math.random() < 0.5 ? 1 : 0,
            timer: 40 + Math.random() * 200,
          });
          node.edges.push(edgeIndex);
          nodes[targetIndex]?.edges.push(edgeIndex);
        }
      }

      pulses = [];
      shocks = [];
    }

    function paintBackground() {
      bgCanvas.width = canvasElement.width;
      bgCanvas.height = canvasElement.height;
      bgContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = bgContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#060912");
      gradient.addColorStop(0.55, "#080b16");
      gradient.addColorStop(1, "#05070f");
      bgContext.fillStyle = gradient;
      bgContext.fillRect(0, 0, width, height);

      const blobs = [
        { x: width * 0.25, y: height * 0.3, color: VI, alpha: 0.06 },
        { x: width * 0.78, y: height * 0.7, color: SK, alpha: 0.05 },
      ];

      for (const blob of blobs) {
        const radius = Math.max(width, height) * 0.5;
        const radial = bgContext.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          radius,
        );
        radial.addColorStop(0, `rgba(${blob.color},${blob.alpha})`);
        radial.addColorStop(1, "rgba(0,0,0,0)");
        bgContext.fillStyle = radial;
        bgContext.fillRect(0, 0, width, height);
      }
    }

    function edgeFade(x: number, y: number) {
      if (!(width > 0) || !(height > 0)) {
        return 0;
      }

      const margin = Math.min(width, height) * 0.16;
      const distance = Math.min(x, width - x, y, height - y);
      return distance <= 0 ? 0 : distance < margin ? distance / margin : 1;
    }

    function otherNodeIndex(edge: NeuralEdge, index: number) {
      return edge.a === index ? edge.b : edge.a;
    }

    function spawnPulse(a: number, b: number, color: string, generation = 0) {
      pulses.push({
        a,
        b,
        t: 0,
        spd: 0.014 + Math.random() * 0.016,
        col: color,
        gen: generation,
      });
    }

    function ambientPulse() {
      if (!edges.length) {
        return;
      }

      for (let tries = 0; tries < 6; tries += 1) {
        const edge = edges[(Math.random() * edges.length) | 0];
        if (edge && edge.cur > 0.4) {
          const color =
            Math.random() < 0.4 ? VI : Math.random() < 0.5 ? SK : CY;
          spawnPulse(edge.a, edge.b, color, 0);
          return;
        }
      }
    }

    function fireAt(mouseX: number, mouseY: number) {
      let best = -1;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < nodes.length; i += 1) {
        const distance =
          (nodes[i].x - mouseX) ** 2 + (nodes[i].y - mouseY) ** 2;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }

      if (best < 0) {
        return;
      }

      const node = nodes[best];
      node.act = 1.4;
      shocks.push({
        x: node.x,
        y: node.y,
        r: 0,
        max: Math.max(width, height) * 0.45,
      });

      for (const edgeIndex of node.edges) {
        const edge = edges[edgeIndex];
        if (edge && edge.cur > 0.3) {
          spawnPulse(best, otherNodeIndex(edge, best), MG, 1);
        }
      }
    }

    function drawStatic() {
      drawingContext.drawImage(bgCanvas, 0, 0, width, height);
      drawingContext.globalCompositeOperation = "lighter";

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) {
          continue;
        }

        const fade = Math.min(edgeFade(a.x, a.y), edgeFade(b.x, b.y));
        if (fade < 0.02 || edge.cur < 0.3) {
          continue;
        }

        drawingContext.strokeStyle = `rgba(${VI},${clampAlpha((0.06 + ((a.z + b.z) / 2) * 0.07) * fade)})`;
        drawingContext.lineWidth = 0.7;
        drawingContext.beginPath();
        drawingContext.moveTo(a.x, a.y);
        drawingContext.lineTo(b.x, b.y);
        drawingContext.stroke();
      }

      for (const node of nodes) {
        const fade = edgeFade(node.x, node.y);
        if (fade < 0.02) {
          continue;
        }

        drawingContext.fillStyle = `rgba(${CY},${clampAlpha((0.12 + node.z * 0.2) * fade)})`;
        drawingContext.beginPath();
        drawingContext.arc(node.x, node.y, 1 + node.z * 1.5, 0, Math.PI * 2);
        drawingContext.fill();
      }

      drawingContext.globalCompositeOperation = "source-over";
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvasElement.clientWidth;
      height = canvasElement.clientHeight;

      if (!(width > 0) || !(height > 0)) {
        return;
      }

      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      paintBackground();

      if (reducedMotion) {
        drawStatic();
      }
    }

    function syncPointer(clientX: number, clientY: number) {
      const rect = canvasElement.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;
    }

    function resetPointer() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function frame(timestamp: number) {
      if (timestamp - last < 16) {
        raf = window.requestAnimationFrame(frame);
        return;
      }

      last = timestamp;
      tick += 1;

      if (!(width > 0)) {
        raf = window.requestAnimationFrame(frame);
        return;
      }

      if (pulses.length < 16 && Math.random() < 0.16) {
        ambientPulse();
      }

      drawingContext.globalCompositeOperation = "source-over";
      drawingContext.globalAlpha = 1;
      drawingContext.drawImage(bgCanvas, 0, 0, width, height);
      drawingContext.globalCompositeOperation = "lighter";

      const cell = Math.min(width, height) / 9;
      const influence = cell * 3.5;
      const minX = -marginX;
      const maxX = width + marginX;
      const minY = -marginY;
      const maxY = height + marginY;

      for (const edge of edges) {
        edge.timer -= 1;
        if (edge.timer <= 0) {
          edge.tgt = Math.random() < 0.45 ? 1 : 0;
          edge.timer = 60 + Math.random() * 220;
        }
        edge.cur += (edge.tgt - edge.cur) * 0.035;
      }

      for (const node of nodes) {
        node.dir += (Math.random() - 0.5) * node.turn;
        node.bx += Math.cos(node.dir) * node.spd;
        node.by += Math.sin(node.dir) * node.spd;

        if (node.bx < minX) {
          node.bx = maxX;
        } else if (node.bx > maxX) {
          node.bx = minX;
        }

        if (node.by < minY) {
          node.by = maxY;
        } else if (node.by > maxY) {
          node.by = minY;
        }

        const fieldX = node.bx + Math.cos(node.jph + tick * node.js) * node.ja;
        const fieldY =
          node.by + Math.sin(node.jph + tick * node.js * 1.3) * node.ja;

        let targetX = fieldX;
        let targetY = fieldY;

        if (pointer.active) {
          const dx = pointer.x - fieldX;
          const dy = pointer.y - fieldY;
          const distance = Math.hypot(dx, dy);

          if (distance < influence && distance > 0.001) {
            const pull = (1 - distance / influence) * 8 * node.z;
            targetX += (dx / distance) * pull;
            targetY += (dy / distance) * pull;
          }
        }

        if (Math.abs(targetX - node.x) > width * 0.5) {
          node.x = targetX;
        }

        if (Math.abs(targetY - node.y) > height * 0.5) {
          node.y = targetY;
        }

        node.x += (targetX - node.x) * 0.08;
        node.y += (targetY - node.y) * 0.08;
        node.act *= 0.95;

        if (pointer.active) {
          const distance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
          if (distance < influence) {
            node.act = Math.max(node.act, (1 - distance / influence) * 0.7);
          }
        }
      }

      for (let i = shocks.length - 1; i >= 0; i -= 1) {
        const shock = shocks[i];
        shock.r += (shock.max - shock.r) * 0.05 + 3;
        const progress = shock.r / shock.max;

        if (progress >= 1) {
          shocks.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.22;
        drawingContext.strokeStyle = `rgba(${MG},${clampAlpha(alpha)})`;
        drawingContext.lineWidth = 1.4 * (1 - progress) + 0.4;
        drawingContext.beginPath();
        drawingContext.arc(shock.x, shock.y, shock.r, 0, Math.PI * 2);
        drawingContext.stroke();

        for (const node of nodes) {
          const distance = Math.hypot(node.x - shock.x, node.y - shock.y);
          if (Math.abs(distance - shock.r) < 24) {
            node.act = Math.max(node.act, (1 - progress) * 0.9);
          }
        }
      }

      const maxLengthSquared = (cell * 4) ** 2;

      for (const edge of edges) {
        if (edge.cur < 0.04) {
          continue;
        }

        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) {
          continue;
        }

        if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 > maxLengthSquared) {
          continue;
        }

        const fade = Math.min(edgeFade(a.x, a.y), edgeFade(b.x, b.y));
        if (fade < 0.02) {
          continue;
        }

        const depthFactor = (a.z + b.z) / 2;
        const activity = (a.act + b.act) * 0.5;
        const alpha =
          (0.05 + depthFactor * 0.07 + activity * 0.28) * edge.cur * fade;
        if (alpha < 0.008) {
          continue;
        }

        const color = activity > 0.3 ? CY : VI;
        drawingContext.strokeStyle = `rgba(${color},${clampAlpha(alpha)})`;
        drawingContext.lineWidth = 0.5 + depthFactor * 0.4 + activity * 0.9;
        drawingContext.beginPath();
        drawingContext.moveTo(a.x, a.y);
        drawingContext.lineTo(b.x, b.y);
        drawingContext.stroke();
      }

      if (pointer.active) {
        const tethered: Array<[number, number]> = [];

        for (let i = 0; i < nodes.length; i += 1) {
          const distance = Math.hypot(
            pointer.x - nodes[i].x,
            pointer.y - nodes[i].y,
          );
          if (distance < influence) {
            tethered.push([distance, i]);
          }
        }

        tethered.sort((left, right) => left[0] - right[0]);

        for (let i = 0; i < Math.min(tethered.length, 4); i += 1) {
          const tether = tethered[i];
          const node = nodes[tether[1]];
          const alpha =
            (1 - tether[0] / influence) * 0.32 * edgeFade(node.x, node.y);
          drawingContext.strokeStyle = `rgba(${CY},${clampAlpha(alpha)})`;
          drawingContext.lineWidth = 0.8;
          drawingContext.beginPath();
          drawingContext.moveTo(pointer.x, pointer.y);
          drawingContext.lineTo(node.x, node.y);
          drawingContext.stroke();
        }
      }

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const pulse = pulses[i];
        const a = nodes[pulse.a];
        const b = nodes[pulse.b];
        if (!a || !b) {
          pulses.splice(i, 1);
          continue;
        }

        pulse.t += pulse.spd;

        if (pulse.t >= 1) {
          b.act = Math.min(1.4, b.act + 0.6);
          if (pulse.gen > 0 && pulse.gen < 3 && Math.random() < 0.5) {
            const liveEdges = b.edges.filter(
              (edgeIndex) =>
                edges[edgeIndex]?.cur > 0.4 &&
                otherNodeIndex(edges[edgeIndex] as NeuralEdge, pulse.b) !==
                  pulse.a,
            );

            if (liveEdges.length) {
              const edgeIndex =
                liveEdges[(Math.random() * liveEdges.length) | 0];
              const edge = edges[edgeIndex];
              if (edge) {
                spawnPulse(
                  pulse.b,
                  otherNodeIndex(edge, pulse.b),
                  pulse.col,
                  pulse.gen + 1,
                );
              }
            }
          }

          pulses.splice(i, 1);
          continue;
        }

        if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 > maxLengthSquared) {
          pulses.splice(i, 1);
          continue;
        }

        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        const fade = Math.sin(pulse.t * Math.PI) * edgeFade(x, y);
        if (fade < 0.02) {
          continue;
        }

        const tailT = Math.max(0, pulse.t - 0.2);
        const tailX = a.x + (b.x - a.x) * tailT;
        const tailY = a.y + (b.y - a.y) * tailT;

        drawingContext.strokeStyle = `rgba(${pulse.col},${clampAlpha(0.4 * fade)})`;
        drawingContext.lineWidth = 1.3;
        drawingContext.beginPath();
        drawingContext.moveTo(tailX, tailY);
        drawingContext.lineTo(x, y);
        drawingContext.stroke();

        const gradient = drawingContext.createRadialGradient(x, y, 0, x, y, 6);
        gradient.addColorStop(0, `rgba(${WT},${clampAlpha(0.7 * fade)})`);
        gradient.addColorStop(
          0.4,
          `rgba(${pulse.col},${clampAlpha(0.45 * fade)})`,
        );
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        drawingContext.fillStyle = gradient;
        drawingContext.beginPath();
        drawingContext.arc(x, y, 6, 0, Math.PI * 2);
        drawingContext.fill();
      }

      for (const node of nodes) {
        const fade = edgeFade(node.x, node.y);
        if (fade < 0.02) {
          continue;
        }

        const twinkle = 0.5 + 0.5 * Math.sin(tick * 0.04 + node.ph);
        const alpha =
          ((0.08 + node.z * 0.16) * (0.6 + twinkle * 0.4) + node.act * 0.5) *
          fade;
        if (alpha < 0.01) {
          continue;
        }

        const size = 0.8 + node.z * 1.2 + node.act * 2.4;
        const color = node.act > 0.4 ? CY : node.z > 0.6 ? SK : VI;
        const gradient = drawingContext.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          size * 3,
        );
        gradient.addColorStop(0, `rgba(${WT},${clampAlpha(alpha)})`);
        gradient.addColorStop(
          0.4,
          `rgba(${color},${clampAlpha(alpha * 0.55)})`,
        );
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        drawingContext.fillStyle = gradient;
        drawingContext.beginPath();
        drawingContext.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        drawingContext.fill();
      }

      if (pointer.active) {
        const gradient = drawingContext.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          influence * 0.7,
        );
        gradient.addColorStop(0, `rgba(${CY},0.05)`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        drawingContext.fillStyle = gradient;
        drawingContext.beginPath();
        drawingContext.arc(
          pointer.x,
          pointer.y,
          influence * 0.7,
          0,
          Math.PI * 2,
        );
        drawingContext.fill();
      }

      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      window.cancelAnimationFrame(raf);
      raf = 0;

      if (reducedMotion) {
        drawStatic();
        return;
      }

      last = 0;
      raf = window.requestAnimationFrame(frame);
    }

    function handlePointerMove(event: PointerEvent) {
      syncPointer(event.clientX, event.clientY);
    }

    function handlePointerDown(event: PointerEvent) {
      syncPointer(event.clientX, event.clientY);
      if (pointer.active) {
        fireAt(pointer.x, pointer.y);
      }
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        resetPointer();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        resetPointer();
      }
    }

    function handleMotionChange() {
      reducedMotion = media.matches;
      resize();
      start();
    }

    resize();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    media.addEventListener("change", handleMotionChange);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      media.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950",
        className,
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
