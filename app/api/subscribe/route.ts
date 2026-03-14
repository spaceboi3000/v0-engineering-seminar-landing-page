import { NextResponse } from "next/server"
import { transporter } from "@/lib/mailer"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  try {
    // Notify the team of the new subscriber
    await transporter.sendMail({
      from: `"RAS NTUA Website" <${process.env.GMAIL_USER}>`,
      to: "ras.ntua@gmail.com",
      subject: `New Mailing List Subscriber: ${email}`,
      html: `
        <h2>New mailing list subscriber</h2>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p>Add this address to your mailing list.</p>
      `,
    })

    // Send a welcome email to the subscriber
    await transporter.sendMail({
      from: `"RAS NTUA" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "You're on the list!",
      html: `
        <p>Hi there,</p>
        <p>You have been successfully subscribed to the RAS NTUA mailing list. We will keep you updated on upcoming events and news.</p>
        <br/>
        <p>Best regards,<br/>The RAS NTUA Team</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscribe email error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
