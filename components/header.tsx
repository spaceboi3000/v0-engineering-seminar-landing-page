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
  { label: "Past Events", href: "#past-events" },
  { label: "Speakers", href: "#speakers" },
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
      className="hidden items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white md:inline-flex"
    >
      Αποσύνδεση
    </button>
  ) : (
    <Link
      href="/login"
      className="hidden items-center rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 md:inline-flex"
    >
      Σύνδεση
    </Link>
  )

  const mobileAuthButton = user ? (
    <button
      onClick={handleLogout}
      className="mt-1 rounded-lg border border-white/20 px-4 py-2 text-center text-sm font-semibold text-white/70 w-full"
    >
      Αποσύνδεση
    </button>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="mt-1 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-center text-sm font-semibold text-white block"
    >
      Σύνδεση
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#081229]/80 backdrop-blur-xl">
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
            Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
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
        <nav className="border-t border-white/10 bg-[#081229]/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-sky-400"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-sky-400"
              >
                My Account
              </Link>
            )}
            {mobileAuthButton}
          </div>
        </nav>
      )}
    </header>
  )
}
