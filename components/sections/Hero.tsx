"use client";

import {
  motion,
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
import { cn } from "@/lib/utils";

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

const DESCRIPTION_LINES = [
  "Specializing in Agentic AI, scalable app development, and AWS cloud deployment.",
  "I build intelligent systems that automate workflows, reduce manual effort, and accelerate business processes.",
] as const;

const TYPING_NAME = "Niddhi Sachdeo";
const TYPING_PHRASE = "Software Developer";

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
    <span className="inline-flex items-baseline text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
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

export default function Hero() {
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
        { icon: "💼", text: "4+ Years Experience" },
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
        className="relative z-[4] flex min-h-[100dvh] flex-1 flex-col section-padding pb-8 pt-20 md:pb-10 md:pt-24"
        variants={shellVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
          {/* Portrait — mobile first (top), desktop right */}
          <motion.div
            className="relative mx-auto flex w-full max-w-[min(100%,420px)] shrink-0 justify-center lg:order-2 lg:mx-0 lg:max-w-none lg:flex-1 lg:justify-center lg:self-start"
            variants={fadeUpBlur}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex w-full max-w-[200px] flex-col items-center sm:max-w-[220px] lg:max-w-[240px]">
              {/* Lanyard clip — fixed anchor at top */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Metal clip */}
                <div className="h-6 w-10 rounded-t-lg border-2 border-white/25 bg-gradient-to-b from-white/20 to-white/5" />
                {/* Lanyard string */}
                <div className="h-6 w-[2px] bg-gradient-to-b from-white/25 to-accent-purple/50 sm:h-7" />
              </div>

              {/* Swinging ID card */}
              <motion.div
                className="relative"
                style={{ transformOrigin: "top center" }}
                animate={{ rotate: [3, -3, 3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Ambient glow behind card */}
                <motion.div
                  className="pointer-events-none absolute -inset-6 rounded-[40%] bg-gradient-to-tr from-accent-blue/30 via-accent-purple/20 to-accent-cyan/15 blur-3xl"
                  animate={{ opacity: [0.5, 0.85, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />

                {/* The card — gradient border wrapper */}
                <div
                  className="relative rounded-2xl p-[1.5px]"
                  style={{
                    background: "linear-gradient(135deg, #0a84ff, #bf5af2)",
                    boxShadow:
                      "0 20px 60px -12px rgba(10,132,255,0.3), 0 0 40px rgba(191,90,242,0.2), 0 0 80px rgba(10,132,255,0.1)",
                  }}
                >
                <div
                  className="relative overflow-hidden rounded-[calc(1rem-1.5px)] p-1"
                  style={{
                    background: "#f2f2f5",
                    boxShadow: "inset 0 0 20px rgba(191,90,242,0.05)",
                  }}
                >
                  {/* Lanyard hole */}
                  <div className="flex justify-center pb-2 pt-3">
                    <div className="h-3 w-8 rounded-full border border-gray-300 bg-gray-100" />
                  </div>

                  {/* Photo */}
                  <div
                    className="mx-3 rounded-xl p-[1.5px]"
                    style={{ background: "linear-gradient(135deg, #0a84ff, #bf5af2)" }}
                  >
                    <div className="overflow-hidden rounded-[calc(0.75rem-1.5px)]">
                      <Image
                        src="/NiddhiSachdeo/images/profile.jpg"
                        width={300}
                        height={360}
                        alt="Niddhi Sachdeo"
                        priority
                        className="aspect-[4/5] w-full object-cover object-top"
                      />
                    </div>
                  </div>

                  {/* Info below photo */}
                  <div className="px-3 pb-4 pt-3 text-center">
                    <h3 className="text-sm font-bold tracking-tight text-gray-900 sm:text-base">
                      Niddhi Sachdeo
                    </h3>
                    <p className="mt-1 text-xs font-medium text-purple-600">
                      Software Developer
                    </p>
                    <div className="mx-auto mt-2 h-px w-10 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                    <p className="mt-1.5 text-[10px] text-gray-500">Pune, India</p>
                  </div>
                </div>
                </div>
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
              <TypingText
                text={TYPING_NAME}
                startDelay={0.4}
                className="text-gradient text-6xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
              />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 md:mt-8">
              <TypingRole startDelay={0.85} />
            </motion.div>

            <motion.div
              variants={columnStagger}
              initial="hidden"
              animate="visible"
              className="mt-6 space-y-3 text-base leading-relaxed text-muted md:text-lg"
            >
              {DESCRIPTION_LINES.map((line) => (
                <motion.p key={line} variants={fadeUp}>
                  {line}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              variants={columnStagger}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <motion.div variants={fadeUp}>
                <a
                  href="/NiddhiSachdeo/Niddhi_Sachdeo_Resume.pdf"
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
              </motion.div>
              <motion.div variants={fadeUp}>
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
              </motion.div>
            </motion.div>

            <motion.div
              variants={columnStagger}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-wrap items-center gap-3"
            >
              {socialLinks.map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  variants={fadeUp}
                  href={href}
                  {...(href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={label}
                  className={cn(
                    "glass glass-hover flex h-11 w-11 items-center justify-center rounded-full text-foreground/90",
                    "transition-colors hover:text-accent-cyan",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="glass mx-auto mt-auto w-full max-w-7xl rounded-2xl border border-glass-border px-4 py-3 md:px-6 md:py-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-xs font-medium text-muted sm:text-sm md:flex-nowrap md:justify-between md:text-left">
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
    </section>
  );
}
