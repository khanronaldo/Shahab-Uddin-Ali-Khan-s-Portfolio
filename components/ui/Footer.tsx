'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const THEME_COLOR = '#dff245'
const BG = '#050505'
const CARD_BG = '#0a0a0a'

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.43 9.8 8.2 11.38.6.12.8-.26.8-.57v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.72.09-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45H16.9v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19 9.457 12.504h-7.406l-5.799-7.582-6.633 7.582H0.48l8.595-9.823L0 1.153h7.594l5.243 6.93 6.064-6.93zM16.31 20.266h2.039L5.686 3.161H3.5l12.81 17.105z" />
      </svg>
    ),
  },
]

const navLinks = ['About', 'Skills', 'Projects', 'Contact']

const staggerReveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }, 
})

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <footer
      ref={ref}
      className="relative px-4 sm:px-6 md:px-10 pt-28 md:pt-32 pb-10 font-sans"
      style={{ background: BG }}
    >
      <style jsx global>{`
        @keyframes rotateHand{50%{transform:rotate(280deg)}}
        
        #sketch-board-con{width:350px;height:350px;display:flex;justify-content:center;position:relative; filter: drop-shadow(0 0 30px rgba(223, 242, 69, 0.25));}
        #sketch-board{margin-top:20px;position:relative;transform:translateY(0);}
        
        #head{width:166px;height:150px;border:2px solid #222;border-radius:50%;background:linear-gradient(145deg, #1a1a1a, #0a0a0a);box-shadow:inset 0 -10px #050505, 0 10px 30px rgba(223, 242, 69, 0.15);display:flex;justify-content:center;align-items:center;position:relative;z-index:4;}
        #lens{background:${THEME_COLOR};width:140px;height:85px;border-radius:50%;margin-top:6px;position:relative;display:flex;align-items:center;box-shadow:0 0 35px ${THEME_COLOR}99;}
        #lens::after,#lens::before{content:"";border-radius:50%;background-color:${THEME_COLOR};position:absolute;width:85px;height:70px;bottom:2px;z-index:1;}
        #lens::after{right:0;}#lens::before{left:0;}
        #upper-shadow{width:94%;height:inherit;box-shadow:inset 0 6px rgba(255,255,255,.2);border-radius:50%;position:absolute;z-index:10;top:3px;transform:translateX(3%);}
        #rect{position:absolute;background:#1a1a1a;width:48px;height:10px;left:50%;bottom:-6px;transform:translateX(-50%);border-top:1px solid #000;}
        #eyes{position:absolute;width:70%;height:50%;transform:translateX(-50%);left:50%;top:28px;z-index:2;display:flex;justify-content:space-between;filter:drop-shadow(0 0 6px rgba(0,0,0,0.8));}
        #eyes::after,#eyes::before{content:"";width:15px;height:15px;border-radius:50%;border:7px solid transparent;border-top-color:#050505;border-left-color:#050505;transform:rotate(45deg);}
        #ear{position:absolute;top:16%;left:50%;transform:translateX(-50%);width:197px;height:60px;background:#1a1a1a;border:2px solid #222;border-radius:16px;z-index:1;box-shadow:inset 0 -10px #0a0a0a;}
        #ear-antenna{width:100%;height:100%;position:relative;}
        #ear-antenna::after,#ear-antenna::before{content:"";width:10px;height:35px;background:${THEME_COLOR};position:absolute;transform:translateY(-100%);border:2px solid #222;box-shadow:0 0 15px ${THEME_COLOR}aa;}
        #ear-antenna::before{left:7px;border-top-left-radius:40px;box-shadow:inset -2px 0 0 2px rgba(0,0,0,0.3), 0 0 15px ${THEME_COLOR}aa;}
        #ear-antenna::after{right:7px;border-top-right-radius:40px;box-shadow:inset 2px 0 0 2px rgba(0,0,0,0.3), 0 0 15px ${THEME_COLOR}aa;}
        #small-cap{position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:60px;height:47px;background:#1a1a1a;border:2px solid #222;border-radius:15px;}
        #body{width:126px;height:170px;background:linear-gradient(145deg, #1a1a1a, #050505);border-radius:50%;border:2px solid #222;position:absolute;z-index:1;left:50%;transform:translateX(-50%);bottom:90px;overflow:hidden;box-shadow:inset 0 -15px rgba(0,0,0,.9), 0 0 20px rgba(223, 242, 69, 0.1);}
        #shadow-box{width:100%;height:40%;border-radius:50%;box-shadow:0 18px #050505;}
        #pocket-area{width:150%;height:60%;margin-top:45px;border:2px solid #222;border-radius:50%;margin-left:-25%;position:relative;}
        #pocket{width:60px;height:50px;background:${THEME_COLOR};position:absolute;left:50%;transform:translateX(-50%);border:2px solid #222;top:-20px;border-radius:10px 10px 50% 50%;box-shadow:inset 0 -8px rgba(0,0,0,.4), 0 0 20px ${THEME_COLOR}aa;}
        #hands{position:absolute;width:170px;height:50px;display:flex;justify-content:space-between;top:34%;left:50%;transform:translateX(-50%);}
        .hand{width:50px;height:50px;border-radius:50%;display:flex;justify-content:center;transform:rotate(35deg);}
        .hand::before{content:"";width:40px;height:90px;background:#1a1a1a;box-shadow:inset -10px 0 #050505;border-radius:40%;border:2px solid #222;}
        .hand:last-child{transform:rotate(240deg);animation:rotateHand 1.5s infinite ease-in-out alternate;}
        #robot-shadow{position:absolute;bottom:0;left:50%;transform:translateX(-50%) scale(.7);width:100px;height:30px;background:rgba(223, 242, 69, 0.15);border-radius:50%;filter:blur(8px);}
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(to right, ${THEME_COLOR} 20%, white 50%, ${THEME_COLOR} 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .bio-text, .link-text, .copyright-text {
            font-size: 13px !important; 
            line-height: 1.6 !important;
            letter-spacing: 0.05em !important;
        }
        .input-compact { height: 52px !important; }
        .btn-compact { height: 40px !important; font-size: 11px !important; }

        /* --- THEME MATCHING PORTAL / HOLOGRAM EFFECT --- */
        @keyframes portalFloat{0%{transform:translateY(0) scale(1);opacity:1;}100%{transform:translateY(-120px) scale(3);opacity:0;}}
        .portal-stack{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:130%;height:100px;z-index:-1;pointer-events:none;}
        #portal-platform{position:absolute;bottom:0;left:0;width:100%;height:60px;border-radius:50%;background:radial-gradient(circle,transparent 30%,${THEME_COLOR} 80%);box-shadow:0 0 60px ${THEME_COLOR}aa,inset 0 0 20px ${THEME_COLOR}aa;}
        .portal-ring{position:absolute;border:3px solid ${THEME_COLOR};border-radius:50%;box-shadow:0 0 25px ${THEME_COLOR},inset 0 0 15px ${THEME_COLOR}aa;pointer-events:none;}
        #portal-ring-outer { width: 110%; height: 110%; bottom: -5%; left: -5%; border-width: 4px; }
        #portal-ring-mid { width: 90%; height: 90%; bottom: 10%; left: 5%; }
        #portal-ring-inner { width: 70%; height: 70%; bottom: 20%; left: 15%; }
        
        #portal-dust{position:absolute;bottom:60px;left:0;width:100%;height:150px;}
        .portal-particle{position:absolute;border-radius:50%;background:radial-gradient(circle,#fff 10%,${THEME_COLOR} 50%,transparent 80%);animation:portalFloat 6s infinite;pointer-events:none;}
        .portal-particle.pt-small { width: 5px; height: 5px; }
        .portal-particle.pt-mid { width: 8px; height: 8px; }
        .portal-particle.pt-large { width: 12px; height: 12px; }
        .portal-particle.pt-delay1 { animation-delay: 1s; }
        .portal-particle.pt-delay2 { animation-delay: 2s; }
        .portal-particle.pt-delay3 { animation-delay: 3s; }
        .portal-particle.pt-delay4 { animation-delay: 4s; }
        .portal-particle.pos1 { bottom: 15%; left: 10%; }
        .portal-particle.pos2 { bottom: 10%; left: 20%; }
        .portal-particle.pos3 { bottom: 20%; left: 30%; }
        .portal-particle.pos4 { bottom: 5%; left: 40%; }
        .portal-particle.pos5 { bottom: 15%; left: 50%; }
        .portal-particle.pos6 { bottom: 10%; left: 60%; }
        .portal-particle.pos7 { bottom: 20%; left: 70%; }
        .portal-particle.pos8 { bottom: 5%; left: 80%; }
        .portal-particle.pos9 { bottom: 15%; left: 90%; }
        .portal-particle.pos10 { bottom: 10%; left: 100%; }
      `}</style>

      {/* Main Footer Card */}
      <motion.div
        initial="initial"
        animate={isInView ? "whileInView" : "initial"}
        variants={staggerReveal(0)}
        className="relative max-w-7xl mx-auto rounded-[35px] border z-20 overflow-hidden flex flex-col" 
        style={{
          background: CARD_BG,
          borderColor: "rgba(223, 242, 69, 0.05)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Background Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-[#dff245]/20"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* TOP SECTION: Grid Content */}
        <div className="relative z-30 grid grid-cols-1 md:grid-cols-3 gap-12 px-6 sm:px-10 lg:px-16 pt-12 pb-4">
          
          {/* Column 1: Newsletter & Bio */}
          <div className="flex flex-col gap-6 md:max-w-[340px]">
            <motion.div variants={staggerReveal(0.2)}>
                <div
                  className="flex items-center overflow-hidden rounded-full border h-[58px] input-compact w-full max-w-[300px] bg-black/50"
                  style={{ borderColor: "rgba(223, 242, 69, 0.15)" }}
                >
                  <input
                    type="email"
                    placeholder="Enter your e-mail address"
                    className="flex-1 h-full bg-transparent outline-none px-6 text-[13px] text-white placeholder:text-white/30 font-light tracking-wide"
                  />
                  <button
                    className="h-[46px] btn-compact px-5 rounded-full text-black text-[11px] font-bold tracking-[0.15em] uppercase mr-[6px] transition-all duration-300 hover:scale-105 shrink-0"
                    style={{ background: THEME_COLOR, boxShadow: `0 0 15px ${THEME_COLOR}66` }}
                  >
                    Connect
                  </button>
                </div>
            </motion.div>

            <motion.p variants={staggerReveal(0.3)} className="text-gray-400 font-light bio-text max-w-[280px]">
              Crafting immersive premium digital experiences with <span className="font-semibold text-white">futuristic interfaces</span>, creative development, and modern web technologies.
            </motion.p>

            <motion.div variants={staggerReveal(0.4)} className="flex flex-wrap items-center gap-5 mt-2">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-semibold">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: THEME_COLOR, boxShadow: `0 0 10px ${THEME_COLOR}` }}
                />
                Premium Web
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Dev Studio
              </div>
            </motion.div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:pl-6 md:border-l border-white/[0.05]">
            <motion.h3 variants={staggerReveal(0.5)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/40 mb-6">
              // Quick Links
            </motion.h3>
            <div className="flex flex-col gap-4">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item}
                  variants={staggerReveal(0.6 + i * 0.1)}
                  href={`#${item.toLowerCase()}`}
                  className="group w-fit font-medium text-gray-400 link-text hover:text-white transition-all duration-300 flex items-center"
                >
                  <span 
                    className="opacity-0 -translate-x-3 text-[12px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-2.5"
                    style={{ color: THEME_COLOR }}
                  >
                    {">"}
                  </span>
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="md:pl-6">
            <motion.h3 variants={staggerReveal(0.8)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/40 mb-6">
              // Get In Touch
            </motion.h3>
            <div className="flex flex-col gap-6 text-gray-400 font-light link-text max-w-[280px]">
              <motion.div variants={staggerReveal(0.9)} className="hover:text-white transition-colors">
                <span className="block text-white font-medium mb-1.5 text-[14px]">Location</span>
                Executive block street 19, Faisal Hills <br />
                Islamabad, Pakistan
              </motion.div>
              <motion.div variants={staggerReveal(1.0)} className="hover:text-white transition-colors">
                <span className="block text-white font-medium mb-1.5 text-[14px]">Direct Line</span>
                03115341514
              </motion.div>
              <motion.div variants={staggerReveal(1.1)} className="group cursor-pointer">
                <span className="block text-white font-medium mb-1.5 text-[14px]">Email Terminal</span>
                <span style={{ color: THEME_COLOR }} className="font-light text-[14px] group-hover:text-white transition-colors">ronaldolover203@gmail.com</span>
              </motion.div>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: Title & Robot */}
        <div className="relative z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-12 px-6 sm:px-10 lg:px-16 pt-10 pb-10 items-center">
          
          {/* Elegant Full Name - Takes up the first 2 columns, aligning with left content */}
          <div className="md:col-span-2 w-full flex justify-center md:justify-start">
            <motion.h1
              variants={staggerReveal(1.2)}
              className="font-serif font-medium uppercase select-none shimmer-text m-0 text-center md:text-left leading-[1.1]"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                letterSpacing: "0.25em",
              }}
            >
              SHAHAB UDDIN<br className="md:hidden" /> ALI KHAN
            </motion.h1>
          </div>

          {/* Robot - Sits EXACTLY in the 3rd column, perfectly centered beneath Get In Touch */}
          <div className="md:col-span-1 w-full flex justify-center md:justify-center shrink-0 mt-8 md:mt-0 relative h-[150px] md:h-[180px]">
            <motion.div
              variants={staggerReveal(1.4)}
              className="relative pointer-events-auto z-30 w-full h-full"
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[0.4] md:scale-[0.5]"> 
                  <div id="sketch-board-con">
                    {/* NEW PORTAL STACK WITH Z-INDEX: -1 INSIDE CON */}
                    <div className="portal-stack">
                        <div id="portal-platform"></div>
                        <div id="portal-ring-outer" className="portal-ring"></div>
                        <div id="portal-ring-mid" className="portal-ring"></div>
                        <div id="portal-ring-inner" className="portal-ring"></div>
                        <div id="portal-dust">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`portal-particle ${['pt-small', 'pt-mid', 'pt-large'][i % 3]} pt-delay${(i % 4) + 1} pos${(i % 10) + 1}`}></div>
                            ))}
                        </div>
                    </div>

                    <div id="sketch-board">
                        <div id="head">
                          <div id="lens">
                              <div id="upper-shadow"></div>
                              <div id="rect"></div>
                              <div id="eyes"></div>
                          </div>
                        </div>
                        <div id="ear"><div id="ear-antenna"></div></div>
                        <div id="small-cap"></div>
                        <div id="body">
                          <div id="shadow-box"></div>
                          <div id="pocket-area"><div id="pocket"></div></div>
                        </div>
                        <div id="hands">
                          <div className="hand"></div>
                          <div className="hand"></div>
                        </div>
                    </div>
                    <div id="robot-shadow"></div>
                  </div>
                </div>
            </motion.div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        <div className="relative z-30 w-full bg-[#0d0d0d] border-t border-white/[0.05] py-6 px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.p variants={staggerReveal(1.5)} className="text-gray-500 font-light text-center md:text-left copyright-text tracking-wide md:w-1/3">
                Designed & Developed by <span className="text-white font-medium">Shahab ud Din</span>
            </motion.p>

            <div className="flex items-center gap-3 justify-center md:w-1/3">
                {socialLinks.map((item, i) => (
                <motion.a
                    key={item.name}
                    variants={staggerReveal(1.6 + i * 0.1)}
                    href={item.href}
                    className="w-[38px] h-[38px] rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--theme)] group bg-[#111]"
                    style={{ "--theme": THEME_COLOR } as React.CSSProperties}
                >
                    <div className="text-gray-400 group-hover:text-[color:var(--theme)] transition-colors">
                    {item.icon}
                    </div>
                </motion.a>
                ))}
            </div>

            <motion.p variants={staggerReveal(1.9)} className="text-gray-500 font-light text-center md:text-right copyright-text tracking-wide md:w-1/3">
                © {new Date().getFullYear()} All rights reserved.
            </motion.p>
        </div>

      </motion.div>
    </footer>
  )
}