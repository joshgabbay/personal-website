"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, #6366f1, #a78bfa)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 100,
        boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
      }}
    />
  );
}
