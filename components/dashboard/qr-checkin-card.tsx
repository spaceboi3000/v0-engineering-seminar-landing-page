"use client"

import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"
import { ScanLine } from "lucide-react"

interface QrCheckinCardProps {
  attendeeId: string
  userId: string
}

export function QrCheckinCard({ attendeeId, userId }: QrCheckinCardProps) {
  // Encode the full user UUID so scanners get the canonical identifier
  const qrValue = `ras-ntua:checkin:${userId}`

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

          {/* QR Code */}
          <div className="relative flex items-center justify-center size-52 lg:size-56 rounded-2xl bg-foreground p-4">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 size-5 rounded-tl-2xl border-t-3 border-l-3 border-accent" />
            <span className="absolute top-0 right-0 size-5 rounded-tr-2xl border-t-3 border-r-3 border-accent" />
            <span className="absolute bottom-0 left-0 size-5 rounded-bl-2xl border-b-3 border-l-3 border-accent" />
            <span className="absolute bottom-0 right-0 size-5 rounded-br-2xl border-b-3 border-r-3 border-accent" />

            <QRCodeSVG
              value={qrValue}
              size={176}
              bgColor="transparent"
              fgColor="hsl(var(--background))"
              level="M"
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">
              Show this at the entrance
            </p>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              {attendeeId}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
