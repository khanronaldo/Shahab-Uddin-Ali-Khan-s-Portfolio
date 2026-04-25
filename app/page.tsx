'use client'

import { useEffect } from 'react'
import Nav from '@/components/ui/Nav'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/ui/Footer'
import FluidCursor from '@/components/ui/FluidCursor'

export default function Home() {
  // ── LENIS SMOOTH SCROLL ──
  // Disabled on mobile — native scroll is smoother and saves CPU/memory
  useEffect(() => {
    // Touch devices: skip Lenis entirely, native scroll is better
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) return

    let lenis: any
    let rafId: number

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
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
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              e.target.classList.add('visible')
            }, 80)
            obs.unobserve(e.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    /*
      IMPORTANT: bg-transparent here — GlobalParticlesBackground (in layout.tsx)
      is fixed behind everything. bg-obsidian / bg-black would cover it.
      The black body in layout.tsx handles the base color.
    */
    <main className="page-enter min-h-screen bg-transparent overflow-x-hidden">
      <FluidCursor />
      <Nav />
      <Hero />
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