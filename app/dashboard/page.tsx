import { UserHeader } from "@/components/dashboard/user-header"
import { QrCheckinCard } from "@/components/dashboard/qr-checkin-card"
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline"
// Hier importieren wir deine Sidebar
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
// Falls du BottomNav noch nicht erstellt hast, erstelle die Datei oder kommentiere diese Zeile aus!
import { BottomNav } from "@/components/dashboard/bottom-nav" 

export default function DashboardPage() {
  return (
    <div className="relative min-h-svh bg-background lg:flex lg:flex-row">
      
      {/* Sidebar - Hier wird jetzt deine echte Komponente geladen */}
      <SidebarNav />

      {/* Mobile: single column / Desktop: two-column main area */}
      <div className="flex flex-1 flex-col lg:flex-row lg:min-h-svh">
        
        {/* Left column: User Info & QR */}
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6 lg:max-w-sm lg:shrink-0 lg:border-r lg:border-border lg:p-8 lg:gap-8 lg:overflow-y-auto lg:h-svh">
          <UserHeader
            name="Alex Johnson"
            group="B"
            eventName="DevSummit 2026"
            date="March 5, 2026"
          />
          <QrCheckinCard attendeeId="EVT-2026-4829" />
        </div>

        {/* Right column: Schedule */}
        <div className="mx-auto flex w-full max-w-lg flex-col lg:max-w-none lg:flex-1 lg:p-8 lg:h-svh lg:overflow-hidden">
          <ScheduleTimeline />
        </div>
      </div>

      {/* Bottom Nav - Die echte Komponente */}
      <BottomNav />
      
    </div>
  )
}