'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const OrbCanvas = dynamic(() => import('../3d/OrbCanvas'), { ssr: false })

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
    background-clip: text;
    animation: tubelight-name 8s linear infinite;
  }
  .sub-tubelight {
    background: linear-gradient(90deg, #dff245, #ffffff, #5ac52f, #dff245);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  .neon-btn:hover .neon-btn-inner { background: transparent; }
`

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden pt-20 lg:pt-28 pb-10"
      // IMPORTANT: transparent so GlobalParticlesBackground shows through
      style={{ backgroundColor: 'transparent' }}
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* NO local Canvas here anymore — GlobalParticlesBackground handles it */}
      {/* Sparkles removed on mobile — pure CSS glow instead */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(223,242,69,0.04) 0%, transparent 60%)',
          }}
        />
      )}

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 pointer-events-none">

        {/* TEXT */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start justify-center text-center lg:text-left order-2 lg:order-1">

          <h1
            className="font-syne font-black flex flex-col gap-2 w-full"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="name-tubelight w-full block"
            >
              Shahab Uddin
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="name-tubelight w-full block"
            >
              Ali Khan
            </motion.div>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
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
            transition={{ delay: 1.2 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <a href="#projects" className="neon-btn group transition-transform hover:scale-105" style={{ boxShadow: '0 0 15px rgba(223,242,69,0.15)' }}>
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
        <div
          className="w-[280px] h-[280px] lg:w-[460px] lg:h-[460px] z-0 order-1 lg:order-2 flex-shrink-0 flex items-center justify-center"
          style={{ pointerEvents: 'none', touchAction: 'none' }}
        >
          <OrbCanvas />
        </div>
      </div>
    </section>
  )
}