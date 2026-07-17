"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export const THEMES = [
  { id: "cosmic", label: "AI Driven", icon: "🌌" },
  { id: "macos", label: "macOS", icon: "🖥️" },
  { id: "spotify", label: "Spotify", icon: "🎵" },
  { id: "agentic", label: "Terminal", icon: "💻" },
  { id: "netflix", label: "Netflix", icon: "🎬" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="cosmic"
      enableSystem={false}
      themes={THEMES.map((t) => t.id)}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
