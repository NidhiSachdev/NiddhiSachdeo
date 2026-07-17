"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getExperienceLabel, assetPath } from "@/lib/utils";

const EXPERIENCE = {
  role: "Software Developer",
  company: "Amdocs",
  period: "Sept 2021 - Present",
  location: "Pune, India",
  achievements: [
    "Designed OpsAI Agent – DORA, reducing resolution time by ~40%",
    "Analyzed Auto Debit Adjustment (ADA) for Philippines ops",
    "Delivered 10+ customer feature enhancements across 3 accounts",
    "Resolved 100+ production issues with <2hr SLA breach rate",
    "Earned AWS Cloud Practitioner certification",
    "Automated 5+ manual workflows, saving ~8 hrs/week",
    "Specialized in Couchbase, PostgreSQL, Kibana visualization",
  ],
};

const PROJECTS = [
  {
    title: "DORA - Digital Order Routing Assistant",
    description: "AI-driven automation for order resolution with 100+ pattern-matching rules",
    tech: ["Python", "AWS Lambda", "Agentic AI"],
    period: "Oct - Dec 2025",
    githubUrl: "https://github.com/NidhiSachdev",
  },
  {
    title: "MoodMiles",
    description: "Mood-based travel planning with personalized itineraries",
    tech: ["Python", "AI/ML", "JavaScript"],
    period: "Dec 2025 - Jan 2026",
    githubUrl: "https://github.com/NidhiSachdev",
  },
  {
    title: "S4 Spine Physiotherapy",
    description: "Healthcare app with interactive body map & quiz recommendations",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    period: "Apr 2026",
    liveUrl: "https://s4-spine-physiotherapy.vercel.app",
    githubUrl: "https://github.com/NidhiSachdev/s4-spine-physiotherapy",
  },
];

