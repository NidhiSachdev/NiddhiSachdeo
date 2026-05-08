"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/NidhiSachdev",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/niddhisachdeo465a53187",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:nidhisachdeo2000@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden className="h-5 w-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative mt-auto w-full px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      {/* Gradient divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-12 h-px max-w-4xl origin-center bg-[linear-gradient(90deg,transparent,rgba(10,132,255,0.95),rgba(191,90,242,0.95),transparent)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className="glass glass-hover mx-auto max-w-4xl rounded-2xl border border-glass-border px-6 py-10 shadow-[0_0_60px_rgba(10,132,255,0.06)]"
      >
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="space-y-3">
            <p className="text-sm text-muted">
              © {year} Niddhi Sachdeo. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "glass glass-hover flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border text-foreground",
                  "transition-shadow duration-300",
                  "hover:border-accent-blue/35 hover:text-accent-cyan hover:shadow-[0_0_24px_rgba(10,132,255,0.35),0_0_48px_rgba(191,90,242,0.15)]"
                )}
              >
                {item.icon}
              </motion.a>
            ))}

            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "glass glass-hover flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-medium text-foreground",
                "transition-shadow duration-300",
                "hover:border-accent-purple/35 hover:shadow-[0_0_22px_rgba(191,90,242,0.35),0_0_40px_rgba(10,132,255,0.12)]"
              )}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Top
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
