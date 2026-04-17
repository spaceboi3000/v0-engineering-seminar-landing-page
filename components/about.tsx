"use client"

// ADDED: Imported Wrench icon for the new workshops bullet point
import Image from "next/image"
import { Bot, Users, Lightbulb, Wrench } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 lg:py-28">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Column */}
          <div>
            <p
              className="text-base font-semibold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent md:text-lg transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              About the Event
            </p>
            <h2
              className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl transition-all duration-700 delay-100"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              Where Robotics Meets Innovation
            </h2>
            <p
              className="mt-6 leading-relaxed text-muted-foreground transition-all duration-700 delay-200"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              RoboTalk is an event organized by IEEE RAS NTUA Student Branch, bringing together
              students, researchers, and industry professionals to explore the latest advances
              in robotics, automation, and artificial intelligence. Join us for an inspiring day
              of talks, demos, and networking at Goethe-Institut Athen.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <div
                className="flex items-start gap-4 transition-all duration-700 delay-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Bot className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Robotics {"&"} AI Talks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Expert presentations on cutting-edge robotics, machine learning, and automation.
                  </p>
                </div>
              </div>

              {/* NEW SECTION: Interactive Workshops */}
              <div
                className="flex items-start gap-4 transition-all duration-700 delay-[350ms]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Wrench className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Interactive Workshops</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Take part in hands-on, interactive workshops organized by our team, where you will gain practical experience, collaborate with peers, and develop valuable skills through engaging, real-world activities.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 transition-all duration-700 delay-[400ms]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <Users className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Networking</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect with fellow students, researchers, and professionals from the robotics community.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 transition-all duration-700 delay-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Lightbulb className="h-5 w-5 text-blue-400" />
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
          <div
            className="relative overflow-hidden rounded-2xl border border-border/40 shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-700 delay-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            {/* UPDATED: Path to the new Goethe-Institut image */}
            <Image
              src="/images/image_goethe.png"
              alt="Goethe-Institut Athen Auditorium"
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