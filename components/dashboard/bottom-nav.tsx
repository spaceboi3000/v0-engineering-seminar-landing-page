"use client"

import { useState, useEffect } from "react"
import { Home, CalendarDays, QrCode, Bot } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "#dashboard" },
  { icon: CalendarDays, label: "Schedule", href: "#schedule" },
  { icon: QrCode, label: "QR Code", href: "#qr-code" },
  { icon: Bot, label: "Game", href: "#minigame" },
]

export function BottomNav() {
  const [activeSection, setActiveSection] = useState("#dashboard")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { threshold: 0.4, rootMargin: "0px 0px -100px 0px" }
    )

    navItems.forEach((item) => {
      const sectionId = item.href.replace("#", "")
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveSection(href)
    
    if (href === "#minigame") {
      e.preventDefault()
      window.dispatchEvent(new Event("openGame"))
    }
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl lg:hidden" aria-label="Main navigation">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.href

          // Der Kommentar ist jetzt sicher vor dem return platziert!
          // Wir nutzen hier <a> anstelle von <Link>, damit Next.js das Scrollen nicht blockiert
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 transition-all duration-300 ${
                isActive ? "text-blue-600 scale-110" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5 transition-transform" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium transition-colors">{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}