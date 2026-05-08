"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Applies staggered fade-up + blur-clear reveal animations
 * to all direct children of a container when scrolled into view.
 */
export function useCinematicReveal(
  options: {
    stagger?: number;
    y?: number;
    duration?: number;
    blur?: number;
    start?: string;
  } = {},
) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    stagger = 0.12,
    y = 60,
    duration = 0.9,
    blur = 12,
    start = "top 85%",
  } = options;

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    const children = ref.current.children;
    if (!children.length) return;

    gsap.set(children, {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(children, {
        start,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration,
            stagger,
            ease: "power3.out",
            overwrite: true,
          });
        },
        once: true,
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, y, duration, blur, start]);

  return ref;
}
