import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/NiddhiSachdeo" : "";

const nextConfig: NextConfig = {
  ...(isProd && { output: "export", basePath }),
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
