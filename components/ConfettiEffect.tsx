"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const PALETTE = ["#E8C884", "#F2C4CE", "#F7EAD9", "#D48CA0", "#FFD97A", "#FFF7DC"];

export default function ConfettiEffect({ fire }: { fire: boolean }) {
  useEffect(() => {
    if (!fire) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const end = Date.now() + 1600;
    // Elegant side bursts
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: PALETTE,
      scalar: 0.9,
      ticks: 220,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: PALETTE,
      scalar: 0.9,
      ticks: 220,
      disableForReducedMotion: true,
    });
    const timer = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(timer);
        return;
      }
      confetti({
        particleCount: 24,
        spread: 100,
        startVelocity: 32,
        origin: { x: Math.random() * 0.5 + 0.25, y: 0.35 },
        colors: PALETTE,
        scalar: 0.85,
        ticks: 200,
        disableForReducedMotion: true,
      });
    }, 450);
    return () => window.clearInterval(timer);
  }, [fire]);

  return null;
}
