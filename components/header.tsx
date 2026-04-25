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
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user: User | null } | null) => {
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
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#081229]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 lg:px-8">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-4 h-16">
            <Image
              src="/images/robotalk-logo.webp"
              alt="RoboTalk Logo"
              width={60}
              height={60}
              className="h-14 w-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
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
      </header>

      {/* Mobile Nav — rendered OUTSIDE header so it isn't affected by header opacity */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" aria-hidden={!mobileOpen}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />

          {/* Panel — fully opaque */}
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-[#081229] border-l-2 border-sky-400 px-6 pt-20 pb-8 flex flex-col gap-1"
            style={{ backgroundColor: "#081229", boxShadow: "0 0 30px rgba(56,189,248,0.4), -20px 0 60px rgba(56,189,248,0.15)" }}
            aria-label="Mobile navigation"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 flex items-center justify-center size-10 rounded-full bg-white/10 border border-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>

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
      )}
    </>
  )
}