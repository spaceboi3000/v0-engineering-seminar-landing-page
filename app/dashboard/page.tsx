import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import { UserHeader } from "@/components/dashboard/user-header"
import { QrCheckinCard } from "@/components/dashboard/qr-checkin-card"
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { GameSection } from "@/components/dashboard/game-section"
import { WinOverlay } from "@/components/dashboard/winoverlay"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single()

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.email ?? "Attendee"

  // Short human-readable attendee ID derived from UUID
  const attendeeId = `RAS-${user.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="relative min-h-svh bg-background lg:flex lg:flex-row scroll-smooth" id="dashboard">
      <WinOverlay />
      <SidebarNav />

      <div className="flex flex-1 flex-col lg:flex-row lg:min-h-svh flex-wrap">
        <div id="qr-code" className="mx-auto flex w-full max-w-lg flex-col gap-6 pt-10 lg:max-w-sm lg:shrink-0 lg:border-r lg:border-border lg:px-8 lg:pb-8 lg:pt-16 lg:gap-8">
          <UserHeader
            name={fullName}
            group="A"
            eventName="RoboTalk 2026"
            date="April 25, 2026"
          />
          <QrCheckinCard attendeeId={attendeeId} userId={user.id} />
        </div>

        <div id="schedule" className="mx-auto flex w-full max-w-lg flex-col pt-6 lg:max-w-none lg:flex-1 lg:px-8 lg:pb-8 lg:pt-16">
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
