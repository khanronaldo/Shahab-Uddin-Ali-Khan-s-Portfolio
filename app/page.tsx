'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Nav from '@/components/ui/Nav'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/ui/Footer'
import FluidCursor from '@/components/ui/FluidCursor'

// Dynamically import heavy 3D canvas — no SSR, lazy loaded
const OrbCanvas = dynamic(() => import('@/components/3d/OrbCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-48 h-48 rounded-full bg-purple-deep/10 animate-pulse" />
    </div>
  ),
})

export default function Home() {
  // ── LENIS SMOOTH SCROLL ──
  useEffect(() => {
    let lenis: any
    let rafId: number

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.2,           // FIXED: 1.4 se 1.2 — thoda faster feel
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,    // FIXED: 2 se 1.5 — mobile pe over-scroll na ho
        smoothWheel: true,
        wheelMultiplier: 0.9,    // ADDED: wheel speed control
      })

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
    }
  }, [])

  // ── SCROLL REVEAL OBSERVER ──
  // FIXED: threshold 0.08 bahut jaldi trigger karta tha
  // Ab 0.15 hai aur rootMargin negative hai taake animation tab aaye
  // jab element screen ke beech mein aa jaye
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // FIXED: Small delay taake section properly visible ho
            setTimeout(() => {
              e.target.classList.add('visible')
            }, 80)
            obs.unobserve(e.target) // ADDED: unobserve once visible — memory leak prevent
          }
        })
      },
      {
        threshold: 0.15,          // FIXED: 0.08 se 0.15 — 15% visible hone pe animate
        rootMargin: '0px 0px -60px 0px', // ADDED: 60px margin — element thoda aur andar aaye
      }
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <main className="page-enter min-h-screen bg-obsidian overflow-x-hidden">
      <FluidCursor />
      <Nav />
      <Hero OrbCanvas={OrbCanvas} />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Contact />
      <Footer />
    </main>
  )
}