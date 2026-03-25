"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";
import { SceneContext } from "./SceneContext";

interface SceneConfig {
  id: string;
  label: string;
  component: ReactNode;
}

interface SceneEngineProps {
  scenes: SceneConfig[];
  enabled: boolean;
  onSceneChange?: (scene: number) => void;
}

// Wider transition zones for smoother blending
const TRANSITION_OVERLAP = 0.15; // 15% overlap between scenes — much smoother

export default function SceneEngine({ scenes, enabled, onSceneChange }: SceneEngineProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll();

  const totalScenes = scenes.length;

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // Simple even split — each scene gets 1/N of scroll, with overlap for transitions
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!enabled) return;

    const segmentSize = 1 / totalScenes;
    const scene = Math.min(totalScenes - 1, Math.floor(v / segmentSize));
    const progress = (v - scene * segmentSize) / segmentSize;

    if (scene !== currentScene) {
      setCurrentScene(scene);
      onSceneChange?.(scene);
    }
    setSceneProgress(Math.min(1, Math.max(0, progress)));
  });

  const goToScene = useCallback((index: number) => {
    const target = (index / totalScenes) * document.documentElement.scrollHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, [totalScenes]);

  return (
    <SceneContext.Provider value={{ globalProgress: scrollYProgress, currentScene, sceneProgress, mouseX, mouseY }}>
      {/* Scroll space — give each scene 150vh for a comfortable pace */}
      <div style={{ height: `${totalScenes * 150}vh`, position: "relative" }} />

      {/* Fixed viewport */}
      <div className="scene-viewport" style={{ pointerEvents: enabled ? "auto" : "none" }}>
        {scenes.map((scene, i) => (
          <SceneLayer
            key={scene.id}
            index={i}
            total={totalScenes}
            current={currentScene}
            scrollProgress={scrollYProgress}
          >
            {scene.component}
          </SceneLayer>
        ))}

        <SceneNavigator
          scenes={scenes}
          current={currentScene}
          progress={sceneProgress}
          onNavigate={goToScene}
        />
      </div>
    </SceneContext.Provider>
  );
}

function SceneLayer({
  index,
  total,
  current,
  scrollProgress,
  children,
}: {
  index: number;
  total: number;
  current: number;
  scrollProgress: ReturnType<typeof useMotionValue<number>>;
  children: ReactNode;
}) {
  const segSize = 1 / total;
  const transZone = segSize * 0.3; // 30% of each segment is transition

  // Scene center point and visible range
  const center = (index + 0.5) * segSize;
  const visibleHalf = segSize * 0.5 + transZone * 0.5;

  // Build strictly increasing keyframes
  const points: number[] = [];
  const opacityValues: number[] = [];
  const yValues: number[] = [];
  const scaleValues: number[] = [];

  if (index === 0) {
    // First scene: starts visible, fades out
    const outStart = (index + 1) * segSize - transZone;
    const outEnd = (index + 1) * segSize + transZone * 0.3;
    points.push(0, outStart, outEnd);
    opacityValues.push(1, 1, 0);
    yValues.push(0, 0, -40);
    scaleValues.push(1, 1, 0.97);
  } else if (index === total - 1) {
    // Last scene: fades in, stays visible
    const inStart = index * segSize - transZone * 0.3;
    const inEnd = index * segSize + transZone;
    points.push(inStart, inEnd, 1);
    opacityValues.push(0, 1, 1);
    yValues.push(50, 0, 0);
    scaleValues.push(1.03, 1, 1);
  } else {
    // Middle scenes: fade in, hold, fade out
    const inStart = index * segSize - transZone * 0.3;
    const inEnd = index * segSize + transZone;
    const outStart = (index + 1) * segSize - transZone;
    const outEnd = (index + 1) * segSize + transZone * 0.3;
    points.push(inStart, inEnd, outStart, outEnd);
    opacityValues.push(0, 1, 1, 0);
    yValues.push(50, 0, 0, -40);
    scaleValues.push(1.03, 1, 1, 0.97);
  }

  const opacity = useTransform(scrollProgress, points, opacityValues);
  const y = useTransform(scrollProgress, points, yValues);
  const scale = useTransform(scrollProgress, points, scaleValues);

  return (
    <motion.div
      className="scene-layer"
      style={{
        opacity,
        scale,
        y,
        transformOrigin: "center center",
        zIndex: current === index ? 10 : 1,
        pointerEvents: current === index ? "auto" : "none",
      }}
    >
      {children}
    </motion.div>
  );
}

function SceneNavigator({
  scenes,
  current,
  progress,
  onNavigate,
}: {
  scenes: SceneConfig[];
  current: number;
  progress: number;
  onNavigate: (i: number) => void;
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <nav
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 20,
      }}
    >
      {scenes.map((scene, i) => (
        <button
          key={scene.id}
          data-hover
          onClick={() => onNavigate(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "none",
            border: "none",
            padding: 0,
            outline: "none",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-geist-mono), monospace",
              letterSpacing: "0.05em",
              color: current === i ? "#d4d4d8" : "#3f3f46",
              opacity: current === i ? 1 : 0,
              transform: current === i ? "translateX(0)" : "translateX(8px)",
              transition: "all 0.4s ease",
            }}
          >
            {scene.label}
          </span>
          <div style={{ position: "relative", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: current === i ? 10 : 5,
                height: current === i ? 10 : 5,
                borderRadius: "50%",
                background: current === i ? "#6366f1" : "#3f3f46",
                transition: "all 0.4s ease",
                boxShadow: current === i ? "0 0 12px rgba(99, 102, 241, 0.5)" : "none",
              }}
            />
            {current === i && (
              <motion.div
                layoutId="scene-nav-ring"
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              />
            )}
          </div>
        </button>
      ))}
    </nav>
  );
}
