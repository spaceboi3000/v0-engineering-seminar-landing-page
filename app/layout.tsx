import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoboTalk | RAS NTUA Robotics & AI Event',
  description: 'Join us for RoboTalk on April 25, 2026 at Goethe-Institut Athen. A Robotics and AI Event by IEEE RAS NTUA.',
}

export const viewport: Viewport = {
  themeColor: '#d44040',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
