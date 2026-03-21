"use client"

import { Bot } from "lucide-react"

export function GameButton() {
  function openGame() {
    window.dispatchEvent(new Event("openGame"))
    const el = document.getElementById("minigame")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <button
      onClick={openGame}
      className="mx-5 lg:mx-0 flex items-center justify-center gap-2.5 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
    >
      <Bot className="size-4" />
      Play Mini-Game
    </button>
  )
}
