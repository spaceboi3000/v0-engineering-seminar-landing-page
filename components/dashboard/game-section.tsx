"use client"

import { useState, useEffect } from "react"
import { SnakeGame } from "./snake-game"
import { X, Wrench } from "lucide-react"

export function GameSection() {
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleOpenGame = () => {
      // 1. Spiel in die Seite einfügen
      setShouldRender(true) 
      
      // 2. React 100ms Zeit geben, um das HTML aufzubauen
      setTimeout(() => {
        setIsVisible(true) // Starte die Pixel-Animation
        
        // 3. Wenn es fertig gebaut ist, scrolle sanft dorthin
        const gameContainer = document.getElementById("minigame")
        if (gameContainer) {
          gameContainer.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }

    // Höre auf das Signal von der Sidebar
    window.addEventListener("openGame", handleOpenGame)

    return () => window.removeEventListener("openGame", handleOpenGame)
  }, [])

  const closeGame = () => {
    setIsVisible(false)
    setTimeout(() => setShouldRender(false), 400)
  }

  // Wenn nicht aktiv, nimmt es absolut keinen Platz auf der Seite ein
  if (!shouldRender) return null

  return (
    <div id="minigame" className="mx-auto flex w-full max-w-lg flex-col lg:max-w-none w-full mt-8 scroll-mt-24">
      
      <style>{`
        @keyframes pixel-reveal {
          0% { clip-path: inset(100% 0 0 0); opacity: 0; filter: grayscale(100%); }
          25% { clip-path: inset(75% 0 0 0); opacity: 0.3; }
          50% { clip-path: inset(50% 0 0 0); opacity: 0.6; }
          75% { clip-path: inset(25% 0 0 0); opacity: 0.8; filter: grayscale(50%); }
          100% { clip-path: inset(0 0 0 0); opacity: 1; filter: grayscale(0%); }
        }
        .animate-pixel-in { animation: pixel-reveal 0.5s steps(5, end) forwards; }
        .animate-pixel-out { animation: pixel-reveal 0.3s steps(4, end) reverse forwards; }
      `}</style>

      <div
        className={`flex flex-col gap-6 lg:p-8 pb-32 lg:border-t lg:border-border bg-blue-50/30 dark:bg-blue-900/10 rounded-xl transition-all ${
          isVisible ? "animate-pixel-in" : "animate-pixel-out"
        }`}
      >
        <div className="flex items-start justify-between rounded-xl bg-blue-100/50 p-4 dark:bg-blue-900/20 shadow-sm border border-blue-200 dark:border-blue-800/50">
          <div className="flex gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-inner">
              <Wrench className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-blue-700 dark:text-blue-400">
                Robo-Diagnostics Hub
              </h2>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                Calibrate the navigation circuits by collecting energy modules.
              </p>
            </div>
          </div>
          
          <button 
            onClick={closeGame} 
            className="rounded-lg p-2 text-blue-600/60 transition-colors hover:bg-blue-200 hover:text-blue-700 dark:hover:bg-blue-800 dark:hover:text-blue-300"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hier wird die eigentliche Logik aus snake-game.tsx geladen */}
        <SnakeGame />
      </div>
    </div>
  )
}