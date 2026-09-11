"use client";

import { motion } from "framer-motion";
import Unicorn from "./Unicorn";

interface WelcomeCardProps {
  onYes: () => void;
  onNo: () => void;
}

export default function WelcomeCard({ onYes, onNo }: WelcomeCardProps) {
  return (
    <div className="card-scene">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Unicorn mood="happy" />
      </motion.div>
      <motion.h1
        className="font-playful card-hello"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.5 }}
      >
        hello
      </motion.h1>
      <motion.p
        className="card-lorem"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.5 }}
      >
        Lorem ipsum
      </motion.p>
      <motion.p
        className="card-question font-playful"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.5 }}
      >
        do you wanna see
        <br />
        your gift?
      </motion.p>
      <motion.div
        className="card-btn-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={onYes}
          className="btn-cute btn-yes font-playful"
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Yes please, show me my gift"
        >
          yes please
        </motion.button>
        <motion.button
          type="button"
          onClick={onNo}
          className="btn-cute btn-no font-playful"
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.94 }}
          aria-label="No thanks"
        >
          no thanks
        </motion.button>
      </motion.div>
    </div>
  );
}
