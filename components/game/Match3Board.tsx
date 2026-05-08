"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GRID_SIZE,
  type Cell,
  type Position,
  type MatchResult,
  getGemVisual,
  createGrid,
  isAdjacent,
  swapCells,
  findMatches,
  removeMatches,
  applyGravity,
  calculateScore,
  hasValidMoves,
  TARGET_SCORE,
  MAX_MOVES,
} from "./Match3Logic";

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface Match3BoardProps {
  onScoreChange: (score: number) => void;
  onMovesChange: (moves: number) => void;
  onCombo: (combo: number) => void;
  onGameEnd: (won: boolean) => void;
  reset: number;
}

const CELL_SIZE = 44;
const GAP = 3;

export default function Match3Board({
  onScoreChange,
  onMovesChange,
  onCombo,
  onGameEnd,
  reset,
}: Match3BoardProps) {
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid());
  const [selected, setSelected] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(false);
  const [matchedCells, setMatchedCells] = useState<Set<string>>(new Set());

  const scoreRef = useRef(0);
  const movesRef = useRef(MAX_MOVES);
  const gameOverRef = useRef(false);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const newGrid = createGrid();
    setGrid(newGrid);
    setSelected(null);
    setIsAnimating(false);
    setParticles([]);
    setMatchedCells(new Set());
    scoreRef.current = 0;
    movesRef.current = MAX_MOVES;
    gameOverRef.current = false;
    onScoreChange(0);
    onMovesChange(MAX_MOVES);
    onCombo(0);
  }, [reset, onScoreChange, onMovesChange, onCombo]);

  const spawnParticles = useCallback((positions: Position[], gemType: number) => {
    const visual = getGemVisual(gemType as 0);
    const newParticles: Particle[] = [];
    for (const pos of positions) {
      for (let i = 0; i < 6; i++) {
        newParticles.push({
          id: `p-${++particleIdRef.current}`,
          x: pos.col * (CELL_SIZE + GAP) + CELL_SIZE / 2,
          y: pos.row * (CELL_SIZE + GAP) + CELL_SIZE / 2,
          color: visual.glow,
        });
      }
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 600);
  }, []);

  const processMatches = useCallback(
    async (currentGrid: Cell[][], comboLevel: number) => {
      const matches = findMatches(currentGrid);
      if (matches.length === 0) {
        setIsAnimating(false);
        onCombo(0);
        if (gameOverRef.current) return;
        if (scoreRef.current >= TARGET_SCORE) {
          gameOverRef.current = true;
          onGameEnd(true);
        } else if (movesRef.current <= 0) {
          gameOverRef.current = true;
          onGameEnd(false);
        } else if (!hasValidMoves(currentGrid)) {
          const freshGrid = createGrid();
          setGrid(freshGrid);
        }
        return;
      }

      if (comboLevel > 0) {
        onCombo(comboLevel);
      }
      if (comboLevel >= 2) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }

      const points = calculateScore(matches, comboLevel);
      scoreRef.current += points;
      onScoreChange(scoreRef.current);

      // Highlight matched cells
      const matchSet = new Set<string>();
      for (const m of matches) {
        for (const p of m.positions) {
          matchSet.add(`${p.row},${p.col}`);
        }
        spawnParticles(
          m.positions,
          currentGrid[m.positions[0].row][m.positions[0].col].type
        );
      }
      setMatchedCells(matchSet);

      await delay(350);

      const cleared = removeMatches(currentGrid, matches);
      setMatchedCells(new Set());

      await delay(100);

      const { grid: filledGrid } = applyGravity(cleared);
      setGrid(filledGrid);

      await delay(300);

      processMatches(filledGrid, comboLevel + 1);
    },
    [onScoreChange, onCombo, onGameEnd, spawnParticles]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isAnimating || gameOverRef.current) return;

      const clickedPos: Position = { row, col };

      if (!selected) {
        setSelected(clickedPos);
        return;
      }

      if (selected.row === row && selected.col === col) {
        setSelected(null);
        return;
      }

      if (!isAdjacent(selected, clickedPos)) {
        setSelected(clickedPos);
        return;
      }

      setIsAnimating(true);
      setSelected(null);

      const swapped = swapCells(grid, selected, clickedPos);
      setGrid(swapped);

      const matches = findMatches(swapped);
      if (matches.length === 0) {
        setTimeout(() => {
          setGrid(swapCells(swapped, selected, clickedPos));
          setIsAnimating(false);
        }, 300);
        return;
      }

      movesRef.current -= 1;
      onMovesChange(movesRef.current);

      setTimeout(() => {
        processMatches(swapped, 0);
      }, 250);
    },
    [grid, selected, isAnimating, processMatches, onMovesChange]
  );

  const boardSize = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GAP;

  return (
    <motion.div
      animate={shake ? { x: [0, -4, 4, -3, 3, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="relative mx-auto select-none"
      style={{ width: boardSize, height: boardSize }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 rounded-xl border border-glass-border bg-glass/50" />

      {/* Gems */}
      <div className="relative" style={{ width: boardSize, height: boardSize }}>
        <AnimatePresence mode="popLayout">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              const visual = getGemVisual(cell.type);
              const isSelected =
                selected?.row === r && selected?.col === c;
              const isMatched = matchedCells.has(`${r},${c}`);
              const x = c * (CELL_SIZE + GAP);
              const y = r * (CELL_SIZE + GAP);

              return (
                <motion.button
                  key={cell.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isMatched ? [1, 1.3, 0] : 1,
                    opacity: isMatched ? [1, 1, 0] : 1,
                    x,
                    y,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 25 },
                    scale: isMatched
                      ? { duration: 0.35 }
                      : { type: "spring", stiffness: 500, damping: 25 },
                    opacity: { duration: 0.2 },
                    x: { type: "spring", stiffness: 300, damping: 25 },
                    y: { type: "spring", stiffness: 200, damping: 20 },
                  }}
                  onClick={() => handleCellClick(r, c)}
                  className="absolute flex items-center justify-center rounded-lg"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {/* Gem body */}
                  <div
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-gradient-to-br ${visual.color} transition-shadow duration-150 ${
                      isSelected
                        ? `ring-2 ring-white shadow-lg ${visual.glow}`
                        : "shadow-md"
                    }`}
                  >
                    <span className="text-lg leading-none drop-shadow-md">
                      {visual.emoji}
                    </span>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>

        {/* Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`pointer-events-none absolute h-2 w-2 rounded-full bg-white ${p.color}`}
              style={{ left: p.x, top: p.y }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 60,
                scale: 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
