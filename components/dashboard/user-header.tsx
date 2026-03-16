"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Settings, X, Save, Lock } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

interface UserHeaderProps {
  name: string
  group: string
  eventName: string
  date: string
  userId: string
  firstName: string
  lastName: string
  university: string
  department: string
}

const EDIT_DEADLINE = new Date("2026-04-26T23:59:59")

export function UserHeader({ name, group, eventName, date, userId, firstName, lastName, university, department }: UserHeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ firstName, lastName, university, department })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLocked = new Date() > EDIT_DEADLINE

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.from("profiles").update({
      first_name: form.firstName,
      last_name: form.lastName,
      university: form.university,
      department: form.department,
    }).eq("id", userId)
    setSaving(false)
    if (error) { setError(error.message); return }
    setOpen(false)
    router.refresh()
  }

  const initials = name.split(" ").map(n => n[0]).join("")

  return (
    <>
      <header className="flex flex-col gap-5 px-5 pt-6 pb-2 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Avatar className="size-11 bg-accent lg:size-14">
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-base lg:text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="text-lg font-semibold text-foreground leading-tight lg:text-xl">{name}</h1>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center size-10 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{eventName}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-3.5" />
              <span>{date}</span>
            </div>
          </div>
          <Badge className="bg-accent/15 text-accent border-accent/25 font-semibold text-xs px-3 py-1">
            Group {group}
          </Badge>
        </div>
      </header>

      {/* Settings modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Επεξεργασία προφίλ</h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            {isLocked ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Lock className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Η επεξεργασία προφίλ έχει κλειδωθεί μετά την εκδήλωση.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Όνομα</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Επώνυμο</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Πανεπιστήμιο</label>
                  <input name="university" value={form.university} onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Σχολή / Τμήμα</label>
                  <input name="department" value={form.department} onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none" />
                </div>

                {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

                <button onClick={handleSave} disabled={saving}
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                  <Save className="size-4" />
                  {saving ? "Αποθήκευση..." : "Αποθήκευση"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
