'use client'

import { motion, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Sphere, Torus, Icosahedron } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

const C = '#dff245'
const M = '#3e8927'
const P = '#5ac52f'
const W = '#FFFFFF'

const customStyles = `
  @keyframes text-shine-effect {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes text-shine-sub {
    0% { background-position: 100% 50%; }
    100% { background-position: -100% 50%; }
  }
  @keyframes stats-glow-c {
    0%, 100% { box-shadow: none; opacity: 0.1; }
    30% { box-shadow: 0 0 18px rgba(223,242,69,0.35); opacity: 0.8; }
    60% { box-shadow: 0 0 4px rgba(223,242,69,0.1); opacity: 0.3; }
    80% { box-shadow: 0 0 22px rgba(223,242,69,0.45); opacity: 0.9; }
  }
  @keyframes stats-glow-m {
    0%, 100% { box-shadow: none; opacity: 0.1; }
    30% { box-shadow: 0 0 18px rgba(62,137,39,0.35); opacity: 0.8; }
    60% { box-shadow: 0 0 4px rgba(62,137,39,0.1); opacity: 0.3; }
    80% { box-shadow: 0 0 22px rgba(62,137,39,0.45); opacity: 0.9; }
  }
  .animate-gradient-text {
    background: linear-gradient(90deg, #ffffff 0%, #ffffff 70%, #dff245 85%, #3e8927 92%, #ffffff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: text-shine-effect 8s linear infinite;
  }
  .animate-gradient-sub {
    background: linear-gradient(90deg, #dff245, #ffffff, #5ac52f, #dff245);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: text-shine-sub 4s linear infinite;
  }
  .stat-card-c { animation: stats-glow-c 4s linear infinite; }
  .stat-card-m { animation: stats-glow-m 4s linear infinite; }
`

function ease(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }
function elastic(t: number) {
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1
}

function Rings() {
  const g = useRef<THREE.Group>(null)
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const c = useRef<THREE.Mesh>(null)
  const mC = useMemo(() => new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2.5, transparent: true, opacity: 0.75 }), [])
  const mM = useMemo(() => new THREE.MeshStandardMaterial({ color: M, emissive: M, emissiveIntensity: 2, transparent: true, opacity: 0.6 }), [])
  const mP = useMemo(() => new THREE.MeshStandardMaterial({ color: P, emissive: P, emissiveIntensity: 1.8, transparent: true, opacity: 0.5 }), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, cy = t % 12
    let v = 0
    if (cy < 2.5) v = ease(cy / 2.5); else if (cy < 7.5) v = 1; else if (cy < 10) v = 1 - ease((cy - 7.5) / 2.5)
    if (g.current) g.current.scale.setScalar(v)
    // Reduced segment counts on torus: 8,96 -> 6,80
    if (a.current) a.current.rotation.z = t * 0.55
    if (b.current) { b.current.rotation.x = t * 0.38; b.current.rotation.z = t * 0.2 }
    if (c.current) { c.current.rotation.y = t * 0.72; c.current.rotation.x = t * 0.28 }
  })
  return (
    <group ref={g}>
      <mesh ref={a as any}><torusGeometry args={[1.9, 0.013, 6, 80]} /><primitive object={mC} /></mesh>
      <mesh ref={b as any}><torusGeometry args={[2.25, 0.009, 6, 80]} /><primitive object={mM} /></mesh>
      <mesh ref={c as any}><torusGeometry args={[2.55, 0.007, 6, 80]} /><primitive object={mP} /></mesh>
    </group>
  )
}

function Core() {
  const g = useRef<THREE.Group>(null)
  const wf = useMemo(() => new THREE.MeshBasicMaterial({ color: C, wireframe: true, transparent: true, opacity: 0.55 }), [])
  const r1 = useMemo(() => new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 3 }), [])
  const r2 = useMemo(() => new THREE.MeshStandardMaterial({ color: M, emissive: M, emissiveIntensity: 2.5 }), [])
  const dt = useMemo(() => new THREE.MeshStandardMaterial({ color: W, emissive: W, emissiveIntensity: 4 }), [])
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.03, 6, 6), [])
  const dotMatC = useMemo(() => new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 5 }), [])
  const dotMatM = useMemo(() => new THREE.MeshStandardMaterial({ color: M, emissive: M, emissiveIntensity: 5 }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime, cy = t % 12
    let v = 0
    if (cy < 2.5) v = ease(cy / 2.5); else if (cy < 7.5) v = 1; else if (cy < 10) v = 1 - ease((cy - 7.5) / 2.5)
    const sp = 1 + v * 4.5
    if (g.current) { g.current.rotation.y = t * sp; g.current.rotation.x = t * sp * 0.45 }
  })
  return (
    <group ref={g}>
      <Icosahedron args={[0.55, 1]} material={wf} />
      <Torus args={[0.56, 0.014, 6, 60]} rotation={[Math.PI / 2, 0, 0]} material={r1} />
      <Torus args={[0.56, 0.010, 6, 60]} rotation={[0, 0, Math.PI / 4]} material={r2} />
      <Sphere args={[0.17, 12, 12]} material={dt} />
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.55, Math.sin(angle) * 0.27, Math.sin(angle) * 0.3]}
            geometry={dotGeo}
            material={i % 2 === 0 ? dotMatC : dotMatM}
          />
        )
      })}
    </group>
  )
}

