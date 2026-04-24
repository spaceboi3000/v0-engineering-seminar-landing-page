"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SponsorNavProps {
  prevId: string | null
  nextId: string | null
  basePath?: string
  children: React.ReactNode
}

export function SponsorNav({ prevId, nextId, basePath = "/sponsors", children }: SponsorNavProps) {
  const router = useRouter()
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const touchStartX = useRef(0)
  const isSwiping = useRef(false)

  const navigate = useCallback((id: string, direction: "left" | "right") => {
    setTransitioning(true)
    setSwipeOffset(direction === "left" ? -window.innerWidth : window.innerWidth)
    setTimeout(() => {
      router.push(`${basePath}/${id}`)
    }, 200)
  }, [router, basePath])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].clientX
      isSwiping.current = true
      setTransitioning(false)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isSwiping.current) return
      const diff = e.changedTouches[0].clientX - touchStartX.current
      // Only allow swipe in directions that have a sponsor
      if (diff > 0 && !prevId) return setSwipeOffset(0)
      if (diff < 0 && !nextId) return setSwipeOffset(0)
      setSwipeOffset(diff)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!isSwiping.current) return
      isSwiping.current = false
      const diff = e.changedTouches[0].clientX - touchStartX.current
      const threshold = 60

      if (diff < -threshold && nextId) {
        navigate(nextId, "left")
      } else if (diff > threshold && prevId) {
        navigate(prevId, "right")
      } else {
        // Snap back
        setTransitioning(true)
        setSwipeOffset(0)
        setTimeout(() => setTransitioning(false), 200)
      }
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: true })
    document.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [prevId, nextId, navigate])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevId) {
        navigate(prevId, "right")
      } else if (e.key === "ArrowRight" && nextId) {
        navigate(nextId, "left")
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [prevId, nextId, navigate])

  // Reset offset when sponsor changes (component remounts with new props)
  useEffect(() => {
    setSwipeOffset(0)
    setTransitioning(false)
  }, [prevId, nextId])

  return (
    <>
      <div
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: transitioning ? "transform 200ms ease-out" : "none",
        }}
      >
        {children}
      </div>

      {/* Left arrow */}
      {prevId && (
        <Link
          href={`${basePath}/${prevId}`}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center size-11 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white/80 transition-all hover:bg-black/40 hover:text-white shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="size-6" />
        </Link>
      )}

      {/* Right arrow */}
      {nextId && (
        <Link
          href={`${basePath}/${nextId}`}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center size-11 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white/80 transition-all hover:bg-black/40 hover:text-white shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="size-6" />
        </Link>
      )}
    </>
  )
}
