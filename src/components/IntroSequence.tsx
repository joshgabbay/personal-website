"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [show, setShow] = useState(true);

  const name = "Josh Gabbay";

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => {
        setShow(false);
        onComplete();
      }, 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{ opacity: phase >= 4 ? 0 : 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, background: "#050505" }}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 4 ? { opacity: 0 } : phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#6366f1",
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)",
              position: "absolute", zIndex: 1,
            }}
          />

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase >= 4 ? { opacity: 0 } : phase >= 2 ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "min(400px, 60vw)", height: 1,
              background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
              position: "absolute", zIndex: 1,
            }}
          />

          {phase >= 3 && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                gap: 0,
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                zIndex: 2,
              }}
            >
              {name.split("").map((char, i) => {
                const seed = ((i + 1) * 7919) % 1000;
                const ox = ((seed % 100) / 100 - 0.5) * 40;
                const oy = (((seed * 3) % 100) / 100 - 0.5) * 80;
                return (
                  <motion.span
                    key={i}
                    initial={{
                      opacity: 0, y: oy, x: ox,
                      filter: "blur(12px)", scale: 0.3,
                    }}
                    animate={{
                      opacity: 1, y: 0, x: 0,
                      filter: "blur(0px)", scale: 1,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ display: "inline-block" }}
                    className="gradient-text"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
