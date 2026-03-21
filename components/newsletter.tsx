"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 5000)
      return () => clearTimeout(t)
    }
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg(null)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setStatus("success")
      setEmail("")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      setStatus("error")
    }
  }

  return (
    <div className="w-full">
      {status === "success" ? (
        <p className="text-sm text-sky-300">You&apos;re on the list! Check your inbox (and spam) for a confirmation email.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-shadow focus:outline-none focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:border-blue-500/50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
      {errorMsg && <p className="mt-2 text-sm text-red-400">{errorMsg}</p>}
    </div>
  )
}
