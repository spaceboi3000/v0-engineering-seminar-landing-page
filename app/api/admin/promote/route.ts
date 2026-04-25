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

  const { userId, workshopId } = await req.json()

  if (!userId || !workshopId) {
    return NextResponse.json({ error: "Missing userId or workshopId" }, { status: 400 })
  }

  // Verify the user is actually waitlisted for this workshop
  const { data: waitlistEntry } = await db
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("workshop_id", workshopId)
    .eq("status", "waitlisted")
    .single()

  if (!waitlistEntry) {
    return NextResponse.json({ error: "User is not waitlisted for this workshop" }, { status: 400 })
  }

  // Find the enrolled user who registered LAST and has NOT been scanned for this workshop
  const { data: allEnrolled } = await db
    .from("enrollments")
    .select("user_id, enrolled_at")
    .eq("workshop_id", workshopId)
    .eq("status", "enrolled")
    .order("enrolled_at", { ascending: false })

  if (!allEnrolled || allEnrolled.length === 0) {
    return NextResponse.json({ error: "No enrolled users to bump" }, { status: 400 })
  }

  // Get check-ins for this workshop context to find who hasn't shown up
  const { data: workshopCheckIns } = await db
    .from("check_ins")
    .select("user_id")
    .eq("context", workshopId)

  const checkedInUserIds = new Set((workshopCheckIns ?? []).map((c: { user_id: string }) => c.user_id))

  // Find the latest-enrolled user who hasn't checked in
  const bumpTarget = allEnrolled.find((e: { user_id: string }) => !checkedInUserIds.has(e.user_id))

  if (!bumpTarget) {
    return NextResponse.json(
      { error: "All enrolled users have already checked in — cannot bump anyone" },
      { status: 409 }
    )
  }

  // Bump: delete the target's enrollment
  const { error: deleteErr } = await db
    .from("enrollments")
    .delete()
    .eq("user_id", bumpTarget.user_id)
    .eq("workshop_id", workshopId)

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  // Promote: change the waitlisted user's status to enrolled
  const { error: promoteErr } = await db
    .from("enrollments")
    .update({ status: "enrolled" })
    .eq("id", waitlistEntry.id)

  if (promoteErr) {
    return NextResponse.json({ error: promoteErr.message }, { status: 500 })
  }

  // Also record check-in for the promoted user
  await db
    .from("check_ins")
    .upsert(
      { user_id: userId, context: workshopId, checked_by: user.id },
      { onConflict: "user_id,context" }
    )

  // Fetch the bumped user's name for the confirmation message
  const { data: bumpedProfile } = await db
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", bumpTarget.user_id)
    .single()

  const bumpedName = bumpedProfile
    ? `${bumpedProfile.first_name} ${bumpedProfile.last_name}`
    : "Unknown"

  return NextResponse.json({
    success: true,
    bumped: { userId: bumpTarget.user_id, name: bumpedName },
  })
}
