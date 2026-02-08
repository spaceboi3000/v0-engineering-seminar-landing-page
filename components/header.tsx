"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Past Events", href: "#past-events" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            TechSummit <span className="text-primary">2026</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href="#home">Join Waitlist</a>
          </Button>
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
        <nav className="border-t border-border/50 bg-background/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button asChild size="sm" className="mt-1">
              <a href="#home" onClick={() => setMobileOpen(false)}>Join Waitlist</a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
