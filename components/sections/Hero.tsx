"use client";

import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";
import ParticleField, {
  type ParticleMouseRef,
} from "@/components/three/ParticleField";
import { cn, getExperienceLabel, assetPath } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { useTheme } from "next-themes";
import { THEMES, type ThemeId } from "@/components/theme/ThemeProvider";

const shellVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const columnStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const wordLineParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -18 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.1 + i * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function IconDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGithub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TERMINAL_TEXT = "From idea to deployment — I build systems that think, adapt, and scale.";

const TYPING_NAME = "Niddhi Sachdeo";
const TYPING_PHRASE = "Software Developer";

function MaskedName({ text, startDelay }: { text: string; startDelay: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maskPos, setMaskPos] = useState({ x: -200, y: -200 });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    const runTyping = () => {
      let i = 0;
      const typeNext = () => {
        if (cancelled) return;
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i < text.length) {
          timeouts.push(window.setTimeout(typeNext, 55 + Math.random() * 35));
        }
      };
      timeouts.push(window.setTimeout(typeNext, 400));
    };
    timeouts.push(window.setTimeout(runTyping, Math.max(0, startDelay * 1000)));
    return () => { cancelled = true; timeouts.forEach((id) => window.clearTimeout(id)); };
  }, [startDelay, text]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMaskPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMaskPos({ x: -200, y: -200 });
  }, []);

  const baseClass = "text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl";

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base layer — normal gradient */}
      <span className={`text-gradient ${baseClass}`}>
        <span>{displayed}</span>
        <motion.span
          className="ml-1 inline-block h-[1.1em] w-[3px] translate-y-0.5 rounded-full bg-accent-purple glow-purple"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </span>

      {/* Masked reveal layer — cyan/white gradient revealed by cursor circle */}
      <span
        className={`pointer-events-none absolute inset-0 ${baseClass}`}
        style={{
          background: "linear-gradient(135deg, #64d2ff, #ffffff, #bf5af2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          clipPath: `circle(80px at ${maskPos.x}px ${maskPos.y}px)`,
          transition: "clip-path 0.15s ease-out",
        }}
        aria-hidden
      >
        <span>{displayed}</span>
        <span className="ml-1 inline-block h-[1.1em] w-[3px] translate-y-0.5 rounded-full opacity-0" />
      </span>
    </div>
  );
}

function TypingText({ text, startDelay, className }: { text: string; startDelay: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];

    const runTyping = () => {
      let i = 0;
      const typeNext = () => {
        if (cancelled) return;
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i < text.length) {
          timeouts.push(window.setTimeout(typeNext, 55 + Math.random() * 35));
        }
      };
      timeouts.push(window.setTimeout(typeNext, 400));
    };

    timeouts.push(window.setTimeout(runTyping, Math.max(0, startDelay * 1000)));

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [startDelay, text]);

  return (
    <span className={className}>
      <span>{displayed}</span>
      <motion.span
        className="ml-1 inline-block h-[1.1em] w-[3px] translate-y-0.5 rounded-full bg-accent-purple glow-purple"
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </span>
  );
}

function TerminalBox({ text, startDelay }: { text: string; startDelay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    const run = () => {
      let i = 0;
      const next = () => {
        if (cancelled) return;
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i < text.length) {
          timeouts.push(window.setTimeout(next, 30 + Math.random() * 25));
        } else {
          setDone(true);
        }
      };
      timeouts.push(window.setTimeout(next, 300));
    };
    timeouts.push(window.setTimeout(run, Math.max(0, startDelay * 1000)));
    return () => { cancelled = true; timeouts.forEach(id => window.clearTimeout(id)); };
  }, [startDelay, text]);

  return (
    <div className="overflow-hidden rounded-lg border border-glass-border bg-[#0d1117]/80 shadow-lg backdrop-blur-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] font-medium text-white/25">niddhi@dev ~</span>
      </div>
      {/* Body */}
      <div className="px-4 py-3 font-mono text-sm leading-relaxed md:text-base">
        <span className="text-emerald-400">$</span>
        <span className="ml-2 text-white/80">{displayed}</span>
        <motion.span
          className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-0.5 bg-emerald-400/80"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function TypingRole({ startDelay }: { startDelay: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];

    const runTyping = () => {
      let i = 0;
      const typeNext = () => {
        if (cancelled) return;
        i += 1;
        setDisplayed(TYPING_PHRASE.slice(0, i));
        if (i < TYPING_PHRASE.length) {
          timeouts.push(window.setTimeout(typeNext, 55 + Math.random() * 35));
        }
      };
      timeouts.push(window.setTimeout(typeNext, 400));
    };

    timeouts.push(window.setTimeout(runTyping, Math.max(0, startDelay * 1000)));

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [startDelay]);

  return (
    <span className="inline-flex items-baseline text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
      <span className="text-accent-cyan" aria-hidden>
        {"› "}
      </span>
      <span>{displayed}</span>
      <motion.span
        className="ml-1 inline-block h-[1.1em] w-[3px] translate-y-0.5 rounded-full bg-accent-purple glow-purple"
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </span>
  );
}

