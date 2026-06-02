"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9998] h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #0a84ff, #bf5af2, #64d2ff)",
      }}
    />
  );
}
