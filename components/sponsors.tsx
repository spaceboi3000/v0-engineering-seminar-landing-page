"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { sponsors, TIER_CONFIG } from "@/data/sponsors"

export function Sponsors() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const animationRef = useRef<number | null>(null)
  const scrollSpeed = 0.6

  const tierOrder = ["platinum", "gold", "silver", "bronze"] as const
  const sortedSponsors = [...sponsors].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  )

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += scrollSpeed
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0
        }
        updateScrollButtons()
      }
      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame(step)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPaused, updateScrollButtons])

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = 340
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
    setTimeout(updateScrollButtons, 350)
  }

  return (
    <section id="sponsors" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-ras-red">
            Our Partners
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Supported By
          </h2>
        </div>

        <div
          className="relative group/carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left arrow */}
          <button
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll sponsors left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-border/40 bg-background/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "opacity-0 group-hover/carousel:opacity-100 hover:border-ras-red/50 hover:bg-background/90 cursor-pointer"
                : "opacity-0 cursor-default"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            aria-label="Scroll sponsors right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-border/40 bg-background/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "opacity-0 group-hover/carousel:opacity-100 hover:border-ras-red/50 hover:bg-background/90 cursor-pointer"
                : "opacity-0 cursor-default"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Left/right fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background/80 to-transparent z-[5]" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background/80 to-transparent z-[5]" />

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex justify-center flex-wrap gap-5 overflow-x-auto scrollbar-hide px-2 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sortedSponsors.map((sponsor) => {
              const tier = TIER_CONFIG[sponsor.tier]
              return (
                <Link
                  key={sponsor.id}
                  href={`/sponsors/${sponsor.id}`}
                  className="group flex flex-col shrink-0 w-[320px] rounded-2xl border border-border/40 bg-muted/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:bg-muted/40 hover:shadow-[0_4px_30px_rgba(228,61,64,0.04)] cursor-pointer"
                >
                  {/* Tier strip */}
                  <div
                    className="flex items-center justify-center py-2 text-[11px] font-bold uppercase tracking-widest text-black shrink-0"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.label}
                  </div>

                  {/* Logo area */}
                  <div
                    className="relative h-[140px] w-full border-b border-border/40"
                    style={{ background: sponsor.logoBg ?? "white" }}
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center gap-1.5 p-5">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-ras-red-400 transition-colors">
                      {sponsor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-3">
                      {sponsor.shortDescription}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* "Become a Sponsor" CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="mailto:sponsors@example.com"
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-border/60 px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-muted/30 hover:text-foreground/80"
          >
            <span className="text-lg leading-none">+</span> Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  )
}