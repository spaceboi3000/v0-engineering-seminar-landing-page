const sponsors = [
  { name: "Synapse Corp", initials: "SC" },
  { name: "NovaTech", initials: "NT" },
  { name: "CircuitLab", initials: "CL" },
  { name: "VoltEdge", initials: "VE" },
  { name: "DeepSilicon", initials: "DS" },
  { name: "PulseWave", initials: "PW" },
]

export function Sponsors() {
  return (
    <section className="border-t border-border/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Proudly Supported By
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Partners
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className="group flex h-20 w-40 items-center justify-center rounded-xl border border-border bg-secondary/50 transition-all duration-300 hover:border-primary/30 hover:bg-secondary"
            >
              <div className="flex flex-col items-center gap-1 grayscale transition-all duration-300 group-hover:grayscale-0">
                <span className="text-2xl font-bold tracking-tighter text-primary">{s.initials}</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                  {s.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
