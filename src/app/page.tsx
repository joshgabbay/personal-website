"use client";

import { useState, useCallback, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import dynamic from "next/dynamic";

import IntroSequence from "@/components/IntroSequence";
import SceneHero from "@/components/scenes/SceneHero";
import SceneProjects from "@/components/scenes/SceneProjects";
import SceneAbout from "@/components/scenes/SceneAbout";
import SceneContact from "@/components/scenes/SceneContact";
import NavigationDots from "@/components/NavigationDots";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import SectionWipe from "@/components/SectionWipe";

const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const PersistentCanvas = dynamic(() => import("@/components/PersistentCanvas"), { ssr: false });
const AmbientGlow = dynamic(() => import("@/components/AmbientGlow"), { ssr: false });
const CursorParticles = dynamic(() => import("@/components/CursorParticles"), { ssr: false });
const AnimatedTitle = dynamic(() => import("@/components/AnimatedTitle"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });

const sectionIds = ["hero", "projects", "about", "contact"];

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const scrollSpeedRef = useRef(0);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const { scrollY } = useScroll();

  const lastScrollY = useRef(0);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const velocity = Math.abs(latest - lastScrollY.current);
    lastScrollY.current = latest;
    scrollSpeedRef.current = Math.min(velocity / 50, 1);

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5) {
          if (currentScene !== i) setCurrentScene(i);
          break;
        }
      }
    }
  });

  return (
    <>
      <SmoothScroll />
      <AnimatedTitle />
      <IntroSequence onComplete={handleIntroComplete} />
      <Cursor />
      <CursorParticles />
      <AmbientGlow />
      <PersistentCanvas scene={currentScene} scrollSpeedRef={scrollSpeedRef} />
      <ScrollProgress />
      <NavigationDots />
      <CommandPalette />

      <main style={{ position: "relative", zIndex: 1 }}>
        <section id="hero">
          <SceneHero introComplete={introComplete} />
        </section>

        <div style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          <SectionWipe />

          <section id="projects">
            <SceneProjects />
          </section>

          <SectionWipe />

          <section id="about">
            <SceneAbout />
          </section>

          <SectionWipe />

          <section id="contact">
            <SceneContact />
          </section>
        </div>
      </main>
    </>
  );
}
