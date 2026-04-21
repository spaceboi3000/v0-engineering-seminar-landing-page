import { createSupabaseServer } from "@/lib/supabase"

export async function GET(req: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Fetch the CV record for the current user
  const { data: cvRecord, error: cvError } = await supabase
    .from("cv_uploads")
    .select("file_path")
    .eq("user_id", user.id)
    .single()

  if (cvError || !cvRecord) {
    return new Response("CV not found", { status: 404 })
  }

  // Get signed URL from storage
  const { data, error: signError } = await supabase.storage
    .from("cvs")
    .createSignedUrl(cvRecord.file_path, 3600)

  if (signError || !data) {
    return new Response("Failed to retrieve CV", { status: 500 })
  }

  // Fetch the file from the signed URL and stream it
  const response = await fetch(data.signedUrl)
  if (!response.ok) {
    return new Response("Failed to fetch CV", { status: 500 })
  }

  // Return with proper headers to open in browser (not download)
  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "no-cache",
    },
  })
}
