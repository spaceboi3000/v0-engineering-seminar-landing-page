import { MapPin, Train } from "lucide-react"

export function Location() {
  return (
    <section id="location" className="border-t border-border/20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-ras-red to-fuchsia-500 bg-clip-text text-transparent">
            Venue
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Location
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Details Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-ras-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Goethe-Institut Athen
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Omirou 14-16, 106 72 Athens, Greece
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Train className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-400" />
                <div>
                  <h4 className="font-medium text-foreground">By Metro</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Panepistimio station (Line 2) is a short walk from the venue, located in the heart of central Athens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="aspect-video overflow-hidden rounded-2xl border border-border/40 shadow-[0_0_20px_rgba(228,61,64,0.06)]">
            <iframe
              title="Goethe-Institut Athen location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.0!2d23.7352!3d37.9812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd3919e9a3a3%3A0x7e8e8e8e8e8e8e8e!2sGoethe-Institut%20Athen!5e0!3m2!1sen!2sgr!4v1700000000000!5m2!1sen!2sgr"
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
