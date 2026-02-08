import Image from "next/image"

const images = [
  { src: "/images/event-1.jpg", alt: "Packed auditorium at a previous TechSummit", tall: true },
  { src: "/images/event-2.jpg", alt: "Speaker presenting on electrical engineering innovations", tall: false },
  { src: "/images/event-3.jpg", alt: "Networking event with professionals discussing", tall: false },
  { src: "/images/event-4.jpg", alt: "Hands-on engineering workshop with circuit boards", tall: true },
  { src: "/images/event-5.jpg", alt: "Panel discussion with expert speakers on stage", tall: false },
  { src: "/images/event-6.jpg", alt: "Aerial view of a technology expo floor", tall: true },
]

export function PastEvents() {
  return (
    <section id="past-events" className="border-t border-border/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Gallery
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Past Highlights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Moments from previous TechSummit events around the world.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img) => (
            <div
              key={img.src}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border"
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
