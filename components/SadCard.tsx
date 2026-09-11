"use client";

import { motion } from "framer-motion";
import Unicorn from "./Unicorn";

export default function SadCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card-scene">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Unicorn mood="sad" />
      </motion.div>
      <motion.p
        className="card-question font-playful"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        i promise u like it
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={onRetry}
          className="btn-cute btn-yes font-playful"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Try again, back to the opening card"
          autoFocus
        >
          try again
        </motion.button>
      </motion.div>
    </div>
  );
}
