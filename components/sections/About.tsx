'use client'

import { motion, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Torus, Icosahedron } from '@react-three/drei'
import { useRef, Suspense, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const C = '#dff245'
const M = '#3e8927'
const P = '#5ac52f'
const W = '#FFFFFF'

// ─── All your existing animation styles (unchanged) ───
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
    if (a.current) a.current.rotation.z = t * 0.55
    if (b.current) { b.current.rotation.x = t * 0.38; b.current.rotation.z = t * 0.2 }
    if (c.current) { c.current.rotation.y = t * 0.72; c.current.rotation.x = t * 0.28 }
  })
  return (
    <group ref={g}>
      <mesh ref={a as any}><torusGeometry args={[1.9, 0.013, 6, 64]} /><primitive object={mC} /></mesh>
      <mesh ref={b as any}><torusGeometry args={[2.25, 0.009, 6, 64]} /><primitive object={mM} /></mesh>
      <mesh ref={c as any}><torusGeometry args={[2.55, 0.007, 6, 64]} /><primitive object={mP} /></mesh>
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
      <Torus args={[0.56, 0.014, 6, 48]} rotation={[Math.PI / 2, 0, 0]} material={r1} />
      <Torus args={[0.56, 0.010, 6, 48]} rotation={[0, 0, Math.PI / 4]} material={r2} />
      <mesh geometry={new THREE.SphereGeometry(0.17, 10, 10)} material={dt} />
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
      <mesh ref={gl as any} scale={0}><sphereGeometry args={[1.7, 16, 16]} /><primitive object={gm} /></mesh>
      <group ref={L}>
        <mesh><sphereGeometry args={[1.3, 32, 32, Math.PI / 2, Math.PI]} /><primitive object={sh} /></mesh>
        <Torus args={[1.32, 0.018, 8, 64, Math.PI]} rotation={[0, 0, Math.PI / 2]} material={ec} />
        <Torus args={[0.88, 0.008, 6, 48, Math.PI]} rotation={[0, 0, Math.PI / 2]} position={[0.1, 0, 0]} material={em} />
        <Torus args={[0.50, 0.006, 6, 48, Math.PI]} rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]} material={ep} />
      </group>
      <group ref={R}>
        <mesh><sphereGeometry args={[1.3, 32, 32, -Math.PI / 2, Math.PI]} /><primitive object={sh} /></mesh>
        <Torus args={[1.32, 0.018, 8, 64, Math.PI]} rotation={[0, 0, -Math.PI / 2]} material={ec} />
        <Torus args={[0.88, 0.008, 6, 48, Math.PI]} rotation={[0, 0, -Math.PI / 2]} position={[-0.1, 0, 0]} material={em} />
        <Torus args={[0.50, 0.006, 6, 48, Math.PI]} rotation={[0, 0, -Math.PI / 2]} position={[-0.2, 0, 0]} material={ep} />
      </group>
    </>
  )
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden pt-56 md:pt-72 pb-48 md:pb-64 px-5 md:px-12"
      // transparent — global bg canvas shows through
      style={{ backgroundColor: 'transparent', minHeight: '100vh' }}
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* NO local background canvas on mobile — global one handles it */}
      {/* On desktop, subtle extra glow only */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '30%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(223,242,69,0.03) 0%, transparent 70%)` }} />
        </div>
      )}

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

          {/* RIGHT: 3D ORB — hidden on mobile, replaced with CSS orb */}
          <motion.div
            className="order-1 lg:order-2 w-full relative flex items-center justify-center"
            style={{
              height: 'clamp(320px, 48vw, 580px)',
              pointerEvents: 'none',
              touchAction: 'none',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {isMobile ? (
              // Mobile: pure CSS orb instead of WebGL — saves entire canvas context
              <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
                <div style={{
                  width: 200, height: 200, borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, rgba(223,242,69,0.15), rgba(62,137,39,0.08) 50%, transparent 70%)`,
                  border: '1px solid rgba(223,242,69,0.3)',
                  boxShadow: '0 0 40px rgba(223,242,69,0.12), inset 0 0 40px rgba(223,242,69,0.05)',
                  animation: 'float-orb 4s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: -20, borderRadius: '50%',
                  border: '1px solid rgba(223,242,69,0.15)',
                  animation: 'spin-ring 8s linear infinite',
                }} />
                <style>{`
                  @keyframes float-orb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                  @keyframes spin-ring { to{transform:rotate(360deg)} }
                `}</style>
              </div>
            ) : (
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
                </Canvas>
              </Suspense>
            )}

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