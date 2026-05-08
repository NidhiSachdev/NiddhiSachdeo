"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  createWalkTimeline,
  createIdleTimeline,
  createWaveTimeline,
  createTalkTimeline,
  createDanceTimeline,
  type CharacterParts,
} from "@/lib/characterAnimations";

export type CharacterState = "intro" | "walking" | "idle" | "talking" | "waving";

export type NiddhiCharacterProps = {
  state: CharacterState;
  dialogue: string;
  shortDialogue: string;
  showBubble: boolean;
  onBubbleClick?: () => void;
};

const bubbleVariants = {
  initial: { opacity: 0, scale: 0.7, x: -8 },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: -6,
    transition: { duration: 0.22 },
  },
};

export default function NiddhiCharacter({
  state,
  dialogue,
  shortDialogue,
  showBubble,
  onBubbleClick,
}: NiddhiCharacterProps) {
  const bodyRef = useRef<SVGGElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);
  const leftLegRef = useRef<SVGGElement>(null);
  const rightLegRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  const getParts = useCallback((): CharacterParts | null => {
    if (
      !bodyRef.current ||
      !leftArmRef.current ||
      !rightArmRef.current ||
      !leftLegRef.current ||
      !rightLegRef.current ||
      !headRef.current ||
      !shadowRef.current
    )
      return null;
    return {
      body: bodyRef.current,
      leftArm: leftArmRef.current,
      rightArm: rightArmRef.current,
      leftLeg: leftLegRef.current,
      rightLeg: rightLegRef.current,
      head: headRef.current,
      shadow: shadowRef.current,
    };
  }, []);

  useEffect(() => {
    const parts = getParts();
    if (!parts) return;

    if (activeTimeline.current) {
      activeTimeline.current.kill();
      activeTimeline.current = null;
    }

    // Reset all transforms before switching state
    const allParts = [
      parts.body,
      parts.leftArm,
      parts.rightArm,
      parts.leftLeg,
      parts.rightLeg,
      parts.head,
      parts.shadow,
    ];
    import("gsap").then(({ default: gsap }) => {
      gsap.set(allParts, { clearProps: "all" });

      let tl: gsap.core.Timeline;
      switch (state) {
        case "walking":
          tl = createWalkTimeline(parts);
          break;
        case "talking":
          tl = createTalkTimeline(parts);
          break;
        case "waving":
          tl = createWaveTimeline(parts);
          break;
        case "intro":
        case "idle":
        default:
          tl = createIdleTimeline(parts);
          break;
      }
      activeTimeline.current = tl;
    });

    return () => {
      if (activeTimeline.current) {
        activeTimeline.current.kill();
      }
    };
  }, [state, getParts]);

  const handleCharacterClick = useCallback(() => {
    if (onBubbleClick) onBubbleClick();

    const parts = getParts();
    if (!parts) return;

    if (activeTimeline.current) activeTimeline.current.kill();
    const danceTl = createDanceTimeline(parts);
    activeTimeline.current = danceTl;
    danceTl.eventCallback("onComplete", () => {
      import("gsap").then(({ default: gsap }) => {
        gsap.set(
          [
            parts.body,
            parts.leftArm,
            parts.rightArm,
            parts.leftLeg,
            parts.rightLeg,
            parts.head,
            parts.shadow,
          ],
          { clearProps: "all" },
        );
        activeTimeline.current = createIdleTimeline(parts);
      });
    });
  }, [getParts, onBubbleClick]);

  return (
    <div className="flex items-end gap-3">
      <div
        className="relative shrink-0 cursor-pointer"
        onClick={handleCharacterClick}
      >
        {/* Ambient glow */}
        <div
          className={cn(
            "absolute inset-0 -z-10 rounded-full blur-[24px] transition-opacity duration-500",
            state === "talking" ? "opacity-50" : "opacity-25",
          )}
          style={{
            background:
              "radial-gradient(circle, rgba(10,132,255,0.3) 0%, rgba(191,90,242,0.15) 50%, transparent 70%)",
          }}
        />

        <svg
          viewBox="0 0 120 200"
          className="h-[130px] w-[78px] sm:h-[165px] sm:w-[99px] lg:h-[200px] lg:w-[120px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="niddhi-head-clip">
              <circle cx="60" cy="36" r="26" />
            </clipPath>
            <radialGradient id="niddhi-head-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(10,132,255,0.5)" />
              <stop offset="60%" stopColor="rgba(191,90,242,0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="niddhi-body-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e2e48" />
              <stop offset="100%" stopColor="#1a1a2e" />
            </linearGradient>
            <linearGradient id="niddhi-leg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1e36" />
              <stop offset="100%" stopColor="#141428" />
            </linearGradient>
            <linearGradient id="niddhi-shoe-fill" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#0a84ff" />
              <stop offset="100%" stopColor="#5e5ce6" />
            </linearGradient>
            <linearGradient id="niddhi-arm-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2a42" />
              <stop offset="100%" stopColor="#1e1e36" />
            </linearGradient>
            <filter id="niddhi-shadow-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>

          {/* Shadow under feet */}
          <ellipse
            ref={shadowRef}
            cx="60"
            cy="194"
            rx="28"
            ry="5"
            fill="rgba(10,132,255,0.15)"
            filter="url(#niddhi-shadow-blur)"
          />

          {/* Main body group */}
          <g ref={bodyRef}>
            {/* Left leg */}
            <g ref={leftLegRef} style={{ transformOrigin: "48px 128px" }}>
              <path
                d="M42,128 Q40,148 42,162 Q44,168 48,168 Q52,168 54,162 Q56,148 54,128 Z"
                fill="url(#niddhi-leg-fill)"
              />
              {/* Left shoe */}
              <path
                d="M38,164 Q40,170 48,172 Q56,170 54,164 Q52,168 48,168 Q44,168 42,164 Z"
                fill="url(#niddhi-shoe-fill)"
              />
            </g>

            {/* Right leg */}
            <g ref={rightLegRef} style={{ transformOrigin: "72px 128px" }}>
              <path
                d="M66,128 Q64,148 66,162 Q68,168 72,168 Q76,168 78,162 Q80,148 78,128 Z"
                fill="url(#niddhi-leg-fill)"
              />
              {/* Right shoe */}
              <path
                d="M62,164 Q64,170 72,172 Q80,170 78,164 Q76,168 72,168 Q68,168 66,164 Z"
                fill="url(#niddhi-shoe-fill)"
              />
            </g>

            {/* Torso — rounded capsule */}
            <path
              d="M40,72 Q38,70 40,68 Q48,62 60,62 Q72,62 80,68 Q82,70 80,72 L82,124 Q82,132 74,134 Q68,136 60,136 Q52,136 46,134 Q38,132 38,124 Z"
              fill="url(#niddhi-body-fill)"
            />
            {/* Neon accent stripe down center */}
            <line
              x1="60" y1="68" x2="60" y2="130"
              stroke="rgba(10,132,255,0.15)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {/* Collar V */}
            <path
              d="M52,64 L60,72 L68,64"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Left arm */}
            <g ref={leftArmRef} style={{ transformOrigin: "38px 72px" }}>
              <path
                d="M38,72 Q30,74 26,82 Q24,90 26,102 Q28,108 32,108 Q36,108 38,102 Q40,90 38,80 Z"
                fill="url(#niddhi-arm-fill)"
              />
              {/* Hand */}
              <circle cx="30" cy="108" r="5.5" fill="#e0a890" />
            </g>

            {/* Right arm */}
            <g ref={rightArmRef} style={{ transformOrigin: "82px 72px" }}>
              <path
                d="M82,72 Q90,74 94,82 Q96,90 94,102 Q92,108 88,108 Q84,108 82,102 Q80,90 82,80 Z"
                fill="url(#niddhi-arm-fill)"
              />
              {/* Hand */}
              <circle cx="90" cy="108" r="5.5" fill="#e0a890" />
            </g>

            {/* Neck */}
            <rect x="54" y="58" width="12" height="8" rx="4" fill="#e0a890" />

            {/* Head group */}
            <g ref={headRef}>
              {/* Glow ring */}
              <circle
                cx="60" cy="36" r="30"
                fill="url(#niddhi-head-glow)"
                className="animate-[niddhi-glow_4s_ease-in-out_infinite]"
              />
              <circle
                cx="60" cy="36" r="28"
                fill="none"
                stroke="rgba(10,132,255,0.25)"
                strokeWidth="1"
              />

              {/* Caricature face */}
              <image
                href="/images/caricature.jpg"
                x="34" y="10"
                width="52" height="52"
                clipPath="url(#niddhi-head-clip)"
                preserveAspectRatio="xMidYMin slice"
              />
              <circle
                cx="60" cy="36" r="26"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showBubble && dialogue && (
          <motion.div
            key={dialogue}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "relative mb-16 rounded-2xl px-4 py-3",
              "glass border border-glass-border",
              "shadow-[0_8px_32px_rgba(10,132,255,0.12),0_0_48px_rgba(191,90,242,0.06)]",
              "max-w-[180px] sm:max-w-[240px] lg:max-w-[280px]",
            )}
          >
            <p className="text-xs font-medium leading-relaxed text-foreground sm:text-sm">
              <span className="hidden sm:inline">{dialogue}</span>
              <span className="inline sm:hidden">{shortDialogue}</span>
            </p>
            <div
              className="absolute left-[-7px] top-1/2 -translate-y-1/2 h-0 w-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "7px solid rgba(255,255,255,0.08)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
