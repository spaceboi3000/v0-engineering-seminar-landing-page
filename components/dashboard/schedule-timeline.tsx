"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { Clock, MapPin, Presentation, Wrench, Coffee, Users, FileUp, Loader2, Users2 } from "lucide-react"

type EventType = "workshop" | "seminar" | "break" | "networking"

interface WorkshopRow {
  id: string
  title: string
  speaker: string | null
  location: string
  type: EventType
  start_time: string
  end_time: string
  capacity: number
}

const typeConfig: Record<
  EventType,
  { icon: typeof Presentation; label: string; bg: string; text: string }
> = {
  seminar:    { icon: Presentation, label: "Seminar",    bg: "bg-blue-100",   text: "text-blue-600"   },
  workshop:   { icon: Wrench,       label: "Workshop",   bg: "bg-pink-100",   text: "text-pink-600"   },
  break:      { icon: Coffee,       label: "Break",      bg: "bg-gray-100",   text: "text-gray-600"   },
  networking: { icon: Users,        label: "Networking", bg: "bg-purple-100", text: "text-purple-600" },
}

const filterOptions: { label: string; value: EventType | "all" }[] = [
  { label: "All",       value: "all"      },
  { label: "Seminars",  value: "seminar"  },
  { label: "Workshops", value: "workshop" },
]

interface Props {
  userId: string
  enrolledIds: string[]
  waitlistedIds: string[]
  enrollmentCounts: Record<string, number>
  workshops: WorkshopRow[]
}

export function ScheduleTimeline({ enrolledIds, waitlistedIds, enrollmentCounts, workshops }: Props) {
  const [filter, setFilter] = useState<EventType | "all">("all")
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set(enrolledIds))
  const [waitlisted, setWaitlisted] = useState<Set<string>>(new Set(waitlistedIds))
  const [counts, setCounts] = useState<Record<string, number>>(enrollmentCounts)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" })

  const events = workshops.map((w) => ({
    id: w.id,
    title: w.title,
    speaker: w.speaker ?? undefined,
    location: w.location,
    type: w.type,
    time: fmt(w.start_time),
    endTime: fmt(w.end_time),
    capacity: w.capacity,
  }))

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter)

  async function getToken() {
    const supabase = createSupabaseBrowser()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? null
  }

  async function handleEnroll(workshopId: string) {
    setLoading(workshopId)
    setError(null)
    const token = await getToken()
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ workshopId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Κάτι πήγε στραβά.")
    } else if (data.waitlisted) {
      setWaitlisted(prev => new Set([...prev, workshopId]))
    } else {
      setEnrolled(prev => new Set([...prev, workshopId]))
      setCounts(prev => ({ ...prev, [workshopId]: (prev[workshopId] ?? 0) + 1 }))
    }
    setLoading(null)
  }

  async function handleUnenroll(workshopId: string) {
    setLoading(workshopId)
    setError(null)
    const token = await getToken()
    const res = await fetch("/api/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ workshopId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Κάτι πήγε στραβά.")
    } else {
      if (waitlisted.has(workshopId)) {
        setWaitlisted(prev => { const s = new Set(prev); s.delete(workshopId); return s })
      } else {
        setEnrolled(prev => { const s = new Set(prev); s.delete(workshopId); return s })
        setCounts(prev => ({ ...prev, [workshopId]: Math.max(0, (prev[workshopId] ?? 1) - 1) }))
      }
    }
    setLoading(null)
  }

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

      {/* CV upload prompt */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("openSettings", { detail: "cv" }))}
        className="flex items-center gap-3 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 px-4 py-3 text-left transition-all hover:border-blue-500/60 hover:bg-blue-500/10"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <FileUp className="size-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Ανέβασε το βιογραφικό σου</p>
          <p className="text-xs text-muted-foreground">Πάτα για να ανοίξεις τις ρυθμίσεις προφίλ</p>
        </div>
      </button>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

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
          const isWorkshop = event.type === "workshop"
          const isEnrolled = enrolled.has(event.id)
          const isWaitlisted = waitlisted.has(event.id)
          const isLoading = loading === event.id
          const enrolledCount = counts[event.id] ?? 0
          const isFull = event.capacity !== undefined && enrolledCount >= event.capacity

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
                  <div className={`hidden lg:flex items-center justify-center size-12 rounded-lg shrink-0 ${colorConfig.bg} ${colorConfig.text}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-medium leading-tight text-foreground">
                      {event.title}
                    </h3>
                    {event.speaker && <p className="text-xs text-muted-foreground">{event.speaker}</p>}
                    {/* Capacity pill */}
                    {isWorkshop && event.capacity !== undefined && (
                      <span className={`mt-0.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        isFull
                          ? "bg-red-500/10 text-red-400"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        <Users2 className="size-2.5" />
                        {isFull ? `Full · ${enrolledCount}/${event.capacity}` : `${enrolledCount}/${event.capacity} spots`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {event.time} - {event.endTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
                  </div>

                  {isWorkshop && (
                    isEnrolled ? (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUnenroll(event.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-60"
                      >
                        {isLoading && <Loader2 className="size-3 animate-spin" />}
                        Απεγγραφή
                      </button>
                    ) : isWaitlisted ? (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUnenroll(event.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/20 disabled:opacity-60"
                      >
                        {isLoading && <Loader2 className="size-3 animate-spin" />}
                        Σε αναμονή · Ακύρωση
                      </button>
                    ) : (
                      <button
                        disabled={isLoading}
                        onClick={() => handleEnroll(event.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                          isFull
                            ? "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            : "bg-accent text-accent-foreground hover:opacity-90"
                        }`}
                      >
                        {isLoading && <Loader2 className="size-3 animate-spin" />}
                        {isFull ? "Λίστα αναμονής" : "Εγγραφή"}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>

  )
}
