'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C  = '#dff245'
const M  = '#3e8927'
const P  = '#5ac52f'
const W  = '#FFFFFF'
const BG = '#000000'

// ─── PROJECTS ────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 'proj-1', num: '01',
    title: 'Enterprise E-Commerce',
    category: 'Full Stack Solution',
    shortDesc: 'High-performance store with Stripe, real-time inventory sync, and full admin dashboard.',
    longDesc: 'Built to handle thousands of concurrent users. Features include a dynamic product catalog, real-time inventory sync, secure checkout flow via Stripe, and a dedicated admin dashboard for order management and analytics.',
    tech: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
    layoutClass: 'md:col-span-2 md:row-span-2',
    color: C,
  },
  {
    id: 'proj-2', num: '02',
    title: 'SaaS Dashboard',
    category: 'Data Visualization',
    shortDesc: 'Interactive analytics panel with real-time metrics and PDF exports.',
    longDesc: 'Feeds live data from multiple APIs into customizable charts. Features complex data filtering, dark/light mode, user role management, and PDF report generation.',
    tech: ['React', 'D3.js', 'Recharts', 'Zustand'],
    layoutClass: 'md:col-span-1 md:row-span-1',
    color: P,
  },
  {
    id: 'proj-3', num: '03',
    title: 'Immersive Portfolio',
    category: 'Creative Web3D',
    shortDesc: 'Personal site with custom shaders, 3D models and GSAP scroll animations.',
    longDesc: 'Integrated custom Three.js models with smooth scroll (Lenis) and interactive animations (Framer Motion, GSAP) to create a high-fidelity narrative experience.',
    tech: ['Three.js', 'R3F', 'GLSL', 'GSAP'],
    layoutClass: 'md:col-span-1 md:row-span-2',
    color: M,
  },
  {
    id: 'proj-4', num: '04',
    title: 'Real-time Chat App',
    category: 'Backend / WebSockets',
    shortDesc: 'Scalable messaging with sub-millisecond delivery, rooms, and file sharing.',
    longDesc: 'WebSockets for sub-millisecond message delivery. Supports multiple chat rooms, file sharing, user presence status, and message history persistence.',
    tech: ['Node.js', 'Socket.io', 'Redis', 'Docker'],
    layoutClass: 'md:col-span-2 md:row-span-1',
    color: W,
  },
]

// ─── 3D: PARTICLES ───────────────────────────────────────────────────────────
function SyncedParticles() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 350
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C).multiplyScalar(1.5)
    const cM = new THREE.Color(M).multiplyScalar(1.5)
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*40
      pos[i*3+1] = (Math.random()-0.5)*40
      pos[i*3+2] = (Math.random()-0.5)*20
      const c = Math.random() > 0.5 ? cC : cM
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.01
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.5
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// ─── 3D: ROBOT ───────────────────────────────────────────────────────────────
function RobotFace() {
  const headRef        = useRef<THREE.Group>(null)
  const eyeGrpL        = useRef<THREE.Group>(null)
  const eyeGrpR        = useRef<THREE.Group>(null)
  const antTip         = useRef<THREE.Mesh>(null)
  const mouthGrilleRef = useRef<THREE.Group>(null)

  const mDark  = useMemo(() => new THREE.MeshStandardMaterial({ color:'#1c1c1c', roughness:0.25, metalness:0.97 }), [])
  const mMid   = useMemo(() => new THREE.MeshStandardMaterial({ color:'#2e2e2e', roughness:0.32, metalness:0.91 }), [])
  const mLight = useMemo(() => new THREE.MeshStandardMaterial({ color:'#424242', roughness:0.16, metalness:1 }), [])
  const mAcc   = useMemo(() => new THREE.MeshStandardMaterial({ color:'#214a13', roughness:0.55, metalness:0.52 }), [])
  const mSmile = useMemo(() => new THREE.MeshStandardMaterial({ color:BG, roughness:0.95, metalness:0.02, transparent:true, opacity:1 }), [])
  const mVisor = useMemo(() => new THREE.MeshStandardMaterial({ color:'#000', roughness:0.01, metalness:1, transparent:true, opacity:0.97, side:THREE.BackSide }), [])
  const mEyeL  = useMemo(() => new THREE.MeshBasicMaterial({ color:C }), [])
  const mEyeR  = useMemo(() => new THREE.MeshBasicMaterial({ color:C }), [])
  const mAntTip= useMemo(() => new THREE.MeshBasicMaterial({ color:C }), [])

  const actionTimer         = useRef(0)
  const nextActionInterval  = useRef(THREE.MathUtils.randFloat(5, 10))
  const robotState          = useRef('idle')

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, (pointer.x*Math.PI)/5, 0.085)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, (-pointer.y*Math.PI)/7, 0.085)
      headRef.current.position.y = Math.sin(t * 1.5) * 0.05
      headRef.current.rotation.z = Math.sin(t * 1.1) * 0.03
      headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, 0, 0.1)
    }
    mEyeL.color.set(new THREE.Color(C).multiplyScalar(robotState.current === 'wink' ? 0.2 : (0.7 + Math.sin(t*2.1)*0.3)))
    mEyeR.color.set(new THREE.Color(C).multiplyScalar(0.7 + Math.sin(t*2.1)*0.3))
    mAntTip.color.set(new THREE.Color(C).multiplyScalar(0.6 + Math.abs(Math.sin(t*1.6))*0.4))
    if (eyeGrpR.current) eyeGrpR.current.scale.y = THREE.MathUtils.lerp(eyeGrpR.current.scale.y, Math.random() > 0.99 ? 0.1 : 1.0, 0.4)
    if (robotState.current === 'smile') {
      mSmile.color.set(new THREE.Color(C).multiplyScalar(0.6 + Math.abs(Math.sin(t*2.8))*0.4))
      mSmile.opacity = THREE.MathUtils.lerp(mSmile.opacity, 1.0, 0.1)
    } else {
      mSmile.color.set(BG)
      mSmile.opacity = THREE.MathUtils.lerp(mSmile.opacity, 0.01, 0.1)
    }
    actionTimer.current += clock.getDelta()
    if (actionTimer.current > nextActionInterval.current) {
      if (robotState.current === 'idle') {
        robotState.current = THREE.MathUtils.randInt(0,1)===0 ? 'wink' : 'smile'
        actionTimer.current = 0; nextActionInterval.current = THREE.MathUtils.randFloat(1, 3)
      } else {
        robotState.current = 'idle'
        actionTimer.current = 0; nextActionInterval.current = THREE.MathUtils.randFloat(5, 10)
      }
    }
    if (eyeGrpL.current) eyeGrpL.current.scale.y = THREE.MathUtils.lerp(eyeGrpL.current.scale.y, robotState.current==='wink'?0.15:1, 0.2)
  })

  const grilleBars = useMemo(() => {
    const bars: THREE.BoxGeometry[] = []
    for (const yc of [-0.05, 0.0, 0.05, 0.1])
      for (let i=0; i<7; i++) {
        const geo = new THREE.BoxGeometry(0.032, 0.018, 0.008)
        geo.translate((i-3)*0.06, yc-0.385, 0.472)
        bars.push(geo)
      }
    return bars
  }, [])

  return (
    <group ref={headRef}>
      <pointLight position={[-3,3,4]}     color={C} intensity={2.8} distance={10} />
      <pointLight position={[3,2,-2]}     color={M} intensity={1.9} distance={9} />
      <pointLight position={[0,-2.5,3.5]} color="#fff" intensity={0.5} distance={6} />
      <ambientLight intensity={0.16} />
      <mesh material={mDark}><boxGeometry args={[1.08,0.92,0.88]} /></mesh>
      <mesh position={[0,0.28,0.43]}  material={mMid}><boxGeometry args={[0.86,0.27,0.07]} /></mesh>
      <mesh position={[0,0.222,0.47]} material={mLight}><boxGeometry args={[0.92,0.062,0.03]} /></mesh>
      <mesh position={[ 0.51,-0.02,0.26]} material={mMid}><boxGeometry args={[0.072,0.44,0.44]} /></mesh>
      <mesh position={[-0.51,-0.02,0.26]} material={mMid}><boxGeometry args={[0.072,0.44,0.44]} /></mesh>
      <mesh position={[0,0.1,0.461]} material={mVisor}><boxGeometry args={[0.8,0.25,0.036]} /></mesh>
      <group position={[0,0.1,0.501]}>
        <group ref={eyeGrpL} position={[-0.2,0,0]}>
          <mesh><boxGeometry args={[0.186,0.066,0.004]} /><primitive object={mEyeL} attach="material" /></mesh>
        </group>
        <group ref={eyeGrpR} position={[0.2,0,0]}>
          <mesh><boxGeometry args={[0.186,0.066,0.004]} /><primitive object={mEyeR} attach="material" /></mesh>
        </group>
      </group>
      <pointLight position={[-0.2,0.1,0.72]} color={C} intensity={2.2} distance={1.5} />
      <pointLight position={[ 0.2,0.1,0.72]} color={C} intensity={2.2} distance={1.5} />
      <mesh position={[0,-0.31,0.37]} material={mMid}><boxGeometry args={[0.72,0.2,0.36]} /></mesh>
      <group ref={mouthGrilleRef}>
        {grilleBars.map((geo, i) => (
          <mesh key={i} geometry={geo} material={robotState.current==='smile'&&i%7!==0&&i%7!==6&&i>=7&&i<21?mSmile:mAcc} />
        ))}
      </group>
      <mesh position={[ 0.57,0.04,0.04]} material={mAcc}><boxGeometry args={[0.046,0.38,0.58]} /></mesh>
      <mesh position={[-0.57,0.04,0.04]} material={mAcc}><boxGeometry args={[0.046,0.38,0.58]} /></mesh>
      <mesh position={[ 0.612,0.08,0.04]} rotation={[0,Math.PI/2,0]} material={mLight}><cylinderGeometry args={[0.06,0.06,0.03,12]} /></mesh>
      <mesh position={[-0.612,0.08,0.04]} rotation={[0,Math.PI/2,0]} material={mLight}><cylinderGeometry args={[0.06,0.06,0.03,12]} /></mesh>
      <mesh position={[0,-0.46,0.3]}  material={mDark}><boxGeometry args={[0.56,0.09,0.26]} /></mesh>
      <mesh position={[0,-0.56,0]}    material={mMid}><cylinderGeometry args={[0.27,0.29,0.11,16]} /></mesh>
      <mesh position={[0,-0.7,0]}     material={mDark}><cylinderGeometry args={[0.22,0.24,0.2,16]} /></mesh>
      <mesh position={[0,0.59,0]}     material={mMid}><cylinderGeometry args={[0.022,0.03,0.33,8]} /></mesh>
      <mesh ref={antTip} position={[0,0.78,0]}>
        <sphereGeometry args={[0.05,16,16]} />
        <primitive object={mAntTip} attach="material" />
      </mesh>
    </group>
  )
}

