import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/robotalk-logo.png"
            alt="RoboTalk logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="text-sm font-semibold text-foreground">
            Robo<span className="bg-gradient-to-r from-ras-red to-fuchsia-500 bg-clip-text text-transparent">Talk</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
          <a href="#home" className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground">
            Home
          </a>
          <a href="#about" className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground">
            About
          </a>
          <a href="#past-events" className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground">
            Past Events
          </a>
          <a href="#location" className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground">
            Location
          </a>
          <a href="#contact" className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground">
            Contact
          </a>
        </nav>

        <p className="text-xs text-muted-foreground/50">
          {"© 2026 IEEE RAS NTUA. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
