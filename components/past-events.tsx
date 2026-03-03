"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    src: "/images/event-1.jpg",
    alt: "Packed auditorium at a previous RoboTalk event",
    caption: "RoboTalk 2024 -- Record attendance with over 300 participants",
  },
  {
    src: "/images/event-2.jpg",
    alt: "Speaker presenting on robotics innovations",
    caption: "Keynote on next-gen autonomous systems",
  },
  {
    src: "/images/event-3.jpg",
    alt: "Networking event with professionals discussing",
    caption: "Networking session connecting students with industry leaders",
  },
  {
    src: "/images/event-4.jpg",
    alt: "Hands-on robotics workshop",
    caption: "Hands-on workshop: Building your first robotic arm",
  },
  {
    src: "/images/event-5.jpg",
    alt: "Panel discussion with expert speakers",
    caption: "Expert panel on the future of AI in robotics",
  },
  {
    src: "/images/event-6.jpg",
    alt: "Expo floor with robotics displays",
    caption: "Demo showcase featuring student-built robots",
  },
]

function getSlideStyle(offset: number): React.CSSProperties {
  // offset: 0 = center, -1 = left, 1 = right, -2 = far left, etc.
  const absOffset = Math.abs(offset)
  const direction = Math.sign(offset)

  if (absOffset > 2) {
    return {
      transform: `translateX(${direction * 95}%) scale(0.45) rotateY(${-direction * 55}deg)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
      filter: "brightness(0.3)",
    }
  }

  if (absOffset === 0) {
    return {
      transform: "translateX(0%) scale(1.08) rotateY(0deg)",
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1)",
    }
  }

  if (absOffset === 1) {
    return {
      transform: `translateX(${direction * 62}%) scale(0.78) rotateY(${-direction * 35}deg)`,
      opacity: 0.55,
      zIndex: 20,
      filter: "brightness(0.6)",
    }
  }

  // absOffset === 2
  return {
    transform: `translateX(${direction * 90}%) scale(0.6) rotateY(${-direction * 50}deg)`,
    opacity: 0.25,
    zIndex: 10,
    pointerEvents: "none" as const,
    filter: "brightness(0.4)",
  }
}

export function PastEvents() {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  // Calculate offset for each slide relative to current
  function getOffset(index: number) {
    let diff = index - current
    // Wrap around for shortest path
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return diff
  }

  return (
    <section
      id="past-events"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1a3a 0%, #162d6b 30%, #2563eb 65%, #60a5fa 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200/80">
            Gallery
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Past Highlights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100/70">
            Moments from previous RoboTalk events.
          </p>
        </div>

        {/* Coverflow Carousel */}
        <div
          className="relative mx-auto mt-14 h-[340px] sm:h-[400px] md:h-[440px] lg:h-[480px]"
          style={{ perspective: "1200px" }}
        >
          {slides.map((slide, i) => {
            const offset = getOffset(i)
            const style = getSlideStyle(offset)
            const isCenter = offset === 0

            return (
              <div
                key={slide.src}
                className="absolute left-1/2 top-0 w-[280px] sm:w-[340px] md:w-[420px] lg:w-[480px]"
                style={{
                  ...style,
                  marginLeft: "-140px",
                  transformStyle: "preserve-3d",
                  transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform, opacity",
                }}
                aria-hidden={!isCenter}
              >
                {/* Image Card */}
                <div
                  className={`overflow-hidden rounded-2xl shadow-2xl ${
                    isCenter
                      ? "ring-2 ring-white/30 shadow-[0_8px_60px_rgba(37,99,235,0.4)]"
                      : ""
                  }`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={480}
                    height={320}
                    className="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] w-full object-cover"
                  />
                </div>

                {/* Caption - only visible on center slide */}
                <div
                  className="mt-4 text-center transition-opacity duration-500"
                  style={{ opacity: isCenter ? 1 : 0 }}
                >
                  <p className="text-sm font-medium text-white/90 sm:text-base leading-relaxed">
                    {slide.caption}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Clickable side-slide areas */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-0 h-[70%] w-[30%] z-[25] cursor-pointer bg-transparent"
            aria-label="Previous slide"
          />
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-0 h-[70%] w-[30%] z-[25] cursor-pointer bg-transparent"
            aria-label="Next slide"
          />
        </div>

        {/* Arrow Controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={prev}
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={`dot-${slides[i].src}`}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-400 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
          </button>
        </div>

        {/* Slide counter */}
        <p className="mt-4 text-center text-xs font-mono tracking-wider text-blue-200/50">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  )
}
