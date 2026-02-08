import Image from "next/image"

export function Sponsors() {
  return (
    <div className="flex flex-col">
      {/* SECTION 1: ORGANIZERS */}
      <section className="border-t border-white/5 py-16 lg:py-20 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
              Event Hosts
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Organized By
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {/* RAS NTUA Logo - Full Color & Glowing Red */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] group-hover:-translate-y-1">
                <Image
                  src="/images/ras-logo.png"
                  alt="IEEE RAS NTUA Student Branch"
                  width={100}
                  height={100}
                  className="h-auto w-full object-contain" 
                  // Removed 'grayscale' here
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60 transition-colors group-hover:text-red-400">
                IEEE RAS NTUA
              </span>
            </div>

            {/* IEEE SB NTUA Logo - Full Color & Glowing Purple */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.25)] group-hover:-translate-y-1">
                <Image
                  src="/images/sb-logo.png"
                  alt="IEEE NTUA Student Branch"
                  width={100}
                  height={100}
                  className="h-auto w-full object-contain"
                  // Removed 'grayscale' here
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60 transition-colors group-hover:text-fuchsia-400">
                IEEE NTUA SB
              </span>
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

          {/* Placeholder for Sponsors - You can add real logos here later */}
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

            {/* "Become a Sponsor" Button (Placeholder) */}
            <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer">
              <span className="text-sm font-medium text-white/50">+ Become a Sponsor</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}