"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Candle, { type CandleState } from "./Candle";

interface BirthdayCakeProps {
  candleStates: CandleState[];
  /** Pre-trigger wind hint 0..1 — flames lean progressively while charging. */
  wind?: number;
  /**
   * Choreography overrides (used by the unicorn-served cake scene).
   * Defaults preserve the standalone drop-in entrance.
   */
  /** When true, tiers render in place (parent animates the whole cake). */
  assembled?: boolean;
  /** When true, hide the metal stand + ground shadow (cake sits on a plate). */
  bare?: boolean;
  /** When false, candles are not rendered yet (they pop in later). */
  showCandles?: boolean;
  /** Base delay (ms) for flame ignite pop-in, per candle adds 100ms. */
  igniteBaseMs?: number;
  /** Base delay (s) for candle drop-in, per candle adds 0.1s. */
  candleDelayBase?: number;
}

/**
 * One consistent wind direction for every candle, with a tiny per-candle
 * variation in lean angle / duration so the flames don't look identical —
 * like a single breath sweeping across the cake.
 */
const LEAN_DEG = [18, 23, 15, 20, 17, 21, 16];
const BLOW_MS = [700, 730, 680, 715, 695, 725, 690];

/*
 * Piece-by-piece drop entrance (springy, like pieces falling into place):
 *   ground shadow fades .... 0.00s
 *   cake body drops ........ 0.15s
 *   frosting cap drops ..... 0.55s
 *   sprinkles pop in ....... 0.90s
 *   candles drop one by one  1.15s + i·0.10s
 *   flames ignite .......... 1.45s + i·0.10s (CSS, see Flame --ignite-delay)
 */
const dropTransition = (delay: number) => ({
  type: "spring" as const,
  stiffness: 210,
  damping: 16,
  mass: 1.1,
  delay,
});

const INK = "#2b1a12";

/** Wavy frosting-drip bottom edge returning from right to left. */
function scallops(x: number, y: number, w: number, depths: number[]): string {
  const n = depths.length;
  const seg = w / n;
  let d = `M ${x + w} ${y} `;
  for (let i = n - 1; i >= 0; i--) {
    const x1 = x + (i + 1) * seg;
    const x0 = x + i * seg;
    const mid = (x0 + x1) / 2;
    d += `Q ${mid} ${y + depths[i] * 2} ${x0} ${y} `;
  }
  return d;
}

const SPRINKLES: { cx: number; cy: number; r: number; fill: string }[] = [
  { cx: 108, cy: 196, r: 7, fill: "#e2608a" },
  { cx: 142, cy: 208, r: 6, fill: "#3fa7d6" },
  { cx: 172, cy: 197, r: 6, fill: "#e2608a" },
  { cx: 200, cy: 209, r: 7.5, fill: "#3fa7d6" },
  { cx: 228, cy: 198, r: 6, fill: "#e8a13c" },
  { cx: 256, cy: 208, r: 6, fill: "#e2608a" },
  { cx: 290, cy: 196, r: 7, fill: "#e2608a" },
];

const SPECKLES: { cx: number; cy: number }[] = [
  { cx: 120, cy: 232 },
  { cx: 168, cy: 244 },
  { cx: 214, cy: 236 },
  { cx: 258, cy: 246 },
  { cx: 300, cy: 232 },
  { cx: 145, cy: 258 },
  { cx: 238, cy: 260 },
  { cx: 282, cy: 260 },
];

const CONFETTI: { cx: number; cy: number; r: number; fill: string }[] = [
  { cx: 52, cy: 120, r: 5, fill: "#3fa7d6" },
  { cx: 96, cy: 66, r: 6, fill: "#e2608a" },
  { cx: 150, cy: 96, r: 4.5, fill: "#7ed6c2" },
  { cx: 208, cy: 52, r: 6, fill: "#e8a13c" },
  { cx: 262, cy: 88, r: 4.5, fill: "#b388eb" },
  { cx: 312, cy: 56, r: 6, fill: "#3fa7d6" },
  { cx: 348, cy: 122, r: 5, fill: "#e2608a" },
  { cx: 70, cy: 190, r: 4.5, fill: "#e8a13c" },
  { cx: 330, cy: 190, r: 4.5, fill: "#7ed6c2" },
];

