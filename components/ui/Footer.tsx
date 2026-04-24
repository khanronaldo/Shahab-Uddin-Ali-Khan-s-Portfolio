'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const C = '#dff245'
const M = '#3e8927'
const P = '#5ac52f'

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'Dribbble',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.22 10.22 0 0 0 4.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.362a10.166 10.166 0 0 0 6.29 2.166 10.25 10.25 0 0 0 4.006-.778zM4.92 19.21c.24-.403 3.096-5.208 8.408-6.955.026-.01.05-.015.077-.023A44.745 44.745 0 0 0 12.14 10.8c-5.086 1.52-10.02 1.46-10.474 1.454a10.16 10.16 0 0 0 3.255 6.957zM1.7 10.225c.463.006 4.818.048 9.617-1.26a51.56 51.56 0 0 0-2.97-4.614 10.212 10.212 0 0 0-6.648 5.874zm11.28-7.04c.264.396 1.84 2.807 2.927 5.07 2.952-1.107 4.205-2.79 4.36-3.012a10.187 10.187 0 0 0-7.288-2.058zm6.27 3.918c-.177.24-1.565 2.04-4.637 3.323.192.395.376.8.543 1.206.06.146.118.293.174.44 3.388-.426 6.745.257 7.085.33a10.19 10.19 0 0 0-3.165-5.3z"/>
      </svg>
    ),
  },
]

const navLinks = ['About', 'Skills', 'Projects', 'Contact']

const techStack = ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion']

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <footer
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#000000', borderTop: '1px solid rgba(223,242,69,0.08)' }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${C}30 30%, ${C}80 50%, ${C}30 70%, transparent 100%)`,
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: `radial-gradient(ellipse, ${C}06 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        {/* ── TOP ROW ── */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">

          {/* LEFT: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 max-w-xs"
          >
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  border: `1px solid ${C}40`,
                  borderRadius: '10px',
                  background: `${C}08`,
                }}
              >
                <span style={{ color: C, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '14px' }}>S</span>
                <div
                  className="absolute inset-0 rounded-[10px] pointer-events-none"
                  style={{ boxShadow: `0 0 20px ${C}20` }}
                />
              </div>
              <div>
                <p style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Shahab ud Din
                </p>
                <p style={{ color: `${C}70`, fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.25em', marginTop: '2px' }}>
                  Creative Developer
                </p>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif' }}>
              Crafting premium digital experiences with Three.js, React & cutting-edge web technology. Built with obsession.
            </p>

            {/* Status indicator */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: `${M}15`, border: `1px solid ${M}30`, width: 'fit-content' }}
            >
              <div
                className="rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  background: P,
                  boxShadow: `0 0 8px ${P}`,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span style={{ color: P, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Available for work
              </span>
            </div>
          </motion.div>

          {/* CENTER: Nav links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            <p style={{ color: `${C}60`, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '4px' }}>
              Navigation
            </p>
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                className="group flex items-center gap-2"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="h-px transition-all duration-300 group-hover:w-6"
                  style={{ width: '12px', background: `${C}40`, transition: 'width 0.3s ease, background 0.3s ease' }}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '12px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = C }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {link}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* RIGHT: Tech stack + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Tech stack */}
            <div>
              <p style={{ color: `${C}60`, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '12px' }}>
                Built With
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.07 }}
                    style={{
                      padding: '3px 10px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.45)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.025)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <p style={{ color: `${C}60`, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '12px' }}>
                Connect
              </p>
              <div className="flex gap-3">
                {socialLinks.map((s, i) => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    title={s.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                    style={{
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.025)',
                      color: 'rgba(255,255,255,0.4)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = `${C}50`
                      el.style.color = C
                      el.style.background = `${C}0d`
                      el.style.boxShadow = `0 0 16px ${C}20`
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(255,255,255,0.07)'
                      el.style.color = 'rgba(255,255,255,0.4)'
                      el.style.background = 'rgba(255,255,255,0.025)'
                      el.style.boxShadow = 'none'
                      el.style.transform = 'translateY(0)'
                    }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }} />

        {/* ── BOTTOM ROW ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Shahab ud Din. Crafted with obsession.
          </p>

          {/* Animated signature line */}
          <div className="flex items-center gap-3">
            <div style={{ height: '1px', width: '24px', background: `linear-gradient(90deg, transparent, ${C}50)` }} />
            <span style={{ color: `${C}50`, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.35em', fontFamily: 'monospace' }}>
              Waziristan → World
            </span>
            <div style={{ height: '1px', width: '24px', background: `linear-gradient(90deg, ${C}50, transparent)` }} />
          </div>
        </motion.div>
      </div>

      {/* Pulse dot animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}} />
    </footer>
  )
}