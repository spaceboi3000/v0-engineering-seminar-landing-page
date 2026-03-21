import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId, firstName, lastName, university, department, year } = await req.json()

  if (!userId || !firstName || !lastName || !university || !department || !year) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 })
  }

  const { error } = await getSupabase().from("profiles").insert({
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
