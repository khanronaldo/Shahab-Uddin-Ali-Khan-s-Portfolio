'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

// PERFORMANCE FIX: Sirf Stars rakhe, Sparkles hata diye (bahut heavy the)
// Aur count bhi kam kar diya
export default function GlobalParticles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} // FIXED: max 1.5 instead of 2
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} // FIXED: antialias off for bg
      >
        <Stars 
          radius={100} 
          depth={50} 
          count={2000}  // FIXED: 4000 se 2000 kar diya
          factor={4} 
          saturation={0} 
          fade 
          speed={0.8}   // FIXED: 1.5 se 0.8 slow kiya
        />
      </Canvas>
    </div>
  )
}