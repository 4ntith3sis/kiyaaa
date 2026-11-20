"use client";

export type UnicornMood = "happy" | "sad";

const INK = "#3b2a5e";

/** A softly animated, connected cat head companion. */
export default function Unicorn({ mood }: { mood: UnicornMood }) {
  const happy = mood === "happy";

  return (
    <div
      className={`unicorn unicorn-${mood}`}
      role="img"
      aria-label={happy ? "Happy cat" : "Sad cat"}
    >
      <svg viewBox="0 0 220 180" className="unicorn-svg" aria-hidden="true">
        {/* Ears sit behind the single, continuous head silhouette. */}
        <path d="M37 84Q28 60 31 24Q32 5 49 14Q76 28 101 53Z" fill="#fffdf8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M119 53Q145 28 171 14Q189 5 190 24Q193 60 184 84Z" fill="#fffdf8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M43 68Q38 43 42 24Q43 18 51 22Q77 36 96 54L88 68Z" fill="#f4a3b5" />
        <path d="M124 56Q150 34 172 22Q179 18 180 25Q184 49 178 68L166 60Z" fill="#bd572b" />

        {/* One silhouette keeps the head visually whole, with soft cheek tufts. */}
        <path
          id="cat-head-shape"
          d="M39 78Q49 51 75 47Q93 42 110 49Q127 42 145 47Q171 51 181 78Q195 104 182 133Q169 161 139 171Q123 176 110 172Q97 176 81 171Q51 161 38 133Q25 104 39 78Z"
          fill="#fffdf8"
        />
        {/* Ginger patch sits inside the head; the outline is drawn last for a uniform stroke. */}
        <defs>
          <clipPath id="cat-head-clip">
            <path d="M39 78Q49 51 75 47Q93 42 110 49Q127 42 145 47Q171 51 181 78Q195 104 182 133Q169 161 139 171Q123 176 110 172Q97 176 81 171Q51 161 38 133Q25 104 39 78Z" />
          </clipPath>
        </defs>
        <path d="M112 49Q128 42 145 47Q171 51 181 78Q195 104 182 133Q169 161 139 171Q123 176 110 172Q129 150 139 129Q153 98 136 72Q123 56 112 49Z" fill="#f28a35" clipPath="url(#cat-head-clip)" />
        <use href="#cat-head-shape" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="77" cy="98" rx="12" ry="15" fill="#171078" />
        <ellipse cx="143" cy="98" rx="12" ry="15" fill="#171078" />
        <circle cx="81" cy="92" r="5" fill="white" />
        <circle cx="147" cy="92" r="5" fill="white" />
        <circle cx="72" cy="103" r="2.5" fill="#8d8bd0" />
        <circle cx="138" cy="103" r="2.5" fill="#8d8bd0" />
        <ellipse cx="60" cy="116" rx="15" ry="8" fill="#f08eae" />
        <ellipse cx="160" cy="116" rx="15" ry="8" fill="#f08eae" />

        {/* Tiny nose and whiskers */}
        <path d="M102 108Q102 104 110 104Q118 104 118 108Q118 112 110 115Q102 112 102 108Z" fill="#171078" />
        <path d="M96 113 78 108M96 118l-20 1M124 113l18-5m-18 10 20 1" fill="none" stroke="#171078" strokeWidth="2.2" strokeLinecap="round" />

        {/* Mouth opens and closes like a little meow. */}
        <g className="cat-mouth">
          <ellipse className="cat-mouth-open" cx="110" cy="123" rx="4.5" ry="0" fill="url(#cat-mouth-fill)" />
          <defs>
            <linearGradient id="cat-mouth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8d4059" />
              <stop offset="100%" stopColor="#451d3a" />
            </linearGradient>
          </defs>
          <path className="cat-tongue" d="M107 124q3-2 6 0v3q-3 2-6 0Z" fill="#f28c9b" />
        </g>

        {!happy && (
          <g className="cat-tears" fill="#6ec6f0" stroke={INK} strokeWidth="2">
            <path d="M73 109q7 9 0 15-7-6 0-15Z" />
            <path d="M147 109q7 9 0 15-7-6 0-15Z" />
          </g>
        )}
      </svg>
    </div>
  );
}
