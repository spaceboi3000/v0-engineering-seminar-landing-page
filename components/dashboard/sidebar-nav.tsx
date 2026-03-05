"use client"

import { Home, CalendarDays, QrCode, User, LogOut, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: CalendarDays, label: "Schedule", active: false },
  { icon: QrCode, label: "QR Code", active: false },
  { icon: User, label: "Profile", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function SidebarNav() {
  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col justify-between border-r border-border bg-card p-6">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent">
            <QrCode className="size-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            EventPass
          </span>
        </div>

        {/* Navigation links */}
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                aria-current={item.active ? "page" : undefined}
              >
                <Icon className="size-[18px]" strokeWidth={item.active ? 2.5 : 2} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-2">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
        >
          <ExternalLink className="size-4" />
          Return to Home
        </Link>

        {/* Sign out */}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <LogOut className="size-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}