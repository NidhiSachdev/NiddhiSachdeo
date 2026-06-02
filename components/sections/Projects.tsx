"use client";

import { motion } from "framer-motion";
import { useCallback, useState, type MouseEvent, type SVGProps } from "react";
import { cn } from "@/lib/utils";

type GlowTone = "blue" | "purple";

type Project = {
  title: string;
  category: string;
  description: string;
  tech: readonly string[];
  gradientFrom: string;
  gradientTo: string;
  period: string;
  highlights?: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Featured tile spans 2 columns on `lg` */
  featured?: boolean;
  glowTone: GlowTone;
  previewMinHeight?: string;
};

const professionalProjects: Project[] = [
  {
    title: "DORA - Digital Order Routing Assistant",
    category: "Agentic AI",
    description:
      "AI-driven automation that accelerates order resolution through intelligent detection, error classification with 100+ pattern-matching rules, smart routing to SAP or Delivery teams, and scalable real-time processing with sub-minute analysis.",
    highlights: [
      "Automated stuck order detection",
      "24/7 monitoring",
      "Serverless infrastructure",
    ],
    tech: ["Python", "AWS Lambda", "Agentic AI", "SQL"],
    gradientFrom: "#0a84ff",
    gradientTo: "#64d2ff",
    period: "Oct 2025 - Dec 2025",
    githubUrl: "https://github.com/NidhiSachdev",
    featured: true,
    glowTone: "blue",
    previewMinHeight: "min-h-[200px] lg:min-h-[220px]",
  },
  {
    title: "MoodMiles - Trip That Matches Your Vibe",
    category: "AI Travel App",
    description:
      "Personalized travel planning app that creates mood-based, budget-friendly itineraries with curated experiences, dynamic real-time adjustments, and recommendation systems.",
    highlights: [
      "Mood-based algorithms",
      "Dynamic itinerary adjustments",
      "Data analytics",
    ],
    tech: ["Python", "AI/ML", "JavaScript", "API Integration"],
    gradientFrom: "#bf5af2",
    gradientTo: "#ec4899",
    period: "Dec 2025 - Jan 2026",
    githubUrl: "https://github.com/NidhiSachdev",
    glowTone: "purple",
    previewMinHeight: "min-h-[168px]",
  },
  {
    title: "S4 Spine Physiotherapy Clinic",
    category: "Healthcare Web App",
    description:
      "Full-stack healthcare web application featuring 40+ treatments across 8 specialties, interactive body map for pain identification, quiz-based treatment recommendations, and appointment booking system.",
    highlights: [
      "Interactive body map",
      "Quiz-based recommendations",
      "Admin panel",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Vercel"],
    gradientFrom: "#64d2ff",
    gradientTo: "#34d399",
    period: "Apr 2026",
    liveUrl: "https://s4-spine-physiotherapy.vercel.app",
    githubUrl: "https://github.com/NidhiSachdev/s4-spine-physiotherapy",
    glowTone: "blue",
    previewMinHeight: "min-h-[188px] lg:min-h-[200px]",
  },
];

const academicProjects: Project[] = [
  {
    title: "Intrusion Detection System",
    category: "B.E. Final Year Project",
    description:
      "Keystroke dynamics-based intrusion detection system using Machine Learning algorithms to identify valid/invalid users and collect biometric data samples.",
    tech: ["Machine Learning", "MySQL", "Python"],
    gradientFrom: "#0a84ff",
    gradientTo: "#bf5af2",
    period: "Jul 2020 - May 2021",
    glowTone: "purple",
    previewMinHeight: "min-h-[140px]",
  },
  {
    title: "Smart Bus Ticketing & Tracking System",
    category: "T.E. Project",
    description:
      "Android application providing live bus location tracking and QR code-based smart ticketing system for efficient public transport.",
    tech: ["Android", "Java", "QR Code", "GPS"],
    gradientFrom: "#bf5af2",
    gradientTo: "#64d2ff",
    period: "Jul 2019 - May 2020",
    glowTone: "purple",
    previewMinHeight: "min-h-[140px]",
  },
  {
    title: "Restaurant Management System",
    category: "Java Project",
    description:
      "Desktop application for managing orders, billing with GST calculation, and restaurant operations management.",
    tech: ["Java", "MySQL", "Desktop App"],
    gradientFrom: "#64d2ff",
    gradientTo: "#0a84ff",
    period: "Jul 2018 - Dec 2018",
    glowTone: "blue",
    previewMinHeight: "min-h-[140px]",
  },
];

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const subHeadingVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 10;
    const ry = (px - 0.5) * 10;
    setTilt({
      x: Math.max(-5, Math.min(5, rx)),
      y: Math.max(-5, Math.min(5, ry)),
    });
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group h-full min-h-0",
        project.featured && ""
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl",
          "bg-transparent backdrop-blur-sm",
          "transition-[transform,box-shadow,border-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -8 : 0}px)`,
          border: `1.5px solid ${hovered ? project.gradientFrom : "rgba(255,255,255,0.1)"}`,
          boxShadow: hovered
            ? `0 0 24px ${project.gradientFrom}44, 0 0 60px ${project.gradientFrom}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
      >
        <div className="relative z-[2] flex flex-1 flex-col gap-3 p-5 md:p-6">
          <h3
            className="text-lg font-bold leading-snug text-foreground md:text-xl"
            style={{ color: hovered ? project.gradientFrom : undefined }}
          >
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted md:text-[0.95rem]">
            {project.description}
          </p>

          <p className="mt-auto text-xs font-medium text-muted/70">{project.period}</p>

          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-emerald-400"
                >
                  <ExternalLinkIcon className="size-3.5 shrink-0" />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-emerald-400"
                >
                  <GitHubIcon className="size-3.5 shrink-0" />
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="noise section-padding relative overflow-hidden floating-section-inset"
    >
      <div
        className="animated-grid pointer-events-none absolute inset-0 opacity-[0.32]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/4 top-24 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.11] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.5) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-20 right-1/4 -z-10 h-[380px] w-[380px] rounded-full opacity-[0.11] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.42) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto max-w-7xl">
        <motion.div
          className="mb-12 md:mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
        >
          <motion.div
            variants={headerItemVariants}
            className="mb-6 flex items-center gap-3"
          >
            <motion.span
              className="h-px origin-left bg-emerald-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
              style={{ width: "2rem" }}
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              FEATURED WORK
            </span>
          </motion.div>

          <motion.h2
            variants={headerItemVariants}
            className="section-heading max-w-5xl text-foreground"
          >
            <span className="block">Projects That</span>
            <span className="block text-gradient-emerald">Push Boundaries</span>
          </motion.h2>
        </motion.div>

        <motion.div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={gridVariants}
        >
          {professionalProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>

        <div className="relative mb-10 mt-16 md:mb-12 md:mt-20">
          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={subHeadingVariants}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-glass-border to-transparent sm:max-w-[120px]" />
            <h3 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Academic Projects
            </h3>
            <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-glass-border to-transparent sm:block" />
          </motion.div>

          <motion.div
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
            )}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-70px" }}
            variants={gridVariants}
          >
            {academicProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