function Scene3D({ type, style }: { type: 'particles'|'robot'; style?: React.CSSProperties }) {
  if (type === 'particles') {
    return (
      <Canvas dpr={[1,1.5]} camera={{ position:[0,0,15], fov:60 }} gl={{ antialias:false, alpha:true, powerPreference:'high-performance' }}>
        <SyncedParticles />
        <Sparkles count={50} scale={20} size={2.5} speed={0.3} color={C} opacity={0.5} />
        {/* ⚡ FIXED: disableNormalPass ko enableNormalPass={false} se replace kiya */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.8} resolutionScale={0.5} />
        </EffectComposer>
      </Canvas>
    )
  }
  return (
    <Canvas dpr={[1,1.5]} camera={{ position:[0,0,3.1], fov:42 }} gl={{ antialias:true, alpha:true, powerPreference:'high-performance' }} style={{ background:'transparent', ...style }}>
      <RobotFace />
      {/* ⚡ FIXED: Yahan bhi disableNormalPass ko enableNormalPass={false} se replace kiya */}
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.2} resolutionScale={0.6} />
      </EffectComposer>
    </Canvas>
  )
}

// ─── PROJECT CARD — Magazine horizontal list ──────────────────────────────────
function ProjectCard({ project, index, onOpen }: { project: typeof projects[0]; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Top divider */}
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      <motion.div
        animate={{ backgroundColor: hovered ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '4.5rem 1fr auto',
          alignItems: 'center',
          gap: '2rem',
          padding: '1.75rem 1.25rem',
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left color bar */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          style={{
            position: 'absolute', left: 0, top: '12%', bottom: '12%',
            width: '2px',
            background: `linear-gradient(180deg, transparent, ${project.color}, transparent)`,
            transformOrigin: 'center', borderRadius: '2px',
          }}
        />

        {/* Shimmer */}
        <motion.div
          animate={{ x: hovered ? '260%' : '-110%' }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, width: '35%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.012), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Col 1: Number ── */}
        <div style={{ flexShrink: 0 }}>
          <motion.span
            animate={{ color: hovered ? project.color : 'rgba(255,255,255,0.13)' }}
            transition={{ duration: 0.28 }}
            style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', display: 'block' }}
          >
            {project.num}
          </motion.span>
          <motion.div
            animate={{ width: hovered ? '32px' : '8px', background: hovered ? project.color : 'rgba(255,255,255,0.12)' }}
            transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}
            style={{ height: '2px', borderRadius: '2px', marginTop: '7px' }}
          />
        </div>

        {/* ── Col 2: Content ── */}
        <div style={{ minWidth: 0 }}>
          {/* Title + category badge */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
            <motion.h3
              animate={{ color: hovered ? W : 'rgba(255,255,255,0.72)' }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 800, margin: 0,
                fontSize: 'clamp(1.05rem, 2.4vw, 1.6rem)',
                letterSpacing: '-0.03em', lineHeight: 1,
              }}
            >
              {project.title}
            </motion.h3>
            <span style={{
              fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '2px 8px', borderRadius: '3px', whiteSpace: 'nowrap',
            }}>
              {project.category}
            </span>
          </div>

          {/* Short desc */}
          <p style={{
            color: 'rgba(255,255,255,0.36)', fontSize: '12.5px', lineHeight: 1.65,
            fontWeight: 300, margin: '0 0 0.8rem', maxWidth: '520px',
          }}>
            {project.shortDesc}
          </p>

          {/* Tech pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {project.tech.map(t => (
              <motion.span
                key={t}
                animate={{
                  color: hovered ? project.color === W ? '#dff245' : project.color : 'rgba(255,255,255,0.32)',
                  borderColor: hovered ? `${project.color === W ? '#dff245' : project.color}40` : 'rgba(255,255,255,0.07)',
                  background: hovered ? `${project.color === W ? '#dff245' : project.color}0c` : 'rgba(255,255,255,0.025)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '3px 9px', fontSize: '10px', fontWeight: 500,
                  border: '1px solid', borderRadius: '3px',
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Col 3: Arrow ── */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0.18,
            x: hovered ? 0 : 4,
            y: hovered ? 0 : 4,
            borderColor: hovered ? `${project.color === W ? '#dff245' : project.color}55` : 'rgba(255,255,255,0.08)',
            background: hovered ? `${project.color === W ? '#dff245' : project.color}12` : 'transparent',
          }}
          transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            border: '1px solid',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: project.color === W ? '#dff245' : project.color,
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function ClassyProjectsSection() {
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null)
  const [mounted, setMounted]             = useState(false)
  const containerRef                      = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const headY  = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, -60]),  { stiffness: 70, damping: 22 })
  const robotY = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, -40]),  { stiffness: 55, damping: 18 })

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeProject])

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: BG, color: W, paddingTop: '8rem', paddingBottom: '12rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      {/* ── Styles with Tubelight Keyframes ── */}
      {mounted && (
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;800;900&display=swap');
            
            @keyframes tubelight-name {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }

            .robot-wrap,.robot-wrap canvas,.robot-wrap > div{background:transparent!important;background-color:transparent!important;box-shadow:none!important;filter:none!important;outline:none!important;border:none!important;}
            .projects-header-row{display:flex;flex-direction:row;align-items:center;justify-content:space-between;margin-bottom:6rem;gap:2rem;}
            .projects-header-text{flex:1;min-width:0;max-width:640px;padding-top:2.5rem;}
            .projects-robot-wrapper{flex-shrink:0;cursor:crosshair;width:clamp(140px,18vw,210px);height:clamp(160px,21vw,250px);position:relative;}
            @media(max-width:700px){
              .projects-header-row{flex-direction:column;align-items:center;gap:2rem;margin-bottom:3.5rem;}
              .projects-header-text{width:100%;max-width:100%;padding-top:1rem;}
              .projects-robot-wrapper{width:180px;height:210px;order:-1;margin:0 auto;}
            }
          `
        }} />
      )}

      {/* Particles bg */}
      {mounted && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.9 }}>
          <Scene3D type="particles" />
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '84rem', margin: '0 auto' }}>

        {/* ════ HEADER ROW ════ */}
        <div className="projects-header-row">
          <motion.div
            style={{ y: headY }}
            className="projects-header-text"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '44px', height: '1px', background: P }} />
              <span style={{ color: C, fontSize: '10px', fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase' }}>Work</span>
            </div>
            
            {/* Animated Heading */}
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(3.8rem, 9vw, 7.5rem)', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: '1.8rem', color: W }}>
              Selected<br />
              <span style={{ 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundImage: `linear-gradient(90deg, ${W}, ${C}, ${P}, ${C}, ${W})`,
                backgroundSize: '200% auto',
                animation: 'tubelight-name 4s linear infinite',
                display: 'inline-block' 
              }}>
                Production.
              </span>
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.75, maxWidth: '440px', fontFamily: 'Outfit, sans-serif' }}>
              Strictly professional deployments. From Enterprise E-Commerce to Creative Web3D, built for performance and modernism.
            </p>

            {/* Animated Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem' }}>
              {[['04', 'Projects'], ['3+', 'Years'], ['100%', 'Deployed']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ 
                    fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1,
                    background: `linear-gradient(90deg, ${C}, ${P}, ${C})`,
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'tubelight-name 3s linear infinite'
                  }}>
                    {val}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Robot ── */}
          <motion.div
            style={{ y: robotY }}
            className="projects-robot-wrapper"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {mounted && (
              <div className="robot-wrap" style={{ width: '100%', height: '100%' }}>
                <Scene3D type="robot" style={{ width: '100%', height: '100%', background: 'transparent' }} />
              </div>
            )}
          </motion.div>
        </div>

        {/* ════ PROJECT LIST ════ */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: '4.5rem 1fr auto', gap: '2rem', padding: '0 1.25rem 0.9rem', marginBottom: '0.1rem' }}
          >
            {['No.', 'Project', 'Open'].map(label => (
              <span key={label} style={{ fontSize: '8.5px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>{label}</span>
            ))}
          </motion.div>

          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={() => setActiveProject(project)} />
          ))}

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
      </div>

      {/* ════ MODAL (Keep as is) ════ */}
      <AnimatePresence>
        {activeProject && (
          /* ... modal content ... */
          <div /> // Placeholder for brevity, use your existing modal code here
        )}
      </AnimatePresence>
    </section>
  )
}