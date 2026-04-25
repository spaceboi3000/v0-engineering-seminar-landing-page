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
    .select("start_time, end_time, title, capacity")
    .eq("id", workshopId)
    .single()

  if (wErr || !workshop) return NextResponse.json({ error: "Workshop not found" }, { status: 404 })

  // Check if this user has a pending_cancel row for this exact workshop.
  // If so, they're re-subscribing within the grace period — restore their spot.
  const { data: pendingRow } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("workshop_id", workshopId)
    .eq("status", "pending_cancel")
    .single()

  if (pendingRow) {
    // Revert the cancellation — position is preserved
    const { error: revertErr } = await db
      .from("enrollments")
      .update({ status: "enrolled", cancel_at: null })
      .eq("id", pendingRow.id)

    if (revertErr) return NextResponse.json({ error: revertErr.message }, { status: 500 })
    return NextResponse.json({ success: true, waitlisted: false })
  }

  // Fetch user's confirmed (enrolled) workshops for overlap check.
  // Waitlisted and pending_cancel enrollments don't block scheduling.
  const { data: userEnrollments } = await db
    .from("enrollments")
    .select("workshop_id, status, workshops(start_time, end_time, title)")
    .eq("user_id", user.id)
    .eq("status", "enrolled")
    .neq("workshop_id", workshopId)

  // Time overlap: start_A < end_B AND end_A > start_B
  const conflict = userEnrollments?.find((e: any) => {
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

  // Count confirmed enrollments to check capacity (exclude pending_cancel)
  const { count: enrolledCount } = await db
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("workshop_id", workshopId)
    .eq("status", "enrolled")

  const isFull = (enrolledCount ?? 0) >= workshop.capacity
  const status = isFull ? "waitlisted" : "enrolled"

  const { error } = await db
    .from("enrollments")
    .insert({ user_id: user.id, workshop_id: workshopId, status })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, waitlisted: isFull })
}

export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = getSupabase()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { workshopId } = await req.json()

  // Fetch current enrollment
  const { data: enrollment } = await db
    .from("enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("workshop_id", workshopId)
    .single()

  if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 404 })

  if (enrollment.status === "waitlisted") {
    // Waitlisted users hold no confirmed spot — delete immediately, no grace period needed
    const { error } = await db
      .from("enrollments")
      .delete()
      .eq("id", enrollment.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // enrolled → grace period: mark as pending_cancel for 1 minute.
  // pg_cron (process_pending_cancels) will handle the actual deletion +
  // waitlist promotion after 60 seconds. If the user re-subscribes before
  // cancel_at, POST will detect the pending_cancel row and revert it instead
  // of inserting a new row, preserving their queue position.
  const cancelAt = new Date(Date.now() + 60_000).toISOString()
  const { error } = await db
    .from("enrollments")
    .update({ status: "pending_cancel", cancel_at: cancelAt })
    .eq("id", enrollment.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
