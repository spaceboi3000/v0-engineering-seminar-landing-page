"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Past Events", href: "#past-events" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/40 backdrop-blur-xl">
=======
    // Changed to an extremely dark custom blue (Midnight Blue) with 80% opacity
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#081229]/80 backdrop-blur-xl">
>>>>>>> main
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/images/robotalk-logo.png"
            alt="RoboTalk Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
<<<<<<< HEAD
            Robo<span className="bg-gradient-to-r from-ras-red to-fuchsia-500 bg-clip-text text-transparent">Talk</span>
=======
            {/* Blue gradient for "Talk" */}
            Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
>>>>>>> main
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
<<<<<<< HEAD
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
=======
              // Adjusted hover effect to sky-400 (matching the footer)
              className="text-sm font-medium text-white/60 transition-colors hover:text-sky-400"
>>>>>>> main
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
<<<<<<< HEAD
            className="hidden items-center rounded-lg bg-gradient-to-r from-ras-red-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(228,61,64,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105 md:inline-flex"
=======
            // Changed button gradient and glow shadows (RGB values) to blue/light blue
            className="hidden items-center rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 md:inline-flex"
>>>>>>> main
          >
            Get in Touch
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
<<<<<<< HEAD
        <nav className="border-t border-border/40 bg-background/80 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
=======
        // Using the custom dark blue here as well, with 95% opacity for better readability
        <nav className="border-t border-white/10 bg-[#081229]/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
>>>>>>> main
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
<<<<<<< HEAD
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
=======
                // Adjusted hover effect to sky-400
                className="rounded-md px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-sky-400"
>>>>>>> main
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
<<<<<<< HEAD
              className="mt-1 rounded-lg bg-gradient-to-r from-ras-red-600 to-fuchsia-600 px-4 py-2 text-center text-sm font-semibold text-white"
=======
              // Changed button gradient to blue/light blue
              className="mt-1 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-center text-sm font-semibold text-white"
>>>>>>> main
            >
              Get in Touch
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}