import type { Metadata } from 'next'
import '@/styles/globals.css'
import dynamic from 'next/dynamic'

// Client-only — no SSR needed
const GlobalParticlesBackground = dynamic(
  // line 7 mein yeh karo:
() => import('@/components/3d/Globalparticles'),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Shahab ud Din — Creative Developer',
  description: 'Creative Developer crafting premium digital experiences with Three.js, React, and cutting-edge web technology.',
  keywords: ['Creative Developer', 'Web Developer', 'Three.js', 'React', 'Portfolio'],
  authors: [{ name: 'Shahab ud Din' }],
  openGraph: {
    title: 'Shahab ud Din — Creative Developer',
    description: 'Premium portfolio of a creative developer',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      {/*
        bg-black on body = CRITICAL
        Prevents white flash when WebGL contexts are initializing or lost on mobile.
        bg-obsidian was likely a dark color BUT if it wasn't pure black or if
        Tailwind CSS hadn't loaded yet, you'd see white. bg-black is always safe.
      */}
      <body className="bg-black antialiased">
        {/* Single shared particle background — fixed position, sits behind everything */}
        <GlobalParticlesBackground />
        {children}
      </body>
    </html>
  )
}