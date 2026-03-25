"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagneticElement from "./MagneticElement";

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function NavigationDots() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.3);

      // If near the bottom of the page, activate the last section
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
      if (atBottom) {
        setActive("contact");
      } else {
        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5) {
              setActive(section.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      {sections.map((section) => (
        <MagneticElement key={section.id} strength={0.4} radius={80}>
          <a
            href={`#${section.id}`}
            data-hover
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontFamily: "var(--font-geist-mono), monospace",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
                color: active === section.id ? "#d4d4d8" : "#52525b",
                opacity: active === section.id ? 1 : 0,
              }}
            >
              {section.label}
            </span>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 12, height: 12 }}>
              <div
                style={{
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  width: active === section.id ? 12 : 6,
                  height: active === section.id ? 12 : 6,
                  background: active === section.id ? "#6366f1" : "#52525b",
                }}
              />
              {active === section.id && (
                <motion.div
                  layoutId="nav-ring"
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
            </div>
          </a>
        </MagneticElement>
      ))}
    </motion.nav>
  );
}
