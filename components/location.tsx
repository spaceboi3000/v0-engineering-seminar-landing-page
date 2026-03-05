import { MapPin, Train } from "lucide-react"

export function Location() {
  return (
    <section id="location" className="border-t border-white/5 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          {/* Stronger gradient from very dark blue to light sky blue for maximum visibility */}
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-blue-800 to-sky-300 bg-clip-text text-transparent">
            Venue
          </p>
          {/* Location text kept pure white as requested */}
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Location
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Details Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-start gap-3">
              {/* Darker blue pin icon */}
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
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
                {/* Lighter blue train icon */}
                <Train className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
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
          {/* Blue glowing shadow behind the map */}
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
            <iframe
              title="Goethe-Institut Athen location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.925439934185!2d23.73356061532454!3d37.9791011797227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd3b48450143%3A0xc3f14006c99c5132!2sGoethe-Institut%20Athen!5e0!3m2!1sen!2sgr!4v1680000000000!5m2!1sen!2sgr"
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