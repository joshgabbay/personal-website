"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  // Glow follows with more lag
  const glowX = useSpring(cursorX, { damping: 40, stiffness: 100 });
  const glowY = useSpring(cursorY, { damping: 40, stiffness: 100 });

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);
    const hover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button'], [data-hover]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      {/* Trailing glow */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: glowX,
          y: glowY,
          pointerEvents: "none",
          zIndex: 9997,
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Main dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          pointerEvents: "none",
          zIndex: 10000,
          mixBlendMode: "difference",
        }}
      >
        <motion.div
          animate={{
            width: isClicking ? 8 : isHovering ? 48 : 12,
            height: isClicking ? 8 : isHovering ? 48 : 12,
            opacity: isHovering ? 0.5 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          style={{
            borderRadius: "50%",
            background: "white",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 64 : 40,
            height: isHovering ? 64 : 40,
            opacity: isClicking ? 0.1 : 0.25,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>
    </>
  );
}
