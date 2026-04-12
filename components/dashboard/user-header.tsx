"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Settings, X, Save, Lock, Upload, FileText, CheckCircle2, ExternalLink } from "lucide-react"
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
  const [tab, setTab] = useState<"profile" | "cv">("profile")
  const [form, setForm] = useState({ firstName, lastName, university, department })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // CV state
  const fileRef = useRef<HTMLInputElement>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvSuccess, setCvSuccess] = useState(false)
  const [cvError, setCvError] = useState<string | null>(null)
  const [cvUrl, setCvUrl] = useState<string | null>(null)

  const isLocked = new Date() > EDIT_DEADLINE

  useEffect(() => {
    function handleOpenSettings(e: Event) {
      const tab = (e as CustomEvent).detail
      setTab(tab === "cv" ? "cv" : "profile")
      setOpen(true)
    }
    window.addEventListener("openSettings", handleOpenSettings)
    return () => window.removeEventListener("openSettings", handleOpenSettings)
  }, [])

  async function handleCvUpload() {
    if (!cvFile) return
    setCvUploading(true)
    setCvError(null)
    setCvSuccess(false)
    const supabase = createSupabaseBrowser()
    const path = `${userId}/cv.pdf`
    const { error } = await supabase.storage.from("cvs").upload(path, cvFile, { upsert: true })
    if (error) { setCvError(error.message); setCvUploading(false); return }
    const { data } = await supabase.storage.from("cvs").createSignedUrl(path, 60)
    if (data) setCvUrl(data.signedUrl)
    setCvSuccess(true)
    setCvUploading(false)
  }

  async function loadCvUrl() {
    const supabase = createSupabaseBrowser()
    const { data } = await supabase.storage.from("cvs").createSignedUrl(`${userId}/cv.pdf`, 60)
    if (data) setCvUrl(data.signedUrl)
  }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => { setOpen(false); setTab("profile") }}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Ρυθμίσεις</h2>
              <button onClick={() => { setOpen(false); setTab("profile") }} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-secondary p-1 mb-5">
              {(["profile", "cv"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {t === "profile" ? "Προφίλ" : "Βιογραφικό"}
                </button>
              ))}
            </div>

            {/* Profile tab */}
            {tab === "profile" && (
              isLocked ? (
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
              )
            )}

            {/* CV tab */}
            {tab === "cv" && (
              <div className="flex flex-col gap-4">
                {/* Template link */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="size-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Πρότυπο βιογραφικού</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Χρησιμοποίησε το πρότυπό μας για να φτιάξεις το βιογραφικό σου.</p>
                      <Link href="/cv-template" target="_blank"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Άνοιγμα προτύπου <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Upload area */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Ανέβασε το βιογραφικό σου (PDF, max 5MB)</p>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-blue-500/50 bg-secondary/50 py-6 cursor-pointer transition-colors"
                  >
                    <Upload className="size-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {cvFile ? cvFile.name : "Κλικ για επιλογή αρχείου"}
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => { setCvFile(e.target.files?.[0] ?? null); setCvSuccess(false) }}
                    />
                  </div>
                </div>

                {cvSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                    <CheckCircle2 className="size-4 text-green-400" />
                    <p className="text-xs text-green-400">Το βιογραφικό ανέβηκε επιτυχώς!</p>
                    {cvUrl && (
                      <a href={cvUrl} target="_blank" className="ml-auto text-xs text-blue-400 hover:text-blue-300 underline">
                        Προβολή
                      </a>
                    )}
                  </div>
                )}

                {cvError && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{cvError}</p>}

                <button onClick={handleCvUpload} disabled={!cvFile || cvUploading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed">
                  <Upload className="size-4" />
                  {cvUploading ? "Ανέβασμα..." : "Ανέβασμα βιογραφικού"}
                </button>

                <button onClick={loadCvUrl} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
                  Έλεγξε αν έχεις ήδη ανεβάσει βιογραφικό →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
