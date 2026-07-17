"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { PersonalSide } from "@/components/sections/PersonalSide";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import SpotifyView from "@/components/views/SpotifyView";
import NetflixView from "@/components/views/NetflixView";
import MacOSView from "@/components/views/MacOSView";
import TerminalView from "@/components/views/TerminalView";

function DefaultView() {
  return (
    <ScrollStory>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <PersonalSide />
      <Education />
      <Contact />
    </ScrollStory>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <DefaultView />;

  if (theme === "spotify") return <SpotifyView />;
  if (theme === "netflix") return <NetflixView />;
  if (theme === "macos") return <MacOSView />;
  if (theme === "agentic") return <TerminalView />;

  return <DefaultView />;
}
