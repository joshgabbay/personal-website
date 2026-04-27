# Josh Gabbay - Personal Portfolio

Immersive personal portfolio website with 3D scenes, cinematic animations, smooth scrolling, and interactive effects.

## Tech Stack

- Next.js 16 (App Router)
- Three.js (via React Three Fiber + Drei)
- Framer Motion
- Tailwind CSS 4
- Lenis (smooth scrolling)
- TypeScript
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/            # Next.js App Router pages
  components/     # UI components and effects
    scenes/       # Per-section 3D scenes
public/
  josh.jpg        # Profile photo
  resume.pdf      # Resume
```

## Features

- Cinematic intro sequence
- Persistent 3D canvas with per-section scenes
- Custom cursor with particle effects
- Smooth scrolling with Lenis
- Scroll-driven animations and section transitions
- Command palette (Cmd+K)
- Fully responsive

## Building

```bash
npm run build
```
