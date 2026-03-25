"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/joshgabbay",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/joshgabbay",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:josh@ortegaeats.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        {/* Beacon pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={titleInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}
        >
          <div style={{ position: "relative" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#6366f1" }} />
            <div style={{
              position: "absolute", inset: 0, width: 12, height: 12, borderRadius: "50%",
              background: "#6366f1", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            }} />
            <div style={{
              position: "absolute", inset: -16, borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.1)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }} />
          </div>
        </motion.div>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.3em", textTransform: "uppercase", color: "#52525b", display: "block", marginBottom: 16 }}>
            // Contact
          </span>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 24 }}>
            Let&apos;s <span className="gradient-text">connect</span>
          </h2>
          <p style={{ color: "#a1a1aa", fontSize: 18, maxWidth: 400, margin: "0 auto 64px" }}>
            Building something cool? Want to collaborate? Just want to say hi?
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              data-hover
              className="contact-link"
            >
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          style={{ marginTop: 128, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p style={{ color: "#52525b", fontSize: 13, fontFamily: "var(--font-geist-mono), monospace" }}>
            Designed & built by Josh Gabbay · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
