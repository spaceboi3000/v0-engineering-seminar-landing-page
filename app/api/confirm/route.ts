import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/?confirmed=invalid", req.url))
  }

  const { data, error } = await getSupabase()
    .from("subscribers")
    .select("id, confirmed")
    .eq("token", token)
    .single()

  if (error || !data) {
    return NextResponse.redirect(new URL("/?confirmed=invalid", req.url))
  }

  if (data.confirmed) {
    return NextResponse.redirect(new URL("/?confirmed=already", req.url))
  }

  await getSupabase()
    .from("subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("token", token)

  return NextResponse.redirect(new URL("/?confirmed=success", req.url))
}
