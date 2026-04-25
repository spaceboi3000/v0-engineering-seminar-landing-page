import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { transporter } from "@/lib/mailer"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
  }

  // Check if already subscribed
  const { data: existing } = await getSupabase()
    .from("subscribers")
    .select("id, confirmed")
    .eq("email", email)
    .single()

  if (existing?.confirmed) {
    return NextResponse.json({ error: "This email is already subscribed." }, { status: 409 })
  }

  const token = crypto.randomUUID()
  const now = new Date().toISOString()

  if (existing) {
    // Resend confirmation for unconfirmed subscriber
    await getSupabase()
      .from("subscribers")
      .update({ token, subscribed_at: now })
      .eq("email", email)
  } else {
    const { error } = await getSupabase().from("subscribers").insert({
      email,
      token,
      confirmed: false,
      subscribed_at: now,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Failed to save subscription. Please try again." }, { status: 500 })
    }
  }

  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/confirm?token=${token}`

  try {
    await transporter.sendMail({
      from: `"RAS NTUA" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Confirm your subscription to RAS NTUA",
      html: `
        <p>Hi there,</p>
        <p>Thanks for signing up! Please confirm your subscription by clicking the link below:</p>
        <p><a href="${confirmUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">Confirm Subscription</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,<br/>The RAS NTUA Team</p>
      `,
    })
  } catch (err) {
    console.error("Confirmation email error:", err)
    return NextResponse.json({ error: "Saved but failed to send confirmation email." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
