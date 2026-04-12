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
    if (Math.abs(dx) > threshold) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  const speaker = speakers[current]

  return (
    <section id="speakers" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-ras-red/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-ras-red">
            RoboTalk 2026
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ομιλητές
          </h2>
        </div>

        {/* Slide wrapper */}
        <div
          className="relative mx-auto max-w-3xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card */}
          <div
            key={current}
            style={{ transition: "transform 350ms ease, opacity 350ms ease" }}
            className={`${
              animating
                ? direction === "left"
                  ? "-translate-x-8 opacity-0"
                  : "translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 shadow-lg">

              {/* Photo */}
              <Link href={`/speakers/${speaker.id}`} className="group shrink-0 mx-auto sm:mx-0">
                <div className="relative h-56 w-44 overflow-hidden rounded-xl border border-border/40 shadow-md">
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </Link>

              {/* Text */}
              <div className="flex flex-col justify-center gap-3 text-center sm:text-left">
                <div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{speaker.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{speaker.title}</p>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-4">
                  {speaker.bio}
                </p>
                <Link
                  href={`/speakers/${speaker.id}`}
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Δες βιογραφικό →
                </Link>
              </div>
            </div>
          </div>

          {/* Controls row: arrows + dots */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-full border border-border/40 bg-card shadow-md transition-all hover:border-blue-500/50 hover:scale-110"
              aria-label="Previous speaker"
            >
              <ChevronLeft className="size-5 text-foreground" />
            </button>

            <div className="flex items-center gap-2">
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

            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-full border border-border/40 bg-card shadow-md transition-all hover:border-blue-500/50 hover:scale-110"
              aria-label="Next speaker"
            >
              <ChevronRight className="size-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
