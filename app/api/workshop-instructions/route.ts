import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const workshopId = searchParams.get("id")

  if (!workshopId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const db = getSupabase()

  // Verify workshop exists and has instructions
  const { data: workshop } = await db
    .from("workshops")
    .select("instructions_url, title")
    .eq("id", workshopId)
    .single()

  if (!workshop?.instructions_url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Download the file from storage
  const path = `${workshopId}/instructions.pdf`
  const { data, error } = await db.storage
    .from("workshop-instructions")
    .download(path)

  if (error || !data) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const filename = `${workshop.title.replace(/[^a-zA-Z0-9\u0370-\u03FF\s-]/g, "").replace(/\s+/g, "_")}_Instructions.pdf`

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  })
}
