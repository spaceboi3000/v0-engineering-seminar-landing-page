export function SectionDivider() {
  return (
    <div className="relative h-px w-full" aria-hidden="true">
      {/* Base line */}
      <div className="absolute inset-0 bg-white/[0.06]" />

      {/* Red neon glow line - sweeps left to right */}
      <div className="absolute inset-y-0 left-0 w-1/3 animate-[sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-red-500/80 to-transparent blur-[1px]" />

      {/* Purple neon glow line - sweeps right to left, offset */}
      <div className="absolute inset-y-0 right-0 w-1/4 animate-[sweepReverse_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent blur-[1px]" />

      {/* Center node / junction dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]" />
      </div>

      {/* Secondary nodes */}
      <div className="absolute left-[20%] top-1/2 -translate-y-1/2">
        <div className="h-1 w-1 rounded-full bg-fuchsia-500/60 shadow-[0_0_6px_1px_rgba(217,70,239,0.4)]" />
      </div>
      <div className="absolute left-[80%] top-1/2 -translate-y-1/2">
        <div className="h-1 w-1 rounded-full bg-fuchsia-500/60 shadow-[0_0_6px_1px_rgba(217,70,239,0.4)]" />
      </div>

      {/* Wider glow behind the line */}
      <div className="absolute -inset-y-2 left-1/4 right-1/4 bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-md" />

      <style jsx>{`
        @keyframes sweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
        }
        @keyframes sweepReverse {
          0%, 100% { transform: translateX(100%); }
          50% { transform: translateX(-300%); }
        }
      `}</style>
    </div>
  )
}
