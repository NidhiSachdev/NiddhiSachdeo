"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { getExperienceLabel, assetPath } from "@/lib/utils";

const EXPERIENCE = [
  {
    title: "The AI Revolution",
    meta: "2021 - Present • 99% Match",
    description: "Amdocs • Software Developer",
    tags: ["Agentic AI", "DORA Agent", "40% Faster"],
    gradient: "linear-gradient(135deg, rgba(229,9,20,0.9) 0%, rgba(0,0,0,0.8) 100%)",
    badge: "NOW PLAYING",
  },
  {
    title: "Cloud Mastery Arc",
    meta: "2024 - Present • 97% Match",
    description: "IIT Roorkee • Cloud & DevOps",
    tags: ["AWS", "Docker", "Kubernetes"],
    gradient: "linear-gradient(135deg, rgba(79,172,254,0.9) 0%, rgba(0,242,254,0.8) 100%)",
  },
  {
    title: "The Foundation",
    meta: "2017 - 2021 • 95% Match",
    description: "University of Mumbai • B.E. Computer Engineering",
    tags: ["8.34 CGPA", "ML Project", "Java"],
    gradient: "linear-gradient(135deg, rgba(67,233,123,0.9) 0%, rgba(56,249,215,0.8) 100%)",
  },
];

const PROJECTS = [
  {
    title: "DORA - Digital Order Routing",
    meta: "🏆 Flagship Project",
    description: "AI agent that reduced resolution time by 40%",
    tags: ["Python", "AWS Lambda", "Agentic AI"],
    gradient: "linear-gradient(135deg, rgba(229,9,20,0.85) 0%, rgba(139,0,0,0.9) 100%)",
    badge: "NEW",
  },
  {
    title: "MoodMiles",
    meta: "⚡ AI Travel App",
    description: "Mood-based trip planning with dynamic itineraries",
    tags: ["Python", "AI/ML", "JavaScript"],
    gradient: "linear-gradient(135deg, rgba(106,90,205,0.9) 0%, rgba(30,144,255,0.8) 100%)",
  },
  {
    title: "S4 Spine Physiotherapy",
    meta: "📈 Live on Vercel",
    description: "Healthcare app with 40+ treatments, body map",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    gradient: "linear-gradient(135deg, rgba(67,233,123,0.9) 0%, rgba(56,249,215,0.8) 100%)",
  },
  {
    title: "Intrusion Detection System",
    meta: "🎓 B.E. Final Year",
    description: "Keystroke ML-based user authentication",
    tags: ["Machine Learning", "Python", "MySQL"],
    gradient: "linear-gradient(135deg, rgba(255,152,0,0.9) 0%, rgba(255,87,51,0.8) 100%)",
  },
];

const SKILLS = [
  { title: "Agentic AI Solutions", meta: "⭐ Expert", description: "Autonomous agents, automation, decision support", gradient: "linear-gradient(135deg, rgba(229,9,20,0.85) 0%, rgba(100,0,0,0.9) 100%)" },
  { title: "AWS Cloud Architect", meta: "⭐ Certified", description: "EC2, S3, Lambda, Docker, Kubernetes", gradient: "linear-gradient(135deg, rgba(79,172,254,0.9) 0%, rgba(0,100,200,0.9) 100%)" },
  { title: "Full Stack Development", meta: "⭐ Advanced", description: "Java, Python, Next.js, React", gradient: "linear-gradient(135deg, rgba(106,90,205,0.9) 0%, rgba(60,40,150,0.9) 100%)" },
  { title: "Database Engineering", meta: "⭐ Advanced", description: "PostgreSQL, Couchbase, MongoDB, Kibana", gradient: "linear-gradient(135deg, rgba(67,233,123,0.9) 0%, rgba(0,100,60,0.9) 100%)" },
  { title: "AI & Machine Learning", meta: "⭐ Advanced", description: "ML algorithms, data pipelines, automation", gradient: "linear-gradient(135deg, rgba(255,152,0,0.9) 0%, rgba(150,60,0,0.9) 100%)" },
  { title: "Linux & DevOps", meta: "⭐ Advanced", description: "Shell scripting, CI/CD, containers", gradient: "linear-gradient(135deg, rgba(220,20,60,0.9) 0%, rgba(139,0,139,0.8) 100%)" },
];

function ContentRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <div className="group/row relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/50 text-2xl text-white opacity-0 transition-opacity group-hover/row:flex group-hover/row:opacity-100"
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none sm:gap-3"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/50 text-2xl text-white opacity-0 transition-opacity group-hover/row:flex group-hover/row:opacity-100"
      >
        ›
      </button>
    </div>
  );
}

type CardProps = {
  title: string;
  meta: string;
  description: string;
  tags?: string[];
  gradient: string;
  badge?: string;
  featured?: boolean;
};

function ContentCard({ title, meta, description, tags, gradient, badge, featured }: CardProps) {
  return (
    <div
      className={`group relative shrink-0 cursor-pointer overflow-hidden rounded transition-transform duration-300 hover:z-10 hover:scale-[1.25] ${
        featured ? "min-w-[320px] h-[200px] sm:min-w-[380px] sm:h-[230px]" : "min-w-[220px] h-[140px] sm:min-w-[260px] sm:h-[155px]"
      }`}
      style={{ background: gradient }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

      {/* Badge */}
      {badge && (
        <span className="absolute right-2 top-2 rounded bg-[#e50914] px-2 py-0.5 text-[10px] font-bold text-white shadow">
          {badge}
        </span>
      )}

      {/* Info */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-sm font-bold text-white sm:text-base leading-tight">{title}</h3>
        <p className="mt-0.5 text-xs font-semibold text-[#46d369]">{meta}</p>
        <p className="mt-0.5 text-xs text-[#e5e5e5] leading-snug">{description}</p>
        {tags && tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#e50914]/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NetflixIntro({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 200);

    const endTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <audio ref={audioRef} src={assetPath("/netflix-sound.webm")} preload="auto" />

      <motion.div className="relative flex items-center justify-center">
        {/* The NS — starts zoomed in very close (like Netflix N filling screen) then pulls back */}
        <motion.span
          className="block font-black text-[#e50914]"
          style={{ lineHeight: 1 }}
          initial={{ scale: 15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            scale: { duration: 2.5, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.8 },
          }}
        >
          <span className="text-[100px] sm:text-[140px] lg:text-[180px]">NS</span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default function NetflixView() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <AnimatePresence>
        {showIntro && <NetflixIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center px-6 sm:px-12 lg:px-14">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              linear-gradient(to bottom, transparent 60%, #141414 100%),
              linear-gradient(to right, #141414 30%, transparent 70%),
              linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
            `,
          }}
        />

        <motion.div
          className="max-w-xl pt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ textShadow: "4px 4px 8px rgba(0,0,0,0.8)" }}
          >
            Niddhi Sachdeo
          </h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wider text-white sm:text-xl">
            Software Developer • {getExperienceLabel()}
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#e5e5e5] sm:text-lg">
            Watch as this developer designs AI agents that slash resolution time by 40%,
            automates complex workflows, and deploys intelligent systems on AWS —
            all while pursuing advanced cloud certification from IIT Roorkee.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={assetPath("/Niddhi_Sachdeo_2026.docx")}
              download
              className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition-all hover:bg-white/75"
            >
              ▶ Play Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded bg-[rgba(109,109,110,0.7)] px-7 py-3 text-base font-bold text-white transition-all hover:bg-[rgba(109,109,110,0.4)]"
            >
              ℹ More Info
            </a>
          </div>
        </motion.div>

        {/* Profile image on right */}
        <motion.div
          className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Image
            src={assetPath("/images/about.jpg")}
            alt=""
            width={400}
            height={500}
            className="h-[450px] w-auto rounded object-cover opacity-60"
            aria-hidden
          />
        </motion.div>
      </section>

      {/* Experience Row */}
      <section className="px-6 py-6 sm:px-12 lg:px-14" id="experience">
        <h2 className="mb-5 text-xl font-bold text-[#e5e5e5] sm:text-2xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}>
          Continue Watching My Career
        </h2>
        <ContentRow>
          {EXPERIENCE.map((item, i) => (
            <ContentCard key={item.title} {...item} featured={i === 0} />
          ))}
        </ContentRow>
      </section>

      {/* Projects Row */}
      <section className="px-6 py-6 sm:px-12 lg:px-14" id="projects">
        <h2 className="mb-5 text-xl font-bold text-[#e5e5e5] sm:text-2xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}>
          Award-Winning Projects
        </h2>
        <ContentRow>
          {PROJECTS.map((item) => (
            <ContentCard key={item.title} {...item} />
          ))}
        </ContentRow>
      </section>

      {/* Skills Row */}
      <section className="px-6 py-6 sm:px-12 lg:px-14" id="skills">
        <h2 className="mb-5 text-xl font-bold text-[#e5e5e5] sm:text-2xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}>
          Trending Skills Right Now
        </h2>
        <ContentRow>
          {SKILLS.map((item) => (
            <ContentCard key={item.title} {...item} />
          ))}
        </ContentRow>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-12 sm:px-12 lg:px-14" id="contact">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Interested in this profile?</h2>
          <p className="mt-3 text-[#b3b3b3]">Start a conversation about your next project.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:nidhisachdeo2000@gmail.com"
              className="inline-flex items-center gap-2 rounded bg-[#e50914] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#f6121d]"
            >
              ▶ Contact Now
            </a>
            <a
              href="https://linkedin.com/in/niddhisachdeo465a53187"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-[rgba(109,109,110,0.7)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[rgba(109,109,110,0.4)]"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center sm:px-12">
        <p className="text-xs text-[#737373]">&copy; {new Date().getFullYear()} Niddhi Sachdeo. All rights reserved.</p>
      </footer>
    </div>
  );
}
