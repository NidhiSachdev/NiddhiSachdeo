"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeCurve },
  },
};

const specialties = [
  {
    title: "Agentic AI Solutions",
    description:
      "Designing autonomous agents for data extraction and decision support",
    icon: "🤖",
  },
  {
    title: "AI-Driven Automation",
    description: "Automating complex workflows to reduce manual effort",
    icon: "⚙️",
  },
  {
    title: "AWS Cloud & DevOps",
    description:
      "EC2, S3, Lambda, Docker, Kubernetes — certified cloud deployment",
    icon: "☁️",
  },
  {
    title: "Full Stack Development",
    description: "Java, Python, Next.js and modern frameworks",
    icon: "⚡",
  },
  {
    title: "Database Engineering",
    description:
      "PostgreSQL, Couchbase, MongoDB — real-time visualization with Kibana",
    icon: "🗄️",
  },
  {
    title: "Application Support",
    description:
      "Troubleshooting, debugging, monitoring and client interactions",
    icon: "🔧",
  },
] as const;

const quickInfo = [
  { icon: "📍", label: "Location", value: "Pune, Maharashtra, India" },
  { icon: "📧", label: "Email", value: "nidhisachdeo2000@gmail.com", href: "mailto:nidhisachdeo2000@gmail.com" },
  { icon: "📞", label: "Phone", value: "+91 7045542080", href: "tel:+917045542080" },
] as const;


export function About() {
  return (
    <section
      id="about"
      className={cn(
        "section-padding relative overflow-hidden noise floating-section-inset",
        "border-t border-glass-border/60"
      )}
      aria-labelledby="about-heading"
    >
      <div className="animated-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[min(85vw,640px)] w-[min(85vw,640px)] -translate-x-1/2 rounded-full opacity-[0.22] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(251,191,36,0.38) 42%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[min(70vw,480px)] w-[min(70vw,480px)] translate-x-1/4 translate-y-1/4 rounded-full opacity-[0.16] blur-[110px] glow-amber"
        style={{
          background:
            "radial-gradient(circle, rgba(253,224,71,0.35) 0%, transparent 68%)",
        }}
        aria-hidden
      />

      <motion.div
        className="relative z-[2] mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        {/* Section label */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
          <motion.span
            className="h-px origin-left bg-amber-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: easeCurve }}
            style={{ width: "2.75rem" }}
            aria-hidden
          />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
            Lets Know About
          </span>
          <motion.span
            className="h-px flex-1 origin-left bg-gradient-to-r from-amber-400/80 via-yellow-500/60 to-transparent max-sm:hidden"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15, ease: easeCurve }}
            aria-hidden
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          id="about-heading"
          variants={itemVariants}
          className="section-heading mb-12 max-w-4xl text-foreground"
        >
          <span className="block text-gradient-amber">Niddhi</span>
        </motion.h2>

        {/* Two columns */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start lg:gap-14">
          {/* Photo column */}
          <motion.div variants={itemVariants} className="relative mx-auto w-full max-w-[400px] lg:mx-0">
            <motion.div
              className="relative overflow-visible rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 0 2px rgba(245,158,11,0.55), 0 0 36px rgba(245,158,11,0.35), 0 0 72px rgba(251,191,36,0.18)",
                  "0 0 0 2px rgba(251,191,36,0.6), 0 0 48px rgba(251,191,36,0.38), 0 0 88px rgba(253,224,71,0.15)",
                  "0 0 0 2px rgba(253,224,71,0.5), 0 0 42px rgba(253,224,71,0.28), 0 0 80px rgba(245,158,11,0.22)",
                  "0 0 0 2px rgba(245,158,11,0.55), 0 0 36px rgba(245,158,11,0.35), 0 0 72px rgba(251,191,36,0.18)",
                ],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-background">
                <Image
                  src="/NiddhiSachdeo/images/about.jpg"
                  alt="Niddhi working"
                  width={400}
                  height={480}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 400px"
                  priority={false}
                />
              </div>

              <motion.div
                className={cn(
                  "absolute right-3 top-3 z-[3] rounded-xl px-3 py-2",
                  "glass glass-hover glow-amber"
                )}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.45, ease: easeCurve }}
              >
                <p className="text-xs font-semibold tracking-wide text-foreground">4+ Years Experience</p>
              </motion.div>

              <motion.div
                className={cn(
                  "absolute bottom-3 left-1/2 z-[3] -translate-x-1/2 rounded-full px-4 py-2",
                  "glass glass-hover glow-amber whitespace-nowrap"
                )}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.45, ease: easeCurve }}
              >
                <p className="text-xs font-medium text-foreground">🎯 Based in Pune, India</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bio + quick info */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="body-text">
                I&apos;m a passionate Software Developer at <strong>Amdocs</strong> in Pune, specializing in{" "}
                <strong>Agentic AI</strong>, scalable app development, and AWS cloud deployment.
                I build intelligent systems that automate workflows, reduce manual effort, and accelerate business processes.
              </p>
              <p className="body-text">
                Skilled in crafting autonomous agents for tasks like data extraction, content generation,
                and decision support. I blend technical depth with creative problem-solving to deliver
                impactful, user-centric solutions. Currently pursuing Advanced Certification in Cloud
                Computing and DevOps from <strong>IIT Roorkee</strong>.
              </p>
            </div>

            <motion.ul
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {quickInfo.map((item) => (
                <motion.li
                  key={item.label}
                  variants={itemVariants}
                  className={cn(
                    "min-w-0 overflow-hidden rounded-xl border border-glass-border bg-glass/80 px-3 py-3 sm:px-4 sm:py-4",
                    "glass glass-hover"
                  )}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-base leading-none" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="text-xs text-muted">{item.label}</span>
                  </div>
                  {"href" in item && item.href ? (
                    <a
                      href={item.href}
                      className="block truncate text-sm text-foreground transition-colors hover:text-amber-400"
                      title={item.value}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{item.value}</p>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Specialties */}
        <motion.div
          className="mt-20 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <motion.h3
            variants={itemVariants}
            className="mb-10 text-left text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            What I{" "}
            <span className="text-gradient-amber">
              Specialize In
            </span>
          </motion.h3>

          <motion.ul
            className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6"
            variants={containerVariants}
          >
            {specialties.map((card) => (
              <motion.li
                key={card.title}
                variants={itemVariants}
                className={cn(
                  "group glow-border relative overflow-hidden rounded-2xl p-5 sm:p-6",
                  "glass glass-hover",
                  "transition-transform duration-300 hover:scale-[1.02]"
                )}
              >
                <div className="relative z-[2] flex flex-col gap-3">
                  <span className="text-3xl leading-none sm:text-4xl" aria-hidden>
                    {card.icon}
                  </span>
                  <h4 className="text-base font-semibold text-foreground sm:text-lg">{card.title}</h4>
                  <p className="text-sm leading-relaxed text-muted">{card.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

      </motion.div>
    </section>
  );
}
