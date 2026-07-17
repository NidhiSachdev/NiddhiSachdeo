"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { THEMES, type ThemeId } from "./ThemeProvider";

function ThemeLogo({ id }: { id: ThemeId }) {
  switch (id) {
    case "cosmic":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <circle cx="12" cy="12" r="4" fill="#bf5af2" />
          <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" stroke="#0a84ff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" stroke="url(#ai-grad)" strokeWidth="1" strokeDasharray="2 3" />
          <defs><linearGradient id="ai-grad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#0a84ff" /><stop offset="1" stopColor="#bf5af2" /></linearGradient></defs>
        </svg>
      );
    case "macos":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.31-1.32-3.15-2.55C4.22 16.86 3 12.87 4.74 10.18c.87-1.33 2.41-2.17 4.06-2.19 1.29-.02 2.51.87 3.29.87.79 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.27-2.15 3.78.03 3 2.63 4 2.65 4.01-.03.07-.41 1.43-1.33 2.78zM15.42 3.5c.74-.9 1.25-2.14 1.11-3.38-1.07.04-2.37.72-3.14 1.62-.69.8-1.29 2.08-1.13 3.3 1.2.09 2.42-.61 3.16-1.54z" fill="#f5f5f7" />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <circle cx="12" cy="12" r="10" fill="#1db954" />
          <path d="M16.5 8.5c-2.7-1.2-7-.8-7-.8s-.3 0-.3.3.3.3.3.3 3.8-.3 6.3.8c.2.1.4 0 .5-.2s0-.4-.2-.5zm-.5 2.3c-2.3-1-6-.7-6-.7s-.2 0-.2.2.2.3.2.3 3.3-.3 5.5.7c.2.1.3 0 .4-.2.1-.1 0-.3-.1-.3zm-.7 2.2c-2-.8-5-.5-5-.5s-.2 0-.2.2.2.2.2.2 2.7-.2 4.6.5c.2.1.3 0 .3-.1.1-.2 0-.3-.1-.3z" fill="white" />
        </svg>
      );
    case "agentic":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" stroke="#05ce91" strokeWidth="1.5" />
          <path d="M6 9l3 3-3 3" stroke="#05ce91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15h5" stroke="#ff9d00" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "netflix":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M5 2h4.5l5 14.5V2H19v20h-4.5l-5-14.5V22H5V2z" fill="#e50914" />
        </svg>
      );
  }
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSelect = useCallback(
    (id: string) => {
      setTheme(id);
      setOpen(false);
    },
    [setTheme]
  );

  if (!mounted) return null;

  return (
    <div ref={panelRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          "glass border border-glass-border text-foreground",
          "transition-shadow duration-200 hover:shadow-[0_0_18px_var(--color-glow-blue)]"
        )}
        aria-label="Switch theme"
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4.5 w-4.5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" strokeLinecap="round" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute right-0 top-full mt-2 z-[100] w-48 overflow-hidden rounded-xl",
              "glass border border-glass-border shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
              "backdrop-blur-xl"
            )}
          >
            <div className="p-2">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
                Theme
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
                    theme === t.id
                      ? "bg-glass-hover text-foreground"
                      : "text-muted hover:bg-glass-hover hover:text-foreground"
                  )}
                >
                  <span className="shrink-0">
                    <ThemeLogo id={t.id} />
                  </span>
                  <span>{t.label}</span>
                  {theme === t.id && (
                    <motion.span
                      layoutId="theme-check"
                      className="ml-1 text-accent-blue"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
