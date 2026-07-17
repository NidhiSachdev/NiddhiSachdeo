"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: easeCurve },
  },
};

const educationEntries = [
  {
    title: "Advanced Certification in Cloud Computing & DevOps",
    institution: "IIT Roorkee",
    period: "Dec 2024 – Dec 2025",
    icon: "🎓",
    detail: null as string | null,
    cyanAccent: true,
  },
  {
    title: "B.E. Computer Science & Engineering",
    institution:
      "VESIT (Vivekanand Education Society's Institute of Technology), Chembur, Mumbai",
    period: "Aug 2017 – June 2021",
    icon: "🎓",
    detail: "CGPA: 7.45",
    cyanAccent: false,
  },
] as const;

const certifications = [
  {
    icon: "☁️",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    meta: null as string | null,
  },
  {
    icon: "🎓",
    title: "Cloud Computing & DevOps",
    issuer: "IIT Roorkee",
    meta: "Dec 2025",
  },
  {
    icon: "🤖",
    title: "Agentic Development",
    issuer: "Using Cursor",
    meta: "Dec 2025",
  },
  {
    icon: "💻",
    title: "Full Stack Development",
    issuer: "Vibe Coding",
    meta: "Dec 2025",
  },
  {
    icon: "🏆",
    title: "Certificate of Recognition",
    issuer: "Amdocs",
    meta: "Dec 2025",
  },
  {
    icon: "📱",
    title: "Android Programming",
    issuer: "",
    meta: "Jul 2019 – Dec 2019",
  },
  {
    icon: "☕",
    title: "Core Java Certification",
    issuer: "",
    meta: "Jan 2018 – May 2018",
  },
  {
    icon: "🔧",
    title: "AICPTR Certified C, C++",
    issuer: "",
    meta: "Jul 2017 – Dec 2017",
  },
  {
    icon: "💼",
    title: "Accenture Virtual Internship",
    issuer: "Developer Experience Program",
    meta: "2021",
  },
] as const;

const coCurricular = [
  "Participated in Praxis, a Technical event",
  "Participated in Syrus, a Technical event",
  "Attended workshop on GitHub",
  "Active in extra-curricular events",
] as const;

export function Education() {
  return (
    <section
      id="education"
      className="section-padding relative overflow-hidden floating-section-inset"
    >
      <div
        className="pointer-events-none absolute -left-28 top-32 -z-10 h-80 w-80 rounded-full opacity-[0.18] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.45) 0%, transparent 68%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-12 right-0 -z-10 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.42) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-center justify-center gap-3 md:justify-start"
        >
          <motion.span
            className="h-px origin-left bg-sky-400 md:hidden"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeCurve }}
            style={{ width: "2rem" }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
            ACADEMIC BACKGROUND
          </span>
          <motion.span
            className="h-px origin-right bg-sky-400 md:hidden"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeCurve }}
            style={{ width: "2rem" }}
          />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="section-heading mb-4 text-center text-foreground md:text-left"
        >
          <span className="block">Education &</span>
          <span className="block">
            <span className="text-gradient-sky">Certifications</span>
          </span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="body-text mx-auto mb-12 max-w-2xl text-center text-muted md:mx-0 md:text-left"
        >
          Formal training and credentials that shape how I build reliable,
          cloud-ready systems.
        </motion.p>

        {/* Education cards */}
        <motion.div
          variants={itemVariants}
          className="mb-16 grid gap-6 md:grid-cols-2"
        >
          {educationEntries.map((edu) => (
            <motion.article
              key={edu.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: easeCurve }}
              whileHover={{ y: -4 }}
              className={cn(
                "glow-border relative rounded-2xl border border-glass-border p-4 sm:rounded-3xl sm:p-6 md:p-8",
                "glass glass-hover",
                edu.cyanAccent &&
                  "shadow-[0_0_40px_rgba(56,189,248,0.12)] ring-1 ring-sky-400/20"
              )}
            >
              <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass/80 text-xl backdrop-blur-md sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl",
                    edu.cyanAccent && "border-sky-400/30 text-sky-400"
                  )}
                  aria-hidden
                >
                  {edu.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg md:text-xl">
                    {edu.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-sm font-medium",
                      edu.cyanAccent ? "text-sky-400" : "text-sky-600"
                    )}
                  >
                    {edu.institution}
                  </p>
                  <p className="mt-2 text-sm text-muted">{edu.period}</p>
                  {edu.detail ? (
                    <p className="mt-1 text-sm text-foreground">{edu.detail}</p>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.h3
          variants={itemVariants}
          className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-sky-400 md:text-left"
        >
          Certifications
        </motion.h3>

        <motion.div
          variants={itemVariants}
          className="relative mb-16 overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max animate-marquee-cert gap-5">
            {[...certifications, ...certifications].map((cert, i) => (
              <article
                key={`${cert.title}-${i}`}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-2xl border border-glass-border px-5 py-4",
                  "glass",
                  "shadow-[0_12px_40px_rgba(10,132,255,0.06)]"
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {cert.icon}
                </span>
                <div className="whitespace-nowrap">
                  <h4 className="text-sm font-semibold leading-snug text-foreground">
                    {cert.title}
                  </h4>
                  {cert.issuer ? (
                    <p className="text-xs text-muted">{cert.issuer}</p>
                  ) : null}
                  {cert.meta ? (
                    <p className="mt-0.5 text-xs text-sky-400">{cert.meta}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        {/* Co-curricular */}
        <motion.h3
          variants={itemVariants}
          className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-sky-400 md:text-left"
        >
          Co-curricular
        </motion.h3>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 md:justify-start"
        >
          {coCurricular.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: easeCurve }}
              whileHover={{ scale: 1.04 }}
              className={cn(
                "rounded-full border border-glass-border bg-glass/70 px-4 py-2 text-xs font-medium text-muted backdrop-blur-md",
                "glass-hover hover:border-sky-400/30 hover:text-foreground"
              )}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
