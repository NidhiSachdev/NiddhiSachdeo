"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GravityDrawProps {
  isOpen: boolean;
  onClose: () => void;
}

type Point = { x: number; y: number };
type Line = Point[];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  trail: Point[];
};

const GRAVITY = 0.15;
const FRICTION = 0.98;
const BOUNCE = 0.55;
const PARTICLE_RADIUS = 2.5;
const LINE_CHECK_DIST = 6;
const MAX_PARTICLES = 400;
const SPAWN_RATE = 3;
const TRAIL_LEN = 8;
const PALETTE_HUES = [260, 220, 190, 280, 310];

function distToSegment(p: Point, a: Point, b: Point): { dist: number; nx: number; ny: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    const d = Math.hypot(p.x - a.x, p.y - a.y);
    return { dist: d, nx: 0, ny: -1 };
  }
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const closestX = a.x + t * dx;
  const closestY = a.y + t * dy;
  const diffX = p.x - closestX;
  const diffY = p.y - closestY;
  const dist = Math.hypot(diffX, diffY);
  if (dist === 0) return { dist: 0, nx: -dy / Math.sqrt(lenSq), ny: dx / Math.sqrt(lenSq) };
  return { dist, nx: diffX / dist, ny: diffY / dist };
}

function spawnParticle(w: number): Particle {
  const hue = PALETTE_HUES[Math.floor(Math.random() * PALETTE_HUES.length)];
  const maxLife = 300 + Math.random() * 200;
  return {
    x: Math.random() * w,
    y: -5,
    vx: (Math.random() - 0.5) * 1.5,
    vy: Math.random() * 1.5,
    life: maxLife,
    maxLife,
    hue,
    trail: [],
  };
}

export default function GravityDraw({ isOpen, onClose }: GravityDrawProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const drawingRef = useRef(false);
  const currentLineRef = useRef<Line>([]);
  const rafRef = useRef<number>(0);
  const spawnRef = useRef(true);
  const [spawning, setSpawning] = useState(true);
  const [particleCount, setParticleCount] = useState(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  const getPos = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  }, []);

  const handleDown = useCallback((e: MouseEvent | TouchEvent) => {
    const pos = getPos(e);
    if (!pos) return;
    drawingRef.current = true;
    currentLineRef.current = [pos];
    linesRef.current.push(currentLineRef.current);
  }, [getPos]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawingRef.current) return;
    const pos = getPos(e);
    if (!pos) return;
    currentLineRef.current.push(pos);
  }, [getPos]);

  const handleUp = useCallback(() => {
    drawingRef.current = false;
    currentLineRef.current = [];
  }, []);

  const clearLines = useCallback(() => {
    linesRef.current = [];
  }, []);

  const toggleSpawn = useCallback(() => {
    spawnRef.current = !spawnRef.current;
    setSpawning(spawnRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();
    window.addEventListener("resize", resize);
    particlesRef.current = [];
    linesRef.current = [];
    spawnRef.current = true;
    setSpawning(true);

    const onMouseDown = (e: MouseEvent) => handleDown(e);
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onMouseUp = () => handleUp();
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); handleDown(e); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); handleMove(e); };
    const onTouchEnd = () => handleUp();

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    const ctx = canvas.getContext("2d")!;
    let frameCount = 0;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.fillStyle = "rgba(8, 8, 16, 0.25)";
      ctx.fillRect(0, 0, w, h);

      // Spawn particles
      if (spawnRef.current && particlesRef.current.length < MAX_PARTICLES) {
        for (let i = 0; i < SPAWN_RATE; i++) {
          particlesRef.current.push(spawnParticle(w));
        }
      }

      const lines = linesRef.current;

      // Draw lines
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const line of lines) {
        if (line.length < 2) continue;
        ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
        ctx.shadowColor = "rgba(139, 92, 246, 0.4)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
          ctx.lineTo(line[i].x, line[i].y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Update & draw particles
      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += GRAVITY;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Collision with drawn lines
        for (const line of lines) {
          for (let i = 0; i < line.length - 1; i++) {
            const { dist, nx, ny } = distToSegment(p, line[i], line[i + 1]);
            if (dist < LINE_CHECK_DIST) {
              const vDotN = p.vx * nx + p.vy * ny;
              if (vDotN < 0) {
                p.vx -= (1 + BOUNCE) * vDotN * nx;
                p.vy -= (1 + BOUNCE) * vDotN * ny;
                p.x += nx * (LINE_CHECK_DIST - dist);
                p.y += ny * (LINE_CHECK_DIST - dist);
              }
            }
          }
        }

        // Bounce off walls
        if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
        if (p.x > w) { p.x = w; p.vx *= -0.5; }
        if (p.y > h) { p.y = h; p.vy *= -0.6; }

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        if (p.life > 0 && p.y <= h + 10) {
          alive.push(p);

          const alpha = Math.min(1, p.life / p.maxLife);

          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let t = 1; t < p.trail.length; t++) {
              ctx.lineTo(p.trail[t].x, p.trail[t].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${alpha})`;
          ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${alpha * 0.6})`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      particlesRef.current = alive;

      frameCount++;
      if (frameCount % 10 === 0) {
        setParticleCount(alive.length);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, [isOpen, resize, handleDown, handleMove, handleUp]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={cn(
              "relative flex flex-col overflow-hidden rounded-2xl border border-glass-border",
              "h-[min(90vh,700px)] w-[min(95vw,900px)]",
              "shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_80px_rgba(139,92,246,0.1)]",
            )}
            style={{ background: "#080810" }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))",
                borderBottom: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌌</span>
                <h2 className="text-sm font-semibold text-white">Gravity Draw</h2>
                <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-purple-300/70">
                  {particleCount} particles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpawn}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    spawning
                      ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1]"
                  )}
                >
                  {spawning ? "Pause" : "Play"}
                </button>
                <button
                  onClick={clearLines}
                  className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:bg-white/[0.1] hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.1] hover:text-white"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative flex-1">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full cursor-crosshair"
              />
              {/* Hint overlay - fades after drawing */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-white/20">Draw lines to guide the falling particles</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
