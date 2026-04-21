import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()

  if (!q || q.length < 3) {
    return NextResponse.json([])
  }

  const db = getSupabase()
  const { data } = await db
    .from("profiles")
    .select("company")
    .eq("role", "company")
    .ilike("company", `${q}%`)
    .limit(10)

  const unique = [...new Set((data ?? []).map((r) => r.company).filter(Boolean))]
  return NextResponse.json(unique)
}
