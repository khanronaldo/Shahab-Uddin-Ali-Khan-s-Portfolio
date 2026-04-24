import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'obsidian': '#070707',
        'obsidian-light': '#0d0d0d',
        // 🔥 FIX: Replaced cyan-neon and purple-deep with new lime/green palette
        'lime-neon': '#dff245',
        'green-deep': '#3e8927',
        'green-bright': '#5ac52f',
        'green-olive': '#78a33c',
        'green-light': '#b4cc36',
        // Kept for backwards compat — point to new values
        'cyan-neon': '#dff245',
        'purple-deep': '#3e8927',
        'gray-cool': '#A1A1AA',
        'gray-dim': '#4a4a52',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-up-delay': 'fadeUp 0.8s 0.15s ease forwards',
        'fade-up-delay-2': 'fadeUp 0.8s 0.3s ease forwards',
        // 🔥 FIX: Updated glow-pulse to use lime color
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          // 🔥 FIX: Updated from cyan to lime
          '0%, 100%': { boxShadow: '0 0 20px rgba(223,242,69,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(223,242,69,0.25)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config