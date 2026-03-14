import { NextResponse } from "next/server"
import { transporter } from "@/lib/mailer"

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  try {
    // Notify the team
    await transporter.sendMail({
      from: `"RAS NTUA Website" <${process.env.GMAIL_USER}>`,
      to: "ras.ntua@gmail.com",
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New message from the contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    })

    // Send confirmation to the user
    await transporter.sendMail({
      from: `"RAS NTUA" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "We received your message!",
      html: `
        <p>Hi ${name},</p>
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
