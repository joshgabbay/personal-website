"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const stats = [
  { label: "Projects Shipped", value: "3+" },
  { label: "Users Served", value: "1K+" },
  { label: "School", value: "UCSB" },
  { label: "Graduation", value: "'27" },
];

const techStack = [
  "TypeScript", "React", "Next.js", "React Native", "Node.js", "Supabase",
  "Tailwind CSS", "Stripe", "Vercel", "Expo", "PostgreSQL", "Git",
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const contentInView = useInView(contentRef, { once: true, margin: "-50px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <section ref={ref} style={{ padding: "128px 24px", position: "relative" }}>
      {/* Vertical accent line — desktop only */}
      <div style={{ position: "absolute", left: 48, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)" }} className="hidden md:block">
        <motion.div
          style={{ width: "100%", background: "linear-gradient(to bottom, #6366f1, transparent)", height: lineHeight }}
        />
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 80 }}
        >
          <span style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.3em", textTransform: "uppercase", color: "#52525b", display: "block", marginBottom: 16 }}>
            // About
          </span>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Who I <span className="gradient-text">am</span>
          </h2>
        </motion.div>

        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 60 }}
          animate={contentInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="about-grid"
        >
          {/* Left column */}
          <div>
            <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.25rem)", color: "#d4d4d8", lineHeight: 1.7, marginBottom: 24 }}>
              I&apos;m a student at UC Santa Barbara who builds products that solve real problems
              for the people around me.
            </p>
            <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", color: "#a1a1aa", lineHeight: 1.7, marginBottom: 24 }}>
              Every project I ship starts with a frustration I see in my community.
              Dining hall lines are too long, finding subleases is chaos, course planning
              is a nightmare. I build the fix, launch it, and iterate until it works.
            </p>
            <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", color: "#a1a1aa", lineHeight: 1.7, marginBottom: 40 }}>
              I believe in shipping fast, learning from users, and never over-engineering.
              If it solves the problem, it ships.
            </p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="stat-card"
                >
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#6366f1" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#71717a", fontFamily: "var(--font-geist-mono), monospace", marginTop: 4 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <h3 style={{ fontSize: 13, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b", marginBottom: 24 }}>
              Tech I Work With
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={contentInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="tech-tag"
                  data-hover
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="philosophy-card"
              style={{ marginTop: 40 }}
            >
              <div style={{ color: "#71717a", fontSize: 13, fontFamily: "var(--font-geist-mono), monospace", marginBottom: 12 }}>// philosophy</div>
              <p style={{ color: "#d4d4d8", fontSize: 16, fontStyle: "italic", lineHeight: 1.6 }}>
                &ldquo;The best way to predict the future is to build it.&rdquo;
              </p>
              <p style={{ color: "#71717a", fontSize: 14, marginTop: 8 }}>- Alan Kay</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
