"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import SmoothScroller from "@/components/layout/SmoothScroller";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FunFactButton from "@/components/ui/FunFactButton";
import GameButton from "@/components/ui/GameButton";
import IntroLoader from "@/components/ui/IntroLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import AIChatBot from "@/components/ui/AIChatBot";

export default function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (!mounted) return null;

  return (
    <>
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
