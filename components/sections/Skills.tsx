'use client'

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const C = '#dff245'
const M = '#5ac52f'
const P = '#3e8927'

const SKILLS = [
  { name: 'React / Next.js',  sub: 'App Router · SSR',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',         color: '#dff245', pct: 96 },
  { name: 'TypeScript',       sub: 'Strict Typing',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#b4cc36', pct: 94 },
  { name: 'Three.js / WebGL', sub: '3D Graphics',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',       color: '#78a33c', pct: 88, invert: true },
  { name: 'CSS / Tailwind',   sub: 'Modern Layouts',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',             color: '#5ac52f', pct: 97 },
  { name: 'Framer Motion',    sub: 'Interactive UI',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg', color: '#3e8927', pct: 91, invert: true },
  { name: 'Node.js / APIs',   sub: 'Scalable Backend',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',          color: '#dff245', pct: 85 },
  { name: 'UI/UX Design',     sub: 'Figma Systems',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',            color: '#b4cc36', pct: 89 },
  { name: 'Git / DevOps',     sub: 'CI/CD Pipelines',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',               color: '#5ac52f', pct: 87 },
]

function StaticStars() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 220
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C), cM = new THREE.Color(P)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
      const c = Math.random() > 0.5 ? cC : cM
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  const material = useMemo(() => new THREE.PointsMaterial({
    size: 0.07, vertexColors: true, transparent: true, opacity: 0.4,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.2
  })
  return <points ref={ref} geometry={geo} material={material} />
}

const SkillBubble = React.memo(function SkillBubble({
  skill, index, activeIndex, onHover, isMobile,
}: any) {
  const isHovered = activeIndex === index
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
      className="relative flex-shrink-0"
      style={{ width: '85px', height: '85px', zIndex: isHovered ? 50 : 10 }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none">
        <motion.div
          onClick={() => isMobile && onHover(isHovered ? null : index)}
          onMouseEnter={() => !isMobile && onHover(index)}
          onMouseLeave={() => !isMobile && onHover(null)}
          animate={{
            width: isHovered ? (isMobile ? 260 : 310) : 85,
            y: isHovered ? 0 : [0, -5, 0],
          }}
          transition={{
            width: { type: 'spring', stiffness: 300, damping: 25 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
          }}
          className="flex items-center overflow-hidden cursor-pointer pointer-events-auto"
          style={{
            height: '85px',
            willChange: 'width, transform',
            background: isHovered ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isHovered ? skill.color : 'rgba(255,255,255,0.08)'}`,
            borderRadius: isHovered ? '45px' : '50%',
            padding: '12px',
            // Removed backdrop-blur here — saves significant GPU on mobile for 8 simultaneous elements
            boxShadow: isHovered ? `0 0 20px ${skill.color}25` : 'none',
          }}
        >
          <div className="flex-shrink-0 w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[#111] border border-white/5">
            <img
              src={skill.icon}
              alt={skill.name}
              style={{ width: '30px', height: '30px', filter: skill.invert ? 'invert(1)' : 'none' }}
            />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="ml-4 flex-1 pr-6 flex flex-col justify-center whitespace-nowrap"
              >
                <div className="flex justify-between items-end">
                  <span className="font-bold text-white text-sm">{skill.name}</span>
                  <span className="text-[10px] font-mono" style={{ color: skill.color }}>{skill.pct}%</span>
                </div>
                <p className="text-[9px] uppercase tracking-tighter opacity-50 mb-1">{skill.sub}</p>
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.pct}%` }}
                    className="h-full"
                    style={{ background: skill.color }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
})

export default function Skills() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { amount: 0.1 })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleHover = useCallback((index: number | null) => { setActiveIndex(index) }, [])

  const diamondRows = [
    [SKILLS[0]],
    [SKILLS[1], SKILLS[2]],
    [SKILLS[3], SKILLS[4], SKILLS[5]],
    [SKILLS[6], SKILLS[7]],
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@400;600&display=swap');
          @keyframes tubelight-name { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
          @keyframes blink { 0%, 100% { opacity: .15 } 50% { opacity: .45 } }
        `,
      }} />

      <section
        ref={sectionRef}
        id="skills"
        className="relative w-full overflow-hidden py-32 px-4"
        style={{ backgroundColor: '#000000' }}
      >
        {/* BACKGROUND CANVAS — pointer/touch events fully disabled */}
        <div
          className="absolute inset-0 z-0"
          style={{ pointerEvents: 'none', touchAction: 'none' }}
        >
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 15], fov: 60 }}
            gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            frameloop={isInView ? 'always' : 'demand'}
            style={{ pointerEvents: 'none', touchAction: 'none' }}
          >
            <StaticStars />
          </Canvas>
        </div>

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(${C} 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full min-h-[70vh]">

          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center text-center mb-16 md:mb-24"
          >
            <p
              className="inline-block text-[9px] sm:text-[10px] tracking-[.4em] uppercase mb-6 px-3 py-1 rounded-full"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                color: C,
                background: `${C}0a`,
                boxShadow: `inset 0 0 0 1px ${C}29`,
                animation: 'blink 3.5s ease-in-out infinite',
              }}
            >
              ◈ &nbsp;TECHNICAL_EXPERTISE&nbsp; ◈
            </p>

            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Core{' '}
              <span style={{
                background: `linear-gradient(90deg, ${P}, ${M}, ${C}, ${M}, ${P})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'tubelight-name 3s linear infinite',
                paddingBottom: '0.1em',
              }}>
                Tech Stack
              </span>
            </h2>

            <p
              className="mt-8 max-w-2xl text-sm md:text-base font-mono leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <span style={{ color: C }}>// </span>
              Building high-performance interfaces with modern primitives. Focused on smooth motion, scalable architecture, and pixel-perfect design realities.
            </p>
          </motion.div>

          {/* SKILL BUBBLES GRID */}
          <div className="w-full flex flex-col items-center justify-center gap-y-10 md:gap-y-12">
            {diamondRows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-x-10 sm:gap-x-12 md:gap-x-16">
                {row.map((sk) => (
                  <SkillBubble
                    key={sk.name}
                    skill={sk}
                    index={SKILLS.indexOf(sk)}
                    activeIndex={activeIndex}
                    onHover={handleHover}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}