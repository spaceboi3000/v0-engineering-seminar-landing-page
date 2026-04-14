import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = getSupabase()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { workshopId } = await req.json()

  const { data: workshop, error: wErr } = await db
    .from("workshops")
    .select("start_time, end_time, title")
    .eq("id", workshopId)
    .single()

  if (wErr || !workshop) return NextResponse.json({ error: "Workshop not found" }, { status: 404 })

  // Fetch all workshops the user is already enrolled in
  const { data: enrolled } = await db
    .from("enrollments")
    .select("workshop_id, workshops(start_time, end_time, title)")
    .eq("user_id", user.id)
    .neq("workshop_id", workshopId)

  // Check for time overlap: overlap when start_A < end_B AND end_A > start_B
  const conflict = enrolled?.find((e: any) => {
    const w = e.workshops
    return new Date(w.start_time) < new Date(workshop.end_time) &&
           new Date(w.end_time)   > new Date(workshop.start_time)
  })

  if (conflict) {
    const conflictName = (conflict as any).workshops?.title ?? "άλλο workshop"
    return NextResponse.json(
      { error: `Χρονική σύγκρουση με: "${conflictName}"` },
      { status: 409 }
    )
  }

  const { error } = await db
    .from("enrollments")
    .insert({ user_id: user.id, workshop_id: workshopId })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = getSupabase()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { workshopId } = await req.json()

  const { error } = await db
    .from("enrollments")
    .delete()
    .eq("user_id", user.id)
    .eq("workshop_id", workshopId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
