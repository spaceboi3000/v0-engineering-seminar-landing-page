import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/ras-logo.png"
            alt="RAS NTUA logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="text-sm font-semibold text-foreground">
            Robo<span className="bg-gradient-to-r from-red-500 to-fuchsia-500 bg-clip-text text-transparent">Talk</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
          <a href="#home" className="text-xs text-white/40 transition-colors hover:text-white">
            Home
          </a>
          <a href="#about" className="text-xs text-white/40 transition-colors hover:text-white">
            About
          </a>
          <a href="#past-events" className="text-xs text-white/40 transition-colors hover:text-white">
            Past Events
          </a>
          <a href="#location" className="text-xs text-white/40 transition-colors hover:text-white">
            Location
          </a>
          <a href="#contact" className="text-xs text-white/40 transition-colors hover:text-white">
            Contact
          </a>
        </nav>

        <p className="text-xs text-white/30">
          {"© 2026 IEEE RAS NTUA. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
