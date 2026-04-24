import { getSupabase } from "@/lib/supabase"
import { sponsors } from "@/data/sponsors"
import { speakers } from "@/data/speakers"
import { StatsClient } from "./stats-client"

export async function Stats() {
  const db = getSupabase()
  const { count: studentCount } = await db
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")

  const { count: companyCount } = await db
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "company")

  const stats = [
    { label: "Participants", value: studentCount ?? 0, big: true },
    { label: "Sponsors", value: sponsors.length, big: false, showPlus: false },
    { label: "Speakers", value: speakers.length, big: false, showPlus: false },
    { label: "Company Representatives", value: companyCount ?? 0, big: false },
  ]

  return <StatsClient stats={stats} />
}
