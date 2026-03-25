"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const roles = ["Builder", "Developer", "Entrepreneur", "Student", "Creator"];

function TypewriterRole() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayed === role) {
      const t = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setCurrentRole((p) => (p + 1) % roles.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplayed(
        isDeleting ? role.slice(0, displayed.length - 1) : role.slice(0, displayed.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, currentRole]);

  return (
    <span style={{ color: "#6366f1" }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{
          display: "inline-block",
          width: 2,
          height: "0.85em",
          background: "#6366f1",
          marginLeft: 3,
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}

export default function SceneHero({ introComplete }: { introComplete: boolean }) {
  const { scrollY } = useScroll();
  const ghostY1 = useTransform(scrollY, [0, 800], [0, -120]);
  const ghostY2 = useTransform(scrollY, [0, 800], [0, -60]);
  const ghostOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Giant background ghost text — parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: ghostOpacity,
        }}
      >
        <motion.span style={{
          fontSize: "clamp(8rem, 22vw, 20rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          color: "transparent",
          WebkitTextStroke: "1px rgba(99, 102, 241, 0.08)",
          userSelect: "none",
          position: "absolute",
          top: "15%",
          left: "5%",
          y: ghostY1,
        }}>
          JOSH
        </motion.span>
        <motion.span style={{
          fontSize: "clamp(8rem, 22vw, 20rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          color: "transparent",
          WebkitTextStroke: "1px rgba(99, 102, 241, 0.06)",
          userSelect: "none",
          position: "absolute",
          bottom: "15%",
          right: "5%",
          y: ghostY2,
        }}>
          GABBAY
        </motion.span>
      </motion.div>

      {/* Center content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 24px",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={introComplete ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          <motion.div
            animate={introComplete ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6366f1",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
            }}
          />
        </motion.div>

        <h1
          style={{
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textAlign: "center",
            background: "linear-gradient(135deg, #e4e4e7 0%, #6366f1 50%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Josh Gabbay
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 20 }}
        >
          <p style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            fontFamily: "var(--font-geist-mono), monospace",
          }}>
            <TypewriterRole />
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={introComplete ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            marginTop: 24,
            color: "#52525b",
            fontSize: 14,
            letterSpacing: "0.05em",
          }}
        >
          UCSB &apos;29 · Building things that improve student life
        </motion.p>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <span style={{ color: "#3f3f46", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" as const }}>
            Scroll
          </span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #3f3f46, transparent)" }} />
        </motion.div>
      </motion.div>

      {/* Side accents */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={introComplete ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          left: 40,
          top: "20%",
          height: "60%",
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.15), transparent)",
          transformOrigin: "top",
        }}
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={introComplete ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          right: 40,
          top: "20%",
          height: "60%",
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.15), transparent)",
          transformOrigin: "top",
        }}
      />
    </div>
  );
}
