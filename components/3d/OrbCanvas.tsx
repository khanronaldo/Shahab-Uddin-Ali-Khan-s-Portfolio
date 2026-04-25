'use client'

import { useRef, Suspense, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Ring, Circle, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function StaticPhotoWithRings({ isMobile }: { isMobile: boolean }) {
  const ringGroupRef = useRef<THREE.Group>(null)
  const texture = useTexture('/shahab.jpg')

  useEffect(() => {
    if (texture && texture.image) {
      texture.colorSpace = THREE.SRGBColorSpace
      const imageAspect = texture.image.width / texture.image.height
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      if (imageAspect > 1) {
        texture.repeat.set(1 / imageAspect, 1)
        texture.offset.set((1 - 1 / imageAspect) / 2, 0)
      } else {
        texture.repeat.set(1, imageAspect)
        texture.offset.set(0, (1 - imageAspect) / 2)
      }
      texture.needsUpdate = true
    }
  }, [texture])

  const scale = isMobile ? 1.1 : 1.35

  // On mobile: slow down animations significantly
  const rotSpeed = isMobile ? 0.25 : 0.5
  const tiltAmp = isMobile ? 0.3 : 0.5

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = Math.sin(t * 0.3) * tiltAmp
      ringGroupRef.current.rotation.y = t * rotSpeed
      ringGroupRef.current.rotation.z = t * (rotSpeed * 0.4)
    }
  })

  // Reduced ring segment count on mobile for GPU savings
  const ringSegs = isMobile ? 32 : 48

  return (
    <group scale={scale}>
      <Circle args={[1.5, isMobile ? 32 : 48]}>
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </Circle>

      <group ref={ringGroupRef}>
        <Ring args={[1.8, 1.83, ringSegs]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshBasicMaterial color="#dff245" transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
        {/* Second ring hidden on mobile to save draw calls */}
        {!isMobile && (
          <Ring args={[2.0, 2.03, ringSegs]} rotation={[0, Math.PI / 3, 0]}>
            <meshBasicMaterial color="#3e8927" transparent opacity={0.6} side={THREE.DoubleSide} />
          </Ring>
        )}
      </group>
    </group>
  )
}

export default function OrbCanvas() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="w-full h-full z-10 flex items-center justify-center"
      style={{ pointerEvents: 'none', touchAction: 'none' }}
    >
      <Canvas
        flat
        // Mobile: DPR cap at 1 — single most impactful mobile perf win
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          // Mobile: disable stencil/depth for simpler scenes
          stencil: false,
          depth: !isMobile,
        }}
        style={{ pointerEvents: 'none', touchAction: 'none' }}
        // Mobile: render on demand when not animating reduces battery drain
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Float
            speed={isMobile ? 0.8 : 1.5}
            rotationIntensity={0}
            floatIntensity={isMobile ? 0.2 : 0.5}
          >
            <StaticPhotoWithRings isMobile={isMobile} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}