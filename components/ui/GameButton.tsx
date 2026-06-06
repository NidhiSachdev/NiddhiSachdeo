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
        className="fixed bottom-5 right-40 z-[9999] flex items-center gap-2 rounded-full border border-glass-border bg-glass/90 px-4 py-3 text-sm shadow-lg backdrop-blur-md"
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
