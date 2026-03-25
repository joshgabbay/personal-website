"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Variant = "scatter" | "slide" | "decode";

interface CinematicTextProps {
  text: string;
  trigger: boolean;
  variant?: Variant;
  style?: React.CSSProperties;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  speed?: number;
}

const decodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export default function CinematicText({
  text,
  trigger,
  variant = "scatter",
  style,
  className,
  as: Tag = "span",
  delay = 0,
  speed = 1,
}: CinematicTextProps) {
  const [decoded, setDecoded] = useState("");

  const chars = useMemo(() => text.split(""), [text]);

  // Decode variant — cycles random chars before revealing real text
  useEffect(() => {
    if (variant !== "decode" || !trigger) {
      setDecoded("");
      return;
    }
    let frame = 0;
    const totalFrames = Math.ceil(text.length * 3 / speed);
    const interval = setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / totalFrames) * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else {
          result += decodeChars[Math.floor(Math.random() * decodeChars.length)];
        }
      }
      setDecoded(result);
      if (resolved >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [trigger, text, variant, speed]);

  if (variant === "decode") {
    return (
      <Tag style={{ ...style, fontFamily: "var(--font-geist-mono), monospace" }} className={className}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={trigger ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay }}
        >
          {decoded || text.replace(/./g, " ")}
        </motion.span>
      </Tag>
    );
  }

  if (variant === "slide") {
    return (
      <Tag style={style} className={className}>
        {chars.map((char, i) => (
          <span key={i} className="clip-mask">
            <motion.span
              style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
              initial={{ y: "110%" }}
              animate={trigger ? { y: "0%" } : {}}
              transition={{
                duration: 0.6 / speed,
                delay: delay + i * 0.03 / speed,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </Tag>
    );
  }

  // Default: scatter — use deterministic offsets based on char index to avoid hydration mismatch
  return (
    <Tag style={style} className={className}>
      {chars.map((char, i) => {
        // Deterministic pseudo-random from index
        const seed = ((i + 1) * 7919) % 1000;
        const offsetX = ((seed % 100) / 100 - 0.5) * 40;
        const offsetY = (((seed * 3) % 100) / 100 - 0.5) * 60;

        return (
          <motion.span
            key={i}
            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
            initial={{
              opacity: 0,
              y: offsetY,
              x: offsetX,
              filter: "blur(8px)",
              scale: 0.5,
            }}
            animate={
              trigger
                ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)", scale: 1 }
                : {}
            }
            transition={{
              duration: 0.8 / speed,
              delay: delay + i * 0.04 / speed,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </Tag>
  );
}
