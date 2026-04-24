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

  // Parse request body
  const body = await req.json()
  const { userId, group } = body

  if (!userId || !group) {
    return NextResponse.json({ error: "Missing userId or group" }, { status: 400 })
  }

  if (group !== "A" && group !== "B") {
    return NextResponse.json({ error: "Group must be 'A' or 'B'" }, { status: 400 })
  }

  // Update the target user's assigned_group
  const { error: updateError } = await db
    .from("profiles")
    .update({ assigned_group: group })
    .eq("id", userId)

  if (updateError) {
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 })
  }

  return NextResponse.json({ success: true, group })
}
