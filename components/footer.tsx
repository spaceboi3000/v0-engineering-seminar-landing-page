import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            // UPDATED: Path matches the exact filename in your public/images folder
            src="/images/RoboTalk ROBOT_PNG_IM.png"
            alt="RoboTalk logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="text-sm font-semibold text-foreground">
            {/* Updated gradient to match the dark blue to light blue theme */}
            Robo<span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">Talk</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
          {/* Updated hover effects to sky-400 for consistency across the site */}
          <a href="#home" className="text-xs text-white/40 transition-colors hover:text-sky-400">
            Home
          </a>
          <a href="#about" className="text-xs text-white/40 transition-colors hover:text-sky-400">
            About
          </a>
          <a href="#past-events" className="text-xs text-white/40 transition-colors hover:text-sky-400">
            Past Events
          </a>
          <a href="#location" className="text-xs text-white/40 transition-colors hover:text-sky-400">
            Location
          </a>
          <a href="#contact" className="text-xs text-white/40 transition-colors hover:text-sky-400">
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