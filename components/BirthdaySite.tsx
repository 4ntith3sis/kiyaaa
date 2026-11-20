"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import WelcomeCard from "./WelcomeCard";
import SadCard from "./SadCard";
import BirthdayExperience from "./BirthdayExperience";
import AmbientBackground from "./AmbientBackground";
import { isMusicMuted, playMusic, setMusicMuted, stopMusic } from "@/lib/music";

type Scene = "welcome" | "sad" | "cake";

/*
 * Seamless crossfade between scenes (no empty gap):
 * both layers share one grid cell so the exiting scene fades out
 * underneath while the entering scene fades in on top.
 */
const sceneVariants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 16,
    filter: "blur(6px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  gone: {
    opacity: 0,
    scale: 1.03,
    y: -12,
    filter: "blur(4px)",
    pointerEvents: "none" as const,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Handmade birthday card flow:
 *   welcome (dancing unicorn) → yes please → cake surprise
 *                             → no thanks  → sad unicorn → try again → welcome
 * The cake experience (and its microphone) only mounts inside the cake scene;
 * leaving the scene unmounts it, which stops and cleans up the mic stream.
 */
export default function BirthdaySite() {
  const [scene, setScene] = useState<Scene>("welcome");
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicMuted, setMusicMutedState] = useState(isMusicMuted());

  // Enter the cake experience; music begins from its Light the Candles button.
  const handleYes = useCallback(() => {
    setScene("cake");
  }, []);

  const handleStartCandles = useCallback(() => {
    void playMusic().then((playing) => {
      if (playing) setMusicStarted(true);
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setMusicMutedState((prev) => {
      const next = !prev;
      setMusicMuted(next);
      return next;
    });
  }, []);

  // When the candles are blown out, the music stops with them.
  const handleBlowStart = useCallback(() => {
    stopMusic();
    setMusicStarted(false);
  }, []);

  return (
    <div className="experience">
      {/* Single static backdrop for every scene — mounted once, so the
          background never transitions between pages */}
      <AmbientBackground />
      {/* Subtle music on/off control, visible only once music has started */}
      {musicStarted && (
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={musicMuted ? "Turn background music on" : "Turn background music off"}
          aria-pressed={!musicMuted}
          title={musicMuted ? "Music off" : "Music on"}
          className="music-toggle"
        >
          {musicMuted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 9v6h4l5 4V5L8 9H4z"
                fill="currentColor"
              />
              <path
                d="M16.5 9.5l5 5m0-5l-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              <path
                d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      )}
      <MotionConfig reducedMotion="user">
        <div className="scene-stack">
          <AnimatePresence>
            {scene === "welcome" && (
              <motion.div
                key="welcome"
                className="scene-layer"
                variants={sceneVariants}
                initial="hidden"
                animate="show"
                exit="gone"
              >
                <WelcomeCard
                  onYes={handleYes}
                  onNo={() => setScene("sad")}
                />
              </motion.div>
            )}
            {scene === "sad" && (
              <motion.div
                key="sad"
                className="scene-layer"
                variants={sceneVariants}
                initial="hidden"
                animate="show"
                exit="gone"
              >
                <SadCard onRetry={() => setScene("welcome")} />
              </motion.div>
            )}
            {scene === "cake" && (
              <motion.div
                key="cake"
                className="scene-layer"
                variants={sceneVariants}
                initial="hidden"
                animate="show"
                exit="gone"
              >
                <BirthdayExperience
                  onReplayToOpening={() => setScene("welcome")}
                  onBlowStart={handleBlowStart}
                  onStartMusic={handleStartCandles}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  );
}