export default function BirthdayCake({
  candleStates,
  wind = 0,
  assembled = false,
  bare = false,
  showCandles = true,
  igniteBaseMs = 1450,
  candleDelayBase = 1.15,
}: BirthdayCakeProps) {
  const litCount = candleStates.filter((s) => s !== "extinguished").length;
  const spill = 0.1 + (0.9 * litCount) / Math.max(1, candleStates.length);
  const middle = Math.floor(candleStates.length / 2);

  return (
    <div
      className="cake-stage"
      role="img"
      aria-label="Birthday cake with striped candles, like the reference"
    >
      <div className="cake-halo" aria-hidden="true" />

      <svg viewBox="0 0 400 500" className="cake-svg" aria-hidden="true">
        <defs>
          <linearGradient id="bodyCream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8ecd4" />
            <stop offset="1" stopColor="#efd6ae" />
          </linearGradient>
          <filter id="soft10" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <clipPath id="bodyClip">
            <path d="M70,215 H330 V372 Q330,400 302,400 H98 Q70,400 70,372 Z" />
          </clipPath>
        </defs>

        {/* floating confetti dots, like the reference background */}
        {CONFETTI.map((c, i) => (
          <circle
            key={`confetti-${i}`}
            className="confetti-dot"
            style={{ animationDelay: `${(i % 5) * 0.5}s` }}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={c.fill}
            opacity="0.85"
          />
        ))}

        {/* ground shadow fades in first (hidden when served on a plate) */}
        {!bare && (
          <motion.g
            initial={assembled ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ellipse
              cx="200"
              cy="432"
              rx="118"
              ry="15"
              fill="rgba(0,0,0,0.5)"
              filter="url(#soft10)"
            />
          </motion.g>
        )}

        {/* ===== cake body — cream with pink bands ===== */}
        <motion.g
          initial={assembled ? false : { y: -260, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={dropTransition(0.15)}
        >
          <path
            d="M70,215 H330 V372 Q330,400 302,400 H98 Q70,400 70,372 Z"
            fill="url(#bodyCream)"
          />
          <g clipPath="url(#bodyClip)">
            <rect x="70" y="268" width="260" height="16" fill="#f0aeb9" />
            <rect x="70" y="312" width="260" height="36" fill="#f2b3bd" />
            <rect x="70" y="360" width="260" height="40" fill="#f0aeb9" />
            {/* soft side shading for a hint of volume */}
            <rect x="70" y="215" width="26" height="185" fill="rgba(255,255,255,0.35)" />
            <rect x="304" y="215" width="26" height="185" fill="rgba(150,80,90,0.18)" />
          </g>
          <path
            d="M70,215 H330 V372 Q330,400 302,400 H98 Q70,400 70,372 Z"
            fill="none"
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* ===== frosting cap with drips ===== */}
        <motion.g
          initial={assembled ? false : { y: -320, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={dropTransition(0.55)}
        >
          <path
            d={`M62,208 C62,186 115,176 200,176 C285,176 338,186 338,208 L338,240 ${scallops(62, 240, 276, [16, 22, 14, 24, 18, 22, 14, 20])} L62,208 Z`}
            fill="#fffdf6"
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* top surface covers the top-edge stroke */}
          <ellipse cx="200" cy="205" rx="136" ry="28" fill="#fffdf6" />
          {/* tiny grey speckles on the frosting */}
          {SPECKLES.map((s, i) => (
            <circle
              key={`speck-${i}`}
              cx={s.cx}
              cy={s.cy}
              r="1.6"
              fill="rgba(120,110,100,0.5)"
            />
          ))}
        </motion.g>

        {/* ===== sprinkles pop in ===== */}
        <motion.g
          initial={assembled ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 12 }}
        >
          {SPRINKLES.map((s, i) => (
            <g key={`sprink-${i}`}>
              <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="none"
                stroke={INK}
                strokeWidth="3"
              />
              <circle
                cx={s.cx - s.r * 0.3}
                cy={s.cy - s.r * 0.35}
                r={s.r * 0.3}
                fill="rgba(255,255,255,0.7)"
              />
            </g>
          ))}
        </motion.g>

        {/* side motion ticks, like the reference */}
        <g stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.45">
          <line x1="50" y1="262" x2="50" y2="302" />
          <line x1="350" y1="262" x2="350" y2="302" />
        </g>
      </svg>

      {/* warm candlelight spilling onto the frosting — fades as candles die */}
      <div className="candle-spill" style={{ opacity: spill }} aria-hidden="true" />

      {/* candles stand on the frosting surface (y ≈ 205/500) */}
      {showCandles && (
        <div
          className="candles-overlay"
          style={{ "--wind": wind } as CSSProperties}
          aria-hidden="true"
        >
          {candleStates.map((state, i) => (
            <motion.div
              key={i}
              className="candle-anchor"
              initial={{ y: -140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={dropTransition(candleDelayBase + i * 0.1)}
            >
              <Candle
                state={state}
                pink={i === middle}
                leanDeg={LEAN_DEG[i % LEAN_DEG.length]}
                blowDurationMs={BLOW_MS[i % BLOW_MS.length]}
                igniteDelayMs={igniteBaseMs + i * 100}
                smokeDelay={0.1 + i * 0.12}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
