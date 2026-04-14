"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send, Instagram, Linkedin } from "lucide-react"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="border-t border-border/20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Get in Touch
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have questions about the event? Reach out and we will get back to you.
          </p>
        </div>

        <Card className="relative mx-auto mt-12 max-w-4xl border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden z-0">

          {/* Glass texture */}
          <div className="absolute inset-0 pointer-events-none -z-10" style={{
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.08) 100%)`
          }} />
          <div className="absolute inset-0 pointer-events-none -z-10" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)`
          }} />
          <div className="absolute top-0 inset-x-0 h-px bg-white/20 pointer-events-none -z-10" />
          <div className="absolute top-0 left-0 w-1/3 h-full pointer-events-none -z-10" style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.04), transparent)`
          }} />

          {/* Glows */}
          <div className="absolute -top-20 left-1/2 h-40 w-1/2 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[70px] pointer-events-none -z-10" />
          <div className="absolute -bottom-20 left-1/2 h-40 w-1/2 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[70px] pointer-events-none -z-10" />

          <CardContent className="grid gap-8 p-6 md:grid-cols-5 md:p-8 relative z-10">
            {/* Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 p-8 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                  <p className="text-center font-medium text-sky-300">
                    Thank you for your message! We will be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      id="name"
                      required
                      placeholder="Your name"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:border-blue-500/50 resize-none"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 self-start rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="flex flex-col justify-center gap-6 md:col-span-2 md:border-l md:border-white/10 md:pl-8 relative z-20">
              <div>
                <h3 className="font-semibold text-foreground">Email Us</h3>
                <a
                  href="mailto:ras.ntua@gmail.com"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-sky-400"
                >
                  <Mail className="h-4 w-4" />
                  ras.ntua@gmail.com
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Follow Us</h3>
                <div className="mt-2 flex gap-3">
                  <a
                    href="https://www.instagram.com/ras.ntua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/50 transition-all hover:border-blue-500/30 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ras-chapter-ntua-student-branch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/50 transition-all hover:border-blue-500/30 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}