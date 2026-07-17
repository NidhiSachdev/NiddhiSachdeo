"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const easeCurve = [0.22, 1, 0.36, 1] as const;

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
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    ),
  },
] as const;

const contactCards = [
  {
    icon: "📧",
    label: "Email",
    value: "nidhisachdeo2000@gmail.com",
    href: "mailto:nidhisachdeo2000@gmail.com",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91 7045542080",
    href: "tel:+917045542080",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: null,
  },
] as const;

const inputClass = cn(
  "w-full rounded-xl border border-glass-border bg-glass/60 p-4 text-foreground outline-none backdrop-blur-md",
  "transition-colors duration-200 placeholder:text-muted",
  "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25"
);

export function Contact() {
  return (
    <section id="contact" className="section-padding relative overflow-hidden floating-section-inset">
      <div
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(244,63,94,0.45) 0%, transparent 68%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-24 -z-10 h-80 w-80 rounded-full opacity-[0.18] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(251,113,133,0.45) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-5xl text-center"
        initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeCurve }}
      >
        <motion.div
          className="mb-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <motion.span
            className="h-px origin-left bg-rose-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeCurve }}
            style={{ width: "2rem" }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">
            GET IN TOUCH
          </span>
          <motion.span
            className="h-px origin-right bg-rose-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: easeCurve }}
            style={{ width: "2rem" }}
          />
        </motion.div>

        <motion.h2
          className="section-heading mx-auto mb-4 max-w-4xl text-foreground"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easeCurve, delay: 0.08 }}
        >
          <span className="block">Let&apos;s Build</span>
          <span className="block">
            <span className="text-gradient-rose">Something Amazing</span>
          </span>
        </motion.h2>

        <motion.p
          className="body-text mx-auto mb-3 max-w-xl font-medium text-rose-400"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: easeCurve, delay: 0.1 }}
        >
          Let&apos;s work together!
        </motion.p>

        <motion.p
          className="body-text mx-auto mb-10 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeCurve, delay: 0.12 }}
        >
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
        </motion.p>

        <motion.div
          className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: easeCurve, delay: 0.13 }}
        >
          {contactCards.map((card, i) => {
            const inner = (
              <>
                <span className="mb-2 block text-2xl" aria-hidden>
                  {card.icon}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {card.label}
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {card.value}
                </span>
              </>
            );

            const cardClass = cn(
              "glow-border rounded-xl border border-glass-border p-4 text-left sm:rounded-2xl sm:p-5",
              "glass glass-hover shadow-[0_16px_48px_rgba(244,63,94,0.06)]",
              card.href && "transition-colors hover:border-rose-400/35"
            );

            return card.href ? (
              <motion.a
                key={card.label}
                href={card.href}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.14 + i * 0.06 }}
                whileHover={{ y: -3 }}
                className={cn(cardClass, "block")}
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.14 + i * 0.06 }}
                className={cardClass}
              >
                {inner}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className={cn(
            "glow-border mx-auto mb-10 max-w-xl rounded-2xl border border-glass-border p-5 text-left sm:mb-14 sm:rounded-3xl sm:p-8",
            "glass glass-hover shadow-[0_24px_80px_rgba(244,63,94,0.08)]"
          )}
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: easeCurve, delay: 0.14 }}
        >
          <form
            className="flex flex-col gap-4 sm:gap-5"
            action="https://api.web3forms.com/submit"
            method="POST"
          >
            <input
              type="hidden"
              name="access_key"
              value="75a0dd3f-199a-4b6b-94f2-bc3731404a88"
            />

            <label className="sr-only" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              className={inputClass}
            />

            <label className="sr-only" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className={inputClass}
            />

            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              placeholder="Tell me about your project..."
              className={cn(inputClass, "min-h-[140px] resize-y")}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className={cn(
                "relative overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold text-white",
                "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-[length:180%_100%]",
                "shadow-[0_12px_40px_rgba(244,63,94,0.35),0_0_60px_rgba(236,72,153,0.2)]",
                "transition-[background-position,box-shadow] duration-500 hover:bg-[position:100%_0]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
              )}
            >
              <span className="relative z-[1]">Send Message</span>
              <motion.span
                className="pointer-events-none absolute inset-0 opacity-40 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.55), transparent 55%)",
                }}
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeCurve, delay: 0.18 }}
        >
          <p className="mb-4 text-sm font-medium text-muted">Or reach out directly</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.22 + i * 0.06 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "glass glass-hover flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border text-foreground",
                  "transition-shadow duration-300",
                  "hover:border-rose-400/35 hover:text-rose-400 hover:shadow-[0_0_24px_rgba(244,63,94,0.35)]"
                )}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
