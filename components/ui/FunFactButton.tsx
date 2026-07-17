"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const funFacts = [
  "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible!",
  "Octopuses have three hearts and blue blood.",
  "A group of flamingos is called a 'flamboyance'.",
  "Bananas are berries, but strawberries aren't.",
  "The Eiffel Tower can grow up to 6 inches taller during summer due to heat expansion.",
  "There are more stars in the universe than grains of sand on all Earth's beaches.",
  "A day on Venus is longer than a year on Venus.",
  "The inventor of the Pringles can is buried in one.",
  "Wombat poop is cube-shaped.",
  "Sharks are older than trees — they've been around for over 400 million years.",
  "The shortest war in history lasted 38 minutes (Britain vs Zanzibar, 1896).",
  "Cows have best friends and get stressed when separated.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "The human nose can detect over 1 trillion different scents.",
  "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
  "There's enough DNA in the average person's body to stretch from the Sun to Pluto and back — 17 times.",
  "Sea otters hold hands while sleeping so they don't drift apart.",
  "The total weight of all ants on Earth roughly equals the total weight of all humans.",
  "You can hear a blue whale's heartbeat from over 2 miles away.",
  "An astronaut's footprint on the Moon can last for millions of years — there's no wind to blow it away.",
];

export default function FunFactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [fact, setFact] = useState("");

  const showNewFact = useCallback(() => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFact(randomFact);
    setIsOpen(true);
  }, []);

  return (
    <>
      <motion.button
        onClick={showNewFact}
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-full border border-glass-border bg-glass/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md sm:bottom-5 sm:right-5 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Fun Fact!"
      >
        <span className="text-lg">💡</span>
        <span className="font-medium text-amber-400">Fun Fact</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-14 right-4 z-[9999] w-[min(320px,85vw)] rounded-2xl border border-glass-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-20 sm:right-5 sm:p-5"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-400">
                💡 Fun Fact
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{fact}</p>
            <button
              onClick={showNewFact}
              className="mt-4 w-full rounded-lg border border-glass-border bg-glass/60 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              Another one!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
