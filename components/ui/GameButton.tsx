"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Match3Game from "@/components/game/Match3Game";

export default function GameButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-40 z-[9999] flex items-center gap-2 rounded-full border border-glass-border bg-glass/90 px-4 py-3 text-sm shadow-lg backdrop-blur-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Play Game"
      >
        <span className="text-lg">🎮</span>
        <span className="font-medium text-cyan-400">Play Game</span>
      </motion.button>

      <Match3Game isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