const SKILLS = [
  { name: "Java", icon: "☕" },
  { name: "Python", icon: "🐍" },
  { name: "AWS", icon: "☁️" },
  { name: "Docker", icon: "🐳" },
  { name: "SQL", icon: "🗄️" },
  { name: "Agentic AI", icon: "🤖" },
  { name: "Next.js", icon: "⚡" },
  { name: "Linux", icon: "🐧" },
  { name: "MongoDB", icon: "🍃" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Machine Learning", icon: "🧠" },
  { name: "Shell Script", icon: "📜" },
];

const EDUCATION = [
  { degree: "B.E. Computer Engineering", school: "University of Mumbai", year: "2017 - 2021", gpa: "8.34 CGPA" },
  { degree: "Cloud Computing & DevOps", school: "IIT Roorkee (Pursuing)", year: "2024 - Present", gpa: "" },
];

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function SpotifyView() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 pb-12 sm:px-6 lg:px-8">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[auto] lg:gap-4">

        {/* Profile Card - spans 2 cols, tall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-[#212121] p-4 md:col-span-2 md:row-span-3"
        >
          <div className="flex flex-col gap-5">
            <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1DB954]/40 via-transparent to-[#1DB954]/20" />
              <Image
                src={assetPath("/images/about.jpg")}
                alt="Niddhi Sachdeo"
                width={400}
                height={400}
                className="w-full rounded-2xl object-cover"
              />
            </div>

            <div className="flex flex-col gap-3 px-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Niddhi Sachdeo</h1>
                <p className="text-sm text-[#b3b3b3]">Software Developer • Agentic AI • AWS</p>
              </div>
              <p className="text-sm text-[#b3b3b3] leading-relaxed">
                Passionate developer at <span className="text-[#1DB954] font-semibold">Amdocs</span>, building
                intelligent systems that automate workflows and scale. {getExperienceLabel()} of shipping production code.
              </p>
              <p className="text-sm text-[#b3b3b3]">
                Focus: <span className="text-[#1DB954]">Agentic AI, Cloud Deployment, Full-Stack Development</span>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <a href="https://github.com/NidhiSachdev" target="_blank" rel="noopener noreferrer" className="text-[#b3b3b3] hover:text-white transition-colors">
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/niddhisachdeo465a53187" target="_blank" rel="noopener noreferrer" className="text-[#b3b3b3] hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="mailto:nidhisachdeo2000@gmail.com" className="text-[#b3b3b3] hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Experience - Playlist Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl bg-[#212121] md:col-span-2 md:row-span-3 overflow-hidden"
        >
          <div className="bg-[#535353] px-5 py-4">
            <h2 className="text-lg font-bold text-white">Experience</h2>
            <p className="flex items-center gap-1.5 text-xs text-[#b3b3b3]">
              {EXPERIENCE.achievements.length} achievements • {EXPERIENCE.period}
            </p>
          </div>

          {/* Play controls */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] hover:scale-105 transition-transform">
                <PlayIcon className="h-4 w-4 text-black ml-0.5" />
              </button>
              <ShuffleIcon className="h-5 w-5 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer" />
              <a href={assetPath("/Niddhi_Sachdeo_2026.docx")} download className="text-[#b3b3b3] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Track list */}
          <div className="max-h-[320px] overflow-y-auto px-3 pb-4">
            {EXPERIENCE.achievements.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-[#282828]"
              >
                <span className="mt-0.5 min-w-[20px] text-sm text-[#b3b3b3] group-hover:text-white">
                  {i + 1}
                </span>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white leading-snug">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects - Album Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl bg-[#212121] p-4 md:col-span-2 md:row-span-3 overflow-hidden"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Featured Projects</h2>
          </div>

          <div className="flex flex-col gap-3">
            {PROJECTS.map((project, i) => (
              <div
                key={project.title}
                className="group flex flex-col gap-2 rounded-lg bg-[#181818] p-4 transition-colors hover:bg-[#282828]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#b3b3b3] leading-relaxed">{project.description}</p>
                  </div>
                  <div className="ml-3 flex items-center gap-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#b3b3b3] hover:text-[#1DB954]">
                        <ExternalIcon className="h-4 w-4" />
                      </a>
                    )}
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#b3b3b3] hover:text-[#1DB954]">
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded-full bg-[#1DB954]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#1DB954]">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-[#535353]">{project.period}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills - Scrolling Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl bg-[#212121] p-4 md:col-span-4 overflow-hidden"
        >
          <h2 className="mb-4 text-lg font-bold text-white">Skills & Tools</h2>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#212121] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#212121] to-transparent" />
            <div className="flex w-max animate-marquee items-center gap-4">
              {[...SKILLS, ...SKILLS, ...SKILLS].map((skill, i) => (
                <div
                  key={`${skill.name}-${i}`}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-[#181818] px-4 py-2.5 hover:bg-[#282828] transition-colors"
                >
                  <span className="text-lg">{skill.icon}</span>
                  <span className="text-sm font-medium text-white whitespace-nowrap">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-xl bg-[#212121] p-4 md:col-span-2 overflow-hidden"
        >
          <h2 className="mb-4 text-lg font-bold text-white">Education</h2>
          <div className="flex flex-col gap-3">
            {EDUCATION.map((edu) => (
              <div key={edu.degree} className="rounded-lg bg-[#181818] p-3 hover:bg-[#282828] transition-colors">
                <p className="text-sm font-semibold text-white">{edu.degree}</p>
                <p className="text-xs text-[#1DB954]">{edu.school}</p>
                <p className="text-xs text-[#535353]">{edu.year} {edu.gpa && `• ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact - CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl bg-gradient-to-br from-[#1DB954]/20 via-[#212121] to-[#212121] p-5 md:col-span-4"
        >
          <h2 className="mb-2 text-lg font-bold text-white">Let&apos;s Connect</h2>
          <p className="mb-4 text-sm text-[#b3b3b3]">Have a project in mind? I&apos;d love to hear from you.</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:nidhisachdeo2000@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-bold text-black hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Say Hello
            </a>
            <a
              href="https://linkedin.com/in/niddhisachdeo465a53187"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#727272] px-5 py-2.5 text-sm font-bold text-white hover:border-white hover:scale-105 transition-all"
            >
              LinkedIn
            </a>
            <a
              href={assetPath("/Niddhi_Sachdeo_2026.docx")}
              download
              className="inline-flex items-center gap-2 rounded-full border border-[#727272] px-5 py-2.5 text-sm font-bold text-white hover:border-[#1DB954] hover:text-[#1DB954] hover:scale-105 transition-all"
            >
              Download Resume
            </a>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-xl bg-[#212121] p-4 md:col-span-2"
        >
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#b3b3b3]">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Experience", value: getExperienceLabel() },
              { label: "Company", value: "Amdocs" },
              { label: "Certification", value: "AWS CCP" },
              { label: "Location", value: "Pune, India" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-[#181818] p-3">
                <p className="text-[10px] uppercase tracking-wide text-[#535353]">{stat.label}</p>
                <p className="text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center md:col-span-6 py-4">
          <p className="text-xs text-[#535353]">&copy; {new Date().getFullYear()} Niddhi Sachdeo • Built with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
