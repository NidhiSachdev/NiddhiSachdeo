"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

const VB = { w: 400, h: 520 };

type FlowNode = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** SVG-space anchor (viewBox units) */
  cx: number;
  cy: number;
};

const flowNodes: FlowNode[] = [
  {
    id: "input",
    title: "Order Detection",
    description: "Automated stuck order detection eliminating manual tracking.",
    emoji: "📋",
    cx: 200,
    cy: 52,
  },
  {
    id: "llm",
    title: "Error Classification",
    description: "100+ pattern-matching rules for intelligent error analysis.",
    emoji: "🔍",
    cx: 56,
    cy: 218,
  },
  {
    id: "tool",
    title: "Smart Routing",
    description: "Routes issues to SAP or Delivery teams automatically.",
    emoji: "🔀",
    cx: 200,
    cy: 218,
  },
  {
    id: "memory",
    title: "24/7 Monitoring",
    description: "Comprehensive audit trails and real-time processing.",
    emoji: "📡",
    cx: 344,
    cy: 218,
  },
  {
    id: "output",
    title: "Resolution Output",
    description: "Sub-minute analysis with serverless scalable infrastructure.",
    emoji: "✅",
    cx: 200,
    cy: 468,
  },
];

/** Connector segments between node hulls (viewBox space) */
const connectors: { id: string; d: string; dur: number }[] = [
  { id: "c-input-tool", d: "M 200 96 L 200 172", dur: 2.6 },
  { id: "c-llm-tool", d: "M 104 218 L 176 218", dur: 2 },
  { id: "c-memory-tool", d: "M 296 218 L 224 218", dur: 2 },
  { id: "c-tool-output", d: "M 200 264 L 200 424", dur: 2.8 },
];

function FlowingParticles({ pathD, duration, delay = 0 }: { pathD: string; duration: number; delay?: number }) {
  return (
    <g>
      <circle r={4} fill="var(--color-accent-cyan)">
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} path={pathD} rotate="auto" />
      </circle>
      <circle r={3} fill="var(--color-accent-purple)" opacity={0.9}>
        <animateMotion
          dur={`${duration * 1.15}s`}
          repeatCount="indefinite"
          begin={`${delay + 0.35}s`}
          path={pathD}
          rotate="auto"
        />
      </circle>
    </g>
  );
}

function FlowLayer() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="ais-flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-blue)" />
          <stop offset="55%" stopColor="var(--color-accent-cyan)" />
          <stop offset="100%" stopColor="var(--color-accent-purple)" />
        </linearGradient>
      </defs>

      {connectors.map((c, i) => (
        <g key={c.id}>
          <motion.path
            d={c.d}
            fill="none"
            stroke="url(#ais-flow-line)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.95 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              pathLength: { duration: 1.05, ease: easeCurve, delay: 0.15 + i * 0.08 },
              opacity: { duration: 0.35, delay: 0.15 + i * 0.08 },
            }}
          />
          <FlowingParticles pathD={c.d} duration={c.dur} delay={i * 0.22} />
        </g>
      ))}
    </svg>
  );
}

function FlowNodeCard({
  node,
  index,
}: {
  node: FlowNode;
  index: number;
}) {
  const leftPct = (node.cx / VB.w) * 100;
  const topPct = (node.cy / VB.h) * 100;

  return (
    <div
      className="absolute z-[2]"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        className={cn(
          "w-[min(92vw,220px)]",
          "glow-border glass glass-hover rounded-xl p-4",
          "shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        )}
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{
          duration: 0.55,
          ease: easeCurve,
          delay: 0.08 + index * 0.12,
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.28 },
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-40 blur-xl"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(10,132,255,0.35), transparent 62%)",
          }}
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 3.2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-[1] space-y-2">
          <span className="text-2xl leading-none" aria-hidden>
            {node.emoji}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{node.title}</h3>
          <p className="text-xs leading-relaxed text-muted">{node.description}</p>
        </div>
      </motion.div>
    </div>
  );
}

function useCountUp(target: number, enabled: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, durationMs]);

  return value;
}

function StatCard({
  target,
  suffix,
  label,
  delay,
}: {
  target: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(target, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: easeCurve, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "glow-border glass glass-hover flex flex-col items-center rounded-2xl px-6 py-8 text-center",
        "transition-shadow duration-300 hover:glow-purple"
      )}
    >
      <span className="text-3xl font-bold tabular-nums text-gradient">
        {count}
        {suffix}
      </span>
      <span className="mt-2 text-sm text-muted">{label}</span>
    </motion.div>
  );
}

export function AIShowcase() {
  return (
    <section id="ai" className="section-padding relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(100,210,255,0.35) 0%, rgba(191,90,242,0.35) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-6xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeCurve }}
        >
          <motion.span
            className="h-px origin-left bg-accent-blue"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeCurve }}
            style={{ width: "2rem" }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue">
            AI INNOVATION
          </span>
        </motion.div>

        <motion.h2
          className="section-heading mb-14 max-w-4xl text-foreground"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easeCurve, delay: 0.06 }}
        >
          <span className="block">Powering Ops with</span>
          <span className="block">
            <span className="text-gradient">Agentic AI — DORA</span>
          </span>
        </motion.h2>

        <motion.div
          className="relative mx-auto mb-16 w-full max-w-4xl overflow-hidden rounded-3xl border border-glass-border"
          style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="noise animated-grid absolute inset-0 bg-glass/25 opacity-95" />
          <FlowLayer />

          <div className="relative h-full w-full">
            {flowNodes.map((node, index) => (
              <FlowNodeCard key={node.id} node={node} index={index} />
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard target={100} suffix="+" label="Pattern-Matching Rules" delay={0} />
          <StatCard target={4} suffix="+" label="Years at Amdocs" delay={0.08} />
          <StatCard target={24} suffix="/7" label="Monitoring Uptime" delay={0.16} />
        </div>
      </motion.div>
    </section>
  );
}
