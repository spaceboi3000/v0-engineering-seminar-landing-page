import { getSupabase } from "@/lib/supabase"
import { ScheduleOverviewClient } from "@/components/schedule-overview-client"

export async function ScheduleOverview() {
  const db = getSupabase()
  const { data: workshops } = await db
    .from("workshops")
    .select("id, title, speaker, location, type, start_time, end_time, description, instructions_url")
    .order("start_time")

  if (!workshops || workshops.length === 0) return null

  return <ScheduleOverviewClient workshops={workshops} />
}
