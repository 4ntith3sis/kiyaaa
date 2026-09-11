"use client";

import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="scene-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        {birthdayConfig.welcomeEyebrow}
      </motion.p>
      <motion.h1
        className="font-display display-title"
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {birthdayConfig.welcomeTitle} <span className="sparkle">✨</span>
      </motion.h1>
      <motion.p
        className="welcome-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
      >
        Close your eyes, take a breath — then light the candles.
      </motion.p>
      <motion.button
        type="button"
        onClick={onStart}
        className="btn-premium"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Light the candles and start the birthday surprise"
      >
        <span className="btn-shine" aria-hidden="true" />
        Light the Candles
      </motion.button>
    </motion.div>
  );
}
