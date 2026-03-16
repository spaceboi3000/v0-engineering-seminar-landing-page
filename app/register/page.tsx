"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

const YEARS = ["1ο", "2ο", "3ο", "4ο", "5ο", "6ο+"]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    university: "",
    department: "",
    year: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        university: form.university,
        department: form.department,
        year: form.year,
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setLoading(false)
  }

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
            <Image src="/images/robotalk-logo.png" alt="RoboTalk" width={48} height={48} className="h-12 w-12 object-contain" />
            <span className="text-xl font-bold text-white">
              Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Δημιουργία λογαριασμού</h1>
          <p className="text-white/50 text-sm mb-6">Συμπλήρωσε τα στοιχεία σου</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1.5">Όνομα</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Νίκος"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1.5">Επώνυμο</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Παπαδόπουλος"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Πανεπιστήμιο</label>
              <input
                name="university"
                type="text"
                required
                value={form.university}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ΕΜΠ"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Σχολή / Τμήμα</label>
              <input
                name="department"
                type="text"
                required
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ηλεκτρολόγων Μηχανικών"
              />
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

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Κωδικός</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Επιβεβαίωση κωδικού</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
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
        </div>
      </div>
    </main>
  )
}
