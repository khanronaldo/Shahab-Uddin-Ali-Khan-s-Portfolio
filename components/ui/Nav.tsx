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

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isScrolled = latest > 40
    if (scrolled !== isScrolled) setScrolled(isScrolled)
  })

  return (
    <div className="fixed top-4 lg:top-6 inset-x-0 z-[100] flex flex-col items-center px-4 pointer-events-none">

      {/* MAIN NAV BAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="pointer-events-auto relative flex items-center justify-between p-2 pl-4 rounded-full max-w-5xl w-full"
        style={{
          // Reduced blur from 3xl/2xl to a single moderate value — massive GPU savings on mobile
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: scrolled ? 'rgba(5,5,5,0.82)' : 'rgba(5,5,5,0.55)',
          border: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.05)',
          // Removed the insane box-shadow radiuses — they murder mobile compositing
          boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.6)' : '0 8px 30px rgba(223,242,69,0.06)',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* Subtle top highlight line — lightweight pseudo via inline div */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#dff245]/40 to-transparent" />
        </div>

        {/* AVATAR */}
        <a href="#hero" className="relative flex items-center gap-3 cursor-pointer group/avatar z-20" style={{ willChange: 'transform' }}>
          <div className="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden p-[2px]">
            {/* Spinning gradient ring — GPU-accelerated via transform-gpu */}
            <div
              className="absolute inset-[-1000%] opacity-50 group-hover/avatar:opacity-100 transition-opacity duration-300 transform-gpu"
              style={{
                background: 'conic-gradient(from 0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)',
                animation: 'spin 3s linear infinite',
                filter: 'blur(2px)',
                willChange: 'transform',
              }}
            />
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#050505] z-10">
              <Image
                src="/shahab.jpg"
                alt="Shahab"
                fill
                priority
                className="object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 48px, 56px"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>
          <span className="font-syne font-black text-sm tracking-widest text-white group-hover:text-[#dff245] transition-colors duration-300 hidden sm:block">
            SHAHAB
          </span>
        </a>

        {/* MOBILE CENTERED NAME */}
        <div className="absolute left-1/2 -translate-x-1/2 sm:hidden z-10 pointer-events-none">
          <span className="font-syne font-black text-[15px] tracking-[0.25em] text-white">
            SHAHAB
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative inline-flex overflow-hidden rounded-full p-[2px] group/link cursor-pointer"
              style={{ willChange: 'transform' }}
            >
              <div
                className="absolute inset-[-1000%] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 transform-gpu"
                style={{
                  background: 'conic-gradient(from 0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)',
                  animation: 'spin 3s linear infinite',
                  filter: 'blur(2px)',
                  willChange: 'transform',
                }}
              />
              <div className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-[#050505] z-10 w-full h-full">
                <span className="text-[11px] tracking-[0.2em] uppercase font-dm font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                  {link.label}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* DESKTOP HIRE ME */}
        <a
          href="#contact"
          className="hidden md:inline-flex relative overflow-hidden rounded-full p-[2px] group/btn cursor-pointer"
          style={{ willChange: 'transform' }}
        >
          <div
            className="absolute inset-[-1000%] opacity-50 group-hover/btn:opacity-100 transition-opacity duration-300 transform-gpu"
            style={{
              background: 'conic-gradient(from 0deg,#dff245,#b4cc36,#78a33c,#3e8927,#5ac52f,#dff245)',
              animation: 'spin 3s linear infinite',
              filter: 'blur(2px)',
              willChange: 'transform',
            }}
          />
          <div className="relative flex items-center justify-center px-8 py-3 rounded-full bg-[#050505] z-10 w-full h-full">
            <span className="text-[11px] font-dm font-black tracking-[0.2em] uppercase text-[#dff245] group-hover/btn:text-white transition-colors duration-300">
              Hire Me
            </span>
          </div>
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="md:hidden relative z-20 flex flex-col justify-center items-center w-10 h-10 rounded-full border border-white/10 text-white hover:bg-[#dff245]/20 transition-colors duration-300 pointer-events-auto"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <span
            className="h-[2px] bg-white rounded-full transition-transform duration-300"
            style={{
              width: '20px',
              transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none',
              marginBottom: isOpen ? '0' : '6px',
            }}
          />
          <span
            className="h-[2px] bg-[#dff245] rounded-full transition-transform duration-300"
            style={{
              width: isOpen ? '20px' : '12px',
              marginLeft: isOpen ? '0' : 'auto',
              marginRight: isOpen ? '0' : '12px',
              transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none',
            }}
          />
        </button>
      </motion.nav>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-[85px] w-[calc(100%-2rem)] max-w-sm rounded-3xl p-4 flex flex-col gap-2 pointer-events-auto md:hidden z-[90]"
            style={{
              background: 'rgba(5,5,5,0.96)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
              willChange: 'transform, opacity',
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-center py-4 rounded-2xl text-[12px] tracking-[0.2em] uppercase font-dm font-bold text-gray-400 hover:bg-white/5 hover:text-[#dff245] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center py-4 rounded-2xl text-[12px] tracking-[0.2em] uppercase font-dm font-black text-[#050505] hover:opacity-90 transition-opacity duration-200"
              style={{ background: 'linear-gradient(135deg, #dff245, #3e8927)' }}
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global keyframe for the spinning conic gradient rings */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}