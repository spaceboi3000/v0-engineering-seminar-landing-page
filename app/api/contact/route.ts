import { NextResponse } from "next/server"
import { transporter } from "@/lib/mailer"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid field types." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)

  try {
    // Notify the team
    await transporter.sendMail({
      from: `"RAS NTUA Website" <${process.env.GMAIL_USER}>`,
      to: "ras.ntua@gmail.com",
      subject: `New Contact Form Message from ${safeName}`,
      html: `
        <h2>New message from the contact form</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safeMessage}</p>
      `,
    })

    // Send confirmation to the user
    await transporter.sendMail({
      from: `"RAS NTUA" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "We received your message!",
      html: `
        <p>Hi ${safeName},</p>
        <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
        <br/>
        <p>Best regards,<br/>The RAS NTUA Team</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form email error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
