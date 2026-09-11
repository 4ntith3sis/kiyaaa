"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import WelcomeCard from "./WelcomeCard";
import SadCard from "./SadCard";
import BirthdayExperience from "./BirthdayExperience";
import AmbientBackground from "./AmbientBackground";

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

  return (
    <div className="experience">
      {/* Single static backdrop for every scene — mounted once, so the
          background never transitions between pages */}
      <AmbientBackground />
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
                  onYes={() => setScene("cake")}
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
                <BirthdayExperience onReplayToOpening={() => setScene("welcome")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  );
}
