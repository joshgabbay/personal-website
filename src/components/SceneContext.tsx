"use client";

import { createContext, useContext } from "react";
import { MotionValue } from "framer-motion";

interface SceneContextType {
  globalProgress: MotionValue<number>;
  currentScene: number;
  sceneProgress: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export const SceneContext = createContext<SceneContextType | null>(null);

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used within SceneEngine");
  return ctx;
}
