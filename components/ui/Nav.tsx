'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // 🔥 OPTIMIZATION 1: Super smooth scroll detection using Framer Motion
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 40
    if (scrolled !== isScrolled) setScrolled(isScrolled)
  })

  return (
    <div className="fixed top-4 lg:top-6 inset-x-0 z-[100] flex flex-col items-center px-4 pointer-events-none">
      
      {/* 🚀 MAIN NAV BAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        // 🔥 OPTIMIZATION 2: Removed transition-all, explicitly animating only what's needed to avoid layout thrashing
        className={`pointer-events-auto relative flex items-center justify-between p-2 pl-4 rounded-full transition-[background-color,box-shadow,backdrop-filter] duration-500 max-w-5xl w-full
          ${scrolled 
            ? 'bg-obsidian/75 backdrop-blur-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]' 
            : 'bg-obsidian/40 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(223,242,69,0.08)]'
          }
        `}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#dff245]/60 to-transparent" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#3e8927]/60 to-transparent" />
        </div>

        {/* 📸 AVATAR */}
        <a href="#hero" className="relative flex items-center gap-3 cursor-pointer group/avatar z-20 will-change-transform">
          <div className="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden p-[2px]">
            {/* 🔥 OPTIMIZATION 3: Added transform-gpu and will-change-transform for smooth spinning */}
            <div className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)] animate-[spin_3s_linear_infinite] opacity-50 group-hover/avatar:opacity-100 group-hover/avatar:animate-[spin_1s_linear_infinite] transition-opacity duration-300 blur-[2px] transform-gpu will-change-transform" />
            <div className="relative w-full h-full rounded-full overflow-hidden bg-obsidian z-10">
              <Image 
                src="/avatar.png" 
                alt="My Logo" 
                fill 
                priority // 🔥 OPTIMIZATION 4: Prioritize loading to prevent initial stutter
                className="object-cover group-hover/avatar:scale-110 transition-transform duration-500 will-change-transform" 
                sizes="(max-width: 768px) 48px, 56px"
              />
            </div>
          </div>
          <span className="font-syne font-black text-sm tracking-widest text-white group-hover:text-[#dff245] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(223,242,69,0.8)] hidden sm:block will-change-contents">
            SHAHAB
          </span>
        </a>

        {/* 🔥 MOBILE VIEW: CENTERED NAME */}
        <div className="absolute left-1/2 -translate-x-1/2 sm:hidden z-10 pointer-events-none">
          <span className="font-syne font-black text-[15px] tracking-[0.25em] text-white drop-shadow-[0_0_8px_rgba(223,242,69,0.8)]">
            SHAHAB
          </span>
        </div>

        {/* 🔗 DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="relative inline-flex overflow-hidden rounded-full p-[2px] group/link cursor-pointer will-change-transform">
              <div className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)] animate-[spin_3s_linear_infinite] opacity-0 group-hover/link:opacity-100 group-hover/link:animate-[spin_1s_linear_infinite] transition-opacity duration-300 blur-[2px] transform-gpu will-change-transform" />
              <div className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-obsidian z-10 w-full h-full">
                <span className="text-[11px] tracking-[0.2em] uppercase font-dm font-bold text-gray-cool group-hover:text-white transition-colors duration-300">
                  {link.label}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* 🚀 DESKTOP BUTTON */}
        <a href="#contact" className="hidden md:inline-flex relative overflow-hidden rounded-full p-[2px] group/btn cursor-pointer will-change-transform">
          <div className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)] animate-[spin_3s_linear_infinite] opacity-50 group-hover/btn:opacity-100 group-hover/btn:animate-[spin_1s_linear_infinite] transition-opacity duration-300 blur-[2px] transform-gpu will-change-transform" />
          <div className="relative flex items-center justify-center px-8 py-3 rounded-full bg-obsidian z-10 w-full h-full">
            <span className="text-[11px] font-dm font-black tracking-[0.2em] uppercase text-[#dff245] group-hover/btn:text-white transition-colors duration-300 drop-shadow-[0_0_5px_rgba(223,242,69,0.8)]">
              Hire Me
            </span>
          </div>
        </a>

        {/* 📱 MODERN MOBILE MENU BUTTON */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-20 flex flex-col justify-center items-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#dff245]/20 transition-colors duration-300 pointer-events-auto transform-gpu"
        >
          <span className={`h-[2px] bg-white rounded-full transition-transform duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-[1px]' : 'w-5 mb-1.5'}`} />
          <span className={`h-[2px] bg-[#dff245] rounded-full transition-transform duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-[1px]' : 'w-3 ml-auto mr-3'}`} />
        </button>
      </motion.nav>

      {/* 📱 MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[85px] w-[calc(100%-2rem)] max-w-sm bg-obsidian/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto md:hidden z-[90] will-change-transform"
          >
            {links.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-center py-4 rounded-2xl text-[12px] tracking-[0.2em] uppercase font-dm font-bold text-gray-cool hover:bg-white/5 hover:text-[#dff245] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a 
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center py-4 rounded-2xl text-[12px] tracking-[0.2em] uppercase font-dm font-black text-obsidian bg-gradient-to-r from-[#dff245] to-[#3e8927] shadow-[0_0_15px_rgba(223,242,69,0.3)] hover:opacity-90 transition-opacity duration-200"
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}