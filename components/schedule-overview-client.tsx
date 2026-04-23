"use client"

import { useState } from "react"
import { Clock, MapPin, Presentation, Wrench, Coffee, Users, ChevronDown } from "lucide-react"
import { ScheduleCardLink } from "@/components/schedule-card-link"

type EventType = "workshop" | "seminar" | "break" | "networking"

interface Workshop {
  id: string
  title: string
  speaker: string | null
  location: string
  type: string
  start_time: string
  end_time: string
  description: string | null
}

const typeConfig: Record<EventType, { icon: typeof Presentation; bg: string; text: string }> = {
  seminar:    { icon: Presentation, bg: "bg-blue-500/10",   text: "text-blue-400"   },
  workshop:   { icon: Wrench,       bg: "bg-red-500/10",    text: "text-red-400"    },
  break:      { icon: Coffee,       bg: "bg-gray-500/10",   text: "text-gray-400"   },
  networking: { icon: Users,        bg: "bg-purple-500/10", text: "text-purple-400" },
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" })

export function ScheduleOverviewClient({ workshops }: { workshops: Workshop[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="schedule" className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <p className="text-center text-base font-semibold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent md:text-lg">
          Πρόγραμμα
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Schedule
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
          Το πρόγραμμα του RoboTalk 2026 — ομιλίες, workshops και networking.
        </p>

        <div className="mt-12 max-h-[520px] overflow-y-auto scrollbar-hide rounded-xl border border-border/40 bg-muted/5 p-2 sm:p-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="flex flex-col gap-1">
            {workshops.map((w) => {
              const cfg = typeConfig[w.type as EventType] ?? typeConfig.seminar
              const Icon = cfg.icon
              const isExpanded = expandedId === w.id

              return (
                <div key={w.id}>
                  <button
                    onClick={() => toggle(w.id)}
                    className="w-full rounded-lg border border-border/40 p-2.5 sm:p-3 flex items-center gap-2.5 transition-colors hover:border-border/60 hover:bg-white/[0.02] text-left"
                  >
                    <div className={`flex items-center justify-center size-8 rounded-lg shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground break-words">{w.title}</h3>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{fmt(w.start_time)}–{fmt(w.end_time)}</span>
                        <span className="flex items-center gap-1 truncate"><MapPin className="size-3" />{w.location}</span>
                      </div>
                    </div>
                    <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded details */}
                  <div
                    className="overflow-hidden transition-all duration-200"
                    style={{ maxHeight: isExpanded ? "200px" : "0px", opacity: isExpanded ? 1 : 0 }}
                  >
                    <div className="px-3 pb-3 pt-1.5 ml-10">
                      {w.speaker && (
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-medium text-foreground/80">{w.speaker}</span>
                        </p>
                      )}
                      {w.description ? (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{w.description}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 italic">No description available.</p>
                      )}
                      {(w.type === "workshop" || w.type === "seminar") && (
                        <ScheduleCardLink
                          type={w.type}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {w.type === "workshop" ? "Enroll →" : "Learn more →"}
                        </ScheduleCardLink>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
