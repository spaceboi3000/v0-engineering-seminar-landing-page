import Image from "next/image"

const images = [
  { src: "/images/Robotalk2025-1.jpg", alt: "Packed auditorium at a previous RoboTalk event", tall: true },
  { src: "/images/Robotalk2025-2.jpg", alt: "Hands-on robotics workshop", tall: false },
  { src: "/images/Robotalk2025-3.png", alt: "Speaker presenting on robotics innovations", tall: false },
  { src: "/images/Robotalk2025-4.jpg", alt: "Final Group image", tall: false },
  { src: "/images/Robotalk2024-1.jpg", alt: "Robotalk 2024 event", tall: false },
  { src: "/images/Robotalk2023-1.jpg", alt: "RoboTalk 2023 event", tall: false },
]

export function PastEvents() {
  return (
    <section id="past-events" className="border-t border-white/5 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">
            Gallery
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Past Highlights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Moments from previous RoboTalk events.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img) => (
            <div
              key={img.src}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/10 transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]"
            >
              <Image
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                width={600}
                height={img.tall ? 500 : 350}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
