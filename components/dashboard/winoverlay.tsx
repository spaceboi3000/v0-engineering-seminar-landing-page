"use client"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"

const STORAGE_KEY = "robotalk-hacker-unlocked"
const THEME_KEY = "robotalk-hacker-active"

export function WinOverlay() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isThemeActive, setIsThemeActive] = useState(false)

  // Restore state from localStorage on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY) === "true"
    const themeActive = localStorage.getItem(THEME_KEY) === "true"

    if (unlocked) {
      setIsUnlocked(true)
      if (themeActive) {
        setIsThemeActive(true)
        document.body.classList.add("hacker-theme")
      }
    }
  }, [])

  // Listen for win event
  useEffect(() => {
    const enableHackerMode = () => {
      setIsUnlocked(true)
      setIsThemeActive(true)
      document.body.classList.add("hacker-theme")
      localStorage.setItem(STORAGE_KEY, "true")
      localStorage.setItem(THEME_KEY, "true")
    }

    window.addEventListener("unlockHackerMode", enableHackerMode)
    return () => window.removeEventListener("unlockHackerMode", enableHackerMode)
  }, [])

  const toggleTheme = () => {
    if (isThemeActive) {
      document.body.classList.remove("hacker-theme")
      setIsThemeActive(false)
      localStorage.setItem(THEME_KEY, "false")
    } else {
      document.body.classList.add("hacker-theme")
      setIsThemeActive(true)
      localStorage.setItem(THEME_KEY, "true")
    }
  }

  if (!isUnlocked) return null

  return (
    <>
      {isThemeActive && (
        <style>{`
          /* CYBER-BLUE OVERRIDE CSS */
          body.hacker-theme {
            background-color: #030712 !important;
            font-family: "Courier New", Courier, monospace !important;
          }

          body.hacker-theme * {
            color: #22d3ee !important;
            border-color: #0891b2 !important;
          }

          body.hacker-theme .bg-background,
          body.hacker-theme .bg-card,
          body.hacker-theme aside,
          body.hacker-theme nav {
            background-color: #050505 !important;
          }

          body.hacker-theme [class*="bg-blue-"],
          body.hacker-theme [class*="bg-slate-"],
          body.hacker-theme [class*="bg-secondary"] {
            background-color: #164e63 !important;
          }

          body.hacker-theme [class*="bg-gradient-to-r"] {
            background: linear-gradient(to right, #0891b2, #22d3ee) !important;
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.4) !important;
            color: #000 !important;
          }

          /* --- GAME BOARD --- */
          body.hacker-theme .snake-board {
            background-color: #000000 !important;
            border-color: #0891b2 !important;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.8) !important;
          }

          body.hacker-theme .snake-body {
            background-color: #0891b2 !important;
            opacity: 0.9 !important;
          }

          body.hacker-theme .snake-head {
            background-color: #22d3ee !important;
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.8) !important;
          }

          body.hacker-theme::after {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(34, 211, 238, 0.04) 2px,
              rgba(34, 211, 238, 0.04) 4px
            );
            pointer-events: none;
            z-index: 99999;
          }
        `}</style>
      )}

      <button
        onClick={toggleTheme}
        className={`fixed bottom-24 lg:bottom-8 right-6 z-[999999] flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold transition-all shadow-lg ${
          isThemeActive
            ? "bg-cyan-500 text-black shadow-cyan-500/50 hover:bg-cyan-400"
            : "bg-slate-800 text-cyan-400 border border-cyan-500 shadow-slate-900/50 hover:bg-slate-700"
        }`}
      >
        <Terminal className="size-4" />
        {isThemeActive ? "DISABLE PROTOCOL" : "ENABLE PROTOCOL"}
      </button>
    </>
  )
}
