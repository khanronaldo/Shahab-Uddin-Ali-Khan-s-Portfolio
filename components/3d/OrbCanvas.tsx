'use client'

import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Ring, Circle, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function StaticPhotoWithRings() {
  const ringGroupRef = useRef<THREE.Group>(null)
  
  // Photo load kar rahe hain
  const texture = useTexture('/shahab.jpg')
  
  // STRETCH & COLOR FIX 
  useEffect(() => {
    if (texture && texture.image) {
      texture.colorSpace = THREE.SRGBColorSpace;
      const imageAspect = texture.image.width / texture.image.height;
      const geoAspect = 1; 

      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      if (imageAspect > geoAspect) {
        texture.repeat.set(1 / imageAspect, 1);
        texture.offset.set((1 - (1 / imageAspect)) / 2, 0);
      } else {
        texture.repeat.set(1, imageAspect);
        texture.offset.set(0, (1 - imageAspect) / 2);
      }

      texture.needsUpdate = true;
    }
  }, [texture])

  const [scale, setScale] = useState(1.45)

  // 🔥 OPTIMIZATION: Debounced Resize + Value Check (Rokta hai faaltu re-renders ko)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      // Thora delay diya taake scroll karte waqt lag na aaye
      timeoutId = setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        const targetScale = isMobile ? 1.30 : 1.45;
        // Sirf tab update karo jab waqai scale change karna ho
        setScale(prev => prev !== targetScale ? targetScale : prev);
      }, 100); 
    }
    
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.5
      ringGroupRef.current.rotation.y = t * 0.5 
      ringGroupRef.current.rotation.z = t * 0.2 
    }
  })

  return (
    <group scale={scale}> 
      {/* 64 segments normal rings/circles ke liye best hain, cheap for GPU */}
      <Circle args={[1.5, 64]}> 
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </Circle>

      <group ref={ringGroupRef}>
        <Ring args={[1.8, 1.83, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          {/* Changed Cyan to Lime */}
          <meshBasicMaterial color="#dff245" transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
        
        <Ring args={[2.0, 2.03, 64]} rotation={[0, Math.PI / 3, 0]}>
          {/* Changed Purple to Green */}
          <meshBasicMaterial color="#3e8927" transparent opacity={0.6} side={THREE.DoubleSide} />
        </Ring>
      </group>
    </group>
  )
}

export default function OrbCanvas() {
  return (
    <div className="w-full h-full z-10 pointer-events-none flex items-center justify-center">
      <Canvas 
        flat
        // 🔥 OPTIMIZATION: Limits pixel ratio to max 2 (huge performance boost on phones)
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 9], fov: 40 }} 
        // 🔥 OPTIMIZATION: Removed preserveDrawingBuffer and added powerPreference
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
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