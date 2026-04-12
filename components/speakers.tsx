"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { speakers } from "@/data/speakers"

const AUTOPLAY_MS = 4000

export function Speakers() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const total = speakers.length

  const goTo = useCallback((index: number, dir: "left" | "right") => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 350)
  }, [animating])

  const next = useCallback(() => {
    goTo((current + 1) % total, "left")
  }, [current, total, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total, "right")
  }, [current, total, goTo])

  // Autoplay
  useEffect(() => {
    timerRef.current = setTimeout(next, AUTOPLAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const threshold = window.innerWidth * 0.1
    if (Math.abs(dx) > threshold) {
      dx < 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  const speaker = speakers[current]

  return (
    <section id="speakers" className="py-16 lg:py-20 bg-background/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-ras-red">
            RoboTalk 2026
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ομιλητές
          </h2>
        </div>

        <div
          className="relative mx-auto max-w-sm"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card */}
          <div className="overflow-hidden rounded-2xl">
            <div
              key={current}
              className={`transition-all duration-350 ${
                animating
                  ? direction === "left"
                    ? "-translate-x-8 opacity-0"
                    : "translate-x-8 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
              style={{ transition: "transform 350ms ease, opacity 350ms ease" }}
            >
              <Link href={`/speakers/${speaker.id}`} className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/40">
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white leading-tight">{speaker.name}</h3>
                    <p className="text-sm text-white/70 mt-0.5">{speaker.title}</p>
                    <p className="mt-2 text-xs font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                      Δες βιογραφικό →
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 flex size-10 items-center justify-center rounded-full border border-border/40 bg-card shadow-md transition-all hover:border-blue-500/50 hover:scale-110"
            aria-label="Previous speaker"
          >
            <ChevronLeft className="size-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 flex size-10 items-center justify-center rounded-full border border-border/40 bg-card shadow-md transition-all hover:border-blue-500/50 hover:scale-110"
            aria-label="Next speaker"
          >
            <ChevronRight className="size-5 text-foreground" />
          </button>

          {/* Dot indicators */}
          <div className="mt-6 flex justify-center gap-2">
            {speakers.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "left" : "right")}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-ras-red" : "w-2 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to speaker ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
