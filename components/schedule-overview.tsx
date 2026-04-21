import { getSupabase } from "@/lib/supabase"
import { Clock, MapPin, Presentation, Wrench, Coffee, Users } from "lucide-react"
import { ScheduleCardLink } from "@/components/schedule-card-link"

type EventType = "workshop" | "seminar" | "break" | "networking"

const typeConfig: Record<EventType, { icon: typeof Presentation; bg: string; text: string }> = {
  seminar:    { icon: Presentation, bg: "bg-blue-500/10",   text: "text-blue-400"   },
  workshop:   { icon: Wrench,       bg: "bg-red-500/10",    text: "text-red-400"    },
  break:      { icon: Coffee,       bg: "bg-gray-500/10",   text: "text-gray-400"   },
  networking: { icon: Users,        bg: "bg-purple-500/10", text: "text-purple-400" },
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" })

export async function ScheduleOverview() {
  const db = getSupabase()
  const { data: workshops } = await db
    .from("workshops")
    .select("id, title, speaker, location, type, start_time, end_time")
    .order("start_time")

  if (!workshops || workshops.length === 0) return null

  // Group events that share the same conflict_group or time slot
  // For simplicity, just list them in order
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

        <div className="mt-12 flex flex-col">
          {workshops.map((w, i) => {
            const cfg = typeConfig[w.type as EventType] ?? typeConfig.seminar
            const Icon = cfg.icon
            const isLast = i === workshops.length - 1

            return (
              <div key={w.id} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0 w-16">
                  <span className="text-[11px] font-mono text-muted-foreground tabular-nums leading-none mt-4">
                    {fmt(w.start_time)}
                  </span>
                  <div className={`mt-2 size-2 rounded-full shrink-0 ${w.type === "workshop" ? "bg-red-500" : w.type === "seminar" ? "bg-blue-400" : w.type === "break" ? "bg-gray-400" : "bg-purple-400"}`} />
                  {!isLast && <div className="flex-1 w-px bg-border/40 mt-1" />}
                </div>

                {/* Card */}
                <div className="flex-1 pb-4">
                  <ScheduleCardLink
                    type={w.type}
                    className="w-full rounded-xl border border-border/60 p-3 sm:p-4 flex items-center gap-3 transition-colors hover:border-border hover:bg-white/[0.02] text-left"
                  >
                    <div className={`flex items-center justify-center size-9 sm:size-10 rounded-lg shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <Icon className="size-4 sm:size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground">{w.title}</h3>
                      {w.speaker && <p className="text-xs text-muted-foreground">{w.speaker}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{fmt(w.start_time)}–{fmt(w.end_time)}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{w.location}</span>
                      </div>
                    </div>
                  </ScheduleCardLink>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
