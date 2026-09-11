"use client";

import { motion } from "framer-motion";

/**
 * Thin wisp rising from the wick after the flame dies.
 * Rises ~1.9s: drifts up, sways slightly sideways, widens a touch,
 * then fades — subtle, never thick.
 */
export default function Smoke({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      className="smoke"
      initial={{ opacity: 0, y: 0, scaleX: 1 }}
      animate={{
        opacity: [0, 0.5, 0.38, 0.22, 0],
        y: [-1, -14, -28, -40, -50],
        x: [0, 2, -3, 2, -1],
        scaleX: [0.9, 1, 1.2, 1.45, 1.6],
      }}
      transition={{
        duration: 1.9,
        delay,
        ease: "easeOut",
        times: [0, 0.22, 0.5, 0.78, 1],
      }}
    >
      <svg viewBox="0 0 20 60" className="smoke-svg" aria-hidden="true">
        <path
          d="M10 58 C7 47 13 39 10 29 C7 19 12 10 10 2"
          fill="none"
          stroke="rgba(228,218,208,0.6)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
