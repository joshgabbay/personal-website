"use client";

import { useEffect, useRef } from "react";

const frames = [
  "Josh Gabbay",
  "Josh Gabbay ·",
  "Josh Gabbay · B",
  "Josh Gabbay · Bu",
  "Josh Gabbay · Bui",
  "Josh Gabbay · Buil",
  "Josh Gabbay · Build",
  "Josh Gabbay · Builde",
  "Josh Gabbay · Builder",
  "Josh Gabbay · Builder",
  "Josh Gabbay · Builder",
  "Josh Gabbay ·",
  "Josh Gabbay · D",
  "Josh Gabbay · De",
  "Josh Gabbay · Dev",
  "Josh Gabbay · Deve",
  "Josh Gabbay · Devel",
  "Josh Gabbay · Develo",
  "Josh Gabbay · Develop",
  "Josh Gabbay · Develope",
  "Josh Gabbay · Developer",
  "Josh Gabbay · Developer",
  "Josh Gabbay · Developer",
  "Josh Gabbay ·",
  "Josh Gabbay · C",
  "Josh Gabbay · Cr",
  "Josh Gabbay · Cre",
  "Josh Gabbay · Crea",
  "Josh Gabbay · Creat",
  "Josh Gabbay · Creato",
  "Josh Gabbay · Creator",
  "Josh Gabbay · Creator",
  "Josh Gabbay · Creator",
];

export default function AnimatedTitle() {
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      document.title = frames[indexRef.current];
      indexRef.current = (indexRef.current + 1) % frames.length;
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return null;
}
