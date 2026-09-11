"use client";

interface MicrophoneIndicatorProps {
  isListening: boolean;
  volume: number;
}

const BARS = 9;

export default function MicrophoneIndicator({
  isListening,
  volume,
}: MicrophoneIndicatorProps) {
  if (!isListening) return null;
  return (
    <div
      className="mic-indicator"
      role="status"
      aria-label="Microphone is listening"
    >
      <span className="mic-dot" aria-hidden="true" />
      <span className="mic-label">Listening</span>
      <div className="mic-bars" aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => {
          const center = (BARS - 1) / 2;
          const falloff = 1 - Math.abs(i - center) / (center + 1);
          const h = 3 + volume * 20 * falloff;
          return (
            <span
              key={i}
              className="mic-bar"
              style={{ height: `${Math.max(3, Math.min(22, h))}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