function HeroThemeLogo({ id }: { id: ThemeId }) {
  switch (id) {
    case "cosmic":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <circle cx="12" cy="12" r="4" fill="#bf5af2" />
          <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" stroke="url(#hero-ai-grad)" strokeWidth="1" strokeDasharray="2 3" />
          <defs><linearGradient id="hero-ai-grad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#0a84ff" /><stop offset="1" stopColor="#bf5af2" /></linearGradient></defs>
        </svg>
      );
    case "macos":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.31-1.32-3.15-2.55C4.22 16.86 3 12.87 4.74 10.18c.87-1.33 2.41-2.17 4.06-2.19 1.29-.02 2.51.87 3.29.87.79 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.27-2.15 3.78.03 3 2.63 4 2.65 4.01-.03.07-.41 1.43-1.33 2.78zM15.42 3.5c.74-.9 1.25-2.14 1.11-3.38-1.07.04-2.37.72-3.14 1.62-.69.8-1.29 2.08-1.13 3.3 1.2.09 2.42-.61 3.16-1.54z" fill="#f5f5f7" />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="12" r="10" fill="#1db954" />
          <path d="M16.5 8.5c-2.7-1.2-7-.8-7-.8s-.3 0-.3.3.3.3.3.3 3.8-.3 6.3.8c.2.1.4 0 .5-.2s0-.4-.2-.5zm-.5 2.3c-2.3-1-6-.7-6-.7s-.2 0-.2.2.2.3.2.3 3.3-.3 5.5.7c.2.1.3 0 .4-.2.1-.1 0-.3-.1-.3zm-.7 2.2c-2-.8-5-.5-5-.5s-.2 0-.2.2.2.2.2.2 2.7-.2 4.6.5c.2.1.3 0 .3-.1.1-.2 0-.3-.1-.3z" fill="white" />
        </svg>
      );
    case "agentic":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" stroke="#05ce91" strokeWidth="1.5" />
          <path d="M6 9l3 3-3 3" stroke="#05ce91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15h5" stroke="#ff9d00" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "netflix":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M5 2h4.5l5 14.5V2H19v20h-4.5l-5-14.5V22H5V2z" fill="#e50914" />
        </svg>
      );
  }
}

function ThemePickerPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-full left-1/2 z-[200] mb-3 -translate-x-1/2 w-56 overflow-hidden rounded-2xl border border-glass-border bg-background/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          <div className="p-3">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
              Choose a Theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); onClose(); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-glass-hover hover:text-foreground"
              >
                <HeroThemeLogo id={t.id} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const [themePopupOpen, setThemePopupOpen] = useState(false);
  const particleMouseRef = useRef({ x: 0, y: 0 }) as ParticleMouseRef;

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const smoothSpotX = useSpring(spotX, { stiffness: 64, damping: 24 });
  const smoothSpotY = useSpring(spotY, { stiffness: 64, damping: 24 });

  const spotlightBackground = useMotionTemplate`radial-gradient(620px circle at ${smoothSpotX}px ${smoothSpotY}px, rgba(10, 132, 255, 0.18), rgba(191, 90, 242, 0.09) 36%, transparent 58%)`;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      particleMouseRef.current.x = nx;
      particleMouseRef.current.y = ny;
      spotX.set(e.clientX - rect.left);
      spotY.set(e.clientY - rect.top);
    },
    [spotX, spotY],
  );

  const socialLinks = useMemo(
    () =>
      [
        {
          href: "https://github.com/NidhiSachdev",
          label: "GitHub",
          Icon: IconGithub,
        },
        {
          href: "https://linkedin.com/in/niddhisachdeo465a53187",
          label: "LinkedIn",
          Icon: IconLinkedIn,
        },
        {
          href: "mailto:nidhisachdeo2000@gmail.com",
          label: "Email",
          Icon: IconMail,
        },
      ] as const,
    [],
  );

  const stats = useMemo(
    () =>
      [
        { icon: "💼", text: getExperienceLabel() },
        { icon: "🏢", text: "Amdocs" },
        { icon: "☁️", text: "AWS Certified" },
        { icon: "📍", text: "Pune, India" },
      ] as const,
    [],
  );

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-transparent"
      onPointerMove={handlePointerMove}
    >
      <ParticleField mouseRef={particleMouseRef} />

      <div
        className="animated-grid pointer-events-none absolute inset-0 z-[1] opacity-[0.55]"
        aria-hidden
      />

      <motion.div
        className="noise pointer-events-none absolute inset-0 z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.25, ease: "easeOut" }}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ background: spotlightBackground }}
        aria-hidden
      />

      <motion.div
        className="relative z-[4] flex min-h-[100dvh] flex-1 flex-col section-padding pb-6 pt-20 sm:pb-8 md:pb-10 md:pt-24"
        variants={shellVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 sm:gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
          {/* Caricature sticker + floating info cards */}
          <motion.div
            className="relative mx-auto flex w-full max-w-[min(80%,360px)] shrink-0 items-start justify-center sm:max-w-[min(100%,500px)] lg:order-2 lg:mx-0 lg:max-w-none lg:flex-1 lg:justify-center lg:-mt-32"
            variants={fadeUpBlur}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-full max-w-[480px]">
              <motion.div
                className="pointer-events-none absolute -inset-10 rounded-[40%] bg-gradient-to-tr from-accent-blue/25 via-accent-purple/15 to-accent-cyan/10 blur-3xl"
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/niddhi-caricature.png"
                  width={480}
                  height={480}
                  alt="Niddhi Sachdeo caricature"
                  priority
                  className="relative z-[1] w-full rounded-2xl object-contain drop-shadow-[0_20px_60px_rgba(124,58,237,0.3)]"
                />
              </motion.div>

            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            className="flex flex-1 flex-col justify-center lg:order-1 lg:max-w-xl xl:max-w-2xl"
            variants={columnStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUpBlur}
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-blue md:text-sm"
            >
              Hello, I&apos;m
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <MaskedName text={TYPING_NAME} startDelay={0.4} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 md:mt-8">
              <TypingRole startDelay={0.85} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 max-w-lg">
              <TerminalBox text={TERMINAL_TEXT} startDelay={1.6} />
            </motion.div>

            <motion.div
              variants={columnStagger}
              initial="hidden"
              animate="visible"
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <motion.div variants={fadeUp}>
                <MagneticButton strength={0.4}>
                  <a
                    href={assetPath("/Niddhi_Sachdeo_2026.docx")}
                    download
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white",
                      "bg-gradient-to-r from-accent-blue to-accent-purple glow-blue",
                      "shadow-[0_0_44px_rgba(10,132,255,0.35)] transition-[transform,filter] duration-300",
                      "hover:brightness-110 active:scale-[0.98]",
                    )}
                  >
                    <IconDownload className="h-5 w-5 shrink-0" />
                    Download Resume
                  </a>
                </MagneticButton>
              </motion.div>
              <motion.div variants={fadeUp}>
                <MagneticButton strength={0.4}>
                  <a
                    href="#contact"
                    className={cn(
                      "glass glass-hover inline-flex items-center justify-center rounded-full border border-glass-border px-8 py-3.5 text-base font-semibold text-foreground",
                      "transition-[box-shadow,border-color] duration-300",
                      "hover:border-accent-purple/50 hover:shadow-[0_0_32px_rgba(191,90,242,0.28)]",
                    )}
                  >
                    Let&apos;s Connect
                  </a>
                </MagneticButton>
              </motion.div>
            </motion.div>

            <motion.div
              variants={columnStagger}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-wrap items-center gap-3"
            >
              {socialLinks.map(({ href, label, Icon }) => (
                <motion.div key={label} variants={fadeUp}>
                  <MagneticButton strength={0.5}>
                    <a
                      href={href}
                      {...(href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      aria-label={label}
                      className={cn(
                        "glass glass-hover flex h-11 w-11 items-center justify-center rounded-full text-foreground/90",
                        "transition-colors hover:text-accent-cyan",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </MagneticButton>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="glass mx-auto mt-auto w-full max-w-7xl rounded-xl border border-glass-border px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3 md:px-6 md:py-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] font-medium text-muted sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2 sm:gap-y-3 sm:text-sm md:flex-nowrap md:justify-between md:text-left">
            {stats.map(({ icon, text }, i) => (
              <Fragment key={text}>
                <motion.span
                  custom={i}
                  variants={statItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-flex items-center gap-2 text-foreground/90"
                >
                  <span className="select-none" aria-hidden>
                    {icon}
                  </span>
                  <span>{text}</span>
                </motion.span>
                {i < stats.length - 1 ? (
                  <span
                    className="hidden h-4 w-px shrink-0 bg-glass-border md:inline-block"
                    aria-hidden
                  />
                ) : null}
              </Fragment>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#contact"
        className="pointer-events-auto absolute bottom-5 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2 text-muted md:bottom-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.55 }}
        aria-label="Scroll to contact"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] md:text-xs">
          Scroll
        </span>
        <motion.span
          className="relative flex h-10 w-6 items-start justify-center rounded-full border border-glass-border bg-glass/90 pt-2 backdrop-blur-sm"
          aria-hidden
        >
          <motion.span
            className="h-2 w-1 rounded-full bg-accent-blue"
            animate={{ y: [0, 12, 0], opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </motion.a>

      {/* Theme picker — bottom right */}
      <motion.div
        className="pointer-events-auto absolute bottom-5 right-5 z-[5] sm:bottom-7 sm:right-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <div className="relative">
          <button
            onClick={() => setThemePopupOpen((v) => !v)}
            className="group flex items-center gap-2.5 rounded-xl border border-glass-border bg-glass/80 px-3 py-2 backdrop-blur-xl transition-all hover:border-accent-purple/40 hover:shadow-[0_0_20px_rgba(191,90,242,0.2)]"
          >
            <Image
              src="/images/theme-icon.png"
              alt="Themes"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-[11px] font-medium leading-tight text-foreground/70 group-hover:text-foreground sm:text-xs">
              Try different themes
            </span>
          </button>
          <ThemePickerPopup open={themePopupOpen} onClose={() => setThemePopupOpen(false)} />
        </div>
      </motion.div>
    </section>
  );
}
