"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Bot, Zap, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Terminal } from "lucide-react"

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 0, y: -1 } 
const GAME_SPEED = 150 
const WIN_SCORE = 500 

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false) 
  const [hasShownWin, setHasShownWin] = useState(false) 
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const directionRef = useRef(direction)

  const spawnFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    setFood({ x, y })
  }, [])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setGameOver(false)
    setGameWon(false)
    setHasShownWin(false) 
    setScore(0)
    setIsPlaying(true)
    spawnFood()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Wenn das Spiel nicht läuft, machen die Pfeiltasten ganz normal ihren Job (scrollen)
      if (!isPlaying || gameOver || gameWon) return

      // NEU: Wenn das Spiel läuft, blockieren wir das Standard-Scrollen für die Pfeiltasten!
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
      }

      const { x, y } = directionRef.current
      switch (e.key) {
        case "ArrowUp":
          if (y !== 1) directionRef.current = { x: 0, y: -1 }
          break
        case "ArrowDown":
          if (y !== -1) directionRef.current = { x: 0, y: 1 }
          break
        case "ArrowLeft":
          if (x !== 1) directionRef.current = { x: -1, y: 0 }
          break
        case "ArrowRight":
          if (x !== -1) directionRef.current = { x: 1, y: 0 }
          break
      }
      setDirection(directionRef.current)
    }

    // WICHTIG: passive: false erlaubt es uns, das Scrollen aktiv zu blockieren
    window.addEventListener("keydown", handleKeyDown, { passive: false })
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, gameOver, gameWon])

  useEffect(() => {
    if (!isPlaying || gameOver || gameWon) return

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0]
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE || 
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          setIsPlaying(false)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prevScore) => {
            const newScore = prevScore + 10
            if (newScore >= WIN_SCORE && !hasShownWin) {
              setGameWon(true)
              setHasShownWin(true) 
              setIsPlaying(false) 
            }
            return newScore
          })
          spawnFood()
        } else {
          newSnake.pop() 
        }

        return newSnake
      })
    }, GAME_SPEED)

    return () => clearInterval(moveSnake)
  }, [isPlaying, gameOver, gameWon, hasShownWin, food, spawnFood])

  const handleMobileControl = (newX: number, newY: number) => {
    const { x, y } = directionRef.current
    if (newX !== 0 && x === -newX) return 
    if (newY !== 0 && y === -newY) return 
    
    directionRef.current = { x: newX, y: newY }
    setDirection(directionRef.current)
  }

  const triggerHackerModeAndContinue = () => {
    window.dispatchEvent(new Event("unlockHackerMode"))
    setGameWon(false) 
    setIsPlaying(true) 
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
            <Bot className="size-6" /> Robo-Route
          </h2>
          <div className="rounded-md bg-secondary px-3 py-1 font-mono text-sm font-bold text-foreground">
            Score: {score}
          </div>
        </div>
        
        <p className="text-[11px] font-mono text-blue-500/80 dark:text-blue-400/80 animate-pulse border-l-2 border-blue-500 pl-2">
          &gt; SYSTEM_HINT: Reach {WIN_SCORE} pts to unlock protocol...
        </p>
      </div>

      <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-slate-900 border-2 border-slate-700 aspect-square snake-board">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:5%_5%]" />

        {gameWon && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6 text-center border-4 border-cyan-500">
            <Terminal className="size-12 text-cyan-400 mb-2 animate-bounce" />
            <p className="mb-1 text-2xl font-bold text-cyan-400 font-mono tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              SYSTEM OVERRIDE
            </p>
            <p className="mb-6 text-xs text-cyan-300 font-mono">Protocol unlocked. Endless mode engaged.</p>
            
            <button
              onClick={triggerHackerModeAndContinue}
              className="flex items-center gap-2 rounded bg-cyan-900/40 border border-cyan-500 px-5 py-3 font-mono text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Terminal className="size-4" />
              INITIATE & CONTINUE
            </button>
          </div>
        )}

        {(!isPlaying && !gameWon) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            {gameOver && <p className="mb-4 text-2xl font-bold text-red-400">System Failure!</p>}
            <button
              onClick={resetGame}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
            >
              {gameOver ? <RotateCcw className="size-5" /> : <Bot className="size-5" />}
              {gameOver ? "Reboot System" : "Start Protocol"}
            </button>
          </div>
        )}

        {snake.map((segment, index) => {
          const isHead = index === 0
          return (
            <div
              key={`${segment.x}-${segment.y}`}
              className="absolute flex items-center justify-center"
              style={{
                width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`, top: `${(segment.y / GRID_SIZE) * 100}%`,
              }}
            >
              {isHead ? (
                <div className="flex size-full items-center justify-center rounded-sm bg-blue-500 text-white z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)] snake-head">
                  <Bot className="size-3/4" />
                </div>
              ) : (
                <div className="size-3/4 rounded-full bg-slate-400 snake-body" />
              )}
            </div>
          )
        })}

        <div
          className="absolute flex items-center justify-center text-yellow-400 animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        >
          <Zap className="size-3/4 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:hidden w-full max-w-[200px]">
        <div />
        <button onClick={() => handleMobileControl(0, -1)} className="flex size-12 items-center justify-center rounded-lg bg-secondary active:bg-blue-600 active:text-white"><ArrowUp /></button>
        <div />
        <button onClick={() => handleMobileControl(-1, 0)} className="flex size-12 items-center justify-center rounded-lg bg-secondary active:bg-blue-600 active:text-white"><ArrowLeft /></button>
        <button onClick={() => handleMobileControl(0, 1)} className="flex size-12 items-center justify-center rounded-lg bg-secondary active:bg-blue-600 active:text-white"><ArrowDown /></button>
        <button onClick={() => handleMobileControl(1, 0)} className="flex size-12 items-center justify-center rounded-lg bg-secondary active:bg-blue-600 active:text-white"><ArrowRight /></button>
      </div>
      
      <p className="text-xs text-muted-foreground hidden lg:block">Use Arrow Keys to control the Robot</p>
    </div>
  )
}