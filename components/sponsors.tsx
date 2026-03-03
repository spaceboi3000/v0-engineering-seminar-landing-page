"use client"

import Image from "next/image"
import { useState } from "react"

export function Sponsors() {
  // State to track which host info is currently open
  const [activeHost, setActiveHost] = useState<"ras" | "ieee" | null>(null)

  return (
    <div className="flex flex-col">
      {/* SECTION 1: ORGANIZERS */}
      <section className="border-t border-white/5 py-16 lg:py-20 bg-black/20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
              Event Hosts
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Organized By
            </h2>
          </div>

          {/* Interactive Container for Hosts */}
          <div className="mt-10 flex w-full items-center justify-center">
            
            {/* RAS Info Panel (Appears from Left) */}
            <div 
              className={`transition-all duration-700 ease-in-out overflow-hidden flex items-center ${
                activeHost === "ras" ? "max-w-md opacity-100 mr-4 sm:mr-8" : "max-w-0 opacity-0 mr-0"
              }`}
            >
              <div className="w-[280px] sm:w-[320px] rounded-2xl border border-red-500/30 bg-red-500/10 p-5 backdrop-blur-sm shrink-0">
                <h3 className="text-lg font-bold text-red-400 mb-2">IEEE RAS NTUA</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  The Robotics and Automation Society Student Branch Chapter at NTUA is dedicated to fostering innovation and hands-on experience in robotics.
                </p>
              </div>
            </div>

            {/* The Logos Container */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-8 lg:gap-12 shrink-0 transition-transform duration-700">
              
              {/* RAS NTUA Logo - Red Styling */}
              <div 
                onClick={() => setActiveHost(activeHost === "ras" ? null : "ras")}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border bg-white/5 p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] ${
                  activeHost === "ras" ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]" : "border-white/10 group-hover:border-red-500/50"
                }`}>
                  <Image
                    src="/images/ras-logo.png"
                    alt="IEEE RAS NTUA Student Branch"
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain" 
                  />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeHost === "ras" ? "text-red-400" : "text-white/60 group-hover:text-red-400"
                }`}>
                  IEEE RAS NTUA
                </span>
              </div>

              {/* IEEE SB NTUA Logo - Now with Blue Styling */}
              <div 
                onClick={() => setActiveHost(activeHost === "ieee" ? null : "ieee")}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                {/* Changed border-fuchsia to border-blue and updated RGB for blue glow */}
                <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border bg-white/5 p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] ${
                  activeHost === "ieee" ? "border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.25)]" : "border-white/10 group-hover:border-blue-500/50"
                }`}>
                  <Image
                    src="/images/sb-logo.png"
                    alt="IEEE NTUA Student Branch"
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain"
                  />
                </div>
                {/* Changed text-fuchsia to text-blue */}
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeHost === "ieee" ? "text-blue-400" : "text-white/60 group-hover:text-blue-400"
                }`}>
                  IEEE NTUA SB
                </span>
              </div>

            </div>

            {/* IEEE Info Panel (Appears from Right) - Now Blue */}
            <div 
              className={`transition-all duration-700 ease-in-out overflow-hidden flex items-center ${
                activeHost === "ieee" ? "max-w-md opacity-100 ml-4 sm:ml-8" : "max-w-0 opacity-0 ml-0"
              }`}
            >
              {/* Changed border and bg from fuchsia to blue */}
              <div className="w-[280px] sm:w-[320px] rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 backdrop-blur-sm shrink-0">
                <h3 className="text-lg font-bold text-blue-400 mb-2">IEEE NTUA SB</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  The IEEE Student Branch of the National Technical University of Athens connects students with global technology trends and networking.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: SPONSORS */}
      <section className="border-t border-white/5 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white/80">
              Supported By
            </h2>
          </div>

          {/* Placeholder for Sponsors */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-75">
            {/* Example Sponsor 1 */}
            <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                S1
              </div>
              <span className="text-sm font-medium text-white">Sponsor Name</span>
            </div>

             {/* Example Sponsor 2 */}
             <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                S2
              </div>
              <span className="text-sm font-medium text-white">Sponsor Name</span>
            </div>

            {/* "Become a Sponsor" Button */}
            <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer">
              <span className="text-sm font-medium text-white/50">+ Become a Sponsor</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}