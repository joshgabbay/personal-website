"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SectionWipe() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} style={{ position: "relative", height: 60, width: "100%", overflow: "hidden" }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)",
          transformOrigin: "left",
        }}
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          left: "20%",
          right: "20%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
          transformOrigin: "center",
          filter: "blur(1px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#6366f1",
          boxShadow: "0 0 12px rgba(99, 102, 241, 0.6)",
        }}
      />
    </div>
  );
}
