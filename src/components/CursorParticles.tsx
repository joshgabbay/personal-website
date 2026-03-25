"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e: MouseEvent) => {
      mouse.current.prevX = mouse.current.x;
      mouse.current.prevY = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const dx = mouse.current.x - mouse.current.prevX;
      const dy = mouse.current.y - mouse.current.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Emit particles based on speed
      const count = Math.min(Math.floor(speed * 0.3), 4);
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 4,
          y: mouse.current.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
          vy: (Math.random() - 0.5) * 1.5 - dy * 0.05,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.4,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    window.addEventListener("mousemove", handleMove);

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.life -= 0.016 / p.maxLife;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy += 0.02; // slight gravity

        const alpha = p.life * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.fill();

        return true;
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        pointerEvents: "none",
      }}
    />
  );
}
