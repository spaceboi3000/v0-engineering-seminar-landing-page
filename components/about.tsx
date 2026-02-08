import Image from "next/image"
import { Cpu, Users, Lightbulb } from "lucide-react"

export function About() {
  return (
    <section id="about" className="border-t border-border/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              About the Event
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Where Innovation Meets Industry
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              TechSummit 2026 brings together the brightest minds in electrical and computer
              engineering for two days of keynotes, workshops, and networking. From cutting-edge
              semiconductor research to the latest in embedded systems and AI hardware, this event
              is designed for professionals pushing the boundaries of what technology can achieve.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">40+ Technical Sessions</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Deep-dive talks on semiconductors, FPGA, power electronics, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">500+ Attendees</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect with engineers, researchers, and executives from around the globe.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Hands-On Workshops</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get practical experience with the latest tools and frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/about-seminar.jpg"
              alt="Engineering seminar keynote stage with blue lighting"
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
