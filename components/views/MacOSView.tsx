"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getExperienceLabel } from "@/lib/utils";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

type WindowId = "finder" | "about" | "experience" | "projects" | "skills" | "contact";

interface WindowState {
  id: WindowId;
  title: string;
  open: boolean;
  minimized: boolean;
  zIndex: number;
}

const INITIAL_WINDOWS: WindowState[] = [
  { id: "finder", title: "Finder", open: true, minimized: false, zIndex: 5 },
  { id: "about", title: "Photo Booth — About Me", open: false, minimized: false, zIndex: 1 },
  { id: "experience", title: "Safari — Experience", open: false, minimized: false, zIndex: 1 },
  { id: "projects", title: "System Settings — Projects", open: false, minimized: false, zIndex: 1 },
  { id: "skills", title: "Terminal — Skills", open: false, minimized: false, zIndex: 1 },
  { id: "contact", title: "FaceTime — Contact", open: false, minimized: false, zIndex: 1 },
];

const DOCK_APPS: { id: WindowId; title: string; img: string }[] = [
  { id: "finder", title: "Finder", img: "/images/macos-icons/finder.png" },
  { id: "about", title: "About Me", img: "/images/macos-icons/photobooth.png" },
  { id: "experience", title: "Experience", img: "/images/macos-icons/safari.png" },
  { id: "projects", title: "Projects", img: "/images/macos-icons/settings.png" },
  { id: "skills", title: "Skills", img: "/images/macos-icons/terminal.png" },
  { id: "contact", title: "Contact", img: "/images/macos-icons/facetime.png" },
];

/* ───────────────── TOP MENU BAR ───────────────── */
function TopBar({ activeTitle }: { activeTitle: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
        "  " +
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[200] flex h-[25px] items-center justify-between px-4 text-[13px] font-medium text-white shadow-sm backdrop-blur-2xl"
      style={{ background: "rgba(30, 30, 30, 0.55)" }}
    >
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 814 1000" fill="white" className="h-[14px] w-[14px] opacity-90">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.5c-57.8-81.7-104.8-208.2-104.8-328.9 0-193.2 125.7-295.7 249.4-295.7 65.8 0 120.8 43.2 162.2 43.2 39.5 0 101.1-45.8 175.9-45.8 28.4 0 130.3 2.6 197.3 98.8zm-169.5-92.6c31.6-37.5 54.2-89.5 54.2-141.5 0-7.2-.7-14.5-1.9-20.4-51.6 1.9-112.8 34.2-149.7 77.1-26.4 30.3-55.5 82.3-55.5 135.3 0 7.9 1.3 15.8 1.9 18.4 3.2.6 8.4 1.3 13.6 1.3 46.4 0 105.1-31 137.4-70.2z"/>
        </svg>
        <span className="font-semibold text-white/90">{activeTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="[&_button]:h-6 [&_button]:w-6 [&_button]:rounded-md [&_button]:border-none [&_button]:bg-transparent [&_button]:shadow-none [&_button]:hover:bg-white/10 [&_svg]:h-3.5 [&_svg]:w-3.5">
          <ThemeSwitcher />
        </div>
        <span className="text-[12px] text-white/80">{time}</span>
      </div>
    </div>
  );
}

/* ───────────────── DOCK ITEM ───────────────── */
function DockItem({ app, isOpen, onClick, mouseX }: {
  app: (typeof DOCK_APPS)[number];
  isOpen: boolean;
  onClick: () => void;
  mouseX: ReturnType<typeof useMotionValue<number | null>>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useMotionValue(200);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const widthSync = useTransform(distance, [-200, 0, 200], isMobile ? [36, 48, 36] : [44, 72, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  useEffect(() => {
    const unsubscribe = mouseX.on("change", (val) => {
      const el = ref.current;
      if (!el || val === null) {
        distance.set(200);
        return;
      }
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      distance.set(val - center);
    });
    return unsubscribe;
  }, [mouseX, distance]);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className="group relative flex flex-col items-center justify-end"
      style={{ width, height: width }}
      whileTap={{ y: -10 }}
    >
      <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-md bg-[#2a2a2e]/95 px-3 py-1 text-[11px] font-medium text-white shadow-lg backdrop-blur-sm group-hover:block">
        {app.title}
      </span>
      <motion.img
        src={app.img}
        alt={app.title}
        draggable={false}
        className="h-full w-full drop-shadow-lg"
        style={{ width, height: width }}
      />
      {isOpen && (
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-white/80" />
      )}
    </motion.button>
  );
}

/* ───────────────── DOCK ───────────────── */
function Dock({ windows, onOpenApp }: { windows: WindowState[]; onOpenApp: (id: WindowId) => void }) {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <motion.div
      className="fixed bottom-2 left-1/2 z-[100] -translate-x-1/2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 170, damping: 20 }}
    >
      <div
        className="flex items-end gap-1 rounded-2xl border border-white/20 px-2 pb-1.5 pt-1.5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
        style={{ background: "rgba(255,255,255,0.12)" }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
      >
        {DOCK_APPS.map((app, i) => (
          <div key={app.id} className="flex items-end">
            <DockItem
              app={app}
              isOpen={windows.find((w) => w.id === app.id)?.open ?? false}
              onClick={() => onOpenApp(app.id)}
              mouseX={mouseX}
            />
            {i === 0 && <div className="mx-1.5 h-[90%] w-px bg-white/20" />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ───────────────── TRAFFIC LIGHTS ───────────────── */
function TrafficLights({ onClose, onMinimize }: { onClose: () => void; onMinimize: () => void }) {
  return (
    <div className="group/tl flex items-center gap-2">
      <button onClick={onClose} className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]">
        <svg viewBox="0 0 12 12" className="h-[6px] w-[6px] opacity-0 group-hover/tl:opacity-100" fill="none" stroke="#4a0002" strokeWidth={1.5}>
          <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
        </svg>
      </button>
      <button onClick={onMinimize} className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e]">
        <svg viewBox="0 0 12 12" className="h-[6px] w-[6px] opacity-0 group-hover/tl:opacity-100" fill="none" stroke="#995700" strokeWidth={1.5}>
          <path d="M2 6h8" strokeLinecap="round" />
        </svg>
      </button>
      <button className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]">
        <svg viewBox="0 0 12 12" className="h-[6px] w-[6px] opacity-0 group-hover/tl:opacity-100" fill="#006500">
          <path d="M2 8.5l4-7 4 7M10 3.5l-4 7-4-7" />
        </svg>
      </button>
    </div>
  );
}

/* ───────────────── APP WINDOW ───────────────── */
function AppWindow({ win, onClose, onMinimize, onFocus, children }: {
  win: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}) {
  if (!win.open || win.minimized) return null;

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute inset-2 overflow-hidden rounded-xl shadow-2xl shadow-black/50 sm:inset-auto sm:left-[10%] sm:top-[8%] sm:h-[75vh] sm:w-[80%] lg:left-[15%] lg:top-[6%] lg:h-[78vh] lg:w-[70%]"
      style={{
        zIndex: win.zIndex,
        border: "0.5px solid rgba(255,255,255,0.18)",
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="flex h-[28px] items-center gap-4 px-3"
        style={{ background: "rgba(56, 56, 60, 0.95)", backdropFilter: "blur(20px)" }}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} />
        <span className="flex-1 text-center text-[12px] font-medium text-white/60 select-none">
          {win.title}
        </span>
        <div className="w-[52px]" />
      </div>
      {/* Content */}
      <div
        className="h-[calc(100%-28px)] overflow-y-auto text-[13px] leading-relaxed text-white/90"
        style={{ background: "rgba(30, 30, 32, 0.97)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ───────────────── FINDER CONTENT (launcher) ───────────────── */
function FinderContent({ onOpenApp }: { onOpenApp: (id: WindowId) => void }) {
  const apps: { id: WindowId; icon: string; label: string; color: string }[] = [
    { id: "about", icon: "/images/macos-icons/photobooth.png", label: "About Me", color: "#8E8E93" },
    { id: "experience", icon: "/images/macos-icons/safari.png", label: "Experience", color: "#007AFF" },
    { id: "projects", icon: "/images/macos-icons/settings.png", label: "Projects", color: "#636366" },
    { id: "skills", icon: "/images/macos-icons/terminal.png", label: "Skills", color: "#30D158" },
    { id: "contact", icon: "/images/macos-icons/facetime.png", label: "Contact", color: "#34D058" },
  ];

  return (
    <div className="flex h-full flex-col sm:flex-row">
      {/* Sidebar */}
      <div className="shrink-0 border-b border-white/[0.06] bg-white/[0.02] p-3 sm:w-[180px] sm:border-b-0 sm:border-r">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">Favorites</p>
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/[0.08]"
          >
            <img src={app.icon} alt="" className="h-5 w-5" />
            <span className="text-[12px] text-white/80">{app.label}</span>
          </button>
        ))}
        <div className="my-3 h-px bg-white/[0.06]" />
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">Quick Links</p>
        <a href="https://github.com/NidhiSachdev" target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/[0.08]">
          <span className="text-[14px]">🔗</span>
          <span className="text-[12px] text-white/80">GitHub</span>
        </a>
        <a href="https://linkedin.com/in/niddhisachdeo465a53187" target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/[0.08]">
          <span className="text-[14px]">🔗</span>
          <span className="text-[12px] text-white/80">LinkedIn</span>
        </a>
      </div>
      {/* Main content */}
      <div className="flex-1 p-5">
        <h2 className="mb-4 text-[14px] font-semibold text-white/80">Applications</h2>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="group flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-white/[0.06]"
            >
              <img src={app.icon} alt="" className="h-14 w-14 transition-transform group-hover:scale-110" />
              <span className="text-[11px] text-white/70 group-hover:text-white/90">{app.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-[11px] text-white/40">
            Click on any app above or use the sidebar to navigate. You can also use the Dock below.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── ABOUT CONTENT (Photo Booth style) ───────────────── */
function AboutContent() {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Photo */}
        <div className="shrink-0">
          <div className="overflow-hidden rounded-xl border-2 border-white/10 shadow-lg">
            <Image
              src="/images/profile.jpg"
              alt="Niddhi Sachdeo"
              width={160}
              height={200}
              className="h-[160px] w-[120px] object-cover sm:h-[200px] sm:w-[160px]"
            />
          </div>
          <p className="mt-2 text-center text-[10px] text-white/40">Photo Booth</p>
        </div>
        {/* Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Niddhi Sachdeo</h2>
            <p className="text-[12px] text-[#007aff]">Software Developer • {getExperienceLabel()}</p>
          </div>
          <p className="text-[13px] leading-[1.7] text-white/70">
            Software developer at Amdocs building AI-powered agents that transform enterprise operations.
            Currently pursuing Advanced Certification in Cloud Computing & DevOps from IIT Roorkee.
            Passionate about agentic AI, automation, and solving complex system problems.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Location", value: "Mumbai, India" },
              { label: "Experience", value: getExperienceLabel() },
              { label: "Focus", value: "Agentic AI & Automation" },
              { label: "Education", value: "IIT Roorkee (Cloud)" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white/[0.04] p-2.5 border border-white/[0.06]">
                <p className="text-[9px] uppercase tracking-wider text-white/35">{item.label}</p>
                <p className="mt-0.5 text-[11px] font-medium text-white/80">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── EXPERIENCE (Safari style) ───────────────── */
function ExperienceContent() {
  return (
    <div>
      {/* Safari URL bar */}
      <div className="flex h-[32px] items-center border-b border-white/[0.06] bg-white/[0.03] px-3">
        <div className="flex flex-1 items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1">
          <span className="text-[10px] text-white/30">🔒</span>
          <span className="text-[11px] text-white/50">niddhisachdeo.dev/experience</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {[
          {
            role: "Software Developer",
            company: "Amdocs",
            period: "2021 - Present",
            current: true,
            points: [
              "Built DORA - AI agent reducing ticket resolution by 40%",
              "Automated JIRA workflows with agentic solutions",
              "Developed microservices on AWS Lambda & API Gateway",
              "Mentored junior developers on best practices",
            ],
          },
          {
            role: "Advanced Certification - Cloud & DevOps",
            company: "IIT Roorkee",
            period: "2024 - Present",
            current: true,
            points: ["AWS, Docker, Kubernetes, Terraform", "CI/CD pipelines & infrastructure as code"],
          },
          {
            role: "B.E. Computer Engineering",
            company: "University of Mumbai",
            period: "2017 - 2021",
            current: false,
            points: ["CGPA: 8.34", "Focus: ML & distributed systems"],
          },
        ].map((exp) => (
          <div key={exp.role} className="rounded-lg bg-white/[0.03] p-4 border border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-white">{exp.role}</h3>
                <p className="text-[11px] text-[#007aff]">{exp.company} • {exp.period}</p>
              </div>
              {exp.current && (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[9px] font-medium text-green-400 border border-green-500/20">
                  Current
                </span>
              )}
            </div>
            <ul className="mt-2 space-y-1">
              {exp.points.map((p) => (
                <li key={p} className="text-[12px] text-white/60">• {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── PROJECTS (System Settings style) ───────────────── */
function ProjectsContent() {
  const projects = [
    { name: "DORA Agent", desc: "AI-powered order routing automation", tech: "Python, AWS, AI", icon: "🤖" },
    { name: "MoodMiles", desc: "Mood-based AI travel planner", tech: "Python, AI/ML, JS", icon: "✈️" },
    { name: "S4 Spine Physio", desc: "Healthcare app with 40+ treatments", tech: "Next.js, TypeScript", icon: "🏥" },
    { name: "Intrusion Detection", desc: "Keystroke ML authentication", tech: "ML, Python, MySQL", icon: "🔐" },
  ];

  return (
    <div className="flex h-full">
      {/* Settings sidebar */}
      <div className="w-[180px] shrink-0 border-r border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 rounded-md bg-white/[0.06] px-2 py-1.5 mb-3">
          <span className="text-[11px] text-white/40">🔍 Search</span>
        </div>
        {projects.map((p) => (
          <div key={p.name} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.06] cursor-default">
            <span className="text-[13px]">{p.icon}</span>
            <span className="text-[11px] text-white/70">{p.name}</span>
          </div>
        ))}
      </div>
      {/* Main content */}
      <div className="flex-1 p-5 space-y-3">
        {projects.map((p) => (
          <div key={p.name} className="flex items-center gap-4 rounded-lg bg-white/[0.03] p-4 border border-white/[0.06] transition-colors hover:bg-white/[0.05]">
            <span className="text-3xl">{p.icon}</span>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-white">{p.name}</h3>
              <p className="text-[11px] text-white/50">{p.desc}</p>
              <p className="mt-1 text-[10px] font-medium text-[#007aff]">{p.tech}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-white/30" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── SKILLS (Terminal style) ───────────────── */
function SkillsContent() {
  const lines = [
    { prompt: "~ % neofetch", output: null },
    { prompt: null, output: "" },
    { prompt: null, output: "  NS@macbook-pro" },
    { prompt: null, output: "  ─────────────────────────" },
    { prompt: null, output: "  OS: Developer v4.0" },
    { prompt: null, output: "  Languages: Java, Python, TypeScript, SQL" },
    { prompt: null, output: "  AI/ML: Agentic AI, LangChain, RAG, NLP" },
    { prompt: null, output: "  Cloud: AWS, Docker, K8s, Terraform" },
    { prompt: null, output: "  Web: React, Next.js, Node.js, Spring Boot" },
    { prompt: null, output: "  DB: PostgreSQL, MongoDB, Couchbase, Redis" },
    { prompt: null, output: "  Tools: Git, Linux, CI/CD, Kibana" },
    { prompt: null, output: "" },
    { prompt: "~ % cat certifications.txt", output: null },
    { prompt: null, output: "  • AWS Cloud Certification (IIT Roorkee)" },
    { prompt: null, output: "  • B.E. Computer Engineering (Mumbai University)" },
    { prompt: null, output: "" },
    { prompt: "~ % echo $CURRENT_ROLE", output: null },
    { prompt: null, output: "  Software Developer @ Amdocs" },
    { prompt: null, output: "" },
    { prompt: "~ % █", output: null },
  ];

  return (
    <div className="h-full bg-[#1e1e1e] p-4 font-mono text-[12px] leading-[1.7]">
      {/* Terminal title bar dots */}
      {lines.map((line, i) => (
        <div key={i}>
          {line.prompt !== null && (
            <span>
              <span className="text-[#30D158]">niddhi</span>
              <span className="text-white/60">{line.prompt}</span>
            </span>
          )}
          {line.output !== null && (
            <span className="text-white/70">{line.output}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────────── CONTACT (FaceTime style) ───────────────── */
function ContactContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      {/* Avatar */}
      <div className="mb-4 overflow-hidden rounded-full border-2 border-white/10">
        <Image
          src="/images/profile.jpg"
          alt="Niddhi Sachdeo"
          width={80}
          height={80}
          className="h-20 w-20 object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold text-white">Niddhi Sachdeo</h2>
      <p className="mt-1 text-[12px] text-white/50">Available for calls & collaborations</p>

      {/* Contact buttons */}
      <div className="mt-6 flex gap-4">
        <a href="mailto:nidhisachdeo2000@gmail.com" className="flex flex-col items-center gap-1.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#30D158]">
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </span>
          <span className="text-[10px] text-[#30D158]">Email</span>
        </a>
        <a href="https://linkedin.com/in/niddhisachdeo465a53187" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#007AFF]">
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </span>
          <span className="text-[10px] text-[#007AFF]">LinkedIn</span>
        </a>
        <a href="https://github.com/NidhiSachdev" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8E8E93]">
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </span>
          <span className="text-[10px] text-[#8E8E93]">GitHub</span>
        </a>
      </div>

      {/* Resume download */}
      <a
        href="/Niddhi_Sachdeo_2026.docx"
        download
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-5 py-2 text-[12px] font-medium text-white/80 transition-colors hover:bg-white/[0.12]"
      >
        ⬇ Download Resume
      </a>
    </div>
  );
}

/* ───────────────── CALENDAR WIDGET ───────────────── */
function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="w-[220px] rounded-2xl border border-white/10 bg-[#1c1c1e]/90 p-3 shadow-xl backdrop-blur-2xl">
      <p className="mb-2 text-center text-[11px] font-semibold text-white/90">{monthName}</p>
      <div className="grid grid-cols-7 gap-0.5">
        {dayNames.map((d) => (
          <span key={d} className="text-center text-[9px] font-medium text-white/40">{d}</span>
        ))}
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => day && setSelectedDay(day)}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-colors ${
              day === today
                ? "bg-[#007AFF] font-bold text-white"
                : day === selectedDay && day !== today
                ? "bg-white/10 text-white"
                : day
                ? "text-white/70 hover:bg-white/[0.06]"
                : ""
            }`}
            disabled={!day}
          >
            {day || ""}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── WEATHER WIDGET ───────────────── */
function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: string;
    location: string;
    high: number;
    low: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherCode = (code: number): { condition: string; icon: string } => {
      if (code === 0) return { condition: "Clear Sky", icon: "☀️" };
      if (code <= 3) return { condition: "Partly Cloudy", icon: "⛅" };
      if (code <= 48) return { condition: "Foggy", icon: "🌫️" };
      if (code <= 57) return { condition: "Drizzle", icon: "🌦️" };
      if (code <= 67) return { condition: "Rain", icon: "🌧️" };
      if (code <= 77) return { condition: "Snow", icon: "🌨️" };
      if (code <= 82) return { condition: "Rain Showers", icon: "🌧️" };
      if (code <= 86) return { condition: "Snow Showers", icon: "🌨️" };
      if (code >= 95) return { condition: "Thunderstorm", icon: "⛈️" };
      return { condition: "Cloudy", icon: "☁️" };
    };

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
        );
        const data = await res.json();
        const { condition, icon } = getWeatherCode(data.current.weather_code);

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&format=json`);
        let location = "Your Location";
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const revData = await revRes.json();
          location = revData.address?.city || revData.address?.town || revData.address?.state || "Your Location";
        } catch {
          location = `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
        }

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition,
          icon,
          location,
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
        });
      } catch {
        setWeather({ temp: 28, condition: "Clear Sky", icon: "☀️", location: "Mumbai", high: 32, low: 25 });
      }
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(19.076, 72.8777) // fallback to Mumbai
      );
    } else {
      fetchWeather(19.076, 72.8777);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-[120px] w-[220px] items-center justify-center rounded-2xl border border-white/10 bg-[#1c1c1e]/90 shadow-xl backdrop-blur-2xl">
        <span className="text-[11px] text-white/40">Loading weather...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="w-[220px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c3a5e]/90 to-[#1c1c3e]/90 p-4 shadow-xl backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-white/60">{weather.location}</p>
          <p className="text-[32px] font-light leading-none text-white">{weather.temp}°</p>
          <p className="mt-1 text-[11px] text-white/60">{weather.condition}</p>
        </div>
        <span className="text-4xl">{weather.icon}</span>
      </div>
      <div className="mt-3 flex gap-3 border-t border-white/10 pt-2">
        <span className="text-[10px] text-white/50">H: {weather.high}°</span>
        <span className="text-[10px] text-white/50">L: {weather.low}°</span>
      </div>
    </div>
  );
}

/* ───────────────── HELLO INTRO ───────────────── */
function HelloIntro({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.svg
        className="h-[80px] sm:h-[100px] lg:h-[120px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 638 200"
        fill="none"
        stroke="white"
        strokeWidth="14.8883"
      >
        <title>hello</title>
        <motion.path
          d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
          style={{ strokeLinecap: "round" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", opacity: { duration: 0.4 } }}
        />
        <motion.path
          d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 409.682 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186"
          style={{ strokeLinecap: "round" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.8, ease: "easeInOut", delay: 0.7, opacity: { duration: 0.7, delay: 0.7 } }}
          onAnimationComplete={onComplete}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ───────────────── MAIN VIEW ───────────────── */
export default function MacOSView() {
  const [showHello, setShowHello] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const maxZ = useRef(6);

  const activeTitle = (() => {
    const openWindows = windows.filter((w) => w.open && !w.minimized);
    if (openWindows.length === 0) return "Finder";
    return openWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).title;
  })();

  const openApp = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          maxZ.current += 1;
          return { ...w, open: true, minimized: false, zIndex: maxZ.current };
        }
        return w;
      })
    );
  }, []);

  const closeApp = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, open: false } : w)));
  }, []);

  const minimizeApp = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const focusApp = useCallback((id: WindowId) => {
    maxZ.current += 1;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ.current } : w)));
  }, []);

  const CONTENT: Record<WindowId, React.ReactNode> = {
    finder: <FinderContent onOpenApp={openApp} />,
    about: <AboutContent />,
    experience: <ExperienceContent />,
    projects: <ProjectsContent />,
    skills: <SkillsContent />,
    contact: <ContactContent />,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      <AnimatePresence>
        {showHello && <HelloIntro onComplete={() => setShowHello(false)} />}
      </AnimatePresence>

      <TopBar activeTitle={activeTitle} />

      {/* Desktop */}
      <div className="absolute inset-0 pt-[25px] pb-[70px]">
        <AnimatePresence>
          {windows.map((win) => (
            <AppWindow
              key={win.id}
              win={win}
              onClose={() => closeApp(win.id)}
              onMinimize={() => minimizeApp(win.id)}
              onFocus={() => focusApp(win.id)}
            >
              {CONTENT[win.id]}
            </AppWindow>
          ))}
        </AnimatePresence>

        {/* Desktop Widgets (macOS Sonoma style - right side, hidden on mobile) */}
        <div className="absolute right-4 top-4 z-[2] hidden flex-col gap-3 md:flex">
          <WeatherWidget />
          <CalendarWidget />
        </div>
      </div>

      {/* Dock */}
      <Dock windows={windows} onOpenApp={openApp} />
    </div>
  );
}
