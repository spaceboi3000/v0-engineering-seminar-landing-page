"use client"

import React, { useState, useEffect } from "react"
import { CalendarDays, MapPin, ArrowRight, ChevronDown } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 5000)
      return () => clearTimeout(t)
    }
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setStatus("success")
      setEmail("")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      setStatus("error")
    }
  }

  return (
    <section id="home" className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-background">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/Robotalk2025-4.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Neon glow orbs - updated to red and blue */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ras-red/10 blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px]" aria-hidden="true" />

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0v60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              <circle cx="60" cy="0" r="1.5" fill="currentColor" />
              <circle cx="0" cy="60" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        {/* Floating Robot Logo with glow */}
        <div className="mx-auto mb-10 flex justify-center">
          <div className="animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(228,61,64,0.4)]">
            {/* UPDATED: Path perfectly matches the original file name in the folder */}
            <Image
              src="/images/RoboTalk ROBOT_PNG_IM.png"
              alt="RoboTalk robot mascot"
              width={200}
              height={200}
              className="h-48 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Gradient Headline - Red to Blue */}
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-ras-red via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            RoboTalk
          </span>
        </h1>

        {/* Subheadline */}
        <h2 className="mx-auto mt-4 max-w-2xl text-balance text-lg text-foreground/70 md:text-xl">
          A robotics {"&"} AI seminar by IEEE RAS NTUA
        </h2>

        {/* Metadata Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-4 py-2 text-sm font-medium text-foreground/90 backdrop-blur-sm">
            <CalendarDays className="h-4 w-4 text-ras-red" />
            April 25, 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-4 py-2 text-sm font-medium text-foreground/90 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-blue-400" />
            Goethe-Institut Athen
          </span>
        </div>

        {/* Email CTA - Suppress hydration warnings for browser extensions */}
        <div className="mx-auto mt-10 max-w-md">
          {status === "success" ? (
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-6 py-4 text-sm font-medium text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
              You&apos;re on the list! Check your inbox (and spam) for a confirmation email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2" suppressHydrationWarning>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:border-blue-500/50"
                aria-label="Email address"
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                suppressHydrationWarning
              >
                {status === "loading" ? "..." : "Notify Me"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          {errorMsg && <p className="mt-2 text-sm text-red-400">{errorMsg}</p>}
          <p className="mt-3 text-xs text-muted-foreground/60">
            Be the first to know. No spam, ever.
          </p>
        </div>
      </div>

      {/* Bottom transition: big bouncing arrow */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-8">
        <a
          href="#about"
          className="group flex items-center justify-center rounded-full transition-all hover:scale-110"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-10 w-10 text-blue-400/70 animate-bounce drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-colors group-hover:text-blue-300" />
        </a>
      </div>

      {/* Bottom fade matching theme background */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-[5]" style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 40%, transparent 100%)" }} aria-hidden="true" />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}