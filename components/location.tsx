import { MapPin, Train, Plane, Building } from "lucide-react"

export function Location() {
  return (
    <section id="location" className="border-t border-border/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
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
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Megaron Athens International Conference Centre
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vass. Sofias {"&"} Kokkali, 115 21 Athens, Greece
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Plane className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">By Air</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Athens International Airport (ATH) is 35 km away. Direct metro line to Syntagma Square, then a short walk.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Train className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">By Metro</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Megaro Moussikis station (Line 3) is directly adjacent to the venue.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">Accommodation</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Partner hotels within walking distance offer discounted rates for attendees.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-secondary">
            <iframe
              title="Megaron Athens International Conference Centre"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.4683853668894!2d23.74584481531!3d37.97614797972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd3e3b0e7c3d%3A0x5a3e3e8f0e0e0e0e!2sMegaron%20Athens%20International%20Conference%20Centre!5e0!3m2!1sen!2sgr!4v1700000000000!5m2!1sen!2sgr"
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
