'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// TypeScript Type
type SkillType = {
  name: string;
  sub: string;
  icon: string;
  color: string;
  pct: number;
  invert?: boolean;
}

// Palette Colors
const C = '#dff245'
const M = '#5ac52f'
const P = '#3e8927'

const SKILLS: SkillType[] = [
  { name: 'React / Next.js', sub: 'App Router · SSR', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', color: '#dff245', pct: 96 },
  { name: 'TypeScript', sub: 'Strict Typing', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#b4cc36', pct: 94 },
  { name: 'Three.js / WebGL', sub: '3D Graphics', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg', color: '#78a33c', pct: 88, invert: true },
  { name: 'CSS / Tailwind', sub: 'Modern Layouts', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', color: '#5ac52f', pct: 97 },
  { name: 'Framer Motion', sub: 'Interactive UI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg', color: '#3e8927', pct: 91, invert: true },
  { name: 'Node.js / APIs', sub: 'Scalable Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#dff245', pct: 85 },
  { name: 'UI/UX Design', sub: 'Figma Systems', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', color: '#b4cc36', pct: 89 },
  { name: 'Git / DevOps', sub: 'CI/CD Pipelines', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', color: '#5ac52f', pct: 87 },
]

// EXACT ORIGINAL BACKGROUND
function BgParticles() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry(), N = 700
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * 50
      pos[i * 3 + 1] = (Math.random() - .5) * 50
      pos[i * 3 + 2] = (Math.random() - .5) * 25
      const t = Math.random()
      if (t < .5) { col[i * 3] = 0.87; col[i * 3 + 1] = 0.95; col[i * 3 + 2] = 0.27 }
      else if (t < .8) { col[i * 3] = 0.35; col[i * 3 + 1] = 0.77; col[i * 3 + 2] = 0.18 }
      else { col[i * 3] = 0.24; col[i * 3 + 1] = 0.53; col[i * 3 + 2] = 0.15 }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) { ref.current.rotation.y = t * .011; ref.current.rotation.x = t * .006 }
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={.065} vertexColors transparent opacity={.55} sizeAttenuation />
    </points>
  )
}

function SkillBubble({ skill, index, activeIndex, onHover, isMobile }: { skill: SkillType; index: number; activeIndex: number | null; onHover: (i: number | null) => void; isMobile: boolean }) {
  const isHovered = activeIndex === index
  const expandedWidth = isMobile ? 280 : 330 

  return (
    <div className="relative flex-shrink-0" style={{ width: '85px', height: '85px', zIndex: isHovered ? 50 : 10 }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none">
        
        <motion.div
          onClick={() => isMobile && onHover(isHovered ? null : index)}
          onMouseEnter={() => !isMobile && onHover(index)}
          onMouseLeave={() => !isMobile && onHover(null)}
          animate={{ width: isHovered ? expandedWidth : 85, y: [-3, 3, -3] }}
          transition={{ width: { type: "spring", stiffness: 350, damping: 25 }, y: { duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut" } }}
          className="flex items-center overflow-hidden cursor-pointer pointer-events-auto"
          style={{
            height: '85px',
            background: isHovered ? 'rgba(15, 15, 15, 0.98)' : 'rgba(25, 25, 25, 0.4)',
            border: `1px solid ${isHovered ? skill.color : 'rgba(255,255,255,0.08)'}`,
            borderRadius: isHovered ? '45px' : '50%',
            padding: '12px',
            paddingRight: isHovered ? (isMobile ? '20px' : '28px') : '12px',
            backdropFilter: 'blur(16px)',
            boxShadow: isHovered ? `0 20px 45px rgba(0,0,0,0.7), inset 0 0 15px ${skill.color}20` : '0 4px 15px rgba(0,0,0,0.3)',
            willChange: 'width, transform'
          }}
        >
          <div 
            className="flex-shrink-0 flex items-center justify-center rounded-full z-10"
            style={{
              width: '59px', height: '59px',
              background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)`, 
              boxShadow: `inset 0 0 15px ${skill.color}50, 0 0 10px rgba(0,0,0,0.5)`,
              border: `1px solid rgba(255,255,255,0.1)`
            }}
          >
            <img 
              src={skill.icon} alt={skill.name} 
              style={{ width: '32px', height: '32px', objectFit: 'contain', filter: skill.invert ? 'brightness(0) invert(1)' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} 
            />
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }} transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
                className={`${isMobile ? 'ml-4' : 'ml-6'} flex-1 min-w-0 flex flex-col justify-center whitespace-nowrap`}
              >
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-extrabold text-[15px] sm:text-[16px]" style={{ color: skill.color, fontFamily: "'Syne', sans-serif" }}>{skill.name}</span>
                  <span className="font-bold text-[13px] sm:text-[14px]" style={{ color: skill.color, fontFamily: "'JetBrains Mono', monospace" }}>{skill.pct}%</span>
                </div>
                <p className="text-[10px] sm:text-[11.5px] mb-2.5 sm:mb-3 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>{skill.sub}</p>
                <div className="w-full h-[4px] rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${skill.pct}%` }} transition={{ duration: 0.6, ease: "circOut" }}
                    className="h-full rounded-full absolute left-0 top-0" style={{ background: `linear-gradient(90deg, ${skill.color}50, ${skill.color})`, boxShadow: `0 0 10px ${skill.color}` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}

export default function Skills() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleHover = useCallback((i: number | null) => setActiveIndex(i), [])

  const diamondRows = [
    [SKILLS[0]],                             
    [SKILLS[1], SKILLS[2]],                  
    [SKILLS[3], SKILLS[4], SKILLS[5]],       
    [SKILLS[6], SKILLS[7]]                   
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;600&display=swap');
        @keyframes tubelight-name { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes bgDrift { to { background-position: 0 52px; } }
        @keyframes blink { 0%, 100% { opacity: .15 } 50% { opacity: .45 } }
        @keyframes pulse-hint { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; transform: scale(1.02); } }

        .sk-grid {
          background-image:
            linear-gradient(rgba(223,242,69,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(223,242,69,0.016) 1px, transparent 1px);
          background-size: 52px 52px;
          animation: bgDrift 12s linear infinite;
        }
      `}} />

      <section id="skills" className="relative min-h-screen w-full overflow-hidden pt-40 lg:pt-56 pb-40 lg:pb-64 px-4 sm:px-6 lg:px-12" style={{ background: '#000000' }}> 

        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
            <BgParticles />
            <Sparkles count={250} scale={22} size={1.8} speed={.25} color={C} opacity={.55} />
            <Sparkles count={80} scale={18} size={1.2} speed={.18} color={M} opacity={.4} />
            <Sparkles count={50} scale={12} size={.8} speed={.4} color={P} opacity={.3} />
          </Canvas>
        </div>

        <div className="absolute inset-0 z-0 sk-grid pointer-events-none" />
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full" style={{ top:'20%',left:'22%',width:550,height:550, background:`radial-gradient(circle,${C}05 0%,transparent 62%)`,transform:'translate(-50%,-50%)' }} />
          <div className="absolute rounded-full" style={{ bottom:'15%',right:'18%',width:420,height:420, background:`radial-gradient(circle,${M}05 0%,transparent 62%)`,transform:'translate(50%,50%)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-10 md:mb-12 flex flex-col items-center">
            <motion.p initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false, amount: 0.5 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="inline-block text-[9px] sm:text-[10px] tracking-[.4em] uppercase mb-2 px-3 py-1 rounded-full"
              style={{ fontFamily:"'JetBrains Mono',monospace", color:C, background:`${C}0a`, boxShadow:`inset 0 0 0 1px ${C}29`, animation:'blink 3.5s ease-in-out infinite' }}>
              ◈ &nbsp;TECHNICAL_EXPERTISE&nbsp; ◈
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 25, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.5 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="font-extrabold uppercase leading-tight mt-4 md:mt-8 flex flex-wrap justify-center items-center gap-x-4 w-full"
              style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-.02em', fontSize: 'clamp(1.8rem, 4.5vw, 4rem)' }}>
              <span className="text-white drop-shadow-md">Core</span>
              <span style={{ background: `linear-gradient(90deg, ${P}, ${M}, ${C}, ${M}, ${P})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'tubelight-name 3s linear infinite', paddingBottom: '0.1em' }}>
                Tech Stack
              </span>
            </motion.h2>
          </div>

          {/* 🔥 RESTORED DESCRIPTION & NEW HINT 🔥 */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="max-w-2xl text-center mb-16 rounded-2xl p-6 relative overflow-hidden" 
            style={{ background:'rgba(255,255,255,0.02)', boxShadow:`inset 0 0 0 1px rgba(255,255,255,0.05)` }}>
            
            <p className="text-[14px] leading-relaxed mb-6" style={{ color:'rgba(255,255,255,0.6)', fontFamily:"'JetBrains Mono',monospace" }}>
              <span style={{ color:C }}>// </span>
              I'm a passionate developer who loves crafting <span className="text-white font-semibold">elegant, lightning-fast web experiences</span>. I focus on writing clean, scalable code and turning complex logic into user-friendly digital realities that feel completely natural.
            </p>

            {/* Glowing Instruction Hint */}
            <div 
              className="inline-block px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold"
              style={{ 
                color: C, 
                background: `rgba(223, 242, 69, 0.08)`, 
                border: `1px solid rgba(223, 242, 69, 0.2)`,
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'pulse-hint 3s infinite'
              }}
            >
              ✦ {isMobile ? "Tap" : "Hover over"} the nodes below to reveal expertise levels
            </div>
          </motion.div>

          <div className="w-full flex flex-col items-center justify-center gap-y-6 sm:gap-y-8 md:gap-y-12 max-w-4xl px-2 py-4">
            {diamondRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row justify-center items-center gap-x-6 sm:gap-x-8 md:gap-x-12 w-full">
                {row.map((sk) => {
                  const originalIndex = SKILLS.indexOf(sk) 
                  return (
                    <SkillBubble 
                      key={sk.name} skill={sk} index={originalIndex} 
                      activeIndex={activeIndex} onHover={handleHover} isMobile={isMobile}
                    />
                  )
                })}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}