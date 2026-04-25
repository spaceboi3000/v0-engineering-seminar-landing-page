import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import { getSupabase } from "@/lib/supabase"
import { AdminClient } from "./admin-client"

export default async function AdminPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const db = getSupabase()
  const { data: profile } = await db
    .from("profiles")
    .select("assigned_group")
    .eq("id", user.id)
    .single()

  if (profile?.assigned_group !== "Admin") redirect("/dashboard")

  // Fetch workshops for context dropdown + instructions management
  const { data: workshops } = await db
    .from("workshops")
    .select("id, title, type, start_time, end_time, instructions_url")
    .in("type", ["workshop", "seminar"])
    .order("start_time")

  return <AdminClient workshops={workshops ?? []} />
}
