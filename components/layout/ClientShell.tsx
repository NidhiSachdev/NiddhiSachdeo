"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import SmoothScroller from "@/components/layout/SmoothScroller";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FunFactButton from "@/components/ui/FunFactButton";
import GameButton from "@/components/ui/GameButton";
import IntroLoader from "@/components/ui/IntroLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import AIChatBot from "@/components/ui/AIChatBot";
import ThemeBackground from "@/components/theme/ThemeBackground";
import SpotifyNavbar from "@/components/views/SpotifyNavbar";
import NetflixNavbar from "@/components/views/NetflixNavbar";

export default function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { theme } = useTheme();
  useEffect(() => { setMounted(true); }, []);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (!mounted) return <main>{children}</main>;

  const isSpotify = theme === "spotify";
  const isNetflix = theme === "netflix";
  const isMacOS = theme === "macos";
  const isTerminal = theme === "agentic";

  if (isSpotify) {
    return (
      <>
        <ThemeBackground />
        <SpotifyNavbar />
        <main>{children}</main>
      </>
    );
  }

  if (isNetflix) {
    return (
      <>
        <ThemeBackground />
        <NetflixNavbar />
        <main>{children}</main>
      </>
    );
  }

  if (isMacOS) {
    return (
      <>
        <ThemeBackground />
        <main>{children}</main>
      </>
    );
  }

  if (isTerminal) {
    return <main>{children}</main>;
  }

  return (
    <>
      <ThemeBackground />
      <IntroLoader />
      <ScrollProgress />
      <SmoothScroller>
        <CustomCursor />
        <Navbar onAIClick={openChat} />
        <main>{children}</main>
        <Footer />
      </SmoothScroller>
      {!chatOpen && <GameButton />}
      {!chatOpen && <FunFactButton />}
      <AIChatBot open={chatOpen} onClose={closeChat} />
    </>
  );
}
