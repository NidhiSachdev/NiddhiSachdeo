"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Match3Board from "./Match3Board";
import { TARGET_SCORE, MAX_MOVES } from "./Match3Logic";

interface Match3GameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Match3Game({ isOpen, onClose }: Match3GameProps) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(MAX_MOVES);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [resetKey, setResetKey] = useState(0);

  const handleGameEnd = useCallback((won: boolean) => {
    setGameState(won ? "won" : "lost");
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setMoves(MAX_MOVES);
    setCombo(0);
    setGameState("playing");
    setResetKey((k) => k + 1);
  }, []);

  const handleClose = useCallback(() => {
    handleRestart();
    onClose();
  }, [onClose, handleRestart]);

  const progress = Math.min((score / TARGET_SCORE) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10050] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Game container */}
          <motion.div
            className="relative z-10 flex w-[min(420px,95vw)] flex-col items-center gap-5 rounded-3xl border border-glass-border bg-glass/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                💎 Gem Crush
              </h2>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-glass-border bg-glass/60 text-sm text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex flex-col items-center rounded-xl border border-glass-border bg-glass/50 px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Score
                </span>
                <motion.span
                  key={score}
                  initial={{ scale: 1.3, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "#f5f5f7" }}
                  className="text-lg font-bold text-foreground"
                >
                  {score}
                </motion.span>
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted">
                  <span>Target: {TARGET_SCORE}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-glass-border">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-glass-border bg-glass/50 px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Moves
                </span>
                <span
                  className={`text-lg font-bold ${
                    moves <= 5 ? "text-red-400" : "text-foreground"
                  }`}
                >
                  {moves}
                </span>
              </div>
            </div>

            {/* Combo indicator */}
            <AnimatePresence>
              {combo > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1 text-xs font-bold text-background"
                >
                  🔥 {combo}x COMBO!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Board */}
            <Match3Board
              onScoreChange={setScore}
              onMovesChange={setMoves}
              onCombo={setCombo}
              onGameEnd={handleGameEnd}
              reset={resetKey}
            />

            {/* Instructions */}
            <p className="text-center text-[11px] text-muted">
              Click a gem, then click an adjacent gem to swap. Match 3+ to score!
            </p>

            {/* Game over overlay */}
            <AnimatePresence>
              {gameState !== "playing" && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-background/85 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="text-5xl"
                  >
                    {gameState === "won" ? "🏆" : "💔"}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {gameState === "won" ? "You Won!" : "Game Over"}
                  </h3>
                  <p className="text-sm text-muted">
                    {gameState === "won"
                      ? `Amazing! You scored ${score} points!`
                      : `You scored ${score} / ${TARGET_SCORE}. Try again!`}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRestart}
                      className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={handleClose}
                      className="rounded-xl border border-glass-border bg-glass/60 px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
