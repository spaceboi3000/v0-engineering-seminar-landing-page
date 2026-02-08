"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { TicketModal } from "@/components/ticket-modal"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Past Events", href: "#past-events" },
  { label: "Venue", href: "#venue" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/images/ras-logo.png"
            alt="RAS NTUA logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Robo<span className="bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">Talk</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Check-In + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <TicketModal />
          </div>
          <a
            href="#contact"
            className="hidden items-center rounded-lg bg-gradient-to-r from-red-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105 md:inline-flex"
          >
            Get in Touch
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white/60 transition-colors hover:text-white lg:hidden"
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
        <nav className="border-t border-white/10 bg-black/80 px-4 pb-4 pt-2 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex flex-col gap-2">
              <div onClick={() => setMobileOpen(false)}>
                <TicketModal />
              </div>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-gradient-to-r from-red-600 to-fuchsia-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
