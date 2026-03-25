"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import CinematicText from "../CinematicText";
import WordReveal from "../WordReveal";

const techStack = [
  "TypeScript", "React", "Next.js", "React Native", "Node.js", "Supabase",
  "Tailwind CSS", "Stripe", "Vercel", "Expo", "PostgreSQL", "Git",
  "Claude Code", "Lovable",
];

const floatPositions = [
  { x: "8%", y: "18%" }, { x: "75%", y: "12%" }, { x: "85%", y: "35%" },
  { x: "5%", y: "48%" }, { x: "70%", y: "55%" }, { x: "90%", y: "70%" },
  { x: "12%", y: "72%" }, { x: "55%", y: "80%" }, { x: "30%", y: "10%" },
  { x: "48%", y: "65%" }, { x: "20%", y: "85%" }, { x: "65%", y: "88%" },
  { x: "40%", y: "92%" }, { x: "78%", y: "82%" },
];

const interests = [
  { label: "Swimming", icon: "🏊" },
  { label: "Movies", icon: "🎬" },
  { label: "Travel", icon: "✈️" },
  { label: "Sushi", icon: "🍣" },
  { label: "My dog", icon: "🐕" },
];

function AnimatedNumber({ target, suffix, active, delay }: { target: number; suffix: string; active: boolean; delay: number }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); setDone(true); clearInterval(interval); }
        else setCount(Math.floor(current));
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [active, target, delay]);

  const display = done
    ? (target >= 1000 ? `${target / 1000}K${suffix}` : `${target}${suffix}`)
    : (target >= 1000 ? `${Math.floor(count / 100) / 10}K` : `${count}`);

  return <span>{display}</span>;
}

export default function SceneAbout() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const bioRef = useRef<HTMLDivElement>(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-100px" });

  return (
    <div style={{ width: "100%" }}>
      <div ref={ref} style={{ padding: "80px 24px 40px", textAlign: "center" }}>
        <CinematicText text="// About" trigger={isInView} variant="decode" as="span"
          style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#52525b", display: "block", marginBottom: 16 }} />
        <CinematicText text="Who I am" trigger={isInView} variant="slide" as="h2" className="gradient-text"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em" }} />
      </div>

      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px 80px",
        minHeight: 500,
      }}>
        {techStack.map((tech, i) => {
          const pos = floatPositions[i];
          return (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 1 }}
            >
              <motion.div
                animate={isInView ? {
                  y: [0, ((i * 7919) % 20) - 10, 0],
                  rotate: [0, ((i * 3571) % 6) - 3, 0],
                } : {}}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="tech-tag" data-hover style={{ whiteSpace: "nowrap" }}>{tech}</span>
              </motion.div>
            </motion.div>
          );
        })}

        <motion.div
          ref={bioRef}
          initial={{ opacity: 0, y: 40 }}
          animate={bioInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 620,
            padding: "48px 40px",
            background: "rgba(5, 5, 5, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 20,
          }}
        >
          {/* Headshot + intro row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={bioInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(99, 102, 241, 0.3)",
                flexShrink: 0,
              }}
            >
              <img
                src="/josh.jpg"
                alt="Josh Gabbay"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={bioInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "#d4d4d8", fontWeight: 600, lineHeight: 1.3 }}
              >
                Hey, I&apos;m Josh.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={bioInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{ fontSize: 13, color: "#6366f1", marginTop: 4, fontFamily: "var(--font-geist-mono), monospace" }}
              >
                UCSB &apos;29
              </motion.p>
            </div>
          </div>

          <WordReveal
            text="I'm the kind of person who notices when something doesn't work and can't stop thinking about it until I've built something better. That's how all my projects started. I'd see students struggling with something that should be simple, and I'd go build the fix."
            delay={0.4}
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "#a1a1aa", lineHeight: 1.8, marginBottom: 20 }}
          />
          <WordReveal
            text="I love learning new things, whether that's a new framework or a new city to explore. When I'm not building, you can probably find me in the pool, at the movies, or eating sushi."
            delay={1.0}
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "#a1a1aa", lineHeight: 1.8, marginBottom: 28 }}
          />

          {/* Interests */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
            {interests.map((item, i) => (
              <motion.span
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={bioInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  fontSize: 13,
                  color: "#71717a",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </motion.span>
            ))}
          </div>

          <WordReveal
            text={"\u201CThe best way to predict the future is to invent it.\u201D"}
            delay={2.0}
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "#52525b", lineHeight: 1.8, fontStyle: "italic" }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={bioInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.5 }}
            style={{ display: "block", marginTop: 4, fontSize: 13, color: "#52525b" }}
          >
            - Alan Kay
          </motion.span>

          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            initial={{ opacity: 0, y: 10 }}
            animate={bioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 2.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 28,
              padding: "12px 24px",
              borderRadius: 10,
              border: "1px solid rgba(99, 102, 241, 0.3)",
              background: "rgba(99, 102, 241, 0.08)",
              color: "#a1a1aa",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.05em",
              textDecoration: "none",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 16V4M12 16l-4-4M12 16l4-4M4 20h16" />
            </svg>
            Resume
          </motion.a>
        </motion.div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(32px, 6vw, 80px)",
        padding: "40px 24px 80px",
        flexWrap: "wrap",
      }}>
        {[
          { label: "PROJECTS", value: 3, suffix: "+" },
          { label: "USERS", value: 1000, suffix: "+" },
          { label: "SCHOOL", text: "UCSB" },
          { label: "CLASS OF", text: "'29" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.5 + i * 0.15 }}
            style={{ textAlign: "center" }}
          >
            <div style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              color: "#6366f1",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              {stat.text ?? <AnimatedNumber target={stat.value!} suffix={stat.suffix!} active={isInView} delay={1.5 + i * 0.15} />}
            </div>
            <div style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#3f3f46",
              fontFamily: "var(--font-geist-mono), monospace",
              marginTop: 12,
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
