"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Presentation, Wrench, Coffee, Users } from "lucide-react"

type EventType = "workshop" | "seminar" | "break" | "networking"

interface ScheduleEvent {
  id: string
  time: string
  endTime: string
  title: string
  location: string
  type: EventType
  speaker?: string
  isNow?: boolean
}

const typeConfig: Record<
  EventType,
  { icon: typeof Presentation; label: string; bg: string; text: string }
> = {
  seminar: { icon: Presentation, label: "Seminar", bg: "bg-blue-100", text: "text-blue-600" },
  workshop: { icon: Wrench, label: "Workshop", bg: "bg-pink-100", text: "text-pink-600" },
  break: { icon: Coffee, label: "Break", bg: "bg-gray-100", text: "text-gray-600" },
  networking: { icon: Users, label: "Networking", bg: "bg-purple-100", text: "text-purple-600" },
}

const events: ScheduleEvent[] = []

const filterOptions: { label: string; value: EventType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Seminars", value: "seminar" },
  { label: "Workshops", value: "workshop" },
]

export function ScheduleTimeline() {
  const [filter, setFilter] = useState<EventType | "all">("all")

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter)

  return (
    <section className="flex flex-col gap-4 px-5 pb-10 lg:px-0 lg:pb-0 lg:flex-1 lg:overflow-hidden" aria-label="Today's Schedule">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground lg:text-lg">Today's Schedule</h2>
        <span className="text-xs text-muted-foreground">Coming soon</span>
      </div>

      <div className="flex items-center gap-2 lg:gap-3" role="tablist">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === opt.value
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:gap-3" role="list">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex items-center justify-center size-14 rounded-2xl bg-secondary">
              <Presentation className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Will be announced soon</p>
            <p className="text-xs text-muted-foreground">Check back closer to the event date</p>
          </div>
        ) : filtered.map((event, i) => {
          const Icon = typeConfig[event.type].icon
          const colorConfig = typeConfig[event.type]
          const isLast = i === filtered.length - 1

          return (
            <div key={event.id} className="flex gap-4 lg:gap-0" role="listitem">
              {/* Mobile Timeline Stem */}
              <div className="flex flex-col items-center pt-1 lg:hidden">
                <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${colorConfig.bg} ${colorConfig.text}`}>
                  <Icon className="size-5" />
                </div>
                {!isLast && <div className="w-px flex-1 min-h-4 bg-border" />}
              </div>

              {/* Content */}
              <div className={`flex flex-col gap-2 pb-5 flex-1 lg:pb-0 lg:rounded-xl lg:border lg:border-border lg:p-4 lg:flex-row lg:items-center lg:justify-between ${isLast ? "pb-0" : ""}`}>
                <div className="flex items-start gap-3 lg:items-center">
                  {/* Desktop Icon - Updated to size-12 container and size-5 icon */}
                  <div className={`hidden lg:flex items-center justify-center size-12 rounded-lg shrink-0 ${colorConfig.bg} ${colorConfig.text}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className={`text-sm font-medium leading-tight ${event.isNow ? "text-accent" : "text-foreground"}`}>
                      {event.title}
                    </h3>
                    {event.speaker && <p className="text-xs text-muted-foreground">{event.speaker}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="size-3" /> {event.time} - {event.endTime}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>

  )
}