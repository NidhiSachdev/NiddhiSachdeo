"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HandParticles from "@/components/game/HandParticles";

export default function GameButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 z-[9999] flex items-center gap-1.5 rounded-full border border-glass-border bg-glass/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md sm:bottom-5 sm:right-40 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Games"
      >
        <span className="text-lg">🎮</span>
        <span className="font-medium text-cyan-400">Games</span>
      </motion.button>

      <HandParticles isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
