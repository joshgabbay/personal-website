"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CinematicText from "../CinematicText";
import MagneticElement from "../MagneticElement";
import TiltCard from "../TiltCard";

const projects = [
  {
    title: "OrtegaEats",
    url: "https://ortegaeats.com",
    description:
      "A peer-to-peer meal ordering platform for UCSB students. Buy a meal from a fellow student on campus, or earn money fulfilling orders yourself.",
    tags: ["React Native", "Expo", "Supabase", "Stripe", "Vercel"],
    color: "#6366f1",
    number: "01",
  },
  {
    title: "Sublease IV",
    url: "https://subleaseiv.com",
    description:
      "The go-to platform for UCSB students to find and list subleases in Isla Vista. No more scrolling through Facebook groups.",
    tags: ["Next.js", "Supabase", "Tailwind", "Vercel"],
    color: "#a78bfa",
    number: "02",
  },
  {
    title: "UCSB Courses",
    url: "https://ucsbcourses.com",
    description:
      "A better way to explore and plan your UCSB course schedule. Search, filter, and visualize your classes.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    color: "#818cf8",
    number: "03",
  },
];

function ProjectChapter({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "80px 0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: isEven ? -100 : 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          [isEven ? "left" : "right"]: "5%",
          fontSize: "clamp(12rem, 25vw, 22rem)",
          fontWeight: 900,
          color: project.color,
          opacity: 0.04,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {project.number}
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          [isEven ? "left" : "right"]: "12%",
          top: "15%",
          height: "70%",
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${project.color}33, transparent)`,
          transformOrigin: "top",
        }}
      />

      <TiltCard style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isEven ? "flex-end" : "flex-start",
        }}>
          <CinematicText
            text={`// Project ${project.number}`}
            trigger={isInView}
            variant="decode"
            as="span"
            style={{
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: "#3f3f46",
              display: "block",
              marginBottom: 16,
            }}
          />

          <MagneticElement strength={0.04} radius={400}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.h2
                className="glitch-hover"
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: project.color,
                  marginBottom: 32,
                }}
              >
                {project.title}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="1.5"
                  style={{ display: "inline-block", marginLeft: 16, verticalAlign: "middle", opacity: 0.4 }}>
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </motion.h2>
            </a>
          </MagneticElement>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "#a1a1aa",
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              lineHeight: 1.7,
              maxWidth: 500,
              textAlign: isEven ? "right" : "left",
              marginBottom: 32,
            }}
          >
            {project.description}
          </motion.p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: isEven ? "flex-end" : "flex-start",
          }}>
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="small-tag"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 200,
              height: 1,
              background: `linear-gradient(${isEven ? "to left" : "to right"}, ${project.color}44, transparent)`,
              marginTop: 40,
              transformOrigin: isEven ? "right" : "left",
            }}
          />
        </div>
      </TiltCard>
    </div>
  );
}

export default function SceneProjects() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <div style={{ width: "100%" }}>
      <div ref={titleRef} style={{ padding: "80px 24px 40px", textAlign: "center" }}>
        <CinematicText text="// Projects" trigger={titleInView} variant="decode" as="span"
          style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#52525b", display: "block", marginBottom: 16 }} />
        <CinematicText text="Things I've built" trigger={titleInView} variant="slide" as="h2" className="gradient-text"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center" }} />
      </div>

      {projects.map((project, i) => (
        <ProjectChapter key={project.title} project={project} index={i} />
      ))}
    </div>
  );
}
