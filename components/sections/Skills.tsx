"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

type TechnicalSkill = {
  name: string;
  percent: number;
  icon: string;
};

type SkillCategory = {
  title: string;
  headerIcon: string;
  skills: TechnicalSkill[];
};

/** Desktop grid order: row1 PL | AI, row2 Cloud | DB */
const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    headerIcon: "💻",
    skills: [
      { name: "Java", percent: 90, icon: "☕" },
      { name: "Python", percent: 85, icon: "🐍" },
      { name: "C/C++", percent: 80, icon: "⚙️" },
      { name: "PL/SQL & Bash", percent: 75, icon: "💻" },
    ],
  },
  {
    title: "AI & Machine Learning",
    headerIcon: "🧬",
    skills: [
      { name: "Agentic AI Solutions", percent: 85, icon: "🤖" },
      { name: "AI-Driven Automation", percent: 80, icon: "🔄" },
      { name: "Machine Learning", percent: 70, icon: "🧠" },
    ],
  },
  {
    title: "Cloud & DevOps",
    headerIcon: "☁️",
    skills: [
      { name: "AWS (EC2, S3, Lambda)", percent: 85, icon: "☁️" },
      { name: "Linux / Unix", percent: 85, icon: "🐧" },
      { name: "Docker & Kubernetes", percent: 70, icon: "🐳" },
      { name: "Shell Scripting", percent: 75, icon: "📜" },
    ],
  },
  {
    title: "Database & Web",
    headerIcon: "🗄️",
    skills: [
      { name: "SQL / PostgreSQL", percent: 90, icon: "🗄️" },
      { name: "MongoDB / Couchbase", percent: 75, icon: "🍃" },
      { name: "HTML, CSS, Angular", percent: 75, icon: "🌐" },
    ],
  },
];

const personalSkills = [
  "Problem Solving",
  "Critical Thinking",
  "Analytical Skills",
  "Attention to Detail",
  "Time Management",
  "Work Ethics",
  "Decision Making",
  "Client Handling",
] as const;

const marqueeNames = [
  ...skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
  ...personalSkills,
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

const categoryGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.12 },
  },
};

const categoryCardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: easeCurve },
  },
};

const personalSectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeCurve },
  },
};

function SkillMarquee() {
  const loop = [...marqueeNames, ...marqueeNames];

  return (
    <div
      className={cn(
        "relative mb-14 overflow-hidden rounded-xl border border-glass-border bg-glass py-4 backdrop-blur-md",
        "glow-border"
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/90 to-transparent" />
      <motion.div
        className="flex w-max gap-10 px-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 42,
            ease: "linear",
          },
        }}
      >
        {loop.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 text-sm font-medium tracking-wide text-muted"
          >
            {name}
            <span className="mx-8 text-glass-border">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SkillProgressBar({
  skill,
  staggerIndex,
  categoryInView,
}: {
  skill: TechnicalSkill;
  staggerIndex: number;
  categoryInView: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="text-lg leading-none select-none" aria-hidden>
            {skill.icon}
          </span>
          <span className="truncate text-sm font-medium text-foreground">{skill.name}</span>
        </span>
        <span className="shrink-0 tabular-nums text-sm font-semibold text-orange-400">
          {skill.percent}%
        </span>
      </div>
      <div
        className={cn(
          "relative h-2.5 overflow-hidden rounded-full border border-glass-border bg-glass/90 backdrop-blur-sm"
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500",
            "bg-[length:200%_100%] shadow-[0_0_12px_rgba(249,115,22,0.35)]"
          )}
          initial={{ width: "0%" }}
          animate={categoryInView ? { width: `${skill.percent}%` } : { width: "0%" }}
          transition={{
            duration: 1.25,
            delay: staggerIndex * 0.09,
            ease: easeCurve,
          }}
        />
      </div>
    </div>
  );
}

function CategoryCard({ category, cardIndex }: { category: SkillCategory; cardIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const categoryInView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px", amount: 0.2 });

  return (
    <motion.article
      ref={ref}
      variants={categoryCardVariants}
      className={cn(
        "noise relative flex flex-col gap-6 rounded-2xl p-6 sm:p-7",
        "glass glass-hover glow-border",
        "border border-glass-border",
        cardIndex % 2 === 0 ? "hover:glow-orange" : "hover:glow-amber"
      )}
    >
      <header className="relative z-[2] flex items-center gap-3 border-b border-glass-border pb-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass/80 text-xl backdrop-blur-sm"
          aria-hidden
        >
          {category.headerIcon}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {category.title}
          </h3>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted">
            Technical proficiency
          </p>
        </div>
      </header>

      <ul className="relative z-[2] flex flex-col gap-5">
        {category.skills.map((skill, i) => (
          <li key={skill.name}>
            <SkillProgressBar
              skill={skill}
              staggerIndex={i}
              categoryInView={categoryInView}
            />
          </li>
        ))}
      </ul>
    </motion.article>
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
      {/* Decorative gradient orbs */}
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
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 65%)",
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
        <motion.div variants={headerItemVariants} className="mb-8">
          <SkillMarquee />
        </motion.div>

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
          className="section-heading mb-14 max-w-4xl text-foreground"
        >
          <span className="block">My Skills &</span>
          <span className="block">
            <span className="text-gradient-orange">Expertise</span>
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
          variants={categoryGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {skillCategories.map((category, index) => (
            <CategoryCard key={category.title} category={category} cardIndex={index} />
          ))}
        </motion.div>

        {/* Personal Skills */}
        <motion.div
          className="relative mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={personalSectionVariants}
        >
          <motion.h3
            variants={headerItemVariants}
            className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Personal Skills
          </motion.h3>

          <motion.div
            variants={headerItemVariants}
            className="rounded-2xl border border-glass-border bg-glass/50 p-6 backdrop-blur-md sm:p-8"
          >
            <motion.div
              className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4"
              variants={personalSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {personalSkills.map((label, i) => (
                <motion.span
                  key={label}
                  variants={pillVariants}
                  custom={i}
                  className={cn(
                    "inline-flex items-center rounded-full border border-glass-border bg-glass/90 px-5 py-2.5",
                    "text-sm font-medium text-foreground shadow-sm backdrop-blur-md",
                    "transition-all duration-300 will-change-transform",
                    "hover:z-[1] hover:-translate-y-1 hover:border-orange-400/35 hover:shadow-[0_0_28px_rgba(249,115,22,0.28),0_0_48px_rgba(245,158,11,0.12)]",
                    "hover:glow-orange"
                  )}
                  style={{
                    animation: `float ${6 + (i % 4) * 0.45}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.21) % 2.4}s`,
                  }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
