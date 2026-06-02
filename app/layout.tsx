import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/layout/SmoothScroller";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FunFactButton from "@/components/ui/FunFactButton";
import GameButton from "@/components/ui/GameButton";
import IntroLoader from "@/components/ui/IntroLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata: Metadata = {
  title: "Niddhi Sachdeo | Software Developer",
  description:
    "Software Developer specializing in Agentic AI, scalable app development, and AWS cloud deployment. Building intelligent systems that automate workflows.",
  keywords: [
    "Niddhi Sachdeo",
    "Software Developer",
    "Agentic AI",
    "AWS",
    "Java",
    "Python",
    "Cloud Computing",
    "Pune",
  ],
  authors: [{ name: "Niddhi Sachdeo" }],
  openGraph: {
    title: "Niddhi Sachdeo | Software Developer",
    description:
      "Software Developer specializing in Agentic AI and intelligent automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {/* Fixed background image layer */}
        <div
          className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/NiddhiSachdeo/images/bg-starfield.jpg')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 -z-[19] bg-background/75 backdrop-blur-[2px]"
          aria-hidden
        />

        <IntroLoader />
        <ScrollProgress />
        <SmoothScroller>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroller>
        <GameButton />
        <FunFactButton />
      </body>
    </html>
  );
}
