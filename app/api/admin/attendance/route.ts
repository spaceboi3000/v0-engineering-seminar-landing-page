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

  const { searchParams } = new URL(req.url)
  const context = searchParams.get("context")
  const format = searchParams.get("format")

  if (!context) {
    return NextResponse.json({ error: "Missing context param" }, { status: 400 })
  }

  // Fetch check-ins for this context
  const { data: checkIns, error: checkInError } = await db
    .from("check_ins")
    .select("user_id, checked_at")
    .eq("context", context)
    .order("checked_at", { ascending: true })

  if (checkInError) {
    return NextResponse.json({ error: checkInError.message }, { status: 500 })
  }

  if (!checkIns || checkIns.length === 0) {
    if (format === "csv") {
      return new Response("First Name,Last Name,University,Group,Checked At\n", {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="attendance-${context}.csv"`,
        },
      })
    }
    return NextResponse.json({ attendees: [], count: 0 })
  }

  // Fetch profiles for all checked-in users
  const userIds = checkIns.map((c: { user_id: string }) => c.user_id)
  const { data: profiles } = await db
    .from("profiles")
    .select("id, first_name, last_name, university, assigned_group")
    .in("id", userIds)

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; first_name: string; last_name: string; university: string; assigned_group: string }) => [p.id, p])
  )

  const attendees = checkIns.map((c: { user_id: string; checked_at: string }) => {
    const p = profileMap.get(c.user_id)
    return {
      userId: c.user_id,
      firstName: p?.first_name ?? "Unknown",
      lastName: p?.last_name ?? "",
      university: p?.university ?? "",
      group: p?.assigned_group ?? "Not set",
      checkedAt: c.checked_at,
    }
  })

  if (format === "csv") {
    const header = "First Name,Last Name,University,Group,Checked At"
    const rows = attendees.map(
      (a: { firstName: string; lastName: string; university: string; group: string; checkedAt: string }) =>
        `"${a.firstName}","${a.lastName}","${a.university}","${a.group}","${a.checkedAt}"`
    )
    const csv = [header, ...rows].join("\n")
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendance-${context}.csv"`,
      },
    })
  }

  return NextResponse.json({ attendees, count: attendees.length })
}
