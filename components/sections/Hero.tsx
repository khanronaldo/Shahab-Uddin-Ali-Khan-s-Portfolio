'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Cormorant_Garamond } from 'next/font/google' 

const OrbCanvas = dynamic(() => import('../3d/OrbCanvas'), { ssr: false })

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '400', 
  style: 'normal',
})

const customStyles = `
  .shimmer-text-exact {
    background: linear-gradient(90deg, #ffffff 0%, #dff245 50%, #ffffff 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer { to { background-position: 200% center; } }
  
  .description-text {
    color: white;
    font-family: var(--font-dm);
    font-size: 10px;
    font-weight: 400;
    line-height: 2.2;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
`

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center bg-[#0a0a0a] overflow-x-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* LAYER 1: BACKGROUND NAME (Fixed for Mobile) */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none opacity-20 md:opacity-100 px-4">
        <h1 className={`${cormorant.className} shimmer-text-exact text-center leading-none flex flex-col items-center`}>
          <span className="text-[12vw] md:text-[9vw] whitespace-nowrap">SHAHAB UDDIN</span>
          <span className="text-[15vw] md:text-[10vw] whitespace-nowrap md:pl-20">ALI KHAN</span>
        </h1>
      </div>

      {/* MAIN CONTENT WRAPPER: Mobile par flex use kiya hai taake distance sahi rahe */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-screen-2xl mx-auto px-6 pt-32 md:pt-0 md:h-screen md:justify-center">
        
        {/* LAYER 2: CENTRAL PORTRAIT & ORB */}
        <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] flex items-center justify-center mb-16 md:mb-0 md:translate-y-12">
          {/* Portrait */}
          <div className="relative w-[70%] h-[70%] rounded-full overflow-hidden z-10 border border-white/10 bg-[#050505]">
            <Image
              src="/shahab.jpg" 
              alt="Shahab"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 250px, 400px"
              priority
            />
          </div>
          {/* Orbit: Strictly contained inside parent */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <OrbCanvas />
          </div>
        </div>

        {/* LAYER 3: PERIPHERY TEXT (Distance fixed using margins) */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-12 md:gap-0 md:absolute md:bottom-20 md:px-20 pb-12 md:pb-0">
          
          {/* BOTTOM-LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="max-w-[280px] text-center md:text-left pointer-events-auto"
          >
            <h3 className="font-dm font-bold text-[10px] text-[#dff245] tracking-[0.2em] uppercase mb-3">
              Philosophical Insight
            </h3>
            <p className="description-text">
              "THE ONLY TRUE WISDOM IS IN KNOWING YOU KNOW NOTHING." <br />
              <span className="shimmer-text-exact mt-2 inline-block font-bold text-xs">— SOCRATES</span>
            </p>
          </motion.div>

          {/* BOTTOM-RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="max-w-[280px] text-center md:text-right pointer-events-auto"
          >
            <p className="description-text">
              "SIMPLICITY IS THE ULTIMATE SOPHISTICATION." <br />
              <span className="shimmer-text-exact mt-2 inline-block font-bold text-xs">— LEONARDO DA VINCI</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}