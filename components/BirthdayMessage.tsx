"use client";

import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";

export default function BirthdayMessage({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="message-card"
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {birthdayConfig.subtitle} ✨
      </motion.p>
      <motion.h2
        className="font-display message-title"
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.45, duration: 0.9 }}
      >
        Happy Birthday, {birthdayConfig.name}!
      </motion.h2>
      <motion.p
        className="message-body"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {birthdayConfig.message}
      </motion.p>
      <motion.p
        className="message-closing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.8 }}
      >
        {birthdayConfig.closing}
      </motion.p>
      <motion.button
        type="button"
        onClick={onReplay}
        className="btn-ghost"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Replay the birthday experience"
      >
        ↻ Replay
      </motion.button>
    </motion.div>
  );
}
