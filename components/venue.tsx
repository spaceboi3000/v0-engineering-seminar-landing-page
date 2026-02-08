import Image from "next/image"

export function Venue() {
  return (
    <section id="venue" className="border-t border-white/5 bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            Where It Happens
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            The Space
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Goethe-Institut Athen -- a modern cultural hub in the heart of the city.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
          {/* Large vertical photo - left */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 md:row-span-2">
            <Image
              src="/images/venue-main.jpg"
              alt="Main hall of Goethe-Institut Athen"
              width={800}
              height={900}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
              Main Hall
            </p>
          </div>

          {/* Top right - smaller */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/venue-lobby.jpg"
              alt="Lobby area of Goethe-Institut Athen"
              width={800}
              height={450}
              className="h-full min-h-[220px] w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
              Lobby Area
            </p>
          </div>

          {/* Bottom right - smaller */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/venue-networking.jpg"
              alt="Networking space at Goethe-Institut Athen"
              width={800}
              height={450}
              className="h-full min-h-[220px] w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
              Networking Space
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
