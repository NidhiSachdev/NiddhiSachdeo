"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

type SkillGroup = {
  label: string;
  color: string;
  glow: string;
  skills: { name: string; icon: string }[];
};

const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
    skills: [
      { name: "Java", icon: "☕" },
      { name: "Python", icon: "🐍" },
      { name: "C/C++", icon: "⚙️" },
      { name: "PL/SQL", icon: "💻" },
    ],
  },
  {
    label: "AI / ML",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.3)",
    skills: [
      { name: "Agentic AI", icon: "🤖" },
      { name: "AI Automation", icon: "🔄" },
      { name: "Machine Learning", icon: "🧠" },
    ],
  },
  {
    label: "Cloud & DevOps",
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
    skills: [
      { name: "AWS", icon: "☁️" },
      { name: "Linux", icon: "🐧" },
      { name: "Docker & K8s", icon: "🐳" },
      { name: "Shell Script", icon: "📜" },
    ],
  },
  {
    label: "Database & Web",
    color: "#f97316",
    glow: "rgba(249,115,22,0.3)",
    skills: [
      { name: "SQL", icon: "🗄️" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Angular", icon: "🌐" },
    ],
  },
];

const personalSkills = [
  { name: "Problem Solving", icon: "🧩" },
  { name: "Critical Thinking", icon: "💡" },
  { name: "Analytical", icon: "📊" },
  { name: "Detail Oriented", icon: "🔍" },
  { name: "Time Mgmt", icon: "⏰" },
  { name: "Work Ethics", icon: "💪" },
  { name: "Decision Making", icon: "🎯" },
  { name: "Client Handling", icon: "🤝" },
];

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeCurve },
  },
};

const boxVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeCurve },
  },
};

function SkillBox({ group, index }: { group: SkillGroup; index: number }) {
  return (
    <motion.div
      variants={boxVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-glass-border bg-glass/40 p-6",
        "backdrop-blur-md transition-shadow duration-300",
      )}
      style={{
        borderTopWidth: 3,
        borderTopColor: group.color,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${group.glow}, transparent 70%)`,
        }}
      />
      <div className="relative z-[1]">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: group.color, boxShadow: `0 0 10px ${group.glow}` }}
          />
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: group.color }}>
            {group.label}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {group.skills.map((skill) => (
            <span
              key={skill.name}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-glass-border bg-white/[0.04] px-3.5 py-2",
                "text-sm font-medium text-foreground/90 transition-all duration-200",
                "hover:bg-white/[0.08] hover:text-foreground",
              )}
              style={{
                borderColor: `${group.color}25`,
              }}
            >
              <span className="text-base leading-none" aria-hidden>{skill.icon}</span>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className={cn(
        "section-padding relative overflow-hidden floating-section-inset",
        "animated-grid"
      )}
    >
      <div
        className="pointer-events-none absolute -left-40 top-12 -z-10 h-[26rem] w-[26rem] rounded-full opacity-[0.22] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.55) 0%, rgba(245,158,11,0.2) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-24 -z-10 h-[28rem] w-[28rem] rounded-full opacity-[0.2] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,0.5) 0%, rgba(249,115,22,0.12) 50%, transparent 72%)",
        }}
        aria-hidden
      />

      <motion.div
        className="noise relative z-[2] mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={headerContainerVariants}
      >
        <motion.div variants={headerItemVariants} className="mb-5 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
            WHAT I KNOW
          </span>
          <span
            className="hidden h-px flex-1 bg-gradient-to-r from-orange-400/70 via-amber-500/50 to-transparent sm:block"
            aria-hidden
          />
        </motion.div>

        <motion.h2
          variants={headerItemVariants}
          className="section-heading mb-12 max-w-4xl text-foreground"
        >
          <span className="block">My Skills &</span>
          <span className="block">
            <span className="text-gradient-orange">Expertise</span>
          </span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <SkillBox key={group.label} group={group} index={i} />
          ))}
        </div>

        {/* Personal Skills — single scrolling bar */}
        <motion.div variants={headerItemVariants} className="mt-16">
          <h3 className="mb-6 text-lg font-semibold text-foreground/90">
            Personal Skills
          </h3>
          <div
            className="relative overflow-hidden rounded-full border border-pink-500/30 bg-glass/30 py-3 backdrop-blur-md"
            style={{
              boxShadow: "0 0 20px rgba(236,72,153,0.15), inset 0 0 30px rgba(236,72,153,0.05)",
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent" />
            <div className="flex w-max animate-marquee items-center gap-8 px-4">
              {[...personalSkills, ...personalSkills, ...personalSkills].map((skill, i) => (
                <span
                  key={`${skill.name}-${i}`}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-foreground/90"
                >
                  <span className="text-base" aria-hidden>{skill.icon}</span>
                  {skill.name}
                  {i < personalSkills.length * 3 - 1 && (
                    <span className="ml-6 text-pink-500/40">●</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
