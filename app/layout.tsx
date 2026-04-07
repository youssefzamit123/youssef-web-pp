import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DentAI - Détection des caries',
  description: 'Système intelligent de détection des caries à partir de radiographies panoramiques',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
