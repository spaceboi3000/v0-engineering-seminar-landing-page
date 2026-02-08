import Image from "next/image"

export function Sponsors() {
  return (
    <section className="border-t border-white/5 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            Organized By
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Community
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-12 lg:gap-16">
          {/* RAS NTUA Logo */}
          <div className="group flex flex-col items-center gap-3 transition-all duration-300">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 group-hover:border-red-500/30 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              <Image
                src="/images/ras-logo.png"
                alt="IEEE RAS NTUA Student Branch"
                width={80}
                height={80}
                className="h-auto w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
              IEEE RAS NTUA
            </span>
          </div>

          {/* IEEE SB NTUA Logo */}
          <div className="group flex flex-col items-center gap-3 transition-all duration-300">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 group-hover:border-fuchsia-500/30 group-hover:shadow-[0_0_25px_rgba(217,70,239,0.2)]">
              <Image
                src="/images/sb-logo.png"
                alt="IEEE NTUA Student Branch"
                width={80}
                height={80}
                className="h-auto w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
              IEEE NTUA SB
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
