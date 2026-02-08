"use client"

import { useState } from "react"
import Image from "next/image"
import { X, QrCode } from "lucide-react"

export function TicketModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-transparent px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
      >
        <QrCode className="h-4 w-4" />
        Check-In
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Ticket Card */}
          <div
            className="relative z-10 w-full max-w-xs animate-in zoom-in-95 slide-in-from-bottom-4 fade-in duration-500"
            role="dialog"
            aria-modal="true"
            aria-label="Digital check-in ticket"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-[0_0_60px_rgba(239,68,68,0.15)]">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close ticket"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-fuchsia-600" />

              {/* Card Content */}
              <div className="flex flex-col items-center px-6 pb-8 pt-6">
                {/* Event Logo */}
                <Image
                  src="/images/robotalk-logo.png"
                  alt="RoboTalk"
                  width={100}
                  height={100}
                  className="h-20 w-auto object-contain"
                />

                <h3 className="mt-3 text-lg font-bold text-white">
                  Robo<span className="bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">Talk</span>
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  April 25, 2026 | Goethe-Institut Athen
                </p>

                {/* Dashed divider */}
                <div className="my-5 w-full border-t border-dashed border-white/15" />

                {/* QR Code area */}
                <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full"
                    aria-label="Check-in QR Code"
                  >
                    {/* Simplified QR pattern */}
                    <rect width="200" height="200" fill="white" />
                    {/* Position markers */}
                    <rect x="10" y="10" width="50" height="50" fill="black" />
                    <rect x="15" y="15" width="40" height="40" fill="white" />
                    <rect x="20" y="20" width="30" height="30" fill="black" />
                    <rect x="140" y="10" width="50" height="50" fill="black" />
                    <rect x="145" y="15" width="40" height="40" fill="white" />
                    <rect x="150" y="20" width="30" height="30" fill="black" />
                    <rect x="10" y="140" width="50" height="50" fill="black" />
                    <rect x="15" y="145" width="40" height="40" fill="white" />
                    <rect x="20" y="150" width="30" height="30" fill="black" />
                    {/* Data pattern */}
                    <rect x="70" y="10" width="10" height="10" fill="black" />
                    <rect x="90" y="10" width="10" height="10" fill="black" />
                    <rect x="110" y="10" width="10" height="10" fill="black" />
                    <rect x="70" y="30" width="10" height="10" fill="black" />
                    <rect x="100" y="30" width="10" height="10" fill="black" />
                    <rect x="120" y="30" width="10" height="10" fill="black" />
                    <rect x="80" y="50" width="10" height="10" fill="black" />
                    <rect x="110" y="50" width="10" height="10" fill="black" />
                    <rect x="10" y="70" width="10" height="10" fill="black" />
                    <rect x="30" y="70" width="10" height="10" fill="black" />
                    <rect x="50" y="70" width="10" height="10" fill="black" />
                    <rect x="70" y="70" width="10" height="10" fill="black" />
                    <rect x="90" y="70" width="10" height="10" fill="black" />
                    <rect x="110" y="70" width="10" height="10" fill="black" />
                    <rect x="130" y="70" width="10" height="10" fill="black" />
                    <rect x="150" y="70" width="10" height="10" fill="black" />
                    <rect x="170" y="70" width="10" height="10" fill="black" />
                    <rect x="10" y="90" width="10" height="10" fill="black" />
                    <rect x="40" y="90" width="10" height="10" fill="black" />
                    <rect x="70" y="90" width="10" height="10" fill="black" />
                    <rect x="100" y="90" width="10" height="10" fill="black" />
                    <rect x="130" y="90" width="10" height="10" fill="black" />
                    <rect x="160" y="90" width="10" height="10" fill="black" />
                    <rect x="20" y="110" width="10" height="10" fill="black" />
                    <rect x="50" y="110" width="10" height="10" fill="black" />
                    <rect x="80" y="110" width="10" height="10" fill="black" />
                    <rect x="110" y="110" width="10" height="10" fill="black" />
                    <rect x="140" y="110" width="10" height="10" fill="black" />
                    <rect x="170" y="110" width="10" height="10" fill="black" />
                    <rect x="70" y="130" width="10" height="10" fill="black" />
                    <rect x="90" y="130" width="10" height="10" fill="black" />
                    <rect x="120" y="130" width="10" height="10" fill="black" />
                    <rect x="150" y="130" width="10" height="10" fill="black" />
                    <rect x="180" y="130" width="10" height="10" fill="black" />
                    <rect x="70" y="150" width="10" height="10" fill="black" />
                    <rect x="100" y="150" width="10" height="10" fill="black" />
                    <rect x="130" y="150" width="10" height="10" fill="black" />
                    <rect x="160" y="150" width="10" height="10" fill="black" />
                    <rect x="80" y="170" width="10" height="10" fill="black" />
                    <rect x="110" y="170" width="10" height="10" fill="black" />
                    <rect x="140" y="170" width="10" height="10" fill="black" />
                    <rect x="170" y="170" width="10" height="10" fill="black" />
                    <rect x="180" y="180" width="10" height="10" fill="black" />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-semibold text-white/80">
                  Scan to Check-In
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                  IEEE RAS NTUA
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
