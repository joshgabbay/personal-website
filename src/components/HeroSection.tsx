"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

const roles = ["Builder", "Developer", "Entrepreneur", "Student", "Creator"];

function TypewriterText() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayed === role) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setCurrentRole((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting ? role.slice(0, displayed.length - 1) : role.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentRole]);

  return (
    <span style={{ color: "#6366f1" }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{
          display: "inline-block",
          width: 3,
          height: "1em",
          background: "#6366f1",
          marginLeft: 4,
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ParticleField />

      {/* Radial gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 30%, #050505 80%)",
        }}
      />

      <motion.div
        style={{ opacity, scale, y, position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}
      >
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Josh Gabbay
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 24 }}
        >
          <p style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            letterSpacing: "0.05em",
            fontFamily: "var(--font-geist-mono), monospace",
          }}>
            <TypewriterText />
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          style={{
            marginTop: 32,
            color: "#71717a",
            fontSize: 18,
            maxWidth: 440,
            margin: "32px auto 0",
          }}
        >
          UCSB &apos;27 · Building things people actually use
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -120 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span style={{ color: "#52525b", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Scroll
            </span>
            <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, #52525b, transparent)" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
