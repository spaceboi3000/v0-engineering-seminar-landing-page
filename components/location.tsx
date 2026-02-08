import { MapPin, Train, ExternalLink } from "lucide-react"

export function Location() {
  return (
    <section id="location" className="border-t border-white/5 bg-slate-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            Find Us
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Location
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Details Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Goethe-Institut Athen
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Omirou 14-16, 106 72 Athens, Greece
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Train className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-400" />
                <div>
                  <h4 className="font-medium text-white">By Metro</h4>
                  <p className="mt-1 text-sm text-zinc-400">
                    Panepistimio station (Line 2) is a short walk from the venue, located in the heart of central Athens.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir//Goethe-Institut+Athen,+Omirou+14-16,+Athina+106+72"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105"
            >
              <ExternalLink className="h-4 w-4" />
              Get Directions
            </a>
          </div>

          {/* Map Column - full width mobile, 50% desktop */}
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(239,68,68,0.06)] lg:aspect-auto lg:min-h-[400px]">
            <iframe
              title="Goethe-Institut Athen location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.9!2d23.7308!3d37.9808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd396e4a0e0f%3A0x400bd2ce68c54e0!2sGoethe-Institut+Athen!5e0!3m2!1sen!2sgr!4v1700000000000!5m2!1sen!2sgr"
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
