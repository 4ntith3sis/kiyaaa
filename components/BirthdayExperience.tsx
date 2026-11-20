"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useBlowDetection } from "@/hooks/useBlowDetection";
import { playApplause, stopApplause } from "@/lib/applause";
import WelcomeScreen from "./WelcomeScreen";
import BirthdayCake from "./BirthdayCake";
import BirthdayMessage from "./BirthdayMessage";
import ConfettiEffect from "./ConfettiEffect";
import MicrophoneIndicator from "./MicrophoneIndicator";
import type { CandleState } from "./Candle";

type Phase =
  | "welcome"
  | "requesting"
  | "ready"
  | "listening"
  | "blowing"
  | "extinguishing"
  | "completed"
  | "mic-error";

/*
 * Blow timeline per candle (flame sequence duration follows blow strength):
 *   soft blow .... ~1000ms — lean → flicker → shrink → out
 *   medium blow .. ~650ms
 *   strong blow .. ~400ms
 * Each candle starts its sequence 80ms after the previous one, like a
 * single breath sweeping across the cake (0/80/160/240/320ms).
 * Smoke then rises ~1.9s per candle.
 */
const EXTINGUISH_STAGGER_MS = 80;

/** Map blow strength (0..1) to per-candle flame-sequence duration. */
function blowDurationFor(strength: number) {
  const s = Math.min(1, Math.max(0.12, strength));
  return Math.round(1100 - 700 * s);
}

function initialCandles(): CandleState[] {
  return Array.from(
    { length: birthdayConfig.candleCount },
    () => "lit" as CandleState,
  );
}

