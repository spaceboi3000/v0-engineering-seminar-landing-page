"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"

export function Hero() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section id="home" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Circuit board pattern background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h80v80H10z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="10" r="2" fill="currentColor" />
              <circle cx="10" cy="90" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <path d="M10 10l40 40M90 10l-40 40M10 90l40-40M90 90l-40-40" stroke="currentColor" strokeWidth="0.5" />
              <path d="M50 10v30M50 60v30M10 50h30M60 50h30" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-primary" />
        </svg>
      </div>

      {/* Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[128px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        {/* Headline */}
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          The Future of Electrical{" "}
          <span className="text-primary">{"&"}</span> Computer Engineering
        </h1>

        {/* Subheadline */}
        <h2 className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          Join industry leaders for a 2-day immersive seminar.
        </h2>

        {/* Metadata Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            Oct 12-14, 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Athens, Greece
          </span>
        </div>

        {/* Email CTA */}
        <div className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <div className="rounded-lg border border-primary/30 bg-primary/10 px-6 py-4 text-sm font-medium text-primary">
              You are on the list! We will notify you when registration opens.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                aria-label="Email address"
              />
              <Button type="submit" className="gap-2">
                Notify Me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Be the first to know. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  )
}
