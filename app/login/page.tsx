"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<"invalid" | "other" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials") || error.message.toLowerCase().includes("invalid credentials")) {
        setError("invalid")
      } else {
        setError("other")
        setErrorMsg(error.message)
      }
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-[#081229] flex items-center justify-center px-4">
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
          <h1 className="text-2xl font-bold text-white mb-1">Καλώς ήρθες</h1>
          <p className="text-white/50 text-sm mb-6">Συνδέσου στον λογαριασμό σου</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Κωδικός</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error === "invalid" && (
              <p className="text-red-400 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                Δεν βρέθηκε λογαριασμός με αυτό το email ή ο κωδικός είναι λάθος.{" "}
                <Link href="/register" className="underline hover:text-red-300 transition-colors">
                  Εγγραφή εδώ
                </Link>
              </p>
            )}
            {error === "other" && (
              <p className="text-red-400 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Σύνδεση..." : "Σύνδεση"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Δεν έχεις λογαριασμό;{" "}
            <Link href="/register" className="text-sky-400 hover:text-sky-300 transition-colors">
              Εγγραφή εδώ
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
