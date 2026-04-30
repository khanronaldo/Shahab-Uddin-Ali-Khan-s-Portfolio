'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

// Shimmer style
const navStyles = `
  .nav-shimmer {
    background: linear-gradient(
      90deg, 
      #ffffff 0%, 
      #dff245 50%, 
      #ffffff 100%
    );
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
`

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      <header className="fixed top-0 inset-x-0 z-[100] px-6 lg:px-12 py-6 flex items-center justify-between pointer-events-none">
        
        {/* LEFT: MENU BUTTON */}
        <div className="flex-1 pointer-events-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 group"
          >
            <span className="text-[10px] lg:text-xs font-dm tracking-[0.25em] uppercase nav-shimmer">
              Menu
            </span>
            <svg 
              width="10" height="6" viewBox="0 0 10 6" fill="none" 
              className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} stroke-current text-[#dff245]`}
            >
              <path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* CENTER: LOGO */}
        <div className="flex-[2] flex justify-center pointer-events-auto">
          <a href="#hero" className="flex items-center gap-2 group whitespace-nowrap">
            <span className="font-serif italic text-gray-500 text-sm lg:text-lg leading-none transition-colors">
              dev
            </span>
            <span className="font-syne font-bold text-xs lg:text-lg tracking-[0.2em] leading-none uppercase nav-shimmer">
              SHAHAB UDDIN ALI KHAN
            </span>
          </a>
        </div>

        {/* RIGHT: CALL TO ACTION */}
        <div className="flex-1 flex justify-end pointer-events-auto hidden sm:flex">
          <a
            href="#contact"
            className="text-[10px] lg:text-xs font-dm tracking-[0.2em] uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#dff245] hover:after:w-full after:transition-all after:duration-300 nav-shimmer inline-block"
          >
            Hire Me Now
          </a>
        </div>
      </header>

      {/* FULLSCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-[80px] left-6 lg:left-12 w-[200px] bg-[#050505]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 z-[90] pointer-events-auto shadow-2xl"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setIsOpen(false)}
                className="text-[11px] tracking-[0.25em] uppercase font-dm nav-shimmer inline-block w-fit"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsOpen(false)}
              className="mt-4 pt-4 border-t border-white/5 text-[11px] tracking-[0.25em] uppercase font-dm sm:hidden block nav-shimmer inline-block w-fit"
            >
              Hire Me Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}