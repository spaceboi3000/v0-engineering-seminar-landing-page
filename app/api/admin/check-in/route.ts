import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  // Verify the requester is an admin
  const supabase = await createSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = getSupabase()
  const { data: adminProfile } = await db
    .from("profiles")
    .select("assigned_group")
    .eq("id", user.id)
    .single()

  if (adminProfile?.assigned_group !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId, context } = await req.json()

  if (!userId || !context) {
    return NextResponse.json({ error: "Missing userId or context" }, { status: 400 })
  }

  // Verify the target user exists
  const { data: profile } = await db
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // If context is a workshop, handle pending_cancel reversion
  if (context !== "entrance") {
    const { data: pendingEnrollment } = await db
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("workshop_id", context)
      .eq("status", "pending_cancel")
      .single()

    if (pendingEnrollment) {
      await db
        .from("enrollments")
        .update({ status: "enrolled", cancel_at: null })
        .eq("id", pendingEnrollment.id)
    }
  }

  // Insert check-in (upsert to handle re-scans gracefully)
  const { error: insertError } = await db
    .from("check_ins")
    .upsert(
      { user_id: userId, context, checked_by: user.id },
      { onConflict: "user_id,context" }
    )

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Check if this was already checked in (by trying to detect if it was an insert or update)
  // Since upsert doesn't tell us, we check if checked_at is recent
  const { data: checkIn } = await db
    .from("check_ins")
    .select("checked_at")
    .eq("user_id", userId)
    .eq("context", context)
    .single()

  const checkedAt = checkIn ? new Date(checkIn.checked_at) : new Date()
  const isRecent = Date.now() - checkedAt.getTime() < 5000 // within 5 seconds = fresh insert
  const alreadyCheckedIn = !isRecent

  return NextResponse.json({ success: true, alreadyCheckedIn })
}
