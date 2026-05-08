"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a[href], button, input, textarea, select, [role="button"], [data-cursor-hover], summary';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfigSlow = { stiffness: 180, damping: 22, mass: 0.35 };
  const springConfigTrail = { stiffness: 90, damping: 28, mass: 0.5 };

  const outerX = useSpring(cursorX, springConfigSlow);
  const outerY = useSpring(cursorY, springConfigSlow);

  const trailX = useSpring(cursorX, springConfigTrail);
  const trailY = useSpring(cursorY, springConfigTrail);

  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, { stiffness: 320, damping: 26 });

  const outerGlowOpacity = useTransform(smoothScale, [1, 1.45], [0.45, 0.85]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 768px)");
    const syncEnabled = () => setEnabled(mq.matches);

    syncEnabled();
    mq.addEventListener("change", syncEnabled);

    return () => mq.removeEventListener("change", syncEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const html = document.documentElement;
    const prevCursor = html.style.cursor;
    html.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const hovering = !!target?.closest(INTERACTIVE_SELECTOR);
      scale.set(hovering ? 1.45 : 1);
    };

    const onLeave = () => {
      scale.set(1);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      html.style.cursor = prevCursor;
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, cursorX, cursorY, scale]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10050] hidden md:block"
    >
      {/* Large spotlight — reveals hidden ambient light on the page */}
      <motion.div
        className="fixed left-0 top-0 h-[280px] w-[280px] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(10,132,255,0.06) 0%, rgba(191,90,242,0.03) 40%, transparent 65%)",
          filter: "blur(30px)",
          opacity: 0.8,
        }}
      />

      {/* Glow trail */}
      <motion.div
        className="fixed left-0 top-0 h-[72px] w-[72px] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(10,132,255,0.35) 0%, rgba(191,90,242,0.22) 45%, transparent 70%)",
          filter: "blur(14px)",
          opacity: outerGlowOpacity,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed left-0 top-0 h-[30px] w-[30px] rounded-full border border-accent-blue/45 bg-transparent mix-blend-screen shadow-[0_0_22px_rgba(10,132,255,0.55),0_0_44px_rgba(191,90,242,0.35)]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          scale: smoothScale,
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-foreground shadow-[0_0_12px_rgba(100,210,255,0.9)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: smoothScale,
        }}
      />
    </div>
  );
}
