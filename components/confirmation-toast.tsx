"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"

const messages: Record<string, { text: string; color: string }> = {
  success: { text: "✅ Your subscription is confirmed! Welcome to the list.", color: "border-green-500/30 bg-green-500/10 text-green-300" },
  already: { text: "ℹ️ This email is already confirmed.", color: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
  invalid: { text: "❌ Invalid or expired confirmation link.", color: "border-red-500/30 bg-red-500/10 text-red-400" },
}

export function ConfirmationToast() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const confirmed = searchParams.get("confirmed")
  const msg = confirmed ? messages[confirmed] : null

  useEffect(() => {
    if (msg) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 6000)
      return () => clearTimeout(t)
    }
  }, [msg])

  if (!visible || !msg) return null

  return (
    <div className={`fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 flex items-center gap-3 rounded-lg border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all ${msg.color}`}>
      <span>{msg.text}</span>
      <button onClick={() => setVisible(false)} aria-label="Dismiss">
        <X className="h-4 w-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  )
}
