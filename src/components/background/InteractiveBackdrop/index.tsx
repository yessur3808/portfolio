"use client";;
import { useEffect, useRef } from "react";

type Pulse = {
  id: number;
  x: number;
  y: number;
};

const SECTION_ACCENT_MAP: Record<string, string> = {
  home: "rgb(79, 195, 247)",
  about: "rgb(138, 108, 255)",
  experience: "rgb(79, 195, 247)",
  work: "rgb(138, 108, 255)",
  stack: "rgb(79, 195, 247)",
  contact: "rgb(138, 108, 255)",
};

const InteractiveBackdrop = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pulsesRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pulseRoot = pulsesRef.current;
    const sweep = sweepRef.current;

    if (!root || !pulseRoot) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let rafId = 0;
    let pulseId = 0;

    const target = { x: 50, y: 28 };
    const current = { x: 50, y: 28 };
    const prevPos = { x: 50, y: 28 };
    const velocity = { x: 0, y: 0 };
    let sweepAngle = 0;
    let lastSection = "home";

    const setVars = (x: number, y: number, accentColor?: string) => {
      root.style.setProperty("--cursor-x", `${x}%`);
      root.style.setProperty("--cursor-y", `${y}%`);
      if (accentColor) {
        root.style.setProperty("--section-accent", accentColor);
      }
    };

    // Detect which section is in view
    const detectActiveSection = () => {
      const sections = document.querySelectorAll(
        "section[id], [id*='home'], [id*='about'], [id*='experience'], [id*='work'], [id*='stack'], [id*='contact']",
      );

      for (const section of sections) {
        const id = section.getAttribute("id");
        if (!id) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
          lastSection = id;
          const color = SECTION_ACCENT_MAP[id] || "rgb(79, 195, 247)";
          root.style.setProperty("--section-accent", color);
          break;
        }
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;

      // Calculate velocity
      velocity.x = current.x - prevPos.x;
      velocity.y = current.y - prevPos.y;
      prevPos.x = current.x;
      prevPos.y = current.y;

      // Calculate sweep angle based on velocity
      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y,
      );
      sweepAngle = Math.atan2(velocity.y, velocity.x);

      if (sweep && speed > 0.45) {
        const startX = current.x;
        const startY = current.y;
        const distance = Math.min(speed * 11, 22);
        const endX = startX + Math.cos(sweepAngle) * distance;
        const endY = startY + Math.sin(sweepAngle) * distance;

        sweep.setAttribute("x1", `${startX}`);
        sweep.setAttribute("y1", `${startY}`);
        sweep.setAttribute("x2", `${endX}`);
        sweep.setAttribute("y2", `${endY}`);

        const sectionBoost = lastSection === "contact" ? 0.48 : 0.42;
        sweep.style.opacity = Math.min(speed * 0.58, sectionBoost).toString();
      }

      setVars(current.x, current.y);
      detectActiveSection();
      rafId = window.requestAnimationFrame(tick);
    };

    const toPercent = (clientX: number, clientY: number) => ({
      x: (clientX / window.innerWidth) * 100,
      y: (clientY / window.innerHeight) * 100,
    });

    const addPulse = (x: number, y: number) => {
      const pulse = document.createElement("span");
      const pulseData: Pulse = { id: pulseId++, x, y };

      pulse.className = "interactive-pulse";
      pulse.style.left = `${pulseData.x}%`;
      pulse.style.top = `${pulseData.y}%`;
      pulse.dataset.pulseId = String(pulseData.id);
      pulseRoot.appendChild(pulse);

      window.setTimeout(() => {
        pulse.remove();
      }, 900);
    };

    const onPointerMove = (event: PointerEvent) => {
      const next = toPercent(event.clientX, event.clientY);
      target.x = next.x;
      target.y = next.y;
    };

    const onPointerDown = (event: PointerEvent) => {
      const next = toPercent(event.clientX, event.clientY);
      target.x = next.x;
      target.y = next.y;
      addPulse(next.x, next.y);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      const next = toPercent(touch.clientX, touch.clientY);
      target.x = next.x;
      target.y = next.y;
      addPulse(next.x, next.y);
    };

    const onScroll = () => {
      detectActiveSection();
    };

    setVars(current.x, current.y);
    detectActiveSection();
    rafId = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="interactive-backdrop" aria-hidden="true">
      <div className="interactive-backdrop__grid" />
      <div className="interactive-backdrop__glow" />
      <svg
        className="interactive-backdrop__sweep"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          ref={sweepRef}
          x1="50"
          y1="28"
          x2="50"
          y2="28"
          strokeWidth="0.2"
          strokeLinecap="round"
          style={{
            stroke: "url(#sweep-gradient)",
            opacity: 0,
            transition: "opacity 0.3s ease-out",
          }}
        />
        <defs>
          <linearGradient
            id="sweep-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(79, 195, 247)" stopOpacity="0.7" />
            <stop
              offset="45%"
              stopColor="rgb(138, 108, 255)"
              stopOpacity="0.45"
            />
            <stop offset="100%" stopColor="rgb(14, 42, 71)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="interactive-backdrop__vignette" />
      <div ref={pulsesRef} className="interactive-backdrop__pulses" />
    </div>
  );
};

export default InteractiveBackdrop;
