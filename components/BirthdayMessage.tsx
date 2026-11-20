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
      <div className="message-stickers" aria-hidden="true">
        <motion.span
          className="message-sticker sticker-cat"
          animate={{ y: [0, -5, 0], rotate: [-4, 3, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 90" fill="none">
            <path d="M16 39 12 9Q11 5 16 8L37 24Q50 19 63 24L84 8Q89 5 88 10L84 40Q91 51 86 66Q80 83 50 84Q20 83 14 66Q9 51 16 39Z" fill="#fff8ef" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
            <path d="m18 17 15 12-13 5ZM82 17 67 29l13 5Z" fill="#ee9cab" />
            <ellipse cx="36" cy="49" rx="3" ry="5" fill="currentColor" />
            <ellipse cx="64" cy="49" rx="3" ry="5" fill="currentColor" />
            <path d="m46 58 4 3 4-3M50 61q-4 6-8 1m8-1q4 6 8 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        <motion.span
          className="message-sticker sticker-hamster"
          animate={{ y: [0, -4, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <svg viewBox="0 0 100 90" fill="none">
            <circle cx="27" cy="30" r="14" fill="#d99a6c" stroke="currentColor" strokeWidth="4" />
            <circle cx="73" cy="30" r="14" fill="#d99a6c" stroke="currentColor" strokeWidth="4" />
            <path d="M14 52Q16 30 50 29Q84 30 86 52Q88 80 50 82Q12 80 14 52Z" fill="#e9b887" stroke="currentColor" strokeWidth="4" />
            <ellipse cx="50" cy="60" rx="22" ry="16" fill="#fff1df" />
            <circle cx="38" cy="49" r="3" fill="currentColor" />
            <circle cx="62" cy="49" r="3" fill="currentColor" />
            <ellipse cx="50" cy="59" rx="4" ry="3" fill="#d97891" />
            <path d="M50 62q-4 5-8 1m8-1q4 5 8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="hamster-caption">Aku Lily</span>
        </motion.span>
        <motion.span
          className="message-sticker sticker-tooth"
          animate={{ rotate: [-6, 6, -6], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 80 90" fill="none">
            <path d="M16 14Q27 7 40 15Q53 7 64 14Q75 21 70 40L60 73Q57 83 50 80L42 58Q40 53 37 59L29 79Q22 85 18 74L8 40Q3 22 16 14Z" fill="#fffefa" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
            <path d="M18 22Q27 17 36 22" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.span>
        <motion.span
          className="message-sticker sticker-balloons"
          animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          <svg viewBox="0 0 100 110" fill="none">
            <path d="M31 14C17 14 12 27 15 41Q18 55 31 61Q44 55 47 41C50 27 45 14 31 14Z" fill="#f3a0ad" stroke="currentColor" strokeWidth="3" />
            <path d="M68 7C55 7 50 20 53 34Q56 48 68 54Q80 48 83 34C86 20 81 7 68 7Z" fill="#f4c66a" stroke="currentColor" strokeWidth="3" />
            <path d="m28 61 3 5 3-5m31-12 3 5 3-5M31 66q-4 18 10 29m27-43q-2 21-27 43m0 0-4 7 8-1m-4-6q14 2 20 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="25" cy="27" r="3" fill="white" opacity=".8" />
            <circle cx="62" cy="20" r="3" fill="white" opacity=".8" />
          </svg>
        </motion.span>
        <motion.span
          className="message-sticker sticker-flower"
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.04, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M50 57q-2 18 0 34m0-18q-11-12-21-3m21-7q11-13 22-4" stroke="#68966c" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 79q-11-12-19-5 5 12 19 8m1-11q11-11 19-3-4 12-19 9" fill="#8fbd82" stroke="currentColor" strokeWidth="2" />
            <g fill="#f3a0ad" stroke="currentColor" strokeWidth="2.5">
              <ellipse cx="50" cy="25" rx="9" ry="15" />
              <ellipse cx="50" cy="25" rx="9" ry="15" transform="rotate(60 50 50)" />
              <ellipse cx="50" cy="25" rx="9" ry="15" transform="rotate(120 50 50)" />
              <ellipse cx="50" cy="25" rx="9" ry="15" transform="rotate(180 50 50)" />
              <ellipse cx="50" cy="25" rx="9" ry="15" transform="rotate(240 50 50)" />
              <ellipse cx="50" cy="25" rx="9" ry="15" transform="rotate(300 50 50)" />
            </g>
            <circle cx="50" cy="50" r="9" fill="#f4c66a" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </motion.span>
      </div>
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {birthdayConfig.subtitle && `${birthdayConfig.subtitle} ✨`}
      </motion.p>
      <motion.h2
        className="font-display message-title"
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.45, duration: 0.9 }}
      >
        Happy Birthday {birthdayConfig.name}!
      </motion.h2>
      <motion.p
        className="message-body"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {birthdayConfig.message.split("\n\n").map((paragraph, index) => (
          <span className="message-paragraph" key={`message-${index}`}>
            {paragraph}
          </span>
        ))}
      </motion.p>
      <motion.p
        className="message-closing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.8 }}
      >
        {birthdayConfig.closing.split("\n").map((line, index) => (
          <span className={`message-closing-line${index === 2 ? " message-signature" : ""}`} key={`${line}-${index}`}>
            {line}
          </span>
        ))}
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
