"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

const AMDOCS = {
  role: "Software Developer",
  company: "Amdocs",
  period: "Sept 2021 - Present",
  location: "Pune, Maharashtra",
  achievements: [
    "Designed and implemented OpsAI Agent – DORA, reducing operational issue resolution time by ~40%, cutting average turnaround from hours to minutes",
    "Performed in-depth analysis of Auto Debit Adjustment (ADA) processes for Philippines operations, identifying gaps and recommending improvements",
    "Delivered 10+ customer-requested feature enhancements, improving satisfaction scores across 3 client accounts",
    "Resolved 100+ production issues with <2hr SLA breach rate, maintaining 99%+ uptime for critical telecom services",
    "Earned AWS Cloud Practitioner certification to strengthen cloud expertise",
    "Automated 5+ manual workflows, saving ~8 hours/week of operational effort",
    "Specialized in database management with Couchbase, PostgreSQL, and leveraged Kibana for real-time data visualization",
  ] as const,
  technologies: [
    "Java",
    "Python",
    "SQL",
    "Linux",
    "AWS",
    "Agentic AI",
    "Couchbase",
    "PostgreSQL",
  ] as const,
};


const CAREER_MILESTONES = [
  { date: "Sept 2021", label: "Joined Amdocs as Software Developer" },
  { date: "2022", label: "AWS Cloud Practitioner Certified" },
  { date: "2023", label: "Specialized in Database & Cloud Ops" },
  { date: "2024", label: "Cloud Computing & DevOps - IIT Roorkee" },
  { date: "2025", label: "Built OpsAI Agent – DORA" },
] as const;

const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeCurve },
  },
};

const listParentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeCurve },
  },
};

function AnimatedSectionLabel() {
  return (
    <motion.div
      variants={headerItemVariants}
      className="mb-6 flex items-center gap-3"
    >
      <motion.span
        className="h-px origin-left rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: easeCurve }}
        style={{ width: "2.75rem" }}
        aria-hidden
      />
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">
        MY JOURNEY
      </span>
      <motion.span
        className="h-px origin-right rounded-full bg-gradient-to-r from-cyan-400 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: easeCurve, delay: 0.15 }}
        style={{ flex: 1, maxWidth: "4rem" }}
        aria-hidden
      />
    </motion.div>
  );
}

function AchievementCheck({ index }: { index: number }) {
  return (
    <motion.span
      className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-teal-400/35 bg-glass/80 glow-sky"
      initial={{ scale: 0, rotate: -12 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 22,
        delay: index * 0.06,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-accent-cyan"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <motion.path
          d="M6 12.5l3.5 3.5L18 7"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: easeCurve, delay: 0.15 + index * 0.06 }}
        />
      </svg>
    </motion.span>
  );
}

function TimelineStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: easeCurve }}
      className="relative mt-14"
    >
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Career milestones
      </p>
      <div className="overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        <div
          className={cn(
            "noise animated-grid glow-border glass relative min-w-max rounded-2xl border border-glass-border px-4 py-6 sm:px-6 sm:py-10 md:px-10"
          )}
        >
          <div className="flex items-start">
            {CAREER_MILESTONES.map((m, i) => (
              <Fragment key={`${m.date}-${m.label}`}>
                <motion.div
                  className="flex w-[min(11rem,72vw)] shrink-0 flex-col items-center text-center sm:w-44"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    ease: easeCurve,
                    delay: 0.06 * i,
                  }}
                >
                  <motion.span
                    className="relative z-[2] mb-5 flex h-3.5 w-3.5 rounded-full bg-teal-400 ring-4 ring-teal-400/30 glow-sky"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 18,
                      delay: 0.08 * i,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full bg-accent-cyan/90 blur-[8px]"
                      aria-hidden
                    />
                  </motion.span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {m.date}
                  </span>
                  <span className="mt-2 text-sm font-medium leading-snug text-foreground">
                    {m.label}
                  </span>
                </motion.div>
                {i < CAREER_MILESTONES.length - 1 ? (
                  <div
                    className="mx-1 mt-[13px] h-px min-w-[2rem] shrink-0 bg-gradient-to-r from-teal-400/55 via-cyan-300/35 to-teal-500/55 sm:mx-3 sm:min-w-[4.5rem]"
                    aria-hidden
                  />
                ) : null}
              </Fragment>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-wider text-muted sm:hidden">
            Swipe to explore the timeline
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden floating-section-inset"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 animated-grid opacity-[0.65]"
        aria-hidden
      />
      <div
        className="noise pointer-events-none absolute inset-0 -z-[5] opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[12%] top-24 -z-[4] h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(13,211,184,0.55) 0%, transparent 68%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-16 right-[8%] -z-[4] h-[28rem] w-[28rem] rounded-full opacity-18 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 72%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <AnimatedSectionLabel />

          <motion.h2
            variants={headerItemVariants}
            className="section-heading max-w-5xl text-foreground"
          >
            <span className="block text-gradient-cyan">Work Experience</span>
          </motion.h2>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: easeCurve }}
          whileHover={{
            y: -4,
            transition: { duration: 0.35, ease: easeCurve },
          }}
          className={cn(
            "noise animated-grid glow-border glass glass-hover relative overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-8 md:p-10 lg:p-12",
            "transition-shadow duration-500 hover:shadow-[0_28px_90px_rgba(10,132,255,0.14)] hover:glow-sky"
          )}
        >
          <div className="relative z-[2] flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-12">
            <div className="lg:w-[220px] lg:shrink-0">
              <motion.div
                className="flex aspect-square max-w-[140px] items-center justify-center rounded-2xl border border-glass-border bg-glass/80 p-4 backdrop-blur-md sm:max-w-[200px] sm:p-6 lg:max-w-none"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: easeCurve }}
              >
                <span className="text-gradient-cyan select-none text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
                  AMDOCS
                </span>
              </motion.div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-end gap-3 gap-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  {AMDOCS.role}
                </h3>
              </div>
              <p className="mt-2 text-lg font-semibold text-teal-400">{AMDOCS.company}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-glass-border bg-glass/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm">
                  {AMDOCS.period}
                </span>
                <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-cyan">
                  {AMDOCS.location}
                </span>
              </div>

              <motion.ul
                className="mt-8 space-y-4"
                variants={listParentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {AMDOCS.achievements.map((item, index) => (
                  <motion.li
                    key={item}
                    variants={listItemVariants}
                    className="flex gap-4"
                  >
                    <AchievementCheck index={index} />
                    <span className="text-[15px] leading-relaxed text-foreground sm:text-base">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-10">
                <ul className="flex flex-wrap gap-2">
                  {AMDOCS.technologies.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-glass-border bg-glass/70 px-3.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-teal-400/40 hover:text-teal-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.article>

      </div>
    </section>
  );
}
