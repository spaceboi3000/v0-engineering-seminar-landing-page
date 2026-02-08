import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            TechSummit <span className="text-primary">2026</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
          <a href="#home" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Home
          </a>
          <a href="#past-events" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Past Events
          </a>
          <a href="#location" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Location
          </a>
          <a href="#contact" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </a>
          <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Privacy Policy
          </a>
        </nav>

        <p className="text-xs text-muted-foreground">
          {"© 2026 TechSummit. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
