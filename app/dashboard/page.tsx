import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServer } from "@/lib/supabase-server"
import { UserHeader } from "@/components/dashboard/user-header"
import { QrCheckinCard } from "@/components/dashboard/qr-checkin-card"
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { GameSection } from "@/components/dashboard/game-section"
import { WinOverlay } from "@/components/dashboard/winoverlay"
import { GameButton } from "@/components/dashboard/game-button"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, university, department")
    .eq("id", user.id)
    .single()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("workshop_id")
    .eq("user_id", user.id)

  const enrolledIds = enrollments?.map((e) => e.workshop_id) ?? []

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
            userId={user.id}
            firstName={profile?.first_name ?? ""}
            lastName={profile?.last_name ?? ""}
            university={profile?.university ?? ""}
            department={profile?.department ?? ""}
          />
          <QrCheckinCard attendeeId={attendeeId} userId={user.id} />
          <div className="hidden lg:flex flex-col gap-2 pb-4">
            <GameButton />
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
            >
              Return to Home
            </Link>
          </div>
        </div>

        <div id="schedule" className="mx-auto flex w-full max-w-lg flex-col pt-6 lg:max-w-none lg:flex-1 lg:px-8 lg:pb-8 lg:pt-16">
          <ScheduleTimeline userId={user.id} enrolledIds={enrolledIds} />
        </div>

        <div className="w-full">
          <GameSection />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
