"use client";

import type { CSSProperties } from "react";
import type { CandleState } from "./Candle";

interface FlameProps {
  state: CandleState;
  /** Lean angle (deg) toward the wind direction. Varies slightly per candle. */
  leanDeg?: number;
  /** Full blow-sequence duration in ms (lean → stretch → flicker → out). */
  blowDurationMs?: number;
  /** Delay before the ignite pop-in on mount (staggered per candle). */
  igniteDelayMs?: number;
}

/**
 * Small realistic flame: blue root at the wick, pale-yellow core,
 * orange outer body, soft glow. Layered SVG gradients keep it luminous
 * without cartoon outlines.
 *
 * - Idle motion (flicker / sway / glow) is pure CSS so it stays smooth
 *   while the mic loop runs at 60fps.
 * - The `blowing` state runs a multi-stage wind sequence driven by
 *   --lean / --blow-dur custom properties (see globals.css):
 *     impact lean → horizontal stretch → flicker shrink → disappear.
 */
export default function Flame({
  state,
  leanDeg = 18,
  blowDurationMs = 700,
  igniteDelayMs = 1600,
}: FlameProps) {
  const blowing = state === "blowing";
  const out = state === "extinguished";

  const style = {
    "--lean": `${leanDeg}deg`,
    "--blow-dur": `${blowDurationMs}ms`,
    "--ignite-delay": `${igniteDelayMs}ms`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`flame-wrap ${blowing ? "is-blowing" : ""} ${out ? "is-out" : ""}`}
    >
      <div className="flame-glow" />
      <span className="wind-gust" />
      <svg viewBox="0 0 32 56" className="flame-svg" role="presentation">
        <defs>
          <radialGradient id="flameOuter" cx="50%" cy="62%" r="62%">
            <stop offset="0%" stopColor="#FFC44D" />
            <stop offset="55%" stopColor="#FF8A4D" />
            <stop offset="100%" stopColor="#F0607E" />
          </radialGradient>
          <linearGradient id="flameMid" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#FFF6BF" />
            <stop offset="55%" stopColor="#FFD93B" />
            <stop offset="100%" stopColor="#FF9E3D" />
          </linearGradient>
          <radialGradient id="flameCore" cx="50%" cy="72%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FFF6BF" />
            <stop offset="100%" stopColor="#FFEDB0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          className="flame-body"
          d="M16 1 C18.5 9 25 17 25 31 C25 43 20.5 51 16 51 C11.5 51 7 43 7 31 C7 17 13.5 9 16 1 Z"
          fill="url(#flameOuter)"
          stroke="#2b1a12"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          className="flame-body-inner"
          d="M16 15 C17.5 20 20.5 24 20.5 32.5 C20.5 39.5 18 44 16 44 C14 44 11.5 39.5 11.5 32.5 C11.5 24 14.5 20 16 15 Z"
          fill="url(#flameMid)"
        />
        <ellipse
          className="flame-core"
          cx="16"
          cy="36"
          rx="4"
          ry="6.5"
          fill="url(#flameCore)"
        />
      </svg>
    </div>
  );
}
