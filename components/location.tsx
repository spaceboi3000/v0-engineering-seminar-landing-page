import { MapPin, Train } from "lucide-react"

export function Location() {
  return (
    <section id="location" className="relative w-full py-20 lg:py-28 overflow-hidden">
      {/* Black → Blue → Black gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, #0a1e3d 25%, #0c2d5a 50%, #0a1e3d 75%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Subtle texture overlay for depth */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Venue
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Location
          </h2>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Details Column */}
          <div className="flex flex-col justify-center text-white">
            <div className="flex items-start gap-5">
              <div className="rounded-full bg-blue-500/20 p-2.5 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <MapPin className="h-6 w-6 shrink-0 text-blue-300" />
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-semibold text-white tracking-wide">
                  Goethe-Institut Athen
                </h3>
                <p className="mt-2 text-base text-blue-200 font-medium">
                  Omirou 14-16, 106 72 Athens, Greece
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <div className="flex items-start gap-5">
                <div className="rounded-full bg-sky-500/20 p-2.5 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  <Train className="h-6 w-6 shrink-0 text-sky-300" />
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-semibold text-white tracking-wide">
                    By Metro
                  </h4>
                  <p className="mt-2 text-base text-blue-200 leading-relaxed max-w-md font-medium">
                    Panepistimio station (Line 2) is a short walk from the venue, located in the heart of central Athens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative flex items-center justify-center">
            {/* Soft glow behind the map */}
            <div className="absolute inset-0 rounded-2xl bg-blue-500/15 blur-2xl" />

            {/* Map Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(59,130,246,0.7)] hover:border-blue-300">
              <iframe
                title="Goethe-Institut Athen location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.9202508819653!2d23.732493676043728!3d37.97899040036996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bdf584243709%3A0x4ec35b51817ab506!2sGOETHE-INSTITUT%20ATHEN!5e0!3m2!1sel!2sgr!4v1772902146386!5m2!1sel!2sgr"
                className="h-full w-full border-0 opacity-90 transition-all duration-500 hover:opacity-100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* How to get to Goethe */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            How to Get to Goethe
          </h3>
          <p className="mt-3 text-blue-200/70 text-sm max-w-md mx-auto">
            Watch our quick guide to find the venue easily
          </p>

          <div className="mt-8 mx-auto" style={{ maxWidth: '340px' }}>
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-blue-500/15 blur-2xl" />
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.5)]" style={{ aspectRatio: '9/16' }}>
                <iframe
                  title="How to get to Goethe-Institut Athen"
                  src="https://www.instagram.com/reel/DXelyOojNiQ/embed"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}