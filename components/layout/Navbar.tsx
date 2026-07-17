"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "ai", label: "AI Chatbot" },
  { id: "contact", label: "Contact" },
] as const;

const MAGNET_STRENGTH = 0.42;

export type NavbarProps = {
  /** When provided, skips internal Intersection Observer and uses this id as active (e.g. `"about"`). */
  activeSection?: string;
  /** Called when the AI nav link is clicked instead of scrolling. */
  onAIClick?: () => void;
};

function MagneticNavLink({
  href,
  children,
  isActive,
  onNavigate,
  onClick,
}: {
  href: string;
  children: string;
  isActive: boolean;
  onNavigate?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);
  const springX = useSpring(shiftX, { stiffness: 260, damping: 22, mass: 0.18 });
  const springY = useSpring(shiftY, { stiffness: 260, damping: 22, mass: 0.18 });

  const reset = useCallback(() => {
    shiftX.set(0);
    shiftY.set(0);
  }, [shiftX, shiftY]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      shiftX.set((e.clientX - cx) * MAGNET_STRENGTH);
      shiftY.set((e.clientY - cy) * MAGNET_STRENGTH);
    },
    [shiftX, shiftY]
  );

  return (
    <motion.span style={{ x: springX, y: springY }} className="inline-flex">
      <motion.span
        className="relative inline-flex rounded-lg"
        animate={{
          boxShadow: isActive
            ? "0 0 22px rgba(10, 132, 255, 0.38), 0 0 48px rgba(191, 90, 242, 0.2)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <Link
          ref={ref}
          href={href}
          onClick={onClick ?? onNavigate}
          onMouseMove={onMouseMove}
          onMouseLeave={reset}
          className={cn(
            "group relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
            "text-muted hover:text-foreground",
            "rounded-lg hover:bg-glass-hover/80 hover:text-accent-cyan",
            "hover:shadow-[0_0_20px_rgba(10,132,255,0.28),0_0_40px_rgba(191,90,242,0.12)]",
            isActive && "text-foreground"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-x-2 -bottom-px h-px rounded-full opacity-0 transition-opacity duration-300",
              "bg-[linear-gradient(90deg,rgba(10,132,255,0.95),rgba(191,90,242,0.9),rgba(100,210,255,0.75))]",
              isActive ? "opacity-100" : "group-hover:opacity-80"
            )}
          />
          <span className={cn("relative z-[1]", isActive && "text-gradient")}>
            {children}
          </span>
        </Link>
      </motion.span>
    </motion.span>
  );
}

export default function Navbar({ activeSection: controlledActive, onAIClick }: NavbarProps) {
  const [internalActive, setInternalActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const isControlled = controlledActive !== undefined;
  const activeId = isControlled ? controlledActive : internalActive;

  const sectionIds = useMemo(() => NAV_SECTIONS.filter((s) => s.id !== "ai").map((s) => s.id), []);

  useEffect(() => {
    if (isControlled) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setInternalActive(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -48% 0px",
        threshold: [0.08, 0.15, 0.25, 0.35],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, [isControlled, sectionIds]);

  useEffect(() => {
    lastY.current = window.scrollY || document.documentElement.scrollTop;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const delta = y - lastY.current;

      setScrolled(y > 32);

      if (y < 72) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
      ticking.current = false;
    };

    const handle = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(onScroll);
      }
    };

    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden && !menuOpen ? -110 : 0,
          opacity: hidden && !menuOpen ? 0 : 1,
        }}
        transition={{
          y: { type: "spring", stiffness: 380, damping: 38, mass: 0.55 },
          opacity: { duration: 0.28 },
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8",
          "pointer-events-none"
        )}
      >
        <motion.div
          layout
          className={cn(
            "pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-[background,backdrop-filter,border-color,box-shadow] duration-500 md:px-6",
            scrolled
              ? "glass border border-glass-border shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_40px_rgba(10,132,255,0.06)]"
              : "border border-transparent bg-transparent"
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold tracking-tight"
              aria-label="Home"
            >
              <span className="text-xl font-bold text-gradient">NS</span>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_SECTIONS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.06 + i * 0.04,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <MagneticNavLink
                  href={item.id === "ai" ? "#" : `#${item.id}`}
                  isActive={activeId === item.id}
                  {...(item.id === "ai" && onAIClick
                    ? { onClick: (e: React.MouseEvent) => { e.preventDefault(); onAIClick(); } }
                    : {})}
                >
                  {item.label}
                </MagneticNavLink>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.4 }}
            >
              <ThemeSwitcher />
            </motion.div>

          <motion.button
            type="button"
            className={cn(
              "relative z-[60] flex h-11 w-11 flex-col items-center justify-center rounded-xl md:hidden",
              "glass glass-hover border border-glass-border text-foreground",
              "hover:shadow-[0_0_18px_rgba(10,132,255,0.35)]"
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <motion.span
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 0 : -5,
              }}
              className="block h-0.5 w-5 rounded-full bg-foreground"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="absolute block h-0.5 w-5 rounded-full bg-foreground"
            />
            <motion.span
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? 0 : 5,
              }}
              className="block h-0.5 w-5 rounded-full bg-foreground"
            />
          </motion.button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-background/75 backdrop-blur-md md:hidden"
              aria-hidden
              onClick={closeMenu}
            />
            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className={cn(
                "fixed right-0 top-0 z-50 flex h-full w-[min(88vw,320px)] flex-col gap-2 border-l border-glass-border",
                "glass px-6 pb-10 pt-24 md:hidden",
                "shadow-[-12px_0_48px_rgba(0,0,0,0.55)]"
              )}
              aria-label="Mobile primary"
            >
              {NAV_SECTIONS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <Link
                    href={item.id === "ai" ? "#" : `#${item.id}`}
                    onClick={(e) => {
                      if (item.id === "ai" && onAIClick) {
                        e.preventDefault();
                        closeMenu();
                        onAIClick();
                      } else {
                        closeMenu();
                      }
                    }}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-medium transition-all duration-300",
                      "text-muted hover:bg-glass-hover hover:text-foreground",
                      "hover:shadow-[0_0_22px_rgba(10,132,255,0.22)]",
                      activeId === item.id && "bg-glass-hover text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * NAV_SECTIONS.length, duration: 0.35 }}
                className="mt-4 border-t border-glass-border pt-4"
              >
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted">Theme</p>
                <ThemeSwitcher />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
