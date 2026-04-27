# CLAUDE.md - Josh Gabbay Personal Website

@AGENTS.md

## What is this?
Immersive personal portfolio site with 3D scenes, cinematic animations, and interactive effects. Sections: Hero, Projects, About, Contact.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **3D**: Three.js via @react-three/fiber + @react-three/drei
- **Animation**: Framer Motion
- **Smooth Scroll**: Lenis
- **Language**: TypeScript
- **Deployment**: Vercel

## Project Structure
```
src/
  app/
    page.tsx              # Main page — assembles all sections + effects
    layout.tsx            # Root layout
    globals.css           # Tailwind + global styles
    blog/                 # Blog section (empty)
  components/
    scenes/               # Per-section 3D scenes (SceneHero, SceneProjects, SceneAbout, SceneContact)
    HeroSection.tsx       # Hero content
    ProjectsSection.tsx   # Projects showcase
    AboutSection.tsx      # About content
    ContactSection.tsx    # Contact form/info
    PersistentCanvas.tsx  # Shared Three.js canvas across sections
    IntroSequence.tsx     # Cinematic intro animation
    SmoothScroll.tsx      # Lenis smooth scrolling
    Cursor.tsx            # Custom cursor
    CursorParticles.tsx   # Particle effects following cursor
    AmbientGlow.tsx       # Background glow effects
    CommandPalette.tsx    # Cmd+K command palette
    ScrollProgress.tsx    # Scroll progress indicator
    NavigationDots.tsx    # Section navigation dots
    SectionWipe.tsx       # Transition between sections
    AnimatedTitle.tsx     # Dynamic page title
    ThemeContext.tsx       # Theme provider
    ThemeSelector.tsx      # Theme picker
    TiltCard.tsx          # 3D tilt card effect
    WordReveal.tsx        # Text reveal animation
    MagneticElement.tsx   # Magnetic hover effect
    CinematicText.tsx     # Cinematic text styling
    SceneContext.tsx       # Scene state context
    SceneEngine.tsx        # Scene management
public/
  josh.jpg              # Profile photo
  resume.pdf            # Resume
```

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Key Patterns
- Sections: hero, projects, about, contact (tracked via scroll position)
- 3D canvas persists across sections, scene swaps based on scroll
- Heavy use of dynamic imports with `ssr: false` for browser-only components
- Scroll velocity tracked for animation intensity
- Intro sequence plays once, then reveals main content

## No environment variables needed
