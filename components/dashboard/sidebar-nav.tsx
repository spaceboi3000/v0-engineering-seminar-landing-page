"use client"

import { useState } from "react"
import { Home, CalendarDays, QrCode, LogOut, ExternalLink, Menu, X, Bot } from "lucide-react"
import Link from "next/link"

const navItems = [
  { icon: Home, label: "Dashboard", href: "#dashboard", active: true },
  { icon: CalendarDays, label: "Schedule", href: "#schedule", active: false },
  { icon: QrCode, label: "QR Code", href: "#qr-code", active: false },
  { icon: Bot, label: "Game", href: "#minigame", active: false },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#minigame") {
      e.preventDefault() 
      setIsOpen(false)
      window.dispatchEvent(new Event("openGame")) 
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* DAS HAUPT-ICON (Handy-Menü) */}
      <button
        onClick={() => setIsOpen(true)}
        // HIER GEÄNDERT: "right-4" statt "left-4", damit es rechts oben in der Ecke sitzt!
        className="fixed top-4 right-4 z-40 rounded-lg bg-card p-2 text-foreground shadow-sm lg:hidden"
        aria-label="Open Menu"
      >
        <Menu className="size-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-svh w-64 flex-col justify-between border-r border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-8">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-100">
                <QrCode className="size-5 text-red-600" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">EventPass</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden">
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Main navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active ? "bg-red-600/15 text-red-600" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon 
                    className={`size-[18px] transition-opacity ${item.active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`} 
                    strokeWidth={item.active ? 2.5 : 2} 
                  />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]">
            <ExternalLink className="size-4" />
            Return to Home
          </Link>
          
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <LogOut className="size-[18px] opacity-50" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}