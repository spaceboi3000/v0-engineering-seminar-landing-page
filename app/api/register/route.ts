import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId, firstName, lastName, university, department, year } = await req.json()

  if (!userId || !firstName || !lastName || !university || !department || !year) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 })
  }

  if (
    typeof userId !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof university !== "string" ||
    typeof department !== "string" ||
    typeof year !== "string"
  ) {
    return NextResponse.json({ error: "Invalid field types." }, { status: 400 })
  }

  const db = getSupabase()

  // Verify this user actually exists in auth and was created recently (< 5 min)
  const { data: { user }, error: userErr } = await db.auth.admin.getUserById(userId)
  if (userErr || !user) {
    return NextResponse.json({ error: "Invalid user." }, { status: 403 })
  }

  const createdAt = new Date(user.created_at).getTime()
  const fiveMinAgo = Date.now() - 5 * 60 * 1000
  if (createdAt < fiveMinAgo) {
    return NextResponse.json({ error: "Registration window expired." }, { status: 403 })
  }

  // Verify no profile exists yet (prevent overwrite)
  const { data: existing } = await db.from("profiles").select("id").eq("id", userId).single()
  if (existing) {
    return NextResponse.json({ error: "Profile already exists." }, { status: 409 })
  }

  const { error } = await db.from("profiles").insert({
    id: userId,
    first_name: firstName,
    last_name: lastName,
    university,
    department,
    year,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
