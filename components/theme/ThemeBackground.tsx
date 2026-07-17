"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { assetPath } from "@/lib/utils";

const MacOSBackground = dynamic(
  () => import("./backgrounds/MacOSBackground"),
  { ssr: false }
);
const SpotifyBackground = dynamic(
  () => import("./backgrounds/SpotifyBackground"),
  { ssr: false }
);
const NetflixBackground = dynamic(
  () => import("./backgrounds/NetflixBackground"),
  { ssr: false }
);

function CosmicBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${assetPath("/images/bg-starfield.jpg")}')` }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-[19] bg-background/75 backdrop-blur-[2px]"
        aria-hidden
      />
    </>
  );
}

export default function ThemeBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <CosmicBackground />;

  switch (theme) {
    case "macos":
      return <MacOSBackground />;
    case "spotify":
      return <SpotifyBackground />;
    case "agentic":
      return null;
    case "netflix":
      return <NetflixBackground />;
    default:
      return <CosmicBackground />;
  }
}
