"use client"

import { SnakeGame } from "./snake-game"
import { Wrench } from "lucide-react"

export function GameSection() {
  return (
    <div id="minigame" className="mx-auto flex w-full max-w-lg flex-col lg:max-w-none mt-8 scroll-mt-24 px-4 lg:px-8">
      <div className="flex flex-col gap-6 pb-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4 lg:p-8 border border-blue-200/30 dark:border-blue-800/30">
        <div className="flex items-start rounded-xl bg-blue-100/50 p-4 dark:bg-blue-900/20 shadow-sm border border-blue-200 dark:border-blue-800/50">
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
        </div>

        <SnakeGame />
      </div>
    </div>
  )
}