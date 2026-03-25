"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, Theme } from "./ThemeContext";

const themes: (Theme & { name: string })[] = [
  { name: "Indigo", accent: "99, 102, 241", hex: "#6366f1", light: "#a78bfa" },
  { name: "Cyan", accent: "6, 182, 212", hex: "#06b6d4", light: "#67e8f9" },
  { name: "Rose", accent: "244, 63, 94", hex: "#f43f5e", light: "#fb7185" },
  { name: "Emerald", accent: "16, 185, 129", hex: "#10b981", light: "#6ee7b7" },
  { name: "Amber", accent: "245, 158, 11", hex: "#f59e0b", light: "#fbbf24" },
  { name: "Violet", accent: "139, 92, 246", hex: "#8b5cf6", light: "#c4b5fd" },
];

export default function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: 28,
      zIndex: 60,
      display: "flex",
      flexDirection: "column-reverse",
      alignItems: "center",
      gap: 12,
    }}>
      <motion.button
        data-hover
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          outline: "none",
        }}
      >
        <div style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: `conic-gradient(${themes.map((t, i) => `${t.hex} ${(i / themes.length) * 100}% ${((i + 1) / themes.length) * 100}%`).join(", ")})`,
        }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 10,
              borderRadius: 24,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(10, 10, 10, 0.9)",
              backdropFilter: "blur(20px)",
              alignItems: "center",
            }}
          >
            {themes.map((t) => (
              <motion.button
                key={t.name}
                data-hover
                onClick={() => { setTheme(t); setOpen(false); }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                title={t.name}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: t.hex,
                  border: theme.hex === t.hex ? "2px solid white" : "2px solid transparent",
                  padding: 0,
                  outline: "none",
                  boxShadow: theme.hex === t.hex ? `0 0 12px ${t.hex}` : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
