"use client";

import { assetPath } from "@/lib/utils";

export default function MacOSBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${assetPath("/images/macos-wallpaper.jpg")}')`,
      }}
      aria-hidden
    />
  );
}
