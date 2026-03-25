"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero", label: "Home", shortcut: "1" },
  { id: "projects", label: "Projects", shortcut: "2" },
  { id: "about", label: "About", shortcut: "3" },
  { id: "contact", label: "Contact", shortcut: "4" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = sections.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => (s - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selected]) {
        navigate(filtered[selected].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, selected, filtered, navigate]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(480px, 90vw)",
              background: "rgba(15, 15, 15, 0.95)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: 16,
              overflow: "hidden",
              zIndex: 10000,
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              gap: 12,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Navigate to..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#e4e4e7",
                  fontSize: 15,
                  fontFamily: "var(--font-geist-mono), monospace",
                  letterSpacing: "0.02em",
                }}
              />
              <kbd style={{
                padding: "2px 8px",
                borderRadius: 6,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 11,
                color: "#71717a",
                fontFamily: "var(--font-geist-mono), monospace",
              }}>
                esc
              </kbd>
            </div>

            <div style={{ padding: "8px" }}>
              {filtered.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.id)}
                  onMouseEnter={() => setSelected(i)}
                  data-hover
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: i === selected ? "rgba(99, 102, 241, 0.1)" : "transparent",
                    color: i === selected ? "#e4e4e7" : "#71717a",
                    fontSize: 14,
                    fontFamily: "inherit",
                    cursor: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: i === selected ? "#6366f1" : "rgba(255,255,255,0.1)",
                      transition: "background 0.15s ease",
                    }} />
                    {section.label}
                  </span>
                  <kbd style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: 11,
                    color: "#52525b",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}>
                    {section.shortcut}
                  </kbd>
                </button>
              ))}
            </div>

            <div style={{
              padding: "10px 20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              gap: 16,
              justifyContent: "center",
            }}>
              {[
                { keys: "↑↓", label: "navigate" },
                { keys: "↵", label: "select" },
                { keys: "esc", label: "close" },
              ].map((hint) => (
                <span key={hint.label} style={{ fontSize: 11, color: "#3f3f46", display: "flex", alignItems: "center", gap: 4 }}>
                  <kbd style={{
                    padding: "1px 5px",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}>
                    {hint.keys}
                  </kbd>
                  {hint.label}
                </span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
