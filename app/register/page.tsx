"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

const YEARS = ["1ο", "2ο", "3ο", "4ο", "5ο", "6ο+"]

type RegistrationType = "student" | "company"

export default function RegisterPage() {
  const [tab, setTab] = useState<RegistrationType>("student")
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    university: "",
    department: "",
    year: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    position: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Company autocomplete
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (form.company.length < 3) {
      setCompanySuggestions([])
      return
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/companies?q=${encodeURIComponent(form.company)}`)
      if (res.ok) {
        const data = await res.json()
        setCompanySuggestions(data)
        setShowSuggestions(data.length > 0)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [form.company])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError("Οι κωδικοί δεν ταιριάζουν.")
      return
    }
    if (form.password.length < 6) {
      setError("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.")
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowser()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const payload = tab === "student"
        ? {
            userId: data.user.id,
            role: "student",
            firstName: form.firstName,
            lastName: form.lastName,
            university: form.university,
            department: form.department,
            year: form.year,
          }
        : {
            userId: data.user.id,
            role: "company",
            firstName: form.firstName,
            lastName: form.lastName,
            company: form.company,
            position: form.position,
          }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const { error: profileError } = await res.json()
        setError(profileError)
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

  if (success) {
    return (
      <main className="min-h-screen bg-[#081229] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-white mb-2">Επιβεβαίωσε το email σου</h2>
            <p className="text-white/50 text-sm">
              Στείλαμε ένα link επιβεβαίωσης στο <span className="text-sky-400">{form.email}</span>. Κλίκαρέ το για να ολοκληρωθεί η εγγραφή σου.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-sky-400 hover:text-sky-300 transition-colors">
              Συνδέσου →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#081229] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/robotalk-logo.webp" alt="RoboTalk" width={48} height={48} className="h-12 w-12 object-contain" />
            <span className="text-xl font-bold text-white">
              Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Δημιουργία λογαριασμού</h1>
          <p className="text-white/50 text-sm mb-6">Συμπλήρωσε τα στοιχεία σου</p>

          {/* Tab switcher */}
          <div className="flex rounded-lg border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => setTab("student")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                tab === "student"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Φοιτητής
            </button>
            <button
              type="button"
              onClick={() => setTab("company")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                tab === "company"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Εταιρεία
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Common fields: name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1.5">Όνομα</label>
                <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} className={inputClass} placeholder="Νίκος" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1.5">Επώνυμο</label>
                <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Παπαδόπουλος" />
              </div>
            </div>

            {/* Student-specific fields */}
            {tab === "student" && (
              <>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Πανεπιστήμιο</label>
                  <input name="university" type="text" required value={form.university} onChange={handleChange} className={inputClass} placeholder="ΕΜΠ" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Σχολή / Τμήμα</label>
                  <input name="department" type="text" required value={form.department} onChange={handleChange} className={inputClass} placeholder="Ηλεκτρολόγων Μηχανικών" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Έτος σπουδών</label>
                  <select
                    name="year"
                    required
                    value={form.year}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#081229] px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" disabled>Επίλεξε έτος</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Company-specific fields */}
            {tab === "company" && (
              <>
                <div className="relative" ref={suggestionsRef}>
                  <label className="block text-sm text-white/70 mb-1.5">Εταιρεία</label>
                  <input
                    name="company"
                    type="text"
                    required
                    value={form.company}
                    onChange={handleChange}
                    onFocus={() => companySuggestions.length > 0 && setShowSuggestions(true)}
                    className={inputClass}
                    placeholder="Όνομα εταιρείας"
                    autoComplete="off"
                  />
                  {showSuggestions && companySuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1a3a] shadow-xl overflow-hidden">
                      {companySuggestions.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, company: name }))
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Θέση</label>
                  <input name="position" type="text" required value={form.position} onChange={handleChange} className={inputClass} placeholder="Software Engineer" />
                </div>
              </>
            )}

            {/* Common fields: email + password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Κωδικός</label>
              <input name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Επιβεβαίωση κωδικού</label>
              <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" />
            </div>

            {error && (
              <p className="text-red-400 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Εγγραφή..." : "Εγγραφή"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Έχεις ήδη λογαριασμό;{" "}
            <Link href="/login" className="text-sky-400 hover:text-sky-300 transition-colors">
              Σύνδεση εδώ
            </Link>
          </p>
          <Link href="/" className="mt-3 block text-center text-sm text-white/30 hover:text-white/60 transition-colors">
            ← Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    </main>
  )
}
