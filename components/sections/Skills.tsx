  'use client'

  import { useRef, useMemo, Suspense, useState, useCallback, useEffect } from 'react'
  import { Canvas, useFrame, useThree } from '@react-three/fiber'
  import { OrbitControls, Sparkles, Html } from '@react-three/drei'
  import * as THREE from 'three'
  import { motion, AnimatePresence } from 'framer-motion'

  // New Palette Colors
  const C = '#dff245' // Primary Lime
  const M = '#5ac52f' // Bright Green
  const P = '#3e8927' // Deep Green
  const W = '#FFFFFF'
  const G1 = '#78a33c' // Olive Green
  const G2 = '#b4cc36' // Light Lime

  // Updated SKILLS array with the new color palette
  const SKILLS = [
    { name: 'React / Next.js', sub: 'App Router · SSR · RSC', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', color: '#dff245', pct: 96, radius: 0.9, speed: 0.90, phase: 0 },
    { name: 'TypeScript', sub: 'Strict Typing · Generics', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#b4cc36', pct: 94, radius: 1.30, speed: 0.68, phase: 0.8 },
    { name: 'Three.js / WebGL', sub: '3D Graphics · Shaders', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg', color: '#78a33c', pct: 88, radius: 1.72, speed: 0.50, phase: 1.6 },
    { name: 'CSS / Tailwind', sub: 'Modern Layouts · Animations', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', color: '#5ac52f', pct: 97, radius: 2.15, speed: 0.38, phase: 2.4 },
    { name: 'Framer Motion', sub: 'Interactive UI · Gestures', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg', color: '#3e8927', pct: 91, radius: 2.60, speed: 0.28, phase: 3.2 },
    { name: 'Node.js / APIs', sub: 'Scalable Backend · REST', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#dff245', pct: 85, radius: 3.08, speed: 0.20, phase: 4.0 },
    { name: 'UI/UX Design', sub: 'Figma · Design Systems', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', color: '#b4cc36', pct: 89, radius: 3.56, speed: 0.14, phase: 4.8 },
    { name: 'Git / DevOps', sub: 'CI/CD · Deployments', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', color: '#5ac52f', pct: 87, radius: 4.00, speed: 0.10, phase: 5.6 },
  ]

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
        // Normalized RGB values for #dff245, #5ac52f, #3e8927
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

  function NeonCubeSun() {
    const cubeRef = useRef<THREE.Mesh>(null)
    const innerRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const r1 = useRef<THREE.Mesh>(null)
    const r2 = useRef<THREE.Mesh>(null)
    const r3 = useRef<THREE.Mesh>(null)

    const edgeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: C, wireframe: true }), [])
    const faceMat = useMemo(() => new THREE.MeshStandardMaterial({
      color: C, emissive: C, emissiveIntensity: 1.4,
      transparent: true, opacity: 0.18, roughness: 0, metalness: 1,
    }), [])
    const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
      color: C, emissive: C, emissiveIntensity: 3,
      transparent: true, opacity: 0.6, roughness: 0, metalness: 1,
    }), [])
    const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
      color: C, transparent: true, opacity: 0.07, side: THREE.BackSide,
    }), [])
    const r1m = useMemo(() => new THREE.MeshBasicMaterial({ color: C, transparent: true, opacity: 0.7 }), [])
    const r2m = useMemo(() => new THREE.MeshBasicMaterial({ color: M, transparent: true, opacity: 0.55 }), [])
    const r3m = useMemo(() => new THREE.MeshBasicMaterial({ color: P, transparent: true, opacity: 0.45 }), [])

    useFrame(({ clock }) => {
      const t = clock.elapsedTime
      if (cubeRef.current) {
        cubeRef.current.rotation.y = t * 0.55
        cubeRef.current.rotation.x = t * 0.35
        cubeRef.current.rotation.z = t * 0.22
      }
      if (innerRef.current) {
        innerRef.current.rotation.y = -t * 0.8
        innerRef.current.rotation.x = t * 0.5
        const ei = 2.5 + Math.sin(t * 2.5) * 1.5
        ;(innerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = ei
      }
      if (glowRef.current) {
        const s = 1 + Math.sin(t * 1.8) * 0.08
        glowRef.current.scale.setScalar(s)
      }
      if (r1.current) { r1.current.rotation.z = t * 0.6; r1.current.rotation.x = 0.4 }
      if (r2.current) { r2.current.rotation.x = t * 0.45; r2.current.rotation.z = 0.8 }
      if (r3.current) { r3.current.rotation.y = t * 0.5; r3.current.rotation.x = 1.2 }
    })

    return (
      <group>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <primitive object={glowMat} />
        </mesh>
        <mesh ref={cubeRef}>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <primitive object={edgeMat} />
        </mesh>
        <mesh ref={cubeRef}>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <primitive object={faceMat} />
        </mesh>
        <mesh ref={innerRef}>
          <boxGeometry args={[0.24, 0.24, 0.24]} />
          <primitive object={innerMat} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh ref={r1}>
          <torusGeometry args={[0.58, 0.010, 8, 100]} />
          <primitive object={r1m} />
        </mesh>
        <mesh ref={r2}>
          <torusGeometry args={[0.52, 0.008, 8, 100]} />
          <primitive object={r2m} />
        </mesh>
        <mesh ref={r3}>
          <torusGeometry args={[0.46, 0.006, 8, 100]} />
          <primitive object={r3m} />
        </mesh>

        <pointLight color={C} intensity={6} distance={5} />
        <pointLight color={M} intensity={2.5} distance={7} position={[0.3, 0.2, 0.3]} />
        <pointLight color={P} intensity={1.8} distance={6} position={[-0.3, -0.2, -0.3]} />
      </group>
    )
  }

  function OrbitRing({ radius, color }: { radius: number; color: string }) {
    const mat = useMemo(() => new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.13,
    }), [color])
    
    return (
      <mesh>
        <torusGeometry args={[radius, 0.005, 8, 180]} />
        <primitive object={mat} />
      </mesh>
    )
  }

  function PlanetNode({ skill, index, onHover, activeIndex, isMobile }:
    { skill: typeof SKILLS[0]; index: number; onHover: (i: number | null) => void; activeIndex: number | null; isMobile: boolean }) {
    const groupRef = useRef<THREE.Group>(null)
    const isActive = activeIndex === index
    const isOther = activeIndex !== null && !isActive

    useFrame(({ clock }) => {
      const t = clock.elapsedTime
      const angle = skill.phase + t * skill.speed
      const x = Math.cos(angle) * skill.radius
      const y = Math.sin(angle) * skill.radius
      
      if (groupRef.current) groupRef.current.position.set(x, y, 0)
    })

    return (
      <group ref={groupRef}>
        <Html center distanceFactor={6} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div 
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              transition: 'opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              opacity: isOther ? 0.45 : 1, 
              transform: isActive ? 'scale(1.35)' : (isMobile ? 'scale(0.85)' : 'scale(1)'),
              pointerEvents: 'auto', 
              cursor: 'pointer',
              willChange: 'transform, opacity'
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(10, 10, 10, 0.85)',
              border: `1px solid ${skill.color}77`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isActive ? `0 0 20px ${skill.color}90` : `0 0 8px ${skill.color}40`,
              backdropFilter: 'blur(8px)',
            }}>
              <img src={skill.icon} alt={skill.name} style={{
                width: 20, height: 20, objectFit: 'contain',
                filter: skill.icon.includes('threejs') ? 'invert(1)' : undefined,
              }} />
            </div>
            
            <AnimatePresence>
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                background: 'rgba(10, 10, 10, 0.94)',
                border: `1px solid ${skill.color}30`,
                borderRadius: 7, padding: '5px 10px',
                textAlign: 'center', backdropFilter: 'blur(14px)',
                boxShadow: `0 0 22px ${skill.color}22`,
                whiteSpace: 'nowrap', marginTop: 2,
              }}>
                <p style={{ color: skill.color, fontSize: 11, fontWeight: 700, fontFamily: 'Syne,sans-serif', margin: 0 }}>{skill.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 8.5, fontFamily: 'JetBrains Mono,monospace', margin: '2px 0 0' }}>{skill.sub}</p>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${skill.pct}%`, background: `linear-gradient(90deg,${skill.color}60,${skill.color})` }} />
                </div>
                <p style={{ color: skill.color, fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', margin: '3px 0 0' }}>{skill.pct}%</p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </Html>
      </group>
    )
  }

  function SolarScene({ onHover, activeIndex, isMobile }:
    { onHover: (i: number | null) => void; activeIndex: number | null; isMobile: boolean }) {
    
    const { camera } = useThree()

    useFrame(() => {
      const targetZ = isMobile ? 13.5 : 9.5
      camera.position.z += (targetZ - camera.position.z) * 0.05
    })

    return (
      <>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 8, 4]} color="#ffffff" intensity={2.5} />
        <pointLight position={[-6, 3, -4]} color={M} intensity={1.5} />
        <pointLight position={[6, 3, 4]} color={P} intensity={1.2} />
        
        <NeonCubeSun />
        
        {SKILLS.map((sk) => (
          <OrbitRing key={`ring-${sk.name}`} radius={sk.radius} color={sk.color} />
        ))}
        {SKILLS.map((sk, i) => (
          <PlanetNode key={sk.name} skill={sk} index={i} onHover={onHover} activeIndex={activeIndex} isMobile={isMobile} />
        ))}
        
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </>
    )
  }

  function SkillCard({ skill, index, isActive, onHover }:
    { skill: typeof SKILLS[0]; index: number; isActive: boolean; onHover: (i: number | null) => void }) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.1, margin: '-10px' }} 
        transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
        whileHover={{ scale: 1.025, y: -2 }}
        className="cursor-pointer will-change-transform"
        onHoverStart={() => onHover(index)}
        onHoverEnd={() => onHover(null)}
      >
        <div className="relative p-3.5 rounded-xl overflow-hidden transition-all duration-300"
          style={{
            background: isActive ? `${skill.color}0f` : 'rgba(255,255,255,0.013)',
            boxShadow: isActive
              ? `inset 0 0 0 1px ${skill.color}45, 0 8px 24px ${skill.color}18`
              : `inset 0 0 0 1px rgba(255,255,255,0.045)`,
          }}>
          <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(90deg,transparent,${skill.color}aa,transparent)` }}
            initial={{ top: '-1px', opacity: 0 }}
            animate={isActive ? { top: '101%', opacity: [0, 1, 0] } : { top: '-1px', opacity: 0 }}
            transition={{ duration: 0.6, ease: 'linear' }} />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
              style={{ background: `${skill.color}15`,
                boxShadow: isActive ? `0 0 15px ${skill.color}40` : 'none' }}>
              <img src={skill.icon} alt={skill.name} className="w-[17px] h-[17px] object-contain"
                style={skill.icon.includes('threejs') ? { filter: 'invert(1)' } : undefined} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate leading-tight transition-colors duration-300"
                style={{ fontFamily: "'Syne',sans-serif", color: isActive ? skill.color : '#fff' }}>{skill.name}</p>
              <p className="text-[10px] truncate mt-0.5 transition-colors duration-300"
                style={{ color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono',monospace" }}>{skill.sub}</p>
            </div>
            <span className="text-[12px] font-bold shrink-0"
              style={{ color: skill.color, fontFamily: "'JetBrains Mono',monospace" }}>{skill.pct}%</span>
          </div>
          <div className="h-[2px] rounded-full overflow-hidden mt-3 relative z-10"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${skill.color}50,${skill.color})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.pct}%` }}
              viewport={{ once: false }} 
              transition={{ duration: 1.2, delay: 0.2 + index * 0.05, ease: "circOut" }} />
          </div>
        </div>
      </motion.div>
    )
  }

  export default function Skills() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    const handleHover = useCallback((i: number | null) => setActiveIndex(i), [])
    const activeSkill = activeIndex !== null ? SKILLS[activeIndex] : null

    useEffect(() => {
      if (typeof window === 'undefined') return
      const handleResize = () => setIsMobile(window.innerWidth < 1024)
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
      <>
        <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;600&display=swap');
    
    @keyframes tubelight-name {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @keyframes bgDrift { 
      to { background-position: 0 52px; } 
    }
    
    @keyframes blink { 
      0%, 100% { opacity: .15 } 
      50% { opacity: .45 } 
    }

    .sk-grid {
      background-image:
        linear-gradient(rgba(223,242,69,0.016) 1px, transparent 1px),
        linear-gradient(90deg, rgba(223,242,69,0.016) 1px, transparent 1px);
      background-size: 52px 52px;
      animation: bgDrift 12s linear infinite;
    }
  `}</style>

        <section id="skills"
          className="relative min-h-screen w-full overflow-hidden pt-48 lg:pt-64 pb-48 lg:pb-72 px-4 sm:px-6 lg:px-12"
          style={{ background: '#000000' }}> 

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
            <div className="absolute rounded-full" style={{ top:'20%',left:'22%',width:550,height:550,
              background:`radial-gradient(circle,${C}05 0%,transparent 62%)`,transform:'translate(-50%,-50%)' }} />
            <div className="absolute rounded-full" style={{ bottom:'15%',right:'18%',width:420,height:420,
              background:`radial-gradient(circle,${M}05 0%,transparent 62%)`,transform:'translate(50%,50%)' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">

            {/* ── HEADER ── */}
            <div className="text-center mb-20 md:mb-24 flex flex-col items-center">
              <motion.p initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false, amount: 0.5 }} 
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="inline-block text-[9px] sm:text-[10px] tracking-[.4em] uppercase mb-2 px-3 py-1 rounded-full"
                style={{ fontFamily:"'JetBrains Mono',monospace", color:C,
                  background:`${C}0a`,
                  boxShadow:`inset 0 0 0 1px ${C}29`,
                  animation:'blink 3.5s ease-in-out infinite' }}>
                ◈ &nbsp;TECHNICAL_EXPERTISE&nbsp; ◈
              </motion.p>

            <motion.h2
    initial={{ opacity: 0, y: 25, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false, amount: 0.5 }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
    className="font-extrabold uppercase leading-tight mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-x-4 w-full"
    style={{
      fontFamily: "'Syne',sans-serif",
      letterSpacing: '-.02em',
      fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
    }}
  >
    <span className="text-white drop-shadow-md">Core</span>
    <span
      style={{
        background: `linear-gradient(90deg, ${P}, ${M}, ${C}, ${M}, ${P})`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'tubelight-name 3s linear infinite',
        paddingBottom: '0.1em',
      }}
    >
      Tech Stack
    </span>
  </motion.h2>

              <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false, amount: 0.5 }} 
                transition={{ duration:.5, delay:.3, ease: "easeOut" }}
                className="mt-4 text-[9px] sm:text-[10px] tracking-[.3em] uppercase"
                style={{ color:'rgba(255,255,255,0.15)',fontFamily:"'JetBrains Mono',monospace" }}>
                hover any node to inspect · interactive ecosystem
              </motion.p>
            </div>

            {/* ── BODY ── */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center justify-between w-full">

              {/* VISUAL CANVAS SIDE */}
              <motion.div
                className="w-full lg:w-[50%] relative flex-shrink-0 mx-auto"
                style={{ height: 'clamp(400px, 95vw, 560px)', maxWidth: '560px' }}
                initial={{ opacity:0, scale: 0.95 }} whileInView={{ opacity:1, scale: 1 }} viewport={{ once:false, amount: 0.2 }} 
                transition={{ duration:.8, ease: "easeOut" }}
              >
                {[
                  { top:0, left:0, borderTop:`1px solid ${C}38`, borderLeft:`1px solid ${C}38` },
                  { top:0, right:0, borderTop:`1px solid ${C}38`, borderRight:`1px solid ${C}38` },
                  { bottom:0, left:0, borderBottom:`1px solid ${C}38`, borderLeft:`1px solid ${C}38` },
                  { bottom:0, right:0, borderBottom:`1px solid ${C}38`, borderRight:`1px solid ${C}38` },
                ].map((s, i) => (
                  <span key={i} className="absolute w-5 h-5 z-20 pointer-events-none"
                    style={{ ...s, animation:`blink ${2.2+i*.3}s ease-in-out infinite` }} />
                ))}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full text-center">
                  <AnimatePresence mode="wait">
                    {activeSkill ? (
                      <motion.p key={activeSkill.name}
                        initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                          color:activeSkill.color,textTransform:'uppercase',letterSpacing:'.2em' }}>
                        ▶ {activeSkill.name} — {activeSkill.pct}%
                      </motion.p>
                    ) : (
                      <motion.p key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                          color:'rgba(255,255,255,0.16)',textTransform:'uppercase',letterSpacing:'.2em' }}>
                        {SKILLS.length} 
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <motion.div className="absolute left-0 right-0 h-px"
                    style={{ background:`linear-gradient(90deg,transparent,${C}40,transparent)` }}
                    animate={{ top:['0%','100%'] }}
                    transition={{ duration:7,repeat:Infinity,ease:'linear',repeatDelay:1.5 }} />
                </div>

                <Suspense fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="animate-pulse" style={{ color:C,fontFamily:"'JetBrains Mono',monospace",
                      fontSize:10,textTransform:'uppercase',letterSpacing:'.4em' }}>
                      Initializing…
                    </p>
                  </div>
                }>
                  <Canvas
                    dpr={[1, 2]} 
                    camera={{ position: [0, 0, 9.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <SolarScene onHover={handleHover} activeIndex={activeIndex} isMobile={isMobile} />
                  </Canvas>
                </Suspense>
              </motion.div>

              {/* SKILLS CONTENT SIDE */}
              <div className="w-full lg:w-[48%] flex flex-col gap-6"> 
                
                <motion.div initial={{ opacity:0, x:25 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:false, amount: 0.5 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="rounded-2xl p-5 mb-2" 
                  style={{ background:'rgba(255,255,255,0.013)',
                    boxShadow:`inset 0 0 0 1px rgba(255,255,255,0.042), inset 2px 0 0 ${C}80` }}>
                  <p className="text-[13px] leading-[1.8]"
                    style={{ color:'rgba(255,255,255,0.4)',fontFamily:"'JetBrains Mono',monospace" }}>
                    <span style={{ color:C }}>// </span>
                    I specialize in building <span className="text-white font-semibold">scalable, high-performance web applications</span>.
                    My approach focuses on clean architecture, type-safety, and creating seamless user experiences.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {SKILLS.map((sk, i) => (
                    <SkillCard key={sk.name} skill={sk} index={i}
                      isActive={activeIndex === i} onHover={handleHover} />
                  ))}
                </div>

                <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false, amount: 0.5 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="grid grid-cols-3 gap-4 mt-4"> 
                  {[
                    { val:'3+', label:'Years of Exp.', color:C },
                    { val:'20+', label:'Solutions Live', color:M },
                    { val:'∞', label:'Optimization', color:P },
                  ].map(({ val,label,color }) => (
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -4, boxShadow: `inset 0 0 0 1px ${color}40, 0 4px 15px ${color}15` }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      key={label} className="rounded-xl p-3.5 text-center cursor-pointer will-change-transform"
                      style={{ background:`${color}07`, boxShadow:`inset 0 0 0 1px ${color}14` }}>
                      <div className="text-2xl font-extrabold"
                        style={{ color, fontFamily:"'Syne',sans-serif" }}>{val}</div>
                      <div className="text-[10px] mt-1 uppercase tracking-wide"
                        style={{ color:'rgba(255,255,255,0.3)',fontFamily:"'JetBrains Mono',monospace" }}>{label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </>
    )
  }