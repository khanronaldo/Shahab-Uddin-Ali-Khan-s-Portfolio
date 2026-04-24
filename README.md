# Shahab ud Din — Portfolio

Premium dark portfolio built with Next.js 14, React Three Fiber, GSAP, Framer Motion & Lenis.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** (App Router) | Framework + SSR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility styling |
| **React Three Fiber** | 3D Glass Orb |
| **@react-three/drei** | Three.js helpers |
| **GSAP + ScrollTrigger** | Scroll animations |
| **Framer Motion** | Page transitions + UI |
| **Lenis** | Buttery smooth scroll |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npx vercel --prod
```

## Project Structure

```
shahab-portfolio/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   └── page.tsx            # Main page (assembles all sections)
├── components/
│   ├── 3d/
│   │   └── OrbCanvas.tsx   # Three.js glass orb (lazy loaded)
│   ├── sections/
│   │   ├── Hero.tsx        # Full-screen hero
│   │   ├── About.tsx       # GSAP split layout
│   │   ├── Skills.tsx      # Bento glassmorphism grid
│   │   ├── Projects.tsx    # Sticky scroll + modal
│   │   └── Contact.tsx     # Minimalist form
│   └── ui/
│       ├── FluidCursor.tsx # Custom cursor
│       ├── Nav.tsx         # Fixed navigation
│       └── Footer.tsx      # Footer
├── lib/
│   └── utils.ts            # Helper utilities
├── styles/
│   └── globals.css         # Design system + CSS vars
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Design System

- **Background:** Deep Obsidian `#070707`
- **Accent Cyan:** `#00F0FF`
- **Accent Purple:** `#8A2BE2`
- **Primary Text:** `#F2F2F2`
- **Secondary Text:** `#A1A1AA`
- **Heading Font:** Syne (800 weight)
- **Body Font:** DM Sans (300–500 weight)

## Features

- ✅ Fluid custom cursor with hover magnify effect
- ✅ Lenis smooth inertia scrolling
- ✅ React Three Fiber glass orb with mouse parallax
- ✅ Framer Motion page transitions
- ✅ GSAP ScrollTrigger scroll reveals
- ✅ Glassmorphism skill cards with gradient border on hover
- ✅ Project modal with blur backdrop
- ✅ Contact form with bottom-border glow inputs
- ✅ Animated send button → checkmark
- ✅ Responsive (mobile + desktop)
- ✅ Dynamic imports for 3D canvas (fast initial load)
