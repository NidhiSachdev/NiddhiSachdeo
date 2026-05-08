"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NiddhiCharacter, {
  type CharacterState,
} from "@/components/ui/NiddhiCharacter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionDef = {
  id: string;
  dialogue: string;
  shortDialogue: string;
};

const SECTION_DEFS: SectionDef[] = [
  {
    id: "hero",
    dialogue:
      "Hi! I am Niddhi. Welcome to my professional and personal walkthrough.",
    shortDialogue: "Hi! I'm Niddhi!",
  },
  {
    id: "about",
    dialogue: "Let's know about me...",
    shortDialogue: "About me!",
  },
  {
    id: "experience",
    dialogue: "This is what Niddhi works for...",
    shortDialogue: "My journey!",
  },
  {
    id: "projects",
    dialogue: "This is what Niddhi is building...",
    shortDialogue: "My projects!",
  },
  {
    id: "skills",
    dialogue: "These are the tools I work with.",
    shortDialogue: "My skills!",
  },
  {
    id: "personal",
    dialogue: "There's more to me than just code...",
    shortDialogue: "The real me!",
  },
  {
    id: "education",
    dialogue: "My academic journey and certifications.",
    shortDialogue: "Education!",
  },
  {
    id: "contact",
    dialogue:
      "Thanks for walking through my journey. Let's build something amazing together.",
    shortDialogue: "Let's connect!",
  },
];

const CHAR_Y_TOP = 45;
const CHAR_Y_BOTTOM = 65;

export default function ScrollStory({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charYRef = useRef({ value: CHAR_Y_TOP });
  const charElRef = useRef<HTMLDivElement>(null);

  const [charState, setCharState] = useState<CharacterState>("intro");
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentDef = SECTION_DEFS[activeSectionIdx] ?? SECTION_DEFS[0];

  const flashBubble = useCallback((duration = 4500) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setShowBubble(true);
    bubbleTimerRef.current = setTimeout(
      () => setShowBubble(false),
      duration,
    );
  }, []);

  // --- Intro sequence ---
  useEffect(() => {
    const t = setTimeout(() => {
      setCharState("talking");
      flashBubble(4000);
    }, 1000);
    return () => clearTimeout(t);
  }, [flashBubble]);

  // --- GSAP ScrollTrigger setup ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const sectionIds = SECTION_DEFS.map((s) => s.id);
      const totalSections = sectionIds.length;

      sectionIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;

        const yStop =
          CHAR_Y_TOP +
          ((CHAR_Y_BOTTOM - CHAR_Y_TOP) * idx) / (totalSections - 1);

        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            setActiveSectionIdx(idx);
            setCharState("talking");
            flashBubble(4500);
            gsap.to(charYRef.current, {
              value: yStop,
              duration: 0.6,
              ease: "power2.out",
              onUpdate: () => {
                if (charElRef.current) {
                  charElRef.current.style.top = `${charYRef.current.value}%`;
                }
              },
            });
          },
          onEnterBack: () => {
            setActiveSectionIdx(idx);
            setCharState("talking");
            flashBubble(4500);
            gsap.to(charYRef.current, {
              value: yStop,
              duration: 0.6,
              ease: "power2.out",
              onUpdate: () => {
                if (charElRef.current) {
                  charElRef.current.style.top = `${charYRef.current.value}%`;
                }
              },
            });
          },
          onLeave: () => {
            setCharState("walking");
            setShowBubble(false);
          },
          onLeaveBack: () => {
            setCharState("walking");
            setShowBubble(false);
          },
        });
      });

      // Scrub-based Y interpolation for smooth walking between sections
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          const yVal =
            CHAR_Y_TOP + (CHAR_Y_BOTTOM - CHAR_Y_TOP) * progress;
          charYRef.current.value = yVal;
          if (charElRef.current) {
            charElRef.current.style.top = `${yVal}%`;
          }
        },
      });

      // Parallax orbs — drift at different speeds for depth
      const orbs = containerRef.current?.querySelectorAll(".parallax-orb");
      if (orbs) {
        orbs.forEach((orb, i) => {
          const speed = 80 + i * 40;
          gsap.to(orb, {
            y: -speed,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [flashBubble]);

  return (
    <div ref={containerRef} className="relative">
      {/* Cinematic parallax background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="parallax-orb absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(10,132,255,0.5), transparent 70%)" }}
        />
        <div
          className="parallax-orb absolute right-[15%] top-[50%] h-[350px] w-[350px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(191,90,242,0.5), transparent 70%)" }}
        />
        <div
          className="parallax-orb absolute left-[40%] top-[80%] h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(100,210,255,0.4), transparent 70%)" }}
        />
      </div>

      {children}
    </div>
  );
}
