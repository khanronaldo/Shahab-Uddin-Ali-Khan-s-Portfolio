import type { Metadata } from 'next'
import '@/styles/globals.css'

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
      <body className="bg-obsidian antialiased">
        {children}

        
      </body>
    </html>
  )
}
