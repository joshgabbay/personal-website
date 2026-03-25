"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface WordRevealProps {
  text: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function WordReveal({ text, style, delay = 0 }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  return (
    <p ref={ref} style={style}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.3em" }}>
          <motion.span
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
              duration: 0.4,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}
