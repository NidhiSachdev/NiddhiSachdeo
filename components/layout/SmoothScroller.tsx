"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { type ReactNode, useEffect } from "react";

type SmoothScrollerProps = {
  children: ReactNode;
};

const creamEasing = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 1 - Math.pow(2, -12 * t);
};

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.8,
      easing: creamEasing,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.04,
      wheelMultiplier: 0.8,
      touchMultiplier: 0.8,
      infinite: false,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
