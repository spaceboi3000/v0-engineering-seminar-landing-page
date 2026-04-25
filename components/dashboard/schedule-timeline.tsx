"use client"

import { useState, useEffect, useCallback } from "react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { Clock, MapPin, Presentation, Wrench, Coffee, Users, FileUp, FileText, Loader2, Users2, X, ChevronDown } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  group_label: string | null
  conflict_group: string | null
  description: string | null
  instructions_url: string | null
}

interface ProcessedEvent {
  id: string
  title: string
  speaker?: string
  location: string
  type: EventType
  time: string
  endTime: string
  startRaw: string
  endRaw: string
  capacity: number
  groupLabel: string | null
  conflictGroup: string | null
  description: string | null
  hasInstructions: boolean
}

type ScheduleRow =
  | { kind: "single"; event: ProcessedEvent }
  | { kind: "group-conflict"; events: ProcessedEvent[] }
  | { kind: "enrollable-conflict"; events: ProcessedEvent[] }
  | { kind: "spanning-conflict"; subRows: { timeLabel: string; left: ProcessedEvent | null; right: ProcessedEvent | null }[]; allEvents: ProcessedEvent[] }

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const typeConfig: Record<
  EventType,
  { icon: typeof Presentation; label: string; bg: string; text: string; dot: string }
> = {
  seminar:    { icon: Presentation, label: "Seminar",    bg: "bg-blue-100",   text: "text-blue-600",   dot: "bg-blue-400"   },
  workshop:   { icon: Wrench,       label: "Workshop",   bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-500"    },
  break:      { icon: Coffee,       label: "Break",      bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400"   },
  networking: { icon: Users,        label: "Networking", bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-400" },
}

const filterOptions: { label: string; value: EventType | "all" }[] = [
  { label: "All",       value: "all"      },
  { label: "Seminars",  value: "seminar"  },
  { label: "Workshops", value: "workshop" },
]

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  userId: string
  assignedGroup: string
  enrolledIds: string[]
  waitlistedIds: string[]
  enrollmentCounts: Record<string, number>
  workshops: WorkshopRow[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" })

const instructionsHref = (eventId: string) => `/api/workshop-instructions?id=${encodeURIComponent(eventId)}`

function buildScheduleRows(events: ProcessedEvent[]): ScheduleRow[] {
  const singles: ProcessedEvent[] = []
  const groups: Record<string, ProcessedEvent[]> = {}

  for (const e of events) {
    if (!e.conflictGroup) {
      singles.push(e)
    } else {
      if (!groups[e.conflictGroup]) groups[e.conflictGroup] = []
      groups[e.conflictGroup].push(e)
    }
  }

  const rows: ScheduleRow[] = []

  for (const e of singles) {
    rows.push({ kind: "single", event: e })
  }

  for (const [, groupEvents] of Object.entries(groups)) {
    const isGroupConflict = groupEvents.every((e) => e.groupLabel !== null)

    if (isGroupConflict) {
      rows.push({ kind: "group-conflict", events: groupEvents })
    } else {
      const starts = new Set(groupEvents.map((e) => e.startRaw))
      const ends = new Set(groupEvents.map((e) => e.endRaw))
      const isSpanning = starts.size > 1 || ends.size > 1

      if (isSpanning) {
        const boundaries = new Set<number>()
        for (const e of groupEvents) {
          boundaries.add(new Date(e.startRaw).getTime())
          boundaries.add(new Date(e.endRaw).getTime())
        }
        const sorted = [...boundaries].sort((a, b) => a - b)

        const subRows: { timeLabel: string; left: ProcessedEvent | null; right: ProcessedEvent | null }[] = []
        for (let i = 0; i < sorted.length - 1; i++) {
          const rangeStart = sorted[i]
          const rangeEnd = sorted[i + 1]
          const covering = groupEvents.filter((e) => {
            const eStart = new Date(e.startRaw).getTime()
            const eEnd = new Date(e.endRaw).getTime()
            return eStart <= rangeStart && eEnd >= rangeEnd
          })
          const left = covering.find((e) => e.type !== "workshop") ?? null
          const right = covering.find((e) => e.type === "workshop") ?? null
          subRows.push({
            timeLabel: `${fmt(new Date(rangeStart).toISOString())} - ${fmt(new Date(rangeEnd).toISOString())}`,
            left,
            right,
          })
        }
        rows.push({ kind: "spanning-conflict", subRows, allEvents: groupEvents })
      } else {
        rows.push({ kind: "enrollable-conflict", events: groupEvents })
      }
    }
  }

  rows.sort((a, b) => {
    const getStart = (r: ScheduleRow) => {
      if (r.kind === "single") return r.event.startRaw
      if (r.kind === "spanning-conflict") return r.allEvents[0].startRaw
      return r.events[0].startRaw
    }
    return new Date(getStart(a)).getTime() - new Date(getStart(b)).getTime()
  })

  return rows
}

function getRowTime(row: ScheduleRow): string {
  if (row.kind === "single") return row.event.time
  if (row.kind === "spanning-conflict") {
    const sorted = [...row.allEvents].sort((a, b) => new Date(a.startRaw).getTime() - new Date(b.startRaw).getTime())
    return sorted[0].time
  }
  return row.events[0].time
}

function getRowDot(row: ScheduleRow): string {
  let type: EventType
  if (row.kind === "single") type = row.event.type
  else if (row.kind === "spanning-conflict") type = row.allEvents.find((e) => e.type === "workshop")?.type ?? row.allEvents[0].type
  else type = row.events.find((e) => e.type === "workshop")?.type ?? row.events[0].type
  return typeConfig[type].dot
}

function getRowKey(row: ScheduleRow, i: number): string {
  if (row.kind === "single") return row.event.id
  if (row.kind === "spanning-conflict") return `sc-${i}`
  if (row.kind === "group-conflict") return `gc-${i}`
  return `ec-${i}`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ScheduleTimeline({ userId, assignedGroup, enrolledIds, waitlistedIds, enrollmentCounts, workshops }: Props) {
  const [filter, setFilter] = useState<EventType | "all">("all")
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set(enrolledIds))
  const [waitlisted, setWaitlisted] = useState<Set<string>>(new Set(waitlistedIds))
  const [counts, setCounts] = useState<Record<string, number>>(enrollmentCounts)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<{ workshopId: string; message: string } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null)
  const [hasCv, setHasCv] = useState(false)

  useEffect(() => {
    createSupabaseBrowser()
      .from("cv_uploads")
      .select("id")
      .eq("user_id", userId)
      .single()
      .then(({ data }: { data: { id: string } | null }) => { if (data) setHasCv(true) })
  }, [userId])

  // Poll enrollment data every 15s so counts and statuses stay fresh
  const refreshEnrollments = useCallback(async () => {
    const supabase = createSupabaseBrowser()

    // Fetch user's own enrollments
    const { data: userEnrollments } = await supabase
      .from("enrollments")
      .select("workshop_id, status")
      .eq("user_id", userId)

    if (userEnrollments) {
      setEnrolled(new Set(userEnrollments.filter((e: { status: string; workshop_id: string }) => e.status === "enrolled").map((e: { workshop_id: string }) => e.workshop_id)))
      setWaitlisted(new Set(userEnrollments.filter((e: { status: string; workshop_id: string }) => e.status === "waitlisted").map((e: { workshop_id: string }) => e.workshop_id)))
    }

    // Fetch global counts
    const { data: countRows } = await supabase
      .from("workshop_enrollment_summary")
      .select("workshop_id, enrolled_count")

    if (countRows) {
      const fresh: Record<string, number> = {}
      for (const row of countRows) fresh[row.workshop_id] = Number(row.enrolled_count)
      setCounts(fresh)
    }
  }, [userId])

  useEffect(() => {
    const interval = setInterval(refreshEnrollments, 15_000)
    return () => clearInterval(interval)
  }, [refreshEnrollments])

  const events: ProcessedEvent[] = workshops.map((w) => ({
    id: w.id,
    title: w.title,
    speaker: w.speaker ?? undefined,
    location: w.location,
    type: w.type,
    time: fmt(w.start_time),
    endTime: fmt(w.end_time),
    startRaw: w.start_time,
    endRaw: w.end_time,
    capacity: w.capacity,
    groupLabel: w.group_label,
    conflictGroup: w.conflict_group,
    description: w.description,
    hasInstructions: !!w.instructions_url,
  }))

  const scheduleRows = buildScheduleRows(events)

  const filtered = filter === "all"
    ? scheduleRows
    : scheduleRows.filter((row) => {
        if (row.kind === "single") return row.event.type === filter
        if (row.kind === "spanning-conflict") return row.allEvents.some((e) => e.type === filter)
        return row.events.some((e) => e.type === filter)
      })

  /* ---- Auth + Enrollment ---- */

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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ workshopId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError({ workshopId, message: data.error ?? "Κάτι πήγε στραβά." })
    } else if (data.waitlisted) {
      setWaitlisted((prev) => new Set([...prev, workshopId]))
    } else {
      setEnrolled((prev) => new Set([...prev, workshopId]))
      setCounts((prev) => ({ ...prev, [workshopId]: (prev[workshopId] ?? 0) + 1 }))
    }
    setLoading(null)
    // Refresh from server to pick up any side-effects (e.g. waitlist promotions)
    refreshEnrollments()
  }

  async function handleUnenroll(workshopId: string) {
    setLoading(workshopId)
    setError(null)
    const token = await getToken()
    const res = await fetch("/api/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ workshopId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError({ workshopId, message: data.error ?? "Κάτι πήγε στραβά." })
    } else {
      if (waitlisted.has(workshopId)) {
        setWaitlisted((prev) => { const s = new Set(prev); s.delete(workshopId); return s })
      } else {
        setEnrolled((prev) => { const s = new Set(prev); s.delete(workshopId); return s })
        setCounts((prev) => ({ ...prev, [workshopId]: Math.max(0, (prev[workshopId] ?? 1) - 1) }))
      }
    }
    setLoading(null)
    // Refresh from server to pick up any side-effects (e.g. waitlist promotions)
    refreshEnrollments()
  }

  /* ---- Sub-components ---- */

  /* Capacity badge — sits in the capacity | instructions row */
  function CapacityBadge({ event }: { event: ProcessedEvent }) {
    if (event.type !== "workshop" || event.capacity >= 9999) return null
    const enrolledCount = counts[event.id] ?? 0
    const isFull = enrolledCount >= event.capacity
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
        isFull ? "text-red-400" : "text-muted-foreground"
      }`}>
        <Users2 className="size-3" />
        {enrolledCount}/{event.capacity}
      </span>
    )
  }

  /* Subscribe / Unsubscribe button — full-width row at bottom */
  function EnrollButton({ event }: { event: ProcessedEvent }) {
    if (event.type !== "workshop") return null
    const isEnrolled = enrolled.has(event.id)
    const isWaitlisted = waitlisted.has(event.id)
    const isLoading = loading === event.id
    const enrolledCount = counts[event.id] ?? 0
    const isFull = event.capacity < 9999 && enrolledCount >= event.capacity

    const hasError = error?.workshopId === event.id

    return (
      <div className="flex flex-col gap-1 mt-3">
        {hasError && (
          <div className="rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] text-red-400 leading-tight">
            {error.message}
          </div>
        )}
        {isEnrolled ? (
          <button disabled={isLoading} onClick={() => handleUnenroll(event.id)}
            className="w-full flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 py-1 text-[10px] font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-60">
            {isLoading && <Loader2 className="size-3 animate-spin" />}
            Unsubscribe
          </button>
        ) : isWaitlisted ? (
          <button disabled={isLoading} onClick={() => handleUnenroll(event.id)}
            className="w-full flex items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1 text-[10px] font-semibold text-amber-400 transition-all hover:bg-amber-500/20 disabled:opacity-60">
            {isLoading && <Loader2 className="size-3 animate-spin" />}
            Waitlisted
          </button>
        ) : (
          <button disabled={isLoading} onClick={() => handleEnroll(event.id)}
            className={`w-full flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-semibold transition-all disabled:opacity-60 ${
              isFull
                ? "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                : "bg-accent text-accent-foreground hover:opacity-90"
            }`}>
            {isLoading && <Loader2 className="size-3 animate-spin" />}
            {isFull ? "Waitlist" : "Subscribe"}
          </button>
        )}
      </div>
    )
  }

  /* Compact card used in group-conflict, enrollable-conflict, spanning-conflict
     Layout:
       title
       group badge          (when groupLabel present)
       description hint     (when description present)
       time | location
       capacity | instructions
       subscribe
  */
  function CompactCard({ event, highlight, enrollable }: { event: ProcessedEvent; highlight?: boolean; enrollable?: boolean }) {
    const hasDesc = !!event.description
    return (
      <div
        className={`rounded-xl border p-3 flex flex-col gap-1 transition-all ${
          highlight ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_12px_rgba(59,130,246,0.1)]" : "border-border"
        } ${hasDesc ? "cursor-pointer active:scale-[0.98] hover:border-muted-foreground/40" : ""}`}
        onClick={hasDesc ? () => setSelectedEvent(event) : undefined}
      >
        {/* title */}
        <h3 className="text-xs font-semibold leading-tight text-foreground">{event.title}</h3>

        {/* group */}
        {event.groupLabel && (
          <span className={`self-start inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
            highlight ? "bg-blue-500/20 text-blue-400" : "bg-secondary text-muted-foreground"
          }`}>
            Group {event.groupLabel}{highlight ? " · You" : ""}
          </span>
        )}

        {/* description */}
        {event.speaker && <p className="text-[10px] text-muted-foreground leading-tight">{event.speaker}</p>}
        {hasDesc && <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><ChevronDown className="size-2.5" />Tap for details</span>}

        {/* time | location */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1 shrink-0"><Clock className="size-3" />{event.time}–{event.endTime}</span>
          <span className="flex items-center gap-1"><MapPin className="size-3 shrink-0" />{event.location}</span>
        </div>

        {/* capacity | instructions */}
        {(event.type === "workshop" || event.hasInstructions) && (
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <CapacityBadge event={event} />
            {event.hasInstructions && (
              <a
                href={instructionsHref(event.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(ev) => ev.stopPropagation()}
                className="flex items-center gap-1 text-[10px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FileText className="size-3" />
                Instructions
              </a>
            )}
          </div>
        )}

        {/* subscribe */}
        {enrollable && <EnrollButton event={event} />}
      </div>
    )
  }

  /* Description modal */
  function DescriptionModal() {
    if (!selectedEvent) return null
    const cfg = typeConfig[selectedEvent.type]
    const Icon = cfg.icon
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background p-5 sm:p-8 shadow-2xl" onClick={(ev) => ev.stopPropagation()}>
          <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="size-6" />
          </button>
          <div className="flex items-start gap-4 mb-6 pr-10">
            <div className={`flex items-center justify-center size-12 rounded-xl shrink-0 ${cfg.bg} ${cfg.text}`}>
              <Icon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-foreground">{selectedEvent.title}</h3>
              {selectedEvent.speaker && <p className="text-base text-muted-foreground">{selectedEvent.speaker}</p>}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1.5"><Clock className="size-4" />{selectedEvent.time}–{selectedEvent.endTime}</span>
                <span className="flex items-center gap-1.5"><MapPin className="size-4" />{selectedEvent.location}</span>
              </div>
            </div>
          </div>
          <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">{selectedEvent.description}</div>
          {selectedEvent.hasInstructions && (
            <div className="mt-6 pt-6 border-t border-border/40">
              <a
                href={instructionsHref(selectedEvent.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <FileText className="size-4" />
                Download Instructions (PDF)
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---- Render ---- */

  return (
    <section className="flex flex-col gap-4 px-5 pb-10 lg:px-0 lg:pb-0 lg:flex-1 lg:overflow-hidden" aria-label="Today's Schedule">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground lg:text-lg">Today&apos;s Schedule</h2>
        <span className="text-xs text-muted-foreground">{events.length} events</span>
      </div>

      <div className="flex items-center gap-2 lg:gap-3" role="tablist">
        {filterOptions.map((opt) => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === opt.value ? "bg-red-600 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* CV upload prompt — hidden once a CV is uploaded */}
      {!hasCv && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("openSettings", { detail: "cv" }))}
          className="flex items-center gap-3 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 px-4 py-3 text-left transition-all hover:border-blue-500/60 hover:bg-blue-500/10"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <FileUp className="size-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Upload your CV</p>
            <p className="text-xs text-muted-foreground">Tap to open profile settings</p>
          </div>
        </button>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error.message}</div>
      )}

      {/* ── Timeline list ── */}
      <div className="flex flex-col lg:flex-1 lg:overflow-y-auto lg:pr-2" role="list">
        {filtered.map((row, i) => {
          const isLast = i === filtered.length - 1
          const rowTime = getRowTime(row)
          const dotBg = getRowDot(row)

          /* ── card content ── */
          let card: React.ReactNode

          /* ---------- Single ---------- */
          if (row.kind === "single") {
            const e = row.event
            const hasDesc = !!e.description
            card = (
              <div
                className={`rounded-xl border border-border p-3 flex flex-col gap-1 transition-all ${hasDesc ? "cursor-pointer active:scale-[0.98] hover:border-muted-foreground/40" : ""}`}
                onClick={hasDesc ? () => setSelectedEvent(e) : undefined}
              >
                {/* title | group on one line (fits for full-width single cards) */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{e.title}</h3>
                  {e.groupLabel && (
                    <span className="inline-flex items-center shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                      Group {e.groupLabel}
                    </span>
                  )}
                </div>

                {/* description */}
                {e.speaker && <p className="text-xs text-muted-foreground">{e.speaker}</p>}
                {hasDesc && <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><ChevronDown className="size-3" />Tap for details</span>}

                {/* time | location */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1 shrink-0"><Clock className="size-3" />{e.time}–{e.endTime}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3 shrink-0" />{e.location}</span>
                </div>

                {/* capacity | instructions */}
                {(e.type === "workshop" || e.hasInstructions) && (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <CapacityBadge event={e} />
                    {e.hasInstructions && (
                      <a
                        href={instructionsHref(e.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(ev) => ev.stopPropagation()}
                        className="flex items-center gap-1 rounded-md shrink-0 border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-[10px] font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                      >
                        <FileText className="size-3" />
                        Instructions
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          }

          /* ---------- Group A/B conflict ---------- */
          else if (row.kind === "group-conflict") {
            const sorted = [...row.events].sort((a, b) => (a.groupLabel ?? "").localeCompare(b.groupLabel ?? ""))
            card = (
              <div className="grid grid-cols-2 gap-2">
                {sorted.map((e) => (
                  <CompactCard key={e.id} event={e} highlight={assignedGroup === e.groupLabel} />
                ))}
              </div>
            )
          }

          /* ---------- Enrollable conflict ---------- */
          else if (row.kind === "enrollable-conflict") {
            card = (
              <div className="grid grid-cols-2 gap-2">
                {row.events.map((e) => (
                  <CompactCard key={e.id} event={e} enrollable />
                ))}
              </div>
            )
          }

          /* ---------- Spanning conflict ---------- */
          else if (row.kind === "spanning-conflict") {
            const spanningEvent = row.allEvents.find((e) => e.type === "workshop")
            card = (
              <div className="grid grid-cols-2 gap-2">
                {/* Left: stacked seminar talks */}
                <div className="flex flex-col gap-2">
                  {row.subRows.map((sr, j) => {
                    if (!sr.left) return <div key={j} />
                    return <CompactCard key={sr.left.id} event={sr.left} />
                  })}
                </div>
                {/* Right: spanning workshop */}
                {spanningEvent && <CompactCard event={spanningEvent} enrollable />}
              </div>
            )
          }

          return (
            <div key={getRowKey(row, i)} className="flex items-start gap-2" role="listitem">
              {/* ── Timeline column ── */}
              <div className="flex flex-col items-center self-stretch w-12 shrink-0">
                <span className="text-[10px] text-muted-foreground font-mono tabular-nums leading-none mt-[14px]">
                  {rowTime}
                </span>
                <div className={`mt-2 size-1.5 rounded-full shrink-0 ${dotBg}`} />
                {!isLast && <div className="flex-1 w-px bg-border/40 mt-1" />}
              </div>
              {/* ── Card ── */}
              <div className="flex-1 pb-3">{card}</div>
            </div>
          )
        })}
      </div>
      <DescriptionModal />
    </section>
  )
}
