"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
        className="group"
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
      >
        <div className="card card-lg" style={{ marginBottom: 24 }}>
          {/* Number watermark */}
          <span
            style={{
              position: "absolute",
              top: -16,
              right: 16,
              fontSize: "clamp(6rem, 10vw, 9rem)",
              fontWeight: 900,
              opacity: 0.03,
              color: project.color,
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {project.number}
          </span>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: project.color,
                  transition: "transform 0.5s ease",
                }}
              >
                {project.title}
              </h3>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#71717a"
                strokeWidth="1.5"
                style={{ marginTop: 8, flexShrink: 0, transition: "transform 0.3s ease" }}
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>

            <p style={{ color: "#a1a1aa", fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)", lineHeight: 1.7, maxWidth: 640, marginBottom: 32 }}>
              {project.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tags.map((tag) => (
                <span key={tag} className="small-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className="accent-line"
            style={{ background: `linear-gradient(90deg, transparent, ${project.color}66, transparent)` }}
          />
        </div>
      </a>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section style={{ padding: "128px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 80 }}
        >
          <span style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.3em", textTransform: "uppercase", color: "#52525b", display: "block", marginBottom: 16 }}>
            // Projects
          </span>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Things I&apos;ve <span className="gradient-text">built</span>
          </h2>
        </motion.div>

        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
