"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandParticlesProps {
  isOpen: boolean;
  onClose: () => void;
}

type Pt = { x: number; y: number };
type Stroke = { points: Pt[]; hue: number; width: number };

const TIP_IDS = [8, 12, 16, 20];
const PIP_IDS = [6, 10, 14, 18];
const THUMB_TIP = 4;
const THUMB_IP = 3;
const PALM_CENTER = 9;

const BRUSH_HUES = [260, 330, 190, 40, 0, 120];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function loadMediaPipe() {
  await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js");
  await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js");
}

function countExtended(landmarks: any[]): number {
  let count = 0;
  const thumbExt = Math.abs(landmarks[THUMB_TIP].x - landmarks[0].x) >
    Math.abs(landmarks[THUMB_IP].x - landmarks[0].x);
  if (thumbExt) count++;
  for (let i = 0; i < TIP_IDS.length; i++) {
    if (landmarks[TIP_IDS[i]].y < landmarks[PIP_IDS[i]].y) count++;
  }
  return count;
}

function smoothPoint(prev: Pt, cur: Pt, factor = 0.35): Pt {
  return {
    x: prev.x + (cur.x - prev.x) * factor,
    y: prev.y + (cur.y - prev.y) * factor,
  };
}

export default function HandParticles({ isOpen, onClose }: HandParticlesProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const panOffsetRef = useRef<Pt>({ x: 0, y: 0 });
  const lastPalmRef = useRef<Pt | null>(null);
  const lastTipRef = useRef<Pt | null>(null);
  const modeRef = useRef<"draw" | "move" | "idle">("idle");
  const handDataRef = useRef<{ landmarks: any[]; fingersUp: number }[]>([]);
  const rafRef = useRef<number>(0);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const brushHueIdxRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "denied">("loading");
  const [mode, setMode] = useState<"draw" | "move" | "idle">("idle");
  const [brushHue, setBrushHue] = useState(BRUSH_HUES[0]);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
    if (handsRef.current) { handsRef.current.close(); handsRef.current = null; }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    strokesRef.current = [];
    currentStrokeRef.current = null;
    panOffsetRef.current = { x: 0, y: 0 };
    lastPalmRef.current = null;
    lastTipRef.current = null;
  }, []);

  const clearDrawing = useCallback(() => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    panOffsetRef.current = { x: 0, y: 0 };
  }, []);

  const cycleBrush = useCallback(() => {
    brushHueIdxRef.current = (brushHueIdxRef.current + 1) % BRUSH_HUES.length;
    setBrushHue(BRUSH_HUES[brushHueIdxRef.current]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        await loadMediaPipe();
        if (cancelled) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const W = (window as any);
        const hands = new W.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          const data: { landmarks: any[]; fingersUp: number }[] = [];
          if (results.multiHandLandmarks) {
            for (const lm of results.multiHandLandmarks) {
              data.push({ landmarks: lm, fingersUp: countExtended(lm) });
            }
          }
          handDataRef.current = data;
        });

        handsRef.current = hands;

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          });
        } catch {
          setStatus("denied");
          return;
        }

        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        video.srcObject = stream;
        await video.play();

        const camera = new W.Camera(video, {
          onFrame: async () => { await hands.send({ image: video }); },
          width: 640,
          height: 480,
        });
        cameraRef.current = camera;
        await camera.start();

        if (cancelled) { cleanup(); return; }

        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        setStatus("ready");

        const ctx = canvas.getContext("2d")!;
        let frame = 0;

        const loop = () => {
          const w = canvas.width;
          const h = canvas.height;
          const handArr = handDataRef.current;

          // Clear canvas
          ctx.clearRect(0, 0, w, h);

          // Determine mode
          let curMode: "draw" | "move" | "idle" = "idle";
          let indexTip: Pt | null = null;
          let palmPt: Pt | null = null;

          if (handArr.length > 0) {
            const hd = handArr[0];
            const lm = hd.landmarks;
            const fu = hd.fingersUp;

            const rawTip = { x: (1 - lm[8].x) * w, y: lm[8].y * h };
            indexTip = lastTipRef.current ? smoothPoint(lastTipRef.current, rawTip) : rawTip;
            lastTipRef.current = indexTip;

            palmPt = { x: (1 - lm[PALM_CENTER].x) * w, y: lm[PALM_CENTER].y * h };

            if (fu >= 4) {
              curMode = "move";
            } else if (fu <= 2) {
              curMode = "draw";
            }
          } else {
            lastTipRef.current = null;
          }

          // Draw mode - add points to current stroke
          if (curMode === "draw" && indexTip) {
            const pt = { x: indexTip.x - panOffsetRef.current.x, y: indexTip.y - panOffsetRef.current.y };
            if (modeRef.current !== "draw") {
              const stroke: Stroke = { points: [pt], hue: BRUSH_HUES[brushHueIdxRef.current], width: 5 };
              strokesRef.current.push(stroke);
              currentStrokeRef.current = stroke;
            } else if (currentStrokeRef.current) {
              currentStrokeRef.current.points.push(pt);
            }
          } else {
            currentStrokeRef.current = null;
          }

          // Move mode - pan all strokes
          if (curMode === "move" && palmPt) {
            if (modeRef.current === "move" && lastPalmRef.current) {
              panOffsetRef.current.x += palmPt.x - lastPalmRef.current.x;
              panOffsetRef.current.y += palmPt.y - lastPalmRef.current.y;
            }
            lastPalmRef.current = { ...palmPt };
          } else {
            lastPalmRef.current = null;
          }

          modeRef.current = curMode;
          if (frame % 6 === 0) setMode(curMode);

          // Render all strokes
          const ox = panOffsetRef.current.x;
          const oy = panOffsetRef.current.y;

          for (const stroke of strokesRef.current) {
            if (stroke.points.length < 2) continue;
            const lastPt = stroke.points[stroke.points.length - 1];
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Glow layer
            ctx.strokeStyle = `hsla(${stroke.hue}, 85%, 60%, 0.3)`;
            ctx.lineWidth = stroke.width + 8;
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x + ox, stroke.points[0].y + oy);
            for (let i = 1; i < stroke.points.length; i++) {
              const prev = stroke.points[i - 1];
              const cur = stroke.points[i];
              const mx = (prev.x + cur.x) / 2 + ox;
              const my = (prev.y + cur.y) / 2 + oy;
              ctx.quadraticCurveTo(prev.x + ox, prev.y + oy, mx, my);
            }
            ctx.lineTo(lastPt.x + ox, lastPt.y + oy);
            ctx.stroke();

            // Main line
            ctx.strokeStyle = `hsla(${stroke.hue}, 80%, 68%, 0.95)`;
            ctx.lineWidth = stroke.width;
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x + ox, stroke.points[0].y + oy);
            for (let i = 1; i < stroke.points.length; i++) {
              const prev = stroke.points[i - 1];
              const cur = stroke.points[i];
              const mx = (prev.x + cur.x) / 2 + ox;
              const my = (prev.y + cur.y) / 2 + oy;
              ctx.quadraticCurveTo(prev.x + ox, prev.y + oy, mx, my);
            }
            ctx.lineTo(lastPt.x + ox, lastPt.y + oy);
            ctx.stroke();
          }

          // Draw cursor
          if (indexTip && curMode === "draw") {
            const hue = BRUSH_HUES[brushHueIdxRef.current];
            ctx.beginPath();
            ctx.arc(indexTip.x, indexTip.y, 10, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.9)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(indexTip.x, indexTip.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 85%, 75%, 1)`;
            ctx.fill();
          }

          if (palmPt && curMode === "move") {
            const sz = 20 + Math.sin(frame * 0.08) * 4;
            ctx.beginPath();
            ctx.arc(palmPt.x, palmPt.y, sz, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
            ctx.lineWidth = 2;
            ctx.stroke();
            // Move arrows
            const arrowLen = 8;
            for (let a = 0; a < 4; a++) {
              const angle = (a * Math.PI) / 2;
              const ax = palmPt.x + Math.cos(angle) * (sz + 6);
              const ay = palmPt.y + Math.sin(angle) * (sz + 6);
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(ax + Math.cos(angle) * arrowLen, ay + Math.sin(angle) * arrowLen);
              ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }

          frame++;
          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => { window.removeEventListener("resize", resize); };
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => { cancelled = true; cleanup(); };
  }, [isOpen, cleanup]);

  const handleClose = useCallback(() => { cleanup(); onClose(); }, [cleanup, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000]"
          style={{ background: "#080810" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Camera feed - visible background */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            autoPlay
            playsInline
            muted
          />

          {/* Semi-transparent overlay to darken camera slightly */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawing canvas on top */}
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-3"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">✋</span>
              <h2 className="text-sm font-semibold text-white">Hand Draw</h2>
              {status === "ready" && (
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  mode === "draw" ? "bg-purple-500/30 text-purple-300" :
                  mode === "move" ? "bg-emerald-500/30 text-emerald-300" :
                  "bg-white/10 text-white/40"
                )}>
                  {mode === "draw" ? "Drawing" : mode === "move" ? "Moving" : "Show hand"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {status === "ready" && (
                <>
                  <button onClick={cycleBrush}
                    className="flex h-8 items-center gap-2 rounded-lg bg-white/10 px-3 text-xs font-medium text-white/70 transition-all hover:bg-white/[0.18]">
                    <span className="inline-block h-3 w-3 rounded-full"
                      style={{ background: `hsl(${brushHue}, 80%, 65%)`, boxShadow: `0 0 8px hsla(${brushHue}, 90%, 55%, 0.5)` }} />
                    Color
                  </button>
                  <button onClick={clearDrawing}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:bg-white/[0.18]">
                    Clear
                  </button>
                </>
              )}
              <button onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom hints */}
          {status === "ready" && (
            <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-4">
              <span className="rounded-full bg-black/60 px-4 py-2 text-xs text-purple-300/80 backdrop-blur-sm">
                Point finger to draw
              </span>
              <span className="rounded-full bg-black/60 px-4 py-2 text-xs text-emerald-300/80 backdrop-blur-sm">
                Open palm to move
              </span>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#080810]">
              <motion.div className="h-10 w-10 rounded-full border-2 border-purple-500/30 border-t-purple-500"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <p className="text-sm text-purple-300/70">Loading hand tracking AI...</p>
              <p className="text-xs text-white/30">Camera access will be requested</p>
            </div>
          )}

          {/* Camera denied */}
          {status === "denied" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#080810]">
              <span className="text-4xl">📷</span>
              <p className="text-sm font-medium text-white/70">Camera access denied</p>
              <p className="max-w-xs text-center text-xs text-white/40">
                Please allow camera access in your browser settings and try again.
              </p>
              <button onClick={handleClose}
                className="mt-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/30">
                Close
              </button>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#080810]">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm font-medium text-white/70">Failed to load hand tracking</p>
              <p className="max-w-xs text-center text-xs text-white/40">
                Check your internet connection and camera permissions.
              </p>
              <button onClick={handleClose}
                className="mt-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/30">
                Close
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
