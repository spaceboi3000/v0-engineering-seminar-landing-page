import { createSupabaseServer } from "@/lib/supabase-server"
import { sponsors } from "@/data/sponsors"
import { speakers } from "@/data/speakers"
import { StatsClient } from "./stats-client"

export async function Stats() {
  const supabase = await createSupabaseServer()
  const { count: totalCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: companyCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "company")

  const stats = [
    { label: "Participants", value: totalCount ?? 0, big: true },
    { label: "Sponsors", value: sponsors.length, big: false },
    { label: "Speakers", value: speakers.length, big: false },
    { label: "Company Representatives", value: companyCount ?? 0, big: false },
  ]

  return <StatsClient stats={stats} />
}
