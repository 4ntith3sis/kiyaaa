"use client";

export type UnicornMood = "happy" | "sad";

const INK = "#3b2a5e";

/**
 * Cute cartoon companion character (the cake itself stays semi-realistic).
 * Two moods, pure CSS/SVG looping animation:
 *   happy → dancing (bounce, kicking legs, bobbing head)
 *   sad   → crying (drooped head, falling tears, gentle breathing)
 */
export default function Unicorn({ mood }: { mood: UnicornMood }) {
  const happy = mood === "happy";
  return (
    <div
      className={`unicorn unicorn-${mood}`}
      role="img"
      aria-label={happy ? "Happy dancing unicorn" : "Sad crying unicorn"}
    >
      <svg viewBox="0 0 220 240" className="unicorn-svg" aria-hidden="true">
        {/* tail */}
        <g className="u-tail">
          <path
            d="M48,112 C30,118 24,138 30,156 C34,144 40,138 48,136 Z"
            fill="#f7a8c4"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M52,118 C40,126 38,142 44,154 C46,142 50,134 56,130 Z"
            fill="#9adcc8"
          />
          <path
            d="M48,112 C36,114 30,124 30,136"
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        {/* far-side legs (darker, calmer) */}
        <g className="u-leg u-leg-far">
          <rect x="69" y="148" width="18" height="38" rx="9" fill="#f3e4cf" stroke={INK} strokeWidth="4" />
          <rect x="69" y="176" width="18" height="12" rx="6" fill="#d9a86c" stroke={INK} strokeWidth="4" />
        </g>
        <g className="u-leg u-leg-far">
          <rect x="119" y="148" width="18" height="38" rx="9" fill="#f3e4cf" stroke={INK} strokeWidth="4" />
          <rect x="119" y="176" width="18" height="12" rx="6" fill="#d9a86c" stroke={INK} strokeWidth="4" />
        </g>

        {/* body */}
        <ellipse
          cx="105"
          cy="126"
          rx="60"
          ry="40"
          fill="#fffdf8"
          stroke={INK}
          strokeWidth="4"
        />
        <ellipse cx="88" cy="140" rx="30" ry="16" fill="#fbeed9" opacity="0.8" />

        {/* near-side legs (dance when happy) */}
        <g className="u-leg u-leg-a">
          <rect x="53" y="148" width="18" height="40" rx="9" fill="#fffdf8" stroke={INK} strokeWidth="4" />
          <rect x="53" y="178" width="18" height="12" rx="6" fill="#e8b64c" stroke={INK} strokeWidth="4" />
        </g>
        <g className="u-leg u-leg-b">
          <rect x="133" y="148" width="18" height="40" rx="9" fill="#fffdf8" stroke={INK} strokeWidth="4" />
          <rect x="133" y="178" width="18" height="12" rx="6" fill="#e8b64c" stroke={INK} strokeWidth="4" />
        </g>

        {/* mane */}
        <g className="u-mane">
          <circle cx="128" cy="62" r="13" fill="#f7a8c4" stroke={INK} strokeWidth="4" />
          <circle cx="116" cy="84" r="13" fill="#9adcc8" stroke={INK} strokeWidth="4" />
          <circle cx="110" cy="108" r="12" fill="#c3b2e8" stroke={INK} strokeWidth="4" />
        </g>

        {/* head */}
        <g className="u-head">
          {/* ear */}
          <path
            d="M150,52 L144,28 L162,42 Z"
            fill="#fffdf8"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* horn */}
          <path
            d="M166,46 L160,16 L178,20 L174,44 Z"
            fill="#e8b64c"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <line x1="164" y1="34" x2="174" y2="32" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          {/* forelock */}
          <circle cx="152" cy="56" r="9" fill="#f7a8c4" stroke={INK} strokeWidth="3.5" />
          {/* face */}
          <circle cx="170" cy="80" r="30" fill="#fffdf8" stroke={INK} strokeWidth="4" />
          <ellipse cx="190" cy="90" rx="15" ry="11" fill="#fffdf8" stroke={INK} strokeWidth="4" />
          <circle cx="196" cy="88" r="2.4" fill={INK} />
          {/* blush */}
          <circle cx="162" cy="92" r="6" fill="#f7a8c4" opacity="0.65" />
          {happy ? (
            <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M164,74 Q170,67 177,73" />
              <path d="M184,99 Q190,104 197,98" />
            </g>
          ) : (
            <g>
              <circle cx="170" cy="76" r="3.6" fill={INK} />
              <path
                d="M183,101 Q190,96 197,101"
                stroke={INK}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        </g>

        {/* tears (sad only) */}
        {!happy && (
          <g>
            <path
              className="u-tear u-tear-a"
              d="M160,88 C164,93 164,98 160,101 C156,98 156,93 160,88 Z"
              fill="#6ec6f0"
              stroke={INK}
              strokeWidth="2.5"
            />
            <path
              className="u-tear u-tear-b"
              d="M182,90 C186,95 186,100 182,103 C178,100 178,95 182,90 Z"
              fill="#6ec6f0"
              stroke={INK}
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* happy sparkles */}
        {happy && (
          <g className="u-sparkles" stroke="#e8a13c" strokeWidth="3" strokeLinecap="round">
            <path className="u-spark u-spark-a" d="M30,52 v14 M23,59 h14" />
            <path className="u-spark u-spark-b" d="M196,30 v12 M190,36 h12" />
            <path className="u-spark u-spark-c" d="M52,150 v10 M47,155 h10" />
          </g>
        )}
      </svg>
    </div>
  );
}
