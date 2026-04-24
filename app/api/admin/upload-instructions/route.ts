import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase-server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  // Verify admin
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

  // Parse multipart form
  const formData = await req.formData()
  const workshopId = formData.get("workshopId") as string
  const file = formData.get("file") as File | null

  if (!workshopId) {
    return NextResponse.json({ error: "Missing workshopId" }, { status: 400 })
  }

  // Verify workshop exists
  const { data: workshop } = await db
    .from("workshops")
    .select("id")
    .eq("id", workshopId)
    .single()

  if (!workshop) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
  }

  // If no file, remove existing instructions
  if (!file) {
    await db.storage.from("workshop-instructions").remove([`${workshopId}/instructions.pdf`])
    await db.from("workshops").update({ instructions_url: null }).eq("id", workshopId)
    return NextResponse.json({ success: true, removed: true })
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
  }

  const path = `${workshopId}/instructions.pdf`
  const buffer = Buffer.from(await file.arrayBuffer())

  // Upload (upsert to overwrite existing)
  const { error: uploadError } = await db.storage
    .from("workshop-instructions")
    .upload(path, buffer, { contentType: "application/pdf", upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = db.storage.from("workshop-instructions").getPublicUrl(path)

  // Save URL to workshops table
  await db.from("workshops").update({ instructions_url: urlData.publicUrl }).eq("id", workshopId)

  return NextResponse.json({ success: true, url: urlData.publicUrl })
}
