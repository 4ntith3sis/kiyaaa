"use client";

import Flame from "./Flame";
import Smoke from "./Smoke";

export type CandleState = "lit" | "blowing" | "extinguished";

interface CandleProps {
  state: CandleState;
  /** Middle candle uses the pink colourway, the rest are blue (reference). */
  pink?: boolean;
  leanDeg?: number;
  blowDurationMs?: number;
  igniteDelayMs?: number;
  smokeDelay?: number;
}

export default function Candle({
  state,
  pink = false,
  leanDeg = 18,
  blowDurationMs = 700,
  igniteDelayMs = 1600,
  smokeDelay = 0,
}: CandleProps) {
  return (
    <div className={`candle is-${state}`} role="presentation">
      <div className="candle-flame-slot">
        {state !== "extinguished" ? (
          <Flame
            state={state}
            leanDeg={leanDeg}
            blowDurationMs={blowDurationMs}
            igniteDelayMs={igniteDelayMs}
          />
        ) : (
          <Smoke delay={smokeDelay} />
        )}
      </div>
      <div className="wick" />
      <div className={`candle-body ${pink ? "candle-body-pink" : "candle-body-blue"}`}>
        <div className="candle-zigzag" aria-hidden="true" />
        <div className="candle-highlight" />
        <div className="candle-stripes" aria-hidden="true" />
      </div>
      <div className="candle-drip" aria-hidden="true" />
    </div>
  );
}