export default function BirthdayExperience({
  onReplayToOpening,
  onBlowStart,
  onStartMusic,
}: {
  /** When provided, Replay returns to the opening card instead of the cake entry. */
  onReplayToOpening?: () => void;
  /** Called once when a blow starts extinguishing the candles. */
  onBlowStart?: () => void;
  /** Called from the Light the Candles click to start background music. */
  onStartMusic?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [candles, setCandles] = useState<CandleState[]>(initialCandles);
  const [breathPause, setBreathPause] = useState(false);
  const timersRef = useRef<number[]>([]);
  const blownRef = useRef(false);
  // Applause fires exactly once per cake session (reset on start/replay).
  const applausePlayedRef = useRef(false);
  const onBlowStartRef = useRef(onBlowStart);
  useEffect(() => {
    onBlowStartRef.current = onBlowStart;
  }, [onBlowStart]);
  const phaseRef = useRef<Phase>("welcome");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runExtinguish = useCallback((strength: number) => {
    blownRef.current = true;
    setPhase("blowing");
    // Notify once (music stops, unicorn reacts, ...). Covers both the
    // microphone path and the manual fallback below.
    onBlowStartRef.current?.();

    // Staggered blow: each candle enters `blowing` 80ms after the previous
    // one, runs its wind sequence (faster for stronger blows), then becomes
    // `extinguished`.
    // lit → blowing → extinguished — the flame always animates out fully
    // before it is removed and replaced by smoke.
    // Completion is NOT scheduled here; it is derived from real candle
    // state in the effect below (state is the source of truth).
    const count = birthdayConfig.candleCount;
    const baseDuration = blowDurationFor(strength);
    for (let i = 0; i < count; i++) {
      // Tiny per-candle variation so flames don't die identically.
      const duration = baseDuration + ((i % 3) - 1) * 20;
      const blowId = window.setTimeout(() => {
        setCandles((cur) => {
          const next = [...cur];
          next[i] = "blowing";
          return next;
        });
      }, i * EXTINGUISH_STAGGER_MS);
      const outId = window.setTimeout(() => {
        setCandles((cur) => {
          const next = [...cur];
          next[i] = "extinguished";
          return next;
        });
      }, i * EXTINGUISH_STAGGER_MS + duration);
      timersRef.current.push(blowId, outId);
    }
  }, []);

  const handleBlow = useCallback(
    (strength = 0.6) => {
      // One valid blow extinguishes every candle — never re-trigger.
      if (blownRef.current) return;
      const current = phaseRef.current;
      if (current !== "listening" && current !== "ready") return;
      runExtinguish(strength);
    },
    [runExtinguish],
  );

  const {
    isListening,
    volume,
    wind,
    microphoneError,
    startListening,
    stopListening,
  } = useBlowDetection({ onBlow: handleBlow });

  // Completion is derived from REAL candle state (source of truth):
  // only when every candle is `extinguished` do we advance to the celebration.
  // Checked against the updated state on every render — never a stale copy.
  useEffect(() => {
    if (phase !== "blowing") return;
    if (!candles.every((c) => c === "extinguished")) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("extinguishing");
    // Last candle out → brief beat of silence → applause → confetti → message.
    // Guarded so re-renders / state updates can never double-fire it.
    if (!applausePlayedRef.current) {
      applausePlayedRef.current = true;
      const applauseId = window.setTimeout(() => playApplause(), 400);
      timersRef.current.push(applauseId);
    }
    const id = window.setTimeout(() => setPhase("completed"), 650);
    timersRef.current.push(id);
  }, [phase, candles]);

  // Stop the mic once the celebration begins (privacy + battery)
  useEffect(() => {
    if (phase === "completed" || phase === "extinguishing") {
      stopListening();
    }
  }, [phase, stopListening]);

  const enterListening = useCallback(() => {
    setPhase("listening");
    // "Take a breath..." beat before showing the blow instruction
    setBreathPause(true);
    const id = window.setTimeout(() => setBreathPause(false), 1800);
    timersRef.current.push(id);
  }, []);

  const handleStart = useCallback(async () => {
    onStartMusic?.();
    blownRef.current = false;
    applausePlayedRef.current = false;
    setCandles(initialCandles());
    setPhase("requesting");
    setBreathPause(false);
    const ok = await startListening();
    if (ok) {
      enterListening();
    } else {
      setPhase("mic-error");
    }
  }, [startListening, enterListening, onStartMusic]);

  const handleRetry = useCallback(async () => {
    blownRef.current = false;
    setPhase("requesting");
    const ok = await startListening();
    if (ok) {
      enterListening();
    } else {
      setPhase("mic-error");
    }
  }, [startListening, enterListening]);

  const handleManualBlow = useCallback(() => {
    // Manual fallback runs the same cinematic sequence without the mic.
    if (blownRef.current) return;
    stopListening();
    runExtinguish(0.6);
  }, [runExtinguish, stopListening]);

  const handleReplay = useCallback(() => {
    clearTimers();
    blownRef.current = false;
    applausePlayedRef.current = false;
    stopListening();
    stopApplause();
    setCandles(initialCandles());
    if (onReplayToOpening) {
      // Back to the very first page (opening card). This unmounts the
      // experience, so the next visit starts completely fresh.
      onReplayToOpening();
    } else {
      setPhase("welcome");
    }
  }, [clearTimers, stopListening, onReplayToOpening]);

  const inCakeScene = phase !== "welcome";
  const showInstruction =
    phase === "ready" || phase === "listening" || phase === "blowing";
  const completed = phase === "completed" || phase === "extinguishing";

  return (
    <div className="experience">
      <ConfettiEffect fire={phase === "completed"} />

      <MotionConfig reducedMotion="user">
      <main className="stage">
        <AnimatePresence mode="wait">
          {phase === "welcome" && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}

          {inCakeScene && (
            <motion.div
              key="cake-scene"
              className="scene-cake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Instruction block */}
              {phase === "requesting" && (
                <motion.div
                  className="scene-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="eyebrow">Preparing the magic</p>
                  <p className="instruction">Requesting microphone access…</p>
                  <div className="spinner" aria-hidden="true" />
                </motion.div>
              )}

              {showInstruction && (
                <motion.div
                  className="instruction-block"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <AnimatePresence mode="wait">
                    {breathPause ? (
                      <motion.p
                        key="breath"
                        className="instruction"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {birthdayConfig.breathHint}
                      </motion.p>
                    ) : (
                      <motion.div
                        key="blow"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="instruction">
                          {birthdayConfig.instruction} 🎙️
                        </p>
                        <p className="instruction-sub">
                          {birthdayConfig.blowHint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <MicrophoneIndicator
                    isListening={isListening}
                    volume={volume}
                  />
                </motion.div>
              )}

              {phase === "mic-error" && (
                <motion.div
                  className="instruction-block"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="eyebrow">Almost there</p>
                  <p className="instruction">
                    Microphone access isn&apos;t available.
                  </p>
                  <p className="instruction-sub">
                    {microphoneError === "denied"
                      ? "Permission was blocked — allow the microphone in your browser, or continue without it."
                      : microphoneError === "insecure-context"
                        ? "Microphone needs a secure (HTTPS or localhost) page."
                        : "For the full experience we listen for your blow — or continue manually."}
                  </p>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn-premium btn-small"
                      onClick={handleRetry}
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-small"
                      onClick={handleManualBlow}
                    >
                      Blow Manually
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Cake — the focal point in every sub-phase */}
              {(showInstruction ||
                phase === "extinguishing" ||
                phase === "completed") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="cake-entrance"
                >
                  <div className="cake-idle">
                    <BirthdayCake candleStates={candles} wind={wind} />
                  </div>
                </motion.div>
              )}

              {/* Gentle manual fallback while listening (small, secondary) */}
              {phase === "listening" && (
                <button
                  type="button"
                  onClick={handleManualBlow}
                  className="manual-link"
                >
                  Can&apos;t blow? Tap here instead
                </button>
              )}

              {phase === "blowing" && (
                <motion.p
                  className="blow-feedback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Feel that breeze… 💨
                </motion.p>
              )}

              {/* Cinematic reveal of the message */}
              <AnimatePresence>
                {completed && (
                  <BirthdayMessage key="msg" onReplay={handleReplay} />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </MotionConfig>
    </div>
  );
}
