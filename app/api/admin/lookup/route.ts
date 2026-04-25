import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { getSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
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

  // Look up the scanned user
  const { searchParams } = new URL(req.url)
  const targetId = searchParams.get("userId")
  if (!targetId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("first_name, last_name, university, department, role, assigned_group")
    .eq("id", targetId)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Get enrollments
  const { data: enrollments } = await db
    .from("enrollments")
    .select("workshop_id, status")
    .eq("user_id", targetId)

  // Get workshop titles for enrolled items
  const enrolledIds = (enrollments ?? []).map((e) => e.workshop_id)
  let workshops: { id: string; title: string; type: string; start_time: string; end_time: string }[] = []
  if (enrolledIds.length > 0) {
    const { data } = await db
      .from("workshops")
      .select("id, title, type, start_time, end_time")
      .in("id", enrolledIds)
      .order("start_time")
    workshops = data ?? []
  }

  const enrichedEnrollments = (enrollments ?? []).map((e) => {
    const w = workshops.find((w) => w.id === e.workshop_id)
    return {
      workshopId: e.workshop_id,
      status: e.status,
      title: w?.title ?? "Unknown",
      type: w?.type ?? "unknown",
      startTime: w?.start_time,
      endTime: w?.end_time,
    }
  })

  // Fetch check-in records for this user
  const { data: checkIns } = await db
    .from("check_ins")
    .select("context")
    .eq("user_id", targetId)

  const checkedIn = (checkIns ?? []).map((c: { context: string }) => c.context)

  return NextResponse.json({
    id: targetId,
    firstName: profile.first_name,
    lastName: profile.last_name,
    university: profile.university,
    department: profile.department,
    role: profile.role,
    assignedGroup: profile.assigned_group,
    enrollments: enrichedEnrollments,
    checkedIn,
  })
}
