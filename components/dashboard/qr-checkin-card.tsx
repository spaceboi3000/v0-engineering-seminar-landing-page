import { Card, CardContent } from "@/components/ui/card"
import { QrCode, ScanLine } from "lucide-react"

interface QrCheckinCardProps {
  attendeeId: string
}

export function QrCheckinCard({ attendeeId }: QrCheckinCardProps) {
  return (
    <section className="px-5 lg:px-0" aria-label="Check-in QR Code">
      <Card className="border-border/60 bg-card overflow-hidden">
        <CardContent className="flex flex-col items-center gap-5 pt-6 pb-5 lg:gap-6 lg:pt-8 lg:pb-7">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ScanLine className="size-4" />
            <p className="text-xs font-medium uppercase tracking-widest">
              Check-in Pass
            </p>
          </div>

          {/* QR Code placeholder */}
          <div className="relative flex items-center justify-center size-52 lg:size-56 rounded-2xl bg-foreground p-4">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 size-5 rounded-tl-2xl border-t-3 border-l-3 border-accent" />
            <span className="absolute top-0 right-0 size-5 rounded-tr-2xl border-t-3 border-r-3 border-accent" />
            <span className="absolute bottom-0 left-0 size-5 rounded-bl-2xl border-b-3 border-l-3 border-accent" />
            <span className="absolute bottom-0 right-0 size-5 rounded-br-2xl border-b-3 border-r-3 border-accent" />

            <div className="flex flex-col items-center gap-3">
              <QrCode className="size-32 text-background" strokeWidth={1} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">
              Show this at the entrance
            </p>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              ID: {attendeeId}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
