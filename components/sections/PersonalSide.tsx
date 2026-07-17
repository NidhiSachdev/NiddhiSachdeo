"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const interests = [
  { label: "Dance", icon: "💃", color: "from-pink-500/20 to-purple-500/20" },
  { label: "Art & Craft", icon: "🎨", color: "from-orange-500/20 to-red-500/20" },
  { label: "Music", icon: "🎵", color: "from-blue-500/20 to-cyan-500/20" },
  { label: "Web Designing", icon: "🌐", color: "from-green-500/20 to-teal-500/20" },
];

const traits = [
  { label: "Creative Thinker", icon: "✨" },
  { label: "Fun-Loving", icon: "😄" },
  { label: "Curious Explorer", icon: "🔍" },
  { label: "Passionate Learner", icon: "📚" },
  { label: "Builder Mindset", icon: "🏗️" },
  { label: "Team Player", icon: "🤝" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function PersonalSide() {
  return (
    <section
      id="personal"
      className="section-padding relative overflow-hidden floating-section-inset"
    >
      {/* Ambient blurs */}
      <div
        className="pointer-events-none absolute left-1/4 top-20 -z-10 h-80 w-80 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-16 right-1/4 -z-10 h-72 w-72 rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.4) 0%, transparent 68%)",
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
        {/* Section label */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
          <motion.span
            className="h-px origin-left bg-pink-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            style={{ width: "2rem" }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">
            BEYOND THE CODE
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="section-heading mb-6 max-w-4xl text-foreground"
        >
          <span className="block">The Personal</span>
          <span className="block">
            <span className="text-gradient-pink">Side of Niddhi</span>
          </span>
        </motion.h2>

        <motion.p variants={itemVariants} className="body-text mb-14 max-w-2xl">
          When I&apos;m not building intelligent systems or debugging code,
          you&apos;ll find me exploring creative passions, learning new things,
          and bringing energy to everything I do.
        </motion.p>

        {/* Interests grid */}
        <motion.div
          className="mb-10 grid grid-cols-2 gap-3 sm:mb-16 sm:gap-4 lg:grid-cols-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {interests.map((item, idx) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -6 }}
              className={cn(
                "group glow-border relative overflow-hidden rounded-xl p-4 text-center sm:rounded-2xl sm:p-6",
                "glass glass-hover",
                "transition-shadow duration-300 hover:glow-pink",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                  item.color,
                )}
              />
              <motion.span
                className="relative z-[2] mb-2 block text-3xl sm:mb-3 sm:text-5xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + idx * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.3,
                }}
              >
                {item.icon}
              </motion.span>
              <h3 className="relative z-[2] text-sm font-semibold text-foreground sm:text-base">
                {item.label}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Personality traits */}
        <motion.div variants={itemVariants}>
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            What Defines <span className="text-gradient-pink">Me</span>
          </h3>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {traits.map((trait, idx) => (
            <motion.div
              key={trait.label}
              variants={itemVariants}
              whileHover={{ scale: 1.06, y: -3 }}
              className={cn(
                "glass glass-hover glow-border cursor-default rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5",
                "text-xs font-medium text-foreground sm:text-sm",
                "transition-shadow duration-300 hover:glow-pink",
              )}
              style={{
                animation: `float ${5 + (idx % 4) * 0.5}s ease-in-out infinite`,
                animationDelay: `${idx * 0.2}s`,
              }}
            >
              <span className="mr-2">{trait.icon}</span>
              {trait.label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
