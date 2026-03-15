import { UserHeader } from "@/components/dashboard/user-header"
import { QrCheckinCard } from "@/components/dashboard/qr-checkin-card"
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { BottomNav } from "@/components/dashboard/bottom-nav" 
import { GameSection } from "@/components/dashboard/game-section"
// NEU: Hier importieren wir jetzt deine winoverlay.tsx
import { WinOverlay } from "@/components/dashboard/winoverlay"

export default function DashboardPage() {
  return (
    <div className="relative min-h-svh bg-background lg:flex lg:flex-row scroll-smooth" id="dashboard">
      
      {/* NEU: Hier rufen wir die Komponente mit dem neuen Namen auf */}
      <WinOverlay />

      <SidebarNav />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:flex-row lg:min-h-svh flex-wrap">
        
        <div id="qr-code" className="mx-auto flex w-full max-w-lg flex-col gap-6 lg:max-w-sm lg:shrink-0 lg:border-r lg:border-border lg:p-8 lg:gap-8">
          <UserHeader name="Alex Johnson" group="B" eventName="DevSummit 2026" date="March 5, 2026" />
          <QrCheckinCard attendeeId="EVT-2026-4829" />
        </div>

        <div id="schedule" className="mx-auto flex w-full max-w-lg flex-col lg:max-w-none lg:flex-1 lg:p-8">
          <ScheduleTimeline />
        </div>

        <div className="w-full">
          <GameSection />
        </div>

      </div>

      <BottomNav />
      
    </div>
  )
}