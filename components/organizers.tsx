"use client"

import Image from "next/image"
import { useState } from "react"

export function Organizers() {
  const [activeHost, setActiveHost] = useState<"ras" | "ieee" | null>(null)

  return (
    <section className="py-16 lg:py-20 bg-background/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ras-red">
            Event Hosts
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Organized By
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center">

          {/* Desktop: side-by-side row with sliding panels */}
          <div className="flex w-full items-center justify-center">

            {/* RAS Info Panel (slides from left — desktop only) */}
            <div
              className={`hidden md:flex transition-all duration-700 ease-in-out overflow-hidden items-center ${
                activeHost === "ras"
                  ? "max-w-md opacity-100 mr-8"
                  : "max-w-0 opacity-0 mr-0"
              }`}
            >
              <div className="w-[320px] rounded-2xl border border-ras-red/30 bg-ras-red/10 p-5 backdrop-blur-sm shrink-0">
                <h3 className="text-lg font-bold text-ras-red-400 mb-2">IEEE RAS NTUA</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  The Robotics and Automation Society Student Branch Chapter at NTUA
                  is dedicated to fostering innovation and hands-on experience in
                  robotics.
                </p>
              </div>
            </div>

            {/* The Logos */}
            <div className="flex items-center justify-center gap-8 lg:gap-12 shrink-0">

              {/* RAS NTUA Logo */}
              <div
                onClick={() => setActiveHost(activeHost === "ras" ? null : "ras")}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-2xl border bg-muted/30 p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(228,61,64,0.25)] ${
                    activeHost === "ras"
                      ? "border-ras-red shadow-[0_0_30px_rgba(228,61,64,0.25)]"
                      : "border-border/40 group-hover:border-ras-red/50"
                  }`}
                >
                  <Image
                    src="/images/ras-logo.png"
                    alt="IEEE RAS NTUA Student Branch"
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeHost === "ras"
                      ? "text-ras-red-400"
                      : "text-muted-foreground group-hover:text-ras-red-400"
                  }`}
                >
                  IEEE RAS NTUA
                </span>
              </div>

              {/* IEEE SB NTUA Logo */}
              <div
                onClick={() => setActiveHost(activeHost === "ieee" ? null : "ieee")}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-2xl border bg-muted/30 p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] ${
                    activeHost === "ieee"
                      ? "border-ieee-blue shadow-[0_0_30px_rgba(37,99,235,0.25)]"
                      : "border-border/40 group-hover:border-ieee-blue/50"
                  }`}
                >
                  <Image
                    src="/images/sb-logo.webp"
                    alt="IEEE NTUA Student Branch"
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeHost === "ieee"
                      ? "text-ieee-blue-400"
                      : "text-muted-foreground group-hover:text-ieee-blue-400"
                  }`}
                >
                  IEEE NTUA SB
                </span>
              </div>
            </div>

            {/* IEEE Info Panel (slides from right — desktop only) */}
            <div
              className={`hidden md:flex transition-all duration-700 ease-in-out overflow-hidden items-center ${
                activeHost === "ieee"
                  ? "max-w-md opacity-100 ml-8"
                  : "max-w-0 opacity-0 ml-0"
              }`}
            >
              <div className="w-[320px] rounded-2xl border border-ieee-blue/30 bg-ieee-blue/10 p-5 backdrop-blur-sm shrink-0">
                <h3 className="text-lg font-bold text-ieee-blue-400 mb-2">IEEE NTUA SB</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  The IEEE Student Branch of the National Technical University of
                  Athens connects students with global technology trends and
                  networking.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: info panel drops below the logos */}
          <div className="md:hidden w-full mt-6 px-2">
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                activeHost !== null ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {activeHost === "ras" && (
                <div className="rounded-2xl border border-ras-red/30 bg-ras-red/10 p-5 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-ras-red-400 mb-2">IEEE RAS NTUA</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The Robotics and Automation Society Student Branch Chapter at NTUA
                    is dedicated to fostering innovation and hands-on experience in
                    robotics.
                  </p>
                </div>
              )}
              {activeHost === "ieee" && (
                <div className="rounded-2xl border border-ieee-blue/30 bg-ieee-blue/10 p-5 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-ieee-blue-400 mb-2">IEEE NTUA SB</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The IEEE Student Branch of the National Technical University of
                    Athens connects students with global technology trends and
                    networking.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
