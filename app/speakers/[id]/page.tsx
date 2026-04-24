import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { speakers } from "@/data/speakers"
import { SponsorNav } from "@/components/sponsor-nav"

export function generateStaticParams() {
  return speakers.map((s) => ({ id: s.id }))
}

export default async function SpeakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const speaker = speakers.find((s) => s.id === id)
  if (!speaker) notFound()

  const currentIndex = speakers.findIndex((s) => s.id === id)
  const prevSpeaker = currentIndex > 0 ? speakers[currentIndex - 1] : null
  const nextSpeaker = currentIndex < speakers.length - 1 ? speakers[currentIndex + 1] : null

  return (
    <SponsorNav prevId={prevSpeaker?.id ?? null} nextId={nextSpeaker?.id ?? null} basePath="/speakers">
    <main className="relative min-h-screen bg-background">
      {/* Floating back button */}
      <Link
        href="/#speakers"
        className="fixed top-4 left-4 z-50 flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
        aria-label="Back to speakers"
      >
        <ArrowLeft className="size-5" />
      </Link>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        {/* Header card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 rounded-2xl border border-border/40 bg-muted/20 p-8">
          <div className="relative size-36 shrink-0 overflow-hidden rounded-2xl border border-border/40">
            <Image
              src={speaker.photo}
              alt={speaker.name}
              fill
              sizes="144px"
              className="object-cover"
              onError={undefined}
            />
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{speaker.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{speaker.title}</p>
            </div>
            {/* Links */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {speaker.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-all hover:border-blue-500/50 hover:text-blue-400"
                >
                  {link.label}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Βιογραφικό
          </h2>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {speaker.bio}
          </p>
        </div>
      </div>
    </main>
    </SponsorNav>
  )
}
