'use client'

import { useEffect, useRef } from 'react'

export default function FluidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const curr = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    // 🔥 FIX: Use clientX/Y directly — no lag from event processing
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }

    const animate = () => {
      // 🔥 FIX: Increased lerp factor from 0.14 → 0.28 for snappier cursor
      // Higher = faster/snappier, lower = slower/floatier
      const lerpFactor = 0.28
      curr.current.x += (pos.current.x - curr.current.x) * lerpFactor
      curr.current.y += (pos.current.y - curr.current.y) * lerpFactor

      // 🔥 FIX: Use transform instead of left/top — GPU-accelerated, no layout reflow
      el.style.transform = `translate(${curr.current.x - 4}px, ${curr.current.y - 4}px)`

      rafRef.current = requestAnimationFrame(animate)
    }

    const hoverables = document.querySelectorAll(
      'a, button, .skill-card, .project-card, .stat-card, [data-hover]'
    )

    const addHover = () => el.classList.add('hovered')
    const removeHover = () => el.classList.remove('hovered')

    hoverables.forEach((h) => {
      h.addEventListener('mouseenter', addHover)
      h.addEventListener('mouseleave', removeHover)
    })

    // 🔥 FIX: passive:true for better scroll performance
    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      hoverables.forEach((h) => {
        h.removeEventListener('mouseenter', addHover)
        h.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return <div id="fluid-cursor" ref={cursorRef} />
}