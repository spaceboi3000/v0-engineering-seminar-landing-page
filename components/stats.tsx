import { createSupabaseServer } from "@/lib/supabase-server"
import { sponsors } from "@/data/sponsors"
import { speakers } from "@/data/speakers"
import { StatsClient } from "./stats-client"

export async function Stats() {
  const supabase = await createSupabaseServer()
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const stats = [
    { label: "Participants", value: count ?? 0, big: true },
    { label: "Sponsors", value: sponsors.length, big: false },
    { label: "Speakers", value: speakers.length, big: false },
    { label: "Company Representatives", value: sponsors.filter((s) => s.contactRecruiter).length + speakers.length, big: false },
  ]

  return <StatsClient stats={stats} />
}
