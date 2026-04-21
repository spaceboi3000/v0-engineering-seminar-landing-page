"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Gallery", href: "#past-events" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.refresh()
  }

  const authButton = user ? (
    <button
      onClick={handleLogout}
      className="hidden items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white lg:inline-flex"
    >
      Logout
    </button>
  ) : (
    <Link
      href="/login"
      className="hidden items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-sky-400/50 hover:text-sky-400 lg:inline-flex"
    >
      Login
    </Link>
  )

  const mobileAuthButton = user ? (
    <button
      onClick={handleLogout}
      className="mt-1 w-full rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-semibold text-white/70"
    >
      Logout
    </button>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="mt-1 block rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-semibold text-white/80"
    >
      Login
    </Link>
  )

  return (
    // Midnight Blue background with 80% opacity
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#081229]/80 backdrop-blur-xl">
      {/* ADDED: Slightly more vertical padding for a more spacious feel (py-2 -> py-1.5) */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 lg:px-8">
        {/* Logo Section */}
        {/* UPDATED: Larger height (h-16) and gap (gap-4) for the container */}
        <a href="#home" className="flex items-center gap-4 h-16">
          <Image
            src="/images/robotalk-logo.webp"
            alt="RoboTalk Logo"
            width={60} // INCREASED: For better scaling
            height={60} // INCREASED: For better scaling
            // UPDATED: Standard logo image height increased from h-10 to h-14
            className="h-14 w-auto object-contain" 
          />
          {/* UPDATED: Increased text size for better balance */}
          <span className="text-xl font-bold tracking-tight text-foreground">
            {/* Blue gradient for "Talk" */}
            Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-sky-400"
            >
              {link.label}
            </a>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/60 transition-colors hover:text-sky-400"
            >
              My Account
            </Link>
          )}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {authButton}
          <button
            type="button"
            className="inline-flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            suppressHydrationWarning
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav — slides in from the right */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

        {/* Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-[#081229] border-l-2 border-blue-500 shadow-[-20px_0_60px_rgba(59,130,246,0.4)] px-6 pt-20 pb-8 flex flex-col gap-1 transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-sky-400"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-sky-400"
            >
              My Account
            </Link>
          )}
          <div className="mt-auto">{mobileAuthButton}</div>
        </nav>
      </div>
    </header>
  )
}