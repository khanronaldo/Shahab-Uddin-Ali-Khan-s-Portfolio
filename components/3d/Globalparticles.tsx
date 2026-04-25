'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const C = '#dff245'
const M = '#3e8927'

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cC = new THREE.Color(C)
    const cM = new THREE.Color(M)
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
  }, [count])

  const material = useMemo(() => new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.2
  })

  return <points ref={ref} geometry={geo} material={material} />
}

export default function GlobalParticlesBackground() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // On mobile, use pure CSS background — NO WebGL for background particles
  if (!mounted) return null

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: '#000000',
          // Simple CSS dot grid — same visual feel, zero GPU cost
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(223,242,69,0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(62,137,39,0.04) 0%, transparent 50%),
            radial-gradient(rgba(223,242,69,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px',
        }}
      />
    )
  }

  // Desktop: single shared WebGL canvas, fixed position
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ pointerEvents: 'none', touchAction: 'none' }}
    >
      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{ pointerEvents: 'none', touchAction: 'none' }}
      >
        <Particles count={220} />
      </Canvas>
    </div>
  )
}