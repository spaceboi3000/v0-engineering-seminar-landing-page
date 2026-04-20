import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { speakers } from "@/data/speakers"

export function generateStaticParams() {
  return speakers.map((s) => ({ id: s.id }))
}

export default async function SpeakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const speaker = speakers.find((s) => s.id === id)
  if (!speaker) notFound()

  return (
    <main className="min-h-screen bg-background">
      {/* Back button */}
      <div className="mx-auto max-w-3xl px-4 pt-8 lg:px-8">
        <Link
          href="/#speakers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Πίσω στους ομιλητές
        </Link>
      </div>

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
  )
}