function Shells() {
  const L = useRef<THREE.Group>(null), R = useRef<THREE.Group>(null)
  const gl = useRef<THREE.Mesh>(null)
  const sh = useMemo(() => new THREE.MeshStandardMaterial({ color: '#080808', metalness: 1, roughness: 0.04 }), [])
  const ec = useMemo(() => new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2.5 }), [])
  const em = useMemo(() => new THREE.MeshStandardMaterial({ color: M, emissive: M, emissiveIntensity: 2 }), [])
  const ep = useMemo(() => new THREE.MeshStandardMaterial({ color: P, emissive: P, emissiveIntensity: 1.8, transparent: true, opacity: 0.5 }), [])
  const gm = useMemo(() => new THREE.MeshBasicMaterial({ color: C, transparent: true, opacity: 0, side: THREE.BackSide }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime, cy = t % 12
    let v = 0
    if (cy < 2.5) v = ease(cy / 2.5); else if (cy < 7.5) v = 1; else if (cy < 10) v = 1 - ease((cy - 7.5) / 2.5)
    if (L.current) L.current.position.x = -v * 2.3
    if (R.current) R.current.position.x = v * 2.3
    if (gl.current) { gl.current.scale.setScalar(v * (0.9 + Math.sin(clock.elapsedTime * 3) * 0.08)); gm.opacity = v * 0.12 }
  })
  return (
    <>
      <mesh ref={gl as any} scale={0}><sphereGeometry args={[1.7, 24, 24]} /><primitive object={gm} /></mesh>
      <group ref={L}>
        <Sphere args={[1.3, 48, 48, Math.PI / 2, Math.PI]} material={sh} />
        <Torus args={[1.32, 0.018, 10, 96, Math.PI]} rotation={[0, 0, Math.PI / 2]} material={ec} />
        <Torus args={[0.88, 0.008, 6, 48, Math.PI]} rotation={[0, 0, Math.PI / 2]} position={[0.1, 0, 0]} material={em} />
        <Torus args={[0.50, 0.006, 6, 48, Math.PI]} rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]} material={ep} />
      </group>
      <group ref={R}>
        <Sphere args={[1.3, 48, 48, -Math.PI / 2, Math.PI]} material={sh} />
        <Torus args={[1.32, 0.018, 10, 96, Math.PI]} rotation={[0, 0, -Math.PI / 2]} material={ec} />
        <Torus args={[0.88, 0.008, 6, 48, Math.PI]} rotation={[0, 0, -Math.PI / 2]} position={[-0.1, 0, 0]} material={em} />
        <Torus args={[0.50, 0.006, 6, 48, Math.PI]} rotation={[0, 0, -Math.PI / 2]} position={[-0.2, 0, 0]} material={ep} />
      </group>
    </>
  )
}

// Removed HoloCard (Html/R3F) — it's extremely expensive on mobile (forces a DOM layer per frame)
// Replaced with a 2D overlay positioned absolutely over the canvas, same visual info

// Synced background particles
function BgParticles() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 220
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C), cM = new THREE.Color(M)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
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

const stats = [
  { num: '3+',  label: 'Years of Mastery',     col: C, cssClass: 'stat-card-c' },
  { num: '20+', label: 'Projects Shipped',      col: M, cssClass: 'stat-card-m' },
  { num: '∞',   label: 'Drive for Perfection',  col: P, cssClass: 'stat-card-c' },
  { num: '1',   label: 'Core Philosophy',       col: C, cssClass: 'stat-card-m' },
]

const EASE = [0.22, 1, 0.36, 1] as const

export default function About() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden pt-56 md:pt-72 pb-48 md:pb-64 px-5 md:px-12"
      style={{ backgroundColor: '#000000', minHeight: '100vh' }}
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Background canvas — pointer events disabled */}
      <div
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none', touchAction: 'none' }}
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 12], fov: 75 }}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
          style={{ pointerEvents: 'none', touchAction: 'none' }}
        >
          <BgParticles />
          <Sparkles count={50} scale={22} size={1.8} speed={0} noise={0.1} color={C} opacity={0.45} />
          <Sparkles count={20} scale={18} size={1.2} speed={0} noise={0.1} color={M} opacity={0.3} />
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-[88rem] mx-auto">
        {/* HEADING */}
        <div className="text-center mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: '-50px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[9px] md:text-[10px] tracking-[.55em] uppercase font-bold mb-4" style={{ color: M }}>
              Engineering Identity
            </p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3, margin: '-40px' }}
              transition={{ duration: 1.0, type: 'spring', stiffness: 120, damping: 20 }}
              className="font-syne font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[.9] mb-3 animate-gradient-text"
              style={{ willChange: 'transform' }}
            >
              Shahab Udin.
            </motion.h2>
            <h3 className="font-syne font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tighter leading-tight animate-gradient-sub">
              Forged in Mountains, Sharpened in Code.
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* LEFT TEXT */}
          <motion.div
            className="order-2 lg:order-1 flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-4 max-w-lg">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: W, fontWeight: 700 }}>I am Shahab Udin Ali Khan</span> — 23-year-old engineer Born of the rugged peaks of{' '}
                <span style={{ color: C, fontWeight: 600 }}>Madijan, South Waziristan</span>. Where the mountains don't break you, they build you.
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: M, fontWeight: 600 }}>Slimikhel Mehsud</span> — and driven by the resilient spirit of the Mehsood Tribe. I treat software architecture as a high-stakes craft where logic meets artistry.
              </p>
              <p className="text-sm leading-relaxed border-l-2 pl-4" style={{ color: 'rgba(223,242,69,0.7)', borderColor: C, fontStyle: 'italic' }}>
                "I strip away complexity to reveal clarity. My focus is strictly on high-performance systems and butter-smooth execution—digital solutions built with the same endurance and strategic precision that have defined my lineage for centuries. Simple, sharp, and built to last."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3, margin: '-40px' }}
                  transition={{ delay: 0.1 + 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative p-4 md:p-5 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl pointer-events-none ${s.cssClass}`}
                    style={{ animationDelay: `${i * 0.5}s`, border: `1px solid ${s.col}40` }}
                  />
                  <motion.p
                    className="text-3xl md:text-4xl font-black relative z-10"
                    animate={{ color: [s.col, W, s.col] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.7 }}
                  >
                    {s.num}
                  </motion.p>
                  <p className="text-[9px] uppercase tracking-widest mt-1 font-bold relative z-10" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: 3D ORB — OrbitControls removed, pointer-events disabled */}
          <motion.div
            className="order-1 lg:order-2 w-full relative flex items-center justify-center"
            style={{ height: 'clamp(320px, 48vw, 580px)', pointerEvents: 'none', touchAction: 'none' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Suspense fallback={
              <p className="font-mono text-xs uppercase tracking-widest animate-pulse" style={{ color: C }}>Establishing Link…</p>
            }>
              <Canvas
                frameloop={isInView ? 'always' : 'demand'}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 7.8], fov: 42 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                style={{ width: '100%', height: '100%', pointerEvents: 'none', touchAction: 'none' }}
              >
                <ambientLight intensity={1.0} />
                <pointLight position={[8, 8, 8]}    intensity={4} color={C} />
                <pointLight position={[-8, -8, -8]} intensity={2} color={W} />
                <pointLight position={[0, 0, 5]}    intensity={1.2} color={C} />
                <pointLight position={[4, -4, 4]}   intensity={1.2} color={M} />
                <pointLight position={[0, 5, 0]}    intensity={1.6} color={P} />
                <Shells /><Core /><Rings />
                {/* NO OrbitControls — fully passive */}
              </Canvas>
            </Suspense>

            {/* Decorative labels — moved outside Canvas (pure CSS, no R3F overhead) */}
            <div className="absolute top-4 right-2 border-r-2 pr-3 text-right hidden sm:block" style={{ borderColor: `${C}60`, pointerEvents: 'none' }}>
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: `${C}80` }}>Biometric: Active</p>
              <p className="font-mono text-[11px] font-bold" style={{ color: W }}>SHAHAB_UDIN_ALI_KHAN</p>
            </div>
            <div className="absolute bottom-6 left-2 border-l-2 pl-3 hidden sm:block" style={{ borderColor: `${M}50`, pointerEvents: 'none' }}>
              <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${M}70` }}>Origin: Waziristan</p>
              <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${C}60` }}>Status: Sovereign</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}