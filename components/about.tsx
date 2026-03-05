import Image from "next/image"
import { Bot, Users, Lightbulb } from "lucide-react"

export function About() {
  return (
    <section id="about" className="border-t border-border/20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-ras-red to-fuchsia-500 bg-clip-text text-transparent">
              About the Event
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Where Robotics Meets Innovation
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              RoboTalk is an event organized by IEEE RAS NTUA Student Branch, bringing together
              students, researchers, and industry professionals to explore the latest advances
              in robotics, automation, and artificial intelligence. Join us for an inspiring day
              of talks, demos, and networking at Goethe-Institut Athen.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ras-red/10 border border-ras-red/20">
                  <Bot className="h-5 w-5 text-ras-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Robotics {"&"} AI Talks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Expert presentations on cutting-edge robotics, machine learning, and automation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                  <Users className="h-5 w-5 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Networking</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect with fellow students, researchers, and professionals from the robotics community.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ras-red/10 border border-ras-red/20">
                  <Lightbulb className="h-5 w-5 text-ras-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Demos</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    See real robots and AI systems in action during interactive demonstrations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-[0_0_30px_rgba(228,61,64,0.08)]">
            <Image
              src="/images/Robotalk2025-5.jpg"
              alt="Engineering seminar with audience and presenter on stage"
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
