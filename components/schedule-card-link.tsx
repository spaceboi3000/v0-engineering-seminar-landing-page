"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

interface ScheduleCardLinkProps {
  type: string
  className: string
  children: React.ReactNode
}

export function ScheduleCardLink({ type, className, children }: ScheduleCardLinkProps) {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    createSupabaseBrowser().auth.getUser().then(({ data }: { data: { user: unknown } }) => {
      setLoggedIn(!!data.user)
    })
  }, [])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (type === "seminar") {
      // Scroll to speakers section on homepage
      const el = document.getElementById("speakers")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        router.push("/#speakers")
      }
      return
    }
    // Workshop, break, networking → dashboard if logged in, login if not
    router.push(loggedIn ? "/dashboard" : "/login")
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
