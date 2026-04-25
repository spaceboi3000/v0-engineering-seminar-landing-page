import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, firstName, lastName, role } = body

  if (!userId || !firstName || !lastName) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 })
  }

  if (typeof userId !== "string" || typeof firstName !== "string" || typeof lastName !== "string") {
    return NextResponse.json({ error: "Invalid field types." }, { status: 400 })
  }

  const registrationRole = role === "company" ? "company" : "student"

  // Validate role-specific fields
  if (registrationRole === "student") {
    const { university, department, year } = body
    if (!university || !department || !year) {
      return NextResponse.json({ error: "Missing student fields." }, { status: 400 })
    }
    if (typeof university !== "string" || typeof department !== "string" || typeof year !== "string") {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 })
    }
  } else {
    const { company, position } = body
    if (!company || !position) {
      return NextResponse.json({ error: "Missing company fields." }, { status: 400 })
    }
    if (typeof company !== "string" || typeof position !== "string") {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 })
    }
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

  const profileData = registrationRole === "student"
    ? {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        role: "student",
        university: body.university,
        department: body.department,
        year: body.year,
      }
    : {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        role: "company",
        company: body.company,
        position: body.position,
        university: body.company,
        department: body.position,
      }

  const { error } = await db.from("profiles").insert(profileData)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
