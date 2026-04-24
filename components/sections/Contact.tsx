'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float, Environment, PresentationControls, MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import emailjs from '@emailjs/browser' // <-- Naya Import

const C = '#dff245' // Primary Lime
const M = '#3e8927' // Dark Green
const P = '#5ac52f' // Bright Green

// ── BACKGROUND PARTICLES ──
function SyncedParticles() {
  const ref = useRef<THREE.Points>(null)
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
  
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.2
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.4}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// ── THE "GOD LEVEL" 3D CORE ──
function QuantumMessageCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const satellitesRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2
      coreRef.current.rotation.x = t * 0.1
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.sin(t * 0.2) * 0.5
      ringRef1.current.rotation.y = t * 0.3
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.cos(t * 0.2) * 0.5
      ringRef2.current.rotation.y = -t * 0.2
    }
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = t * 0.4
      satellitesRef.current.rotation.z = Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} color={M} />
          
          <Sphere ref={coreRef} args={[0.8, 32, 32]}>
            <meshStandardMaterial color={C} emissive={C} emissiveIntensity={1.5} toneMapped={false} />
          </Sphere>

          <mesh>
            <icosahedronGeometry args={[1.5, 0]} />
            <MeshTransmissionMaterial
              backside samples={4} thickness={0.5} chromaticAberration={0.05}
              anisotropy={0.1} distortion={0.2} distortionScale={0.3} temporalDistortion={0.1}
              color="#ffffff" transmission={1} roughness={0.1}
            />
          </mesh>

          <mesh ref={ringRef1}>
            <torusGeometry args={[2.2, 0.015, 16, 100]} />
            <meshBasicMaterial color={C} transparent opacity={0.3} />
          </mesh>
          <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.6, 0.015, 16, 100]} />
            <meshBasicMaterial color={M} transparent opacity={0.5} />
          </mesh>

          <group ref={satellitesRef}>
            <mesh position={[2.2, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={C} />
            </mesh>
            <mesh position={[-2.6, 0, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 2.2]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={P} />
            </mesh>
          </group>

        </group>
      </PresentationControls>
    </Float>
  )
}

export default function Contact() {
  const [sent, setSent]        = useState(false)
  const [sending, setSending]  = useState(false)
  const [waUrl, setWaUrl]      = useState("") // <-- WhatsApp link store karne ke liye
  const formRef                = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return;
    
    setSending(true)

    // Form ka data nikalna for WhatsApp
    const formData = new FormData(formRef.current);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // WhatsApp ka link banana
    const whatsappNumber = "923000000000"; // <-- APNA NUMBER YAHAN DALEIN (Without +)
    const whatsappText = `*New Lead from Portfolio*%0A*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${message}`;
    setWaUrl(`https://wa.me/${whatsappNumber}?text=${whatsappText}`);

    try {
      // EMAILJS LOGIC - Isse aapki Gmail par email jayegi
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',    // <-- EmailJS se replace karein
        'YOUR_TEMPLATE_ID',   // <-- EmailJS se replace karein
        formRef.current,
        'YOUR_PUBLIC_KEY'     // <-- EmailJS se replace karein
      )
      
      setSending(false)
      setSent(true)
    } catch (error) {
      console.error("FAILED...", error)
      setSending(false)
      alert("Kuch masla hua hai, please try again.")
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: '#000000', paddingTop: '8rem', paddingBottom: '10rem' }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes tubelight-name {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `
      }} />
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        >
          <SyncedParticles />
          <Sparkles count={40}  scale={20} size={2} speed={0.3}  color={C} opacity={0.3} />
          <Sparkles count={20}  scale={15} size={1} speed={0.2} color={M} opacity={0.2} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '30%', left: '15%', width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle,${C}05 0%,transparent 70%)`, transform: 'translate(-50%,-50%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle,${M}05 0%,transparent 70%)`, transform: 'translate(50%,50%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }} transition={{ duration: 0.6 }}
            style={{ fontSize: '10px', letterSpacing: '.5em', textTransform: 'uppercase', color: M, fontWeight: 700, marginBottom: '1rem' }}
          >
            Let's Connect
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundImage: `linear-gradient(90deg, #fff, ${C}, ${P}, ${M}, ${C}, #fff)`,
                backgroundSize: '300% auto',
                animation: 'tubelight-name 5s linear infinite',
              }}
            >
              Have an idea?
              <br />
              Let's build it.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}
          >
            Whether it's a complex 3D experience or a clean product interface — I turn vision into reality. Let's talk.
          </motion.p>
        </div>

        {/* TWO COLUMN */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 justify-center">

          {/* FORM AREA */}
          <motion.div
            className="w-full lg:w-[48%] max-w-lg"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }} transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}
                >
                  {/* Name Input - ADDED NAME ATTRIBUTE */}
                  <div className="relative group pt-4">
                    <input
                      type="text" required id="name" name="name" placeholder=" "
                      className="peer w-full bg-white/5 backdrop-blur-md text-white text-sm px-5 py-4 rounded-2xl outline-none transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 20px ${C}20`; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    />
                    <label htmlFor="name" className="absolute left-5 top-8 text-xs tracking-widest uppercase text-white/40 transition-all duration-300 pointer-events-none peer-focus:-translate-y-9 peer-focus:text-[10px] peer-focus:text-[#dff245] peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:-translate-x-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-focus:-translate-x-1 bg-[#000000] px-2 rounded">
                      Your Name
                    </label>
                  </div>

                  {/* Email Input - ADDED NAME ATTRIBUTE */}
                  <div className="relative group pt-4">
                    <input
                      type="email" required id="email" name="email" placeholder=" "
                      className="peer w-full bg-white/5 backdrop-blur-md text-white text-sm px-5 py-4 rounded-2xl outline-none transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 20px ${C}20`; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    />
                    <label htmlFor="email" className="absolute left-5 top-8 text-xs tracking-widest uppercase text-white/40 transition-all duration-300 pointer-events-none peer-focus:-translate-y-9 peer-focus:text-[10px] peer-focus:text-[#dff245] peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:-translate-x-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-focus:-translate-x-1 bg-[#000000] px-2 rounded">
                      Email Address
                    </label>
                  </div>

                  {/* Message Input - ADDED NAME ATTRIBUTE */}
                  <div className="relative group pt-4">
                    <textarea
                      required id="message" name="message" rows={4} placeholder=" "
                      className="peer w-full bg-white/5 backdrop-blur-md text-white text-sm px-5 py-4 rounded-2xl outline-none transition-all duration-300 resize-none"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 20px ${C}20`; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    />
                    <label htmlFor="message" className="absolute left-5 top-8 text-xs tracking-widest uppercase text-white/40 transition-all duration-300 pointer-events-none peer-focus:-translate-y-9 peer-focus:text-[10px] peer-focus:text-[#dff245] peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:-translate-x-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-focus:-translate-x-1 bg-[#000000] px-2 rounded">
                      Message
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit" disabled={sending}
                    className="w-full py-4 mt-2 rounded-2xl border relative overflow-hidden transition-all duration-300 group"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', borderColor: `${C}35`, color: C, background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C}80`; e.currentTarget.style.boxShadow  = `0 0 40px ${C}12`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C}35`; e.currentTarget.style.boxShadow  = 'none'; }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <AnimatePresence mode="wait">
                        {sending ? (
                          <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="5" strokeLinecap="round"/>
                            </svg>
                            Transmitting...
                          </motion.span>
                        ) : (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            Initialize Connection
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                              <line x1="22" y1="2" x2="11" y2="13"/>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success" className="py-16 flex flex-col items-center gap-6"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C}40`, boxShadow: `0 0 40px ${C}20`, background: `${C}08` }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.25rem', margin: 0 }}>Connection Established</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: 0 }}>Your data has been successfully transmitted to Gmail.</p>
                  
                  {/* WHATSAPP AUR RESET BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <a href={waUrl} target="_blank" rel="noreferrer" style={{ padding: '0.8rem 1.5rem', borderRadius: '9999px', background: '#25D366', color: '#000', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Chat on WhatsApp
                    </a>
                    
                    <button onClick={() => setSent(false)} style={{ padding: '0.8rem 1.5rem', border: `1px solid ${C}35`, borderRadius: '9999px', color: C, background: 'transparent', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                      Send Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── 3D CANVAS (The Quantum Core) ── */}
          <motion.div
            className="w-full lg:w-[46%] relative mt-10 lg:mt-0"
            style={{ height: 'clamp(380px, 50vw, 550px)' }} 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }} transition={{ duration: 0.9, delay: 0.15 }}
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <p className="animate-pulse text-xs uppercase tracking-widest" style={{ color: C }}>Initializing Core...</p>
              </div>
            }>
              <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 7.5], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                style={{ width: '100%', height: '100%', cursor: 'grab' }}
              >
                <QuantumMessageCore />
              </Canvas>
            </Suspense>

            <div className="absolute bottom-0 lg:bottom-3 left-1/2 -translate-x-1/2 pointer-events-none" style={{ whiteSpace: 'nowrap' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.3em', color: `${C}55` }}>
                Interactive Data Node · Drag to Inspect
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}