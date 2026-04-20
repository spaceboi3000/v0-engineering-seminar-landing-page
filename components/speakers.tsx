"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    if (Math.abs(dx) > window.innerWidth * 0.1) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  const speaker = speakers[current]

  return (
    <section id="speakers" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-ras-red to-blue-500 bg-clip-text text-transparent">
            RoboTalk 2026
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ομιλητές
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Γνώρισε τους ομιλητές του φετινού RoboTalk.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl">
        <Card className="relative border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden z-0">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-950/20 to-black/80 pointer-events-none -z-10" />
          {/* Glows */}
          <div className="absolute -top-20 left-1/4 h-40 w-1/3 -translate-x-1/2 rounded-full bg-ras-red/20 blur-[70px] pointer-events-none -z-10" />
          <div className="absolute -top-20 right-1/4 h-40 w-1/3 translate-x-1/2 rounded-full bg-blue-500/20 blur-[70px] pointer-events-none -z-10" />
          <div className="absolute -bottom-20 left-1/2 h-40 w-1/2 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[70px] pointer-events-none -z-10" />

          <CardContent className="p-6 md:p-8">
            {/* Slide */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                key={current}
                style={{ transition: "transform 350ms ease, opacity 350ms ease" }}
                className={`grid gap-6 md:grid-cols-5 ${
                  animating
                    ? direction === "left"
                      ? "-translate-x-6 opacity-0"
                      : "translate-x-6 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                {/* Photo */}
                <div className="md:col-span-2 flex justify-center md:justify-start">
                  <div className="relative h-80 w-60 md:h-96 md:w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
                    <Image
                      src={speaker.photo}
                      alt={speaker.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-3 flex flex-col justify-center gap-4 md:border-l md:border-white/10 md:pl-8 text-center md:text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{speaker.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{speaker.title}</p>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed line-clamp-5">
                    {speaker.bio}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Link
                      href={`/speakers/${speaker.id}`}
                      className="inline-flex items-center gap-2 self-start rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105"
                    >
                      More
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 transition-all hover:border-blue-500/30 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                aria-label="Previous speaker"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="flex items-center gap-2">
                {speakers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? "left" : "right")}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-8 bg-ras-red" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to speaker ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 transition-all hover:border-blue-500/30 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                aria-label="Next speaker"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </section>
  )
}
