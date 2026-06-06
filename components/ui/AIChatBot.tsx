"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, getExperienceYears } from "@/lib/utils";
import emailjs from "@emailjs/browser";

type Message = { role: "bot" | "user"; text: string };

const GREETING: Message = {
  role: "bot",
  text: "Hey! 👋 I'm NiddAI — Niddhi's personal AI assistant. Ask me anything about her — or pick a question below!",
};

const SUGGESTED_QUESTIONS = [
  "What's Niddhi's superpower?",
  "What tech does she use?",
  "Tell me about her projects",
  "What's her experience?",
  "Is she available for work?",
  "What's her coffee order?",
];

// Priority-ordered: earlier entries win. Blockers (out-of-syllabus) come first,
// then intent-based patterns, then keyword-based ones.
const QA_MAP: { pattern: RegExp; exclude?: RegExp; answers: string[] }[] = [
  // --- Blockers: catch inappropriate / off-topic questions first ---
  {
    pattern: /date\b|go out|dating|relationship|marry|girlfriend|boyfriend|crush|love\b|flirt|kiss|hug/i,
    answers: [
      "Out of syllabus! 📚 Please try reaching out to Niddhi directly — she'd be happy to chat! 😊",
      "Ha! That's out of syllabus for me! 📚 But you can always reach out to Niddhi directly 😊",
    ],
  },
  {
    pattern: /age|old|born|birthday/i,
    answers: [
      "Out of syllabus! 📚 Please try reaching out to Niddhi directly — she'd be happy to chat! 😊",
    ],
  },
  {
    pattern: /salary|pay\b|money|earn|compensation|ctc|package/i,
    answers: [
      "Out of syllabus! 📚 Please try reaching out to Niddhi directly for that conversation! 😊",
    ],
  },
  {
    pattern: /married|husband|wife|single|taken|family|parent|father|mother|brother|sister/i,
    answers: [
      "Out of syllabus! 📚 That's personal — feel free to reach out to Niddhi directly! 😊",
    ],
  },

  // --- Intent-based: catch "help me", "work with me" before keyword matches ---
  {
    pattern: /help me|help us|work (with|for) (me|us|my)|assist me|can she.*help|will she.*help|hire her|collab/i,
    answers: [
      "Absolutely! She's open to collaboration and exciting opportunities. Whether it's AI, cloud, or full-stack — reach out via the Contact section or email her at nidhisachdeo2000@gmail.com 📧",
      "Yes! She'd love to help. Drop her a message through the Contact section below and let's make it happen! 🚀",
    ],
  },

  // --- Greetings (before keywords that might conflict) ---
  {
    pattern: /^(hello|hi|hey|howdy|yo|sup|hola|namaste)\b/i,
    answers: [
      "Hey there! 👋 Nice to meet you. Want to know something cool about Niddhi? Just ask!",
      "Hello! Welcome to Niddhi's corner of the internet. What would you like to know about her?",
    ],
  },

  // --- Thank you / bye ---
  {
    pattern: /thank|thanks|thx|appreciate/i,
    answers: [
      "You're welcome! 😊 Feel free to ask anything else about Niddhi. I'm always here!",
      "Happy to help! If you want to know more, just ask away! ✨",
    ],
  },
  {
    pattern: /bye|goodbye|see you|later\b|cya/i,
    answers: [
      "Bye! 👋 Thanks for stopping by Niddhi's portfolio. Don't forget to check out the Contact section if you want to connect!",
      "See you later! Hope you enjoyed learning about Niddhi. Come back anytime! ✨",
    ],
  },

  // --- Identity ---
  {
    pattern: /who are you|what are you|are you ai|are you real|are you.?bot/i,
    answers: [
      "I'm NiddAI — Niddhi's personal AI assistant built right into her portfolio! I know everything about her skills, projects, and experience. Think of me as her digital hype-bot 🤖✨",
    ],
  },

  // --- Contact info ---
  {
    pattern: /contact|email|phone|reach\b|connect|linkedin|github|number|call her|talk to her|get in touch|how.*(reach|contact|message)/i,
    answers: [
      "You can reach her at: 📧 nidhisachdeo2000@gmail.com | 📞 +91 7045542080 | GitHub: github.com/NidhiSachdev | LinkedIn: linkedin.com/in/niddhisachdeo465a53187. Or just scroll down to the Contact section!",
    ],
  },

  // --- Portfolio knowledge ---
  {
    pattern: /superpower|super power|special|best at/i,
    answers: [
      "Turning caffeine into production-ready code at 2 AM. Seriously though — she has a knack for breaking down complex problems into elegant, scalable solutions. She built DORA, an AI agent that cut order resolution time by ~40%!",
      "Debugging code by just *staring* at it. Her pattern-recognition game is elite — she's written 100+ pattern-matching rules for automated error classification.",
    ],
  },
  {
    pattern: /tech|stack|language|tools?\b|what.*(use|work with)/i,
    answers: [
      "Java & Python are her daily drivers. She's deep into Agentic AI, AWS (EC2, S3, Lambda), Docker, Kubernetes, Linux, and has solid experience with Angular, Next.js, and TypeScript. Database-wise: PostgreSQL, Couchbase, MongoDB, and SQL/PL-SQL.",
      "Think: Java, Python, AWS, Docker, K8s, Angular, Next.js, MongoDB, PostgreSQL — plus she builds AI agents that automate entire workflows. Full-stack with a cloud twist!",
    ],
  },
  {
    pattern: /her project|her work|what.*(she|niddhi).*(built|made|created|develop)|tell.*(project|portfolio)|show.*project|dora\b|moodmiles|s4|spine|intrusion|bus ticket|restaurant manage/i,
    answers: [
      "She's got some amazing ones! 🚀 **DORA** — an Agentic AI system for automated order resolution with 100+ pattern-matching rules. **MoodMiles** — an AI travel app that creates mood-based itineraries. **S4 Spine Physiotherapy** — a healthcare web app with 40+ treatments and interactive body maps. Plus academic projects like an Intrusion Detection System using ML and a Smart Bus Ticketing app!",
      "Highlights: DORA (Agentic AI for ops automation at Amdocs), MoodMiles (AI-powered trip planner), and S4 Spine Physiotherapy (full-stack healthcare app with 40+ treatments, live on Vercel). She's also built ML-based intrusion detection and smart bus tracking systems during her B.E.",
    ],
  },
  {
    pattern: /experience|work history|amdocs|how.*years|her (job|role)|career/i,
    answers: [
      `${getExperienceYears()}+ years as a Software Developer at **Amdocs** in Pune (since Sept 2021). She built DORA — an Agentic AI system that cut resolution time by ~40%. She's resolved 100+ production issues with <2hr SLA, delivered 10+ client features, and automated 5+ workflows saving ~8 hours/week. Her career milestones: AWS certified in 2022, database & cloud ops specialist by 2023, IIT Roorkee certification in 2024, and built DORA in 2025.`,
      `She's been at Amdocs for ${getExperienceYears()}+ years, working on everything from serverless AWS infrastructure to AI-powered ops automation. 99%+ uptime maintained, multiple client accounts handled, and she earned a Certificate of Recognition. Not your average 9-to-5!`,
    ],
  },
  {
    pattern: /education|degree|study|college|university|vesit|iit|roorkee|cgpa/i,
    answers: [
      "B.E. in Computer Science & Engineering from **VESIT** (Mumbai, 2017–2021) with a CGPA of 7.45. Currently pursuing an Advanced Certification in **Cloud Computing & DevOps from IIT Roorkee** (Dec 2024 – Dec 2025). She never stops learning!",
    ],
  },
  {
    pattern: /certif|aws|cloud practitioner/i,
    answers: [
      "She's got quite the collection! ☁️ AWS Cloud Practitioner, Cloud Computing & DevOps from IIT Roorkee, Agentic Development, Full Stack Development, Certificate of Recognition from Amdocs, Android Programming, Core Java, AICPTR C/C++, and an Accenture Virtual Internship. She believes in continuous learning!",
    ],
  },
  {
    pattern: /skill|what.*know|expertise|capable/i,
    answers: [
      "**Technical:** Java, Python, C/C++, PL/SQL, Agentic AI, AI Automation, Machine Learning, AWS, Linux, Docker & K8s, Shell Scripting, SQL, MongoDB, Angular. **Personal:** Problem Solving, Critical Thinking, Analytical, Detail Oriented, Time Management, Work Ethics, Decision Making, and Client Handling. She's the full package!",
    ],
  },
  {
    pattern: /speciali[sz]|focus|domain/i,
    answers: [
      "Six core areas: Agentic AI Solutions, AI-Driven Automation, AWS Cloud & DevOps, Full Stack Development, Database Engineering (PostgreSQL, Couchbase, MongoDB + Kibana), and Application Support (troubleshooting, debugging, monitoring & client interactions).",
    ],
  },
  {
    pattern: /fun fact|interesting fact|something (fun|cool|interesting)|random fact/i,
    answers: [
      "She once automated a manual process so well that the team thought the system was haunted — tickets were resolving themselves! 👻",
      "She names her terminal sessions. The current favorite? 'deploy-and-pray'. (Just kidding, her deploys are solid — 99%+ uptime!)",
      "Outside of code, she's into Dance 💃, Art & Craft 🎨, Music 🎵, and Web Designing. A true creative thinker with a builder mindset!",
    ],
  },
  {
    pattern: /motivat|what drives|passion(?:ate)?(?:\s+about)|what inspires|why.*(code|dev|build|work|tech|software)/i,
    answers: [
      "Building things that make people's lives easier. She genuinely lights up when an automation saves someone hours of manual work. The intersection of AI and real-world impact is her sweet spot.",
      "She's described as a Creative Thinker, Curious Explorer, and Passionate Learner. What drives her? Building intelligent systems that automate workflows, reduce manual effort, and accelerate business processes.",
    ],
  },
  {
    pattern: /available|hire\b|freelance|open to|opportunities|looking for/i,
    answers: [
      "Yes! She's open to exciting opportunities — especially in AI, cloud architecture, or anything that pushes boundaries. Hit that Contact section or drop her an email at nidhisachdeo2000@gmail.com 📧",
      "Absolutely! Scroll down to the Contact section or reach out on LinkedIn/GitHub. She'd love to hear about your project!",
    ],
  },
  {
    pattern: /coffee|chai|tea\b|drink|beverage|latte/i,
    answers: [
      "A sweet iced coffee latte — no negotiations! ☕ She believes the best code is written with one in hand.",
      "Sweet iced coffee latte, always. It's basically her debugging fuel. The sweeter, the better! 🧊☕",
    ],
  },
  {
    pattern: /tell me about (her|niddhi)|who is (she|niddhi)|describe (her|niddhi)|about her|know (her|niddhi)|what.*(she|niddhi) like/i,
    answers: [
      "Oh, where do I start? ✨ She's a coffee-obsessed (sweet iced latte, always ☕), dance-loving 💃, art-crafting 🎨 software developer who codes by day and vibes to music by night 🎵. She's curious, fun-loving, and the kind of person who names her terminal sessions. Part engineer, part creative soul — 100% awesome!",
      "Picture this: a Software Developer who runs on sweet iced coffee lattes ☕, unwinds with Dance 💃 and Art & Craft 🎨, and genuinely gets excited about automating things. She's a Creative Thinker, Curious Explorer, and Passionate Learner who built an AI agent (DORA) that basically resolves tickets on its own. Oh, and she loves Music 🎵 — the perfect debugging soundtrack!",
      "Niddhi in a nutshell? She's the girl who'll automate your entire workflow before lunch, grab a sweet iced coffee latte ☕, then spend the evening doing Dance 💃 or Art & Craft 🎨. Fun-loving, detail-oriented, and always learning — currently leveling up with IIT Roorkee's Cloud Computing program. She's basically a creative nerd with great taste in coffee! 🚀",
    ],
  },
  {
    pattern: /hobbies|free time|outside work|interests?\b|beyond code|for fun\b/i,
    answers: [
      "When she's not coding, she's into Dance 💃, Art & Craft 🎨, Music 🎵, and Web Designing 🌐. She's a Creative Thinker, Fun-Loving, Curious Explorer, Passionate Learner with a Builder Mindset and a Team Player attitude!",
    ],
  },
  {
    pattern: /location|where.*(live|based|stay|from)|city|pune|mumbai|india/i,
    answers: [
      "She's based in **Pune, Maharashtra, India** 📍 — the perfect blend of tech culture and great weather (mostly!).",
    ],
  },
];

const FALLBACK_ANSWERS = [
  "Out of syllabus! 📚 Please try reaching out to Niddhi directly — she'd love to answer that herself! 😊",
  "That's out of syllabus for me! 📚 Drop Niddhi a message via the Contact section and she'll get back to you! 😊",
  "Hmm, that one's out of syllabus! 📚 But Niddhi would be happy to chat — reach out to her directly! 😊",
];

const FOLLOWUP_PATTERN = /^(tell me more|more|go on|what else|anything else|elaborate|explain|details|and\??)\s*[.?!]*$/i;

function getAnswer(question: string, history: Message[]): string {
  for (const entry of QA_MAP) {
    if (entry.pattern.test(question)) {
      return entry.answers[Math.floor(Math.random() * entry.answers.length)];
    }
  }

  // Only use context for obvious follow-ups like "tell me more" / "what else"
  if (FOLLOWUP_PATTERN.test(question.trim()) && history.length >= 2) {
    const recentBotMsg = [...history].reverse().find((m) => m.role === "bot");
    if (recentBotMsg) {
      for (const entry of QA_MAP) {
        if (entry.pattern.test(recentBotMsg.text)) {
          const other = entry.answers.filter((a) => a !== recentBotMsg.text);
          if (other.length > 0) {
            return other[Math.floor(Math.random() * other.length)];
          }
          return entry.answers[Math.floor(Math.random() * entry.answers.length)];
        }
      }
    }
  }

  return FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-purple-400"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function AIChatBot({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSentRef = useRef(false);

  const sendChatTranscript = useCallback((msgs: Message[]) => {
    const hasUserMsg = msgs.some((m) => m.role === "user");
    if (!hasUserMsg || hasSentRef.current) return;
    hasSentRef.current = true;

    const transcript = msgs
      .map((m) => `${m.role === "user" ? "Visitor" : "NiddAI"}: ${m.text}`)
      .join("\n\n");

    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
      { conversation: transcript, timestamp: time },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    ).catch(() => {});
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (open) {
      hasSentRef.current = false;
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(scrollToBottom, [messages, typing, scrollToBottom]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      setInput("");
      const updatedHistory: Message[] = [...messages, { role: "user", text: trimmed }];
      setMessages(updatedHistory);
      setTyping(true);

      const delay = 600 + Math.random() * 800;
      setTimeout(() => {
        const answer = getAnswer(trimmed, updatedHistory);
        setMessages((prev) => [...prev, { role: "bot", text: answer }]);
        setTyping(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }, delay);
    },
    [typing]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend(input);
      }
    },
    [input, handleSend]
  );

  const handleClose = useCallback(() => {
    sendChatTranscript(messages);
    onClose();
  }, [messages, sendChatTranscript, onClose]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-hidden
          />

          <motion.div
            className={cn(
              "fixed z-[91] flex flex-col overflow-hidden rounded-2xl",
              "shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_80px_rgba(139,92,246,0.15),0_0_120px_rgba(59,130,246,0.1)]",
              "bottom-4 right-4 h-[min(85vh,580px)] w-[min(92vw,400px)]",
              "sm:bottom-6 sm:right-6"
            )}
            onWheel={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(165deg, #0f0a1e 0%, #0a0e1a 40%, #0d0518 100%)",
            }}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.6 }}
          >
            {/* Ambient glow effects */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-[60px]"
              style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-20 blur-[50px]"
              style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
            />

            {/* Header */}
            <div
              className="relative flex items-center gap-3 px-5 py-4"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(236,72,153,0.08) 100%)",
                borderBottom: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  <span className="text-xs font-bold text-white tracking-tight">NA</span>
                </div>
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f0a1e] bg-emerald-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">NiddAI <span className="font-normal text-purple-300/70">— The AI Assistant</span></p>
                <p className="text-xs text-purple-300/70">Always online</p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-purple-300/60 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-scroll overscroll-contain px-4 py-4 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(139,92,246,0.3) transparent",
              }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-md bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
                        : "rounded-bl-md text-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
                    )}
                    style={
                      msg.role === "bot"
                        ? {
                            background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)",
                            border: "1px solid rgba(139,92,246,0.15)",
                          }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="rounded-2xl rounded-bl-md"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}
                  >
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div
                className="flex flex-wrap gap-2 px-4 py-3"
                style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
              >
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={typing}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium text-purple-300/80",
                      "transition-all",
                      "hover:text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]",
                      "disabled:opacity-40"
                    )}
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="px-4 py-3"
              style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))",
                  border: "1px solid rgba(139,92,246,0.18)",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Niddhi..."
                  disabled={typing}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-purple-300/40 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || typing}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    "bg-gradient-to-r from-violet-600 to-blue-600 text-white",
                    "transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
