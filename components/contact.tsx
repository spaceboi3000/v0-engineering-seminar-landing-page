"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send, Instagram, Linkedin } from "lucide-react"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="border-t border-white/5 bg-zinc-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            Get in Touch
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have questions about the event? Reach out and we will get back to you.
          </p>
        </div>

        <Card className="mx-auto mt-12 max-w-4xl border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="grid gap-8 p-6 md:grid-cols-5 md:p-8">
            {/* Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-8 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <p className="text-center font-medium text-red-300">
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
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:border-red-500/30"
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
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:border-red-500/30"
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
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:border-red-500/30 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 self-start rounded-lg bg-gradient-to-r from-red-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="flex flex-col justify-center gap-6 md:col-span-2 md:border-l md:border-white/10 md:pl-8">
              <div>
                <h3 className="font-semibold text-foreground">Email Us</h3>
                <a
                  href="mailto:ras.ntua@gmail.com"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-red-400"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:border-red-500/30 hover:text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ras-chapter-ntua-student-branch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:border-fuchsia-500/30 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]"
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
