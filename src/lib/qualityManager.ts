// ─── Types ──────────────────────────────────────────────────────────────────

export type QualityTier = "low" | "mid" | "high";

export type QualityConfig = {
  readonly tier: QualityTier;
  /** Number of sphere particles to render. */
  readonly particleCount: number;
  /** Star counts per layer [far, mid, near]. */
  readonly starCounts: readonly [number, number, number];
  /** Animation target frames-per-second. */
  readonly targetFps: number;
  /** Maximum device pixel ratio cap. */
  readonly maxDpr: number;
  /** Render glow around stars. */
  readonly enableStarGlow: boolean;
  /** Render a bloom glow pass over front-facing particles. */
  readonly enableBloom: boolean;
  /** Maximum particles included in the bloom pass. */
  readonly bloomParticleLimit: number;
  /** Sort particles back-to-front before drawing. */
  readonly enableDepthSort: boolean;
  /** Number of radial accent gradient overlay layers (1–3). */
  readonly accentLayerCount: number;
  /** Render background network node/edge graph. */
  readonly enableNetworkNodes: boolean;
  /** Render a single frame on scroll/resize only; skip the RAF loop. */
  readonly staticFrameMode: boolean;
};

// ─── Per-tier presets ────────────────────────────────────────────────────────

const TIER_CONFIGS: Record<QualityTier, QualityConfig> = {
  low: {
    tier: "low",
    particleCount: 56,
    starCounts: [28, 14, 8],
    targetFps: 15,
    maxDpr: 1,
    enableStarGlow: false,
    enableBloom: false,
    bloomParticleLimit: 0,
    enableDepthSort: false,
    accentLayerCount: 1,
    enableNetworkNodes: false,
    staticFrameMode: true,
  },
  mid: {
    tier: "mid",
    particleCount: 110,
    starCounts: [55, 28, 16],
    targetFps: 24,
    maxDpr: 1.5,
    enableStarGlow: true,
    enableBloom: true,
    bloomParticleLimit: 16,
    enableDepthSort: true,
    accentLayerCount: 2,
    enableNetworkNodes: false,
    staticFrameMode: false,
  },
  high: {
    tier: "high",
    particleCount: 200,
    starCounts: [80, 45, 30],
    targetFps: 30,
    maxDpr: 2,
    enableStarGlow: true,
    enableBloom: true,
    bloomParticleLimit: 28,
    enableDepthSort: true,
    accentLayerCount: 3,
    enableNetworkNodes: true,
    staticFrameMode: false,
  },
};

// ─── Adaptive thresholds ─────────────────────────────────────────────────────

/** P80 draw-time budget (ms); downgrade if exceeded for DOWNGRADE_PRESSURE ms. */
const FRAME_BUDGET_MS: Record<QualityTier, number> = {
  high: 22,
  mid: 36,
  low: 90,
};

const SAMPLE_WINDOW = 24; // rolling frame sample size
const DOWNGRADE_PRESSURE = 800; // ms above budget before downgrade
const UPGRADE_STEADY = 6000; // ms under budget before upgrade
const DOWNGRADE_COOLDOWN = 10000; // ms after downgrade before upgrade allowed

// ─── QualityManager ──────────────────────────────────────────────────────────

export class QualityManager {
  private tier: QualityTier;
  private samples: number[] = [];
  private overBudgetSince = 0;
  private underBudgetSince = 0;
  private lastDowngradeAt = 0;

  constructor() {
    this.tier = this.detectInitialTier();
  }

  private detectInitialTier(): QualityTier {
    if (typeof window === "undefined") return "mid";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "low";
    }

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };

    if (nav.connection?.saveData) return "low";
    if (/2g|slow-2g/.test(nav.connection?.effectiveType ?? "")) return "low";

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;

    if (cores <= 2 || memory <= 2) return "low";
    if (cores <= 4 || memory <= 4) return "mid";
    return "high";
  }

  /**
   * Record the actual draw cost (ms) for one frame. Call once per rendered frame.
   * @returns `true` when the quality tier changed — the caller should rebuild
   *          particle/star buffers and update the canvas DPR accordingly.
   */
  sampleFrame(frameDurationMs: number, now: number): boolean {
    this.samples.push(frameDurationMs);
    if (this.samples.length > SAMPLE_WINDOW) this.samples.shift();
    if (this.samples.length < 8) return false;

    const sorted = [...this.samples].sort((a, b) => a - b);
    const p80 = sorted[Math.floor(sorted.length * 0.8)];
    const budget = FRAME_BUDGET_MS[this.tier];

    if (p80 > budget) {
      if (this.overBudgetSince === 0) this.overBudgetSince = now;
      this.underBudgetSince = 0;

      if (
        this.tier !== "low" &&
        now - this.overBudgetSince > DOWNGRADE_PRESSURE
      ) {
        this.tier = this.tier === "high" ? "mid" : "low";
        this.lastDowngradeAt = now;
        this.overBudgetSince = 0;
        this.samples = [];
        return true;
      }
    } else {
      if (this.underBudgetSince === 0) this.underBudgetSince = now;
      this.overBudgetSince = 0;

      if (
        this.tier !== "high" &&
        now - this.lastDowngradeAt > DOWNGRADE_COOLDOWN &&
        now - this.underBudgetSince > UPGRADE_STEADY
      ) {
        this.tier = this.tier === "low" ? "mid" : "high";
        this.underBudgetSince = 0;
        this.samples = [];
        return true;
      }
    }

    return false;
  }

  getTier(): QualityTier {
    return this.tier;
  }

  getConfig(): QualityConfig {
    return TIER_CONFIGS[this.tier];
  }

  /** Override with an explicit user-preference tier. */
  setTier(tier: QualityTier): void {
    this.tier = tier;
    this.samples = [];
  }
}
