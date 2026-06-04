"use client";
import { useEffect, useRef } from "react";
import { useState } from "react";

export function NavWaveFill({
  progress,
  color = "#4FC3F7",
}: {
  progress: number;
  color?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  // Animate wave phase
  useEffect(() => {
    if (prefersReducedMotion) {
      const width = 120;
      const height = 36;
      const fillX = width * progress;
      const staticPath = `M0,0 L${fillX},0 L${fillX},${height} L0,${height} Z`;
      if (ref.current) ref.current.setAttribute("d", staticPath);
      return;
    }

    let running = true;
    let phase = 0;
    const animate = () => {
      if (!running) return;
      phase += 0.045;
      const width = 120;
      const height = 36;
      const amplitude = 5;
      const freq = 2.1;
      const fillX = width * progress;
      let d = "M0,0 ";
      d += `L${fillX},0`;
      for (let y = 0; y <= height; y += 2) {
        const x =
          fillX +
          Math.sin((y / height) * Math.PI * freq + phase) *
            amplitude *
            0.7 *
            Math.max(progress, 0.12);
        d += ` L${x},${y}`;
      }
      d += ` L0,${height} Z`;
      if (ref.current) ref.current.setAttribute("d", d);
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      running = false;
    };
  }, [prefersReducedMotion, progress]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 120 36"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: progress > 0.01 ? undefined : "none" }}
    >
      <defs>
        <linearGradient id="navwavefill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.14" />
          <stop offset="60%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.36" />
        </linearGradient>
      </defs>
      <path ref={ref} fill="url(#navwavefill)" />
    </svg>
  );
}
