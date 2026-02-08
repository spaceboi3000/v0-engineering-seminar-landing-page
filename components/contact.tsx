"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send, Instagram, Linkedin } from "lucide-react"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="border-t border-border/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get in Touch
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have questions about the event? Reach out and we will get back to you.
          </p>
        </div>

        <Card className="mx-auto mt-12 max-w-4xl border-border bg-card">
          <CardContent className="grid gap-8 p-6 md:grid-cols-5 md:p-8">
            {/* Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 p-8">
                  <p className="text-center font-medium text-primary">
                    Thank you for your message! We will be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder="Your name"
                      className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </div>
                  <Button type="submit" className="gap-2 self-start">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="flex flex-col justify-center gap-6 md:col-span-2 md:border-l md:border-border md:pl-8">
              <div>
                <h3 className="font-semibold text-foreground">Email Us</h3>
                <a
                  href="mailto:ras.ntua@gmail.com"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ras-chapter-ntua-student-branch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
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
