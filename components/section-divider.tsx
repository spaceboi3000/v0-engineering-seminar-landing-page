"use client"

/**
 * A glowing gradient horizontal divider for separating page sections.
 * Uses a centered radial glow with a sharp line through the middle.
 */
export function SectionDivider() {
  return (
    <div className="relative w-full h-px">
      {/* The sharp 1px line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ras-red/60 to-transparent" />
      {/* The soft glow behind it */}
      <div className="absolute -top-3 -bottom-3 inset-x-0 bg-gradient-to-r from-transparent via-ras-red/15 to-transparent blur-sm" />
    </div>
  )
}
