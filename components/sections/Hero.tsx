'use client'

import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Preload } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

const OrbCanvas = dynamic(() => import('../3d/OrbCanvas'), { ssr: false })

const C = '#dff245' // Primary Lime
const M = '#3e8927' // Dark Green

// ── OPTIMIZED BACKGROUND PARTICLES (No Lag, No Jank) ──
function SyncedParticles() {
  const ref = useRef<THREE.Points>(null)
  
  // Memoize geometry so it's only created once
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 400
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C)
    const cM = new THREE.Color(M)
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*30
      pos[i*3+1] = (Math.random()-0.5)*30
      pos[i*3+2] = (Math.random()-0.5)*15 - 5 
      const c = Math.random() > 0.5 ? cC : cM
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  
  // Memoize material
  const mat = useMemo(() => (
    <pointsMaterial 
      size={0.06} 
      vertexColors 
      transparent 
      opacity={0.4}
      sizeAttenuation 
      blending={THREE.AdditiveBlending} 
      depthWrite={false} 
    />
  ), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.2
  })

  return (
    <points ref={ref} geometry={geo}>
      {mat}
    </points>
  )
}

const customStyles = `
  @keyframes tubelight-name {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes tubelight-sub {
    0% { background-position: 100% 50%; }
    100% { background-position: -100% 50%; }
  }
  @keyframes neon-border-spin {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  
  .name-tubelight {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 70%, #dff245 85%, #3e8927 92%, #ffffff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: tubelight-name 8s linear infinite;
  }

  .sub-tubelight {
    background: linear-gradient(90deg, #dff245, #ffffff, #5ac52f, #dff245);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: tubelight-sub 4s linear infinite;
  }

  .neon-btn {
    position: relative;
    padding: 1px;
    border-radius: 9999px;
    background: linear-gradient(90deg, #dff245, #3e8927, #5ac52f, #dff245);
    background-size: 200% auto;
    animation: neon-border-spin 3s linear infinite;
  }
  .neon-btn-inner {
    background: #050505;
    border-radius: 9999px;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }
  .neon-btn:hover .neon-btn-inner {
    background: transparent;
  }
`

const letterVariants = {
  initial: { opacity: 0, y: 5 },
  animate: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [5, 0, 0, 5],
    transition: {
      duration: 8,
      times: [0, 0.1, 0.9, 1],
      repeat: Infinity,
      repeatDelay: 1,
      delay: i * 0.08,
    }
  }),
}

export default function Hero() {
  const line1 = "Shahab Uddin".split("")
  const line2 = "Ali Khan".split("")

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#000000] pt-20 lg:pt-28 pb-10"
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* ── ULTRA LIGHTWEIGHT CANVAS (Solves WebGL Context Issue) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        >
          <SyncedParticles />
          <Sparkles count={40} scale={20} size={2} speed={0.3} color={C} opacity={0.3} />
          <Sparkles count={20} scale={15} size={1} speed={0.2} color={M} opacity={0.2} />
          <Preload all />
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 pointer-events-none">

        {/* TEXT */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start justify-center text-center lg:text-left order-2 lg:order-1">

          <h1
            className="font-syne font-black flex flex-col gap-1 w-full"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.1 }}
          >
            <div className="flex flex-wrap justify-center lg:justify-start name-tubelight drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
              {line1.map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  custom={i}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start name-tubelight drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
              {line2.map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  custom={line1.length + i}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ willChange: 'opacity' }}
            className="mt-6 lg:mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-2 lg:gap-4 w-full"
          >
            <p className="font-dm font-bold text-xs lg:text-sm tracking-[0.3em] uppercase sub-tubelight">
              Front-End
            </p>
            <span className="text-gray-700 font-light hidden sm:inline-block">|</span>
            <p className="font-dm font-bold text-xs lg:text-sm tracking-[0.3em] uppercase sub-tubelight">
              Back-End Developer
            </p>
          </motion.div>

          <motion.div
            className="mt-10 lg:mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-4 lg:gap-6 pointer-events-auto w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <a href="#projects" className="neon-btn group transition-transform hover:scale-105 shadow-[0_0_15px_rgba(223,242,69,0.2)]">
              <div className="neon-btn-inner">
                <span className="font-dm font-bold tracking-widest text-[10px] uppercase text-white">View Work</span>
              </div>
            </a>
            <a href="#contact" className="neon-btn group transition-transform hover:scale-105" style={{ animationDelay: '1.5s' }}>
              <div className="neon-btn-inner">
                <span className="font-dm font-bold tracking-widest text-[10px] uppercase text-gray-400 group-hover:text-white">Contact</span>
              </div>
            </a>
          </motion.div>
        </div>

        {/* ORB */}
        <div className="w-[300px] h-[300px] lg:w-[480px] lg:h-[480px] z-0 pointer-events-none order-1 lg:order-2 flex-shrink-0 flex items-center justify-center">
          <OrbCanvas />
        </div>
      </div>
    </section>
  )
}