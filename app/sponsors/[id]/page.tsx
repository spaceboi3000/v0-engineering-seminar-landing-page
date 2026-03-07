import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { sponsors, TIER_CONFIG } from "@/data/sponsors"

interface SponsorPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return sponsors.map((s) => ({ id: s.id }))
}

export default async function SponsorPage({ params }: SponsorPageProps) {
  const { id } = await params
  const sponsor = sponsors.find((s) => s.id === id)
  if (!sponsor) notFound()

  const tier = TIER_CONFIG[sponsor.tier]

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Back navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-10 lg:px-8">
        <Link
          href="/#sponsors"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Event
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Header area */}
        <div className="flex flex-col items-center text-center">
          {/* Large logo */}
          <div className="flex h-36 w-36 items-center justify-center rounded-3xl border border-border/40 bg-muted/30 p-6">
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={120}
              height={120}
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Name + tier badge */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight">{sponsor.name}</h1>
          <span
            className={`mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest border ${tier.textClass} ${tier.borderClass} ${tier.bgClass}`}
          >
            {tier.label} Sponsor
          </span>
        </div>

        {/* Glowing divider */}
        <div className="relative my-10 w-full h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ras-red/60 to-transparent" />
          <div className="absolute -top-3 -bottom-3 inset-x-0 bg-gradient-to-r from-transparent via-ras-red/15 to-transparent blur-sm" />
        </div>

        {/* Description */}
        <div className="mx-auto max-w-2xl">
          <h2 className="text-lg font-semibold text-foreground/90 mb-4">About</h2>
          <p className="text-base text-muted-foreground leading-relaxed">{sponsor.longDescription}</p>
        </div>

        {/* Links section */}
        <div className="mx-auto max-w-2xl mt-10 flex flex-col gap-4">

          {/* Website */}
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-5 py-4 transition-all hover:border-border/60 hover:bg-muted/40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ras-red-400 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-foreground">Website</p>
              <p className="text-xs text-muted-foreground">{sponsor.website}</p>
            </div>
          </a>

          {/* Contact email */}
          {sponsor.contactEmail && (
            <a
              href={`mailto:${sponsor.contactEmail}`}
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-5 py-4 transition-all hover:border-border/60 hover:bg-muted/40"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ras-red-400 shrink-0">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <div>
                <p className="text-sm font-medium text-foreground">Contact</p>
                <p className="text-xs text-muted-foreground">{sponsor.contactEmail}</p>
              </div>
            </a>
          )}

          {/* Social links */}
          {sponsor.socialLinks && (
            <div className="flex gap-3 mt-2">
              {sponsor.socialLinks.linkedin && (
                <a
                  href={sponsor.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-muted/20 transition-all hover:border-ieee-blue/50 hover:bg-ieee-blue/10"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground hover:text-ieee-blue-400">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {sponsor.socialLinks.twitter && (
                <a
                  href={sponsor.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-muted/20 transition-all hover:border-ieee-cyan/50 hover:bg-ieee-cyan/10"
                  aria-label="Twitter / X"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground hover:text-ieee-cyan-400">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {sponsor.socialLinks.github && (
                <a
                  href={sponsor.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-muted/20 transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
                  aria-label="GitHub"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground hover:text-purple-400">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Speaker link */}
          {sponsor.speakerSlug && (
            <Link
              href={`/speakers#${sponsor.speakerSlug}`}
              className="flex items-center gap-3 rounded-xl border border-ras-red/20 bg-ras-red/[0.05] px-5 py-4 transition-all hover:border-ras-red/40 hover:bg-ras-red/10 mt-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ras-red-400 shrink-0">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <div>
                <p className="text-sm font-medium text-ras-red-400">This sponsor has a speaker</p>
                <p className="text-xs text-muted-foreground">View in the Speakers section →</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}