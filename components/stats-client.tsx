"use client"

import { useEffect, useRef, useState } from "react"

interface Stat {
  label: string
  value: number
  big: boolean
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

export function StatsClient({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Blue background with top/bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-950 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center">
        <h2
          className="text-3xl font-bold tracking-tight text-white md:text-4xl transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          RoboTalk 2026
        </h2>
        <p
          className="mt-3 text-blue-200/60 text-sm uppercase tracking-widest font-medium transition-all duration-700 delay-100"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          In Numbers
        </p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} visible={visible} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat, visible, index }: { stat: Stat; visible: boolean; index: number }) {
  const count = useCountUp(stat.value, visible)

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${stat.big ? "col-span-2 md:col-span-1" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${200 + index * 100}ms`,
      }}
    >
      <span
        className={`font-bold tracking-tight text-white ${
          stat.big ? "text-7xl md:text-8xl" : "text-4xl md:text-5xl"
        }`}
      >
        {count}+
      </span>
      <span className="mt-2 text-sm text-blue-200/70 font-medium uppercase tracking-wider">
        {stat.label}
      </span>
    </div>
  )
}
