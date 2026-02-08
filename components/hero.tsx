"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"

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
    <section id="home" className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0v60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              <circle cx="60" cy="0" r="1.5" fill="currentColor" />
              <circle cx="0" cy="60" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground" />
        </svg>
      </div>

      {/* Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[128px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-accent/8 blur-[100px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        {/* Robot Logo */}
        <div className="mx-auto mb-8 flex justify-center">
          <Image
            src="/images/robotalk-logo.png"
            alt="RoboTalk robot mascot"
            width={180}
            height={180}
            className="h-44 w-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Robo<span className="text-primary">Talk</span>
        </h1>

        {/* Subheadline */}
        <h2 className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          A robotics {"&"} AI seminar by IEEE RAS NTUA
        </h2>

        {/* Metadata Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            April 25, 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Goethe-Institut Athen
          </span>
        </div>

        {/* Email CTA */}
        <div className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <div className="rounded-lg border border-primary/30 bg-primary/10 px-6 py-4 text-sm font-medium text-primary">
              You are on the list! We will notify you with updates.
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
