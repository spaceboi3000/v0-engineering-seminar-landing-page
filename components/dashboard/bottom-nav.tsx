"use client"

import { Home, CalendarDays, QrCode, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: CalendarDays, label: "Schedule", active: false },
  { icon: QrCode, label: "QR Code", active: false },
  { icon: User, label: "Profile", active: false },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl lg:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 transition-colors ${
                item.active
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="size-5" strokeWidth={item.active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
