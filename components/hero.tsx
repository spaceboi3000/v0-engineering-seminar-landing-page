"use client"

import React from "react"
import { useState } from "react"
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
    <section id="home" className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/event-1.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Neon glow orbs */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-[130px]" aria-hidden="true" />

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0v60" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="white" />
              <circle cx="60" cy="0" r="1.5" fill="white" />
              <circle cx="0" cy="60" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        {/* Floating Robot Logo with glow */}
        <div className="mx-auto mb-10 flex justify-center">
          <div className="animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]">
            <Image
              src="/images/robotalk-logo.png"
              alt="RoboTalk robot mascot"
              width={200}
              height={200}
              className="h-48 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Gradient Headline */}
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            RoboTalk
          </span>
        </h1>

        {/* Subheadline */}
        <h2 className="mx-auto mt-4 max-w-2xl text-balance text-lg text-white/70 md:text-xl">
          A robotics {"&"} AI seminar by IEEE RAS NTUA
        </h2>

        {/* Metadata Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <CalendarDays className="h-4 w-4 text-red-400" />
            April 25, 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-fuchsia-400" />
            Goethe-Institut Athen
          </span>
        </div>

        {/* Email CTA */}
        <div className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm font-medium text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              You are on the list! We will notify you with updates.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-red-500/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] backdrop-blur-sm transition-shadow focus:outline-none focus:shadow-[0_0_25px_rgba(239,68,68,0.3)] focus:border-red-500/50"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105"
              >
                Notify Me
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-white/40">
            Be the first to know. No spam, ever.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}
