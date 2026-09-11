"use client";

import { useMemo } from "react";

const STAR_SEED = [8, 22, 41, 57, 68, 79, 88, 94, 12, 33, 47, 63, 74, 85, 3, 18, 29, 52, 71, 90];
const PARTICLE_SEED = [5, 17, 31, 44, 59, 70, 83, 11, 26, 48, 62, 77];

export default function AmbientBackground() {
  const stars = useMemo(
    () =>
      STAR_SEED.map((s, i) => ({
        left: `${(s * 37 + 11) % 100}%`,
        top: `${(s * 53 + 7) % 100}%`,
        size: 1 + ((s + i) % 3),
        delay: `${(s % 7) * 0.9}s`,
        duration: `${5 + (s % 5)}s`,
      })),
    [],
  );
  const particles = useMemo(
    () =>
      PARTICLE_SEED.map((s, i) => ({
        left: `${(s * 41 + 5) % 100}%`,
        top: `${(s * 29 + 13) % 100}%`,
        size: 5 + ((s + i) % 5) * 2,
        delay: `${(s % 9) * 1.1}s`,
        duration: `${9 + (s % 7)}s`,
      })),
    [],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {/* base gradient */}
      <div className="absolute inset-0 bg-ambient" />
      {/* glowing blobs */}
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />
      {/* vignette */}
      <div className="absolute inset-0 bg-vignette" />
      {/* stars */}
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      {/* floating dust */}
      {particles.map((p, i) => (
        <span
          key={`dust-${i}`}
          className="dust"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      {/* film grain */}
      <div className="grain" />
    </div>
  );
}
