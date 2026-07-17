"use client";

import { motion } from "framer-motion";

export default function SpotifyBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: "#121212" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed -z-[18] rounded-full blur-[120px] opacity-[0.18]"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: "600px",
          maxHeight: "600px",
          top: "10%",
          left: "5%",
          background: "radial-gradient(circle, #1ed760 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed -z-[18] rounded-full blur-[130px] opacity-[0.12]"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "550px",
          maxHeight: "550px",
          bottom: "5%",
          right: "10%",
          background: "radial-gradient(circle, #1db954 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -10, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed -z-[18] rounded-full blur-[100px] opacity-[0.08]"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: "400px",
          maxHeight: "400px",
          top: "50%",
          right: "30%",
          background: "radial-gradient(circle, #535353 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 15, -10, 0],
          y: [0, -15, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </>
  );
}
