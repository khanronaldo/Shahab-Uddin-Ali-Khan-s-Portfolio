'use client'

import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Ring, Circle, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function StaticPhotoWithRings() {
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

  const [scale, setScale] = useState(1.35)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let rafId: number
    const handleResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setScale(window.innerWidth < 768 ? 1.2 : 1.35)
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.5
      ringGroupRef.current.rotation.y = t * 0.5
      ringGroupRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <group scale={scale}>
      {/* Photo circle — 48 segments is sufficient, saves GPU vs 64 */}
      <Circle args={[1.5, 48]}>
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </Circle>

      <group ref={ringGroupRef}>
        <Ring args={[1.8, 1.83, 48]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshBasicMaterial color="#dff245" transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[2.0, 2.03, 48]} rotation={[0, Math.PI / 3, 0]}>
          <meshBasicMaterial color="#3e8927" transparent opacity={0.6} side={THREE.DoubleSide} />
        </Ring>
      </group>
    </group>
  )
}

export default function OrbCanvas() {
  return (
    <div
      className="w-full h-full z-10 flex items-center justify-center"
      style={{ pointerEvents: 'none', touchAction: 'none' }}
    >
      <Canvas
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          // Prevents context loss on mobile when switching tabs
          preserveDrawingBuffer: false,
        }}
        style={{ pointerEvents: 'none', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
            <StaticPhotoWithRings />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}