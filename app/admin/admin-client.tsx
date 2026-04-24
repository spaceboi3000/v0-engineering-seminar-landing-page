"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ArrowLeft, Camera, CameraOff, Users, FileText, Upload, Trash2, Loader2, Check } from "lucide-react"
import Link from "next/link"

interface Enrollment {
  workshopId: string
  status: string
  title: string
  type: string
  startTime?: string
  endTime?: string
}

interface ScannedUser {
  id: string
  firstName: string
  lastName: string
  university: string
  department: string
  role: string
  assignedGroup: string
  enrollments: Enrollment[]
}

interface WorkshopInfo {
  id: string
  title: string
  type: string
  instructions_url: string | null
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" })

export function AdminClient({ workshops }: { workshops: WorkshopInfo[] }) {
  const [scanning, setScanning] = useState(false)
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [assigning, setAssigning] = useState(false)
  const [lastAssigned, setLastAssigned] = useState<string | null>(null)
  const scannerRef = useRef<any>(null)

  // Instructions upload state
  const [workshopList, setWorkshopList] = useState(workshops)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadMsg, setUploadMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Active tab
  const [tab, setTab] = useState<"checkin" | "instructions">("checkin")

  const lookupUser = useCallback(async (userId: string) => {
    setError(null)
    setScannedUser(null)
    setLastAssigned(null)
    try {
      const res = await fetch(`/api/admin/lookup?userId=${encodeURIComponent(userId)}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Lookup failed")
        return
      }
      const data: ScannedUser = await res.json()
      setScannedUser(data)
    } catch {
      setError("Network error")
    }
  }, [])

  const stopScanner = useCallback(() => {
    const scanner = scannerRef.current
    if (!scanner) return
    scannerRef.current = null
    setScanning(false)
    scanner.isScanning && scanner.stop().then(() => scanner.clear()).catch(() => {})
  }, [])

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return
    setScanning(true)
    setError(null)

    const { Html5Qrcode } = await import("html5-qrcode")
    const scanner = new Html5Qrcode("qr-reader")
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          const match = decodedText.match(/^ras-ntua:checkin:(.+)$/)
          if (match) {
            lookupUser(match[1])
            stopScanner()
          } else {
            setError("Invalid QR code format")
          }
        },
        () => {}
      )
    } catch {
      setError("Camera access denied or not available")
      setScanning(false)
      scannerRef.current = null
    }
  }, [lookupUser, stopScanner])

  useEffect(() => {
    return () => { stopScanner() }
  }, [stopScanner])

  const assignGroup = async (group: "A" | "B") => {
    if (!scannedUser || assigning) return
    setAssigning(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/assign-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: scannedUser.id, group }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Assignment failed")
        return
      }
      setScannedUser({ ...scannedUser, assignedGroup: group })
      setLastAssigned(group)
    } catch {
      setError("Network error")
    } finally {
      setAssigning(false)
    }
  }

  const uploadInstructions = async (workshopId: string, file: File) => {
    setUploadingId(workshopId)
    setUploadMsg(null)
    const form = new FormData()
    form.append("workshopId", workshopId)
    form.append("file", file)
    try {
      const res = await fetch("/api/admin/upload-instructions", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) {
        setUploadMsg({ id: workshopId, text: data.error || "Upload failed", ok: false })
      } else {
        setWorkshopList((prev) => prev.map((w) => w.id === workshopId ? { ...w, instructions_url: data.url } : w))
        setUploadMsg({ id: workshopId, text: "Uploaded", ok: true })
      }
    } catch {
      setUploadMsg({ id: workshopId, text: "Network error", ok: false })
    } finally {
      setUploadingId(null)
    }
  }

  const removeInstructions = async (workshopId: string) => {
    setUploadingId(workshopId)
    setUploadMsg(null)
    const form = new FormData()
    form.append("workshopId", workshopId)
    try {
      const res = await fetch("/api/admin/upload-instructions", { method: "POST", body: form })
      if (res.ok) {
        setWorkshopList((prev) => prev.map((w) => w.id === workshopId ? { ...w, instructions_url: null } : w))
        setUploadMsg({ id: workshopId, text: "Removed", ok: true })
      }
    } catch {
      setUploadMsg({ id: workshopId, text: "Network error", ok: false })
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg flex items-center gap-3 px-4 py-3">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-lg px-4 pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setTab("checkin"); if (tab !== "checkin") stopScanner() }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "checkin" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => { setTab("instructions"); stopScanner() }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "instructions" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Instructions
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {tab === "checkin" && (
          <>
            {/* Scanner controls */}
            <div className="space-y-3">
              <div id="qr-reader" className="rounded-xl overflow-hidden bg-black/20" />
              <button
                onClick={scanning ? stopScanner : startScanner}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-border/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              >
                {scanning ? (
                  <><CameraOff className="size-4" /> Stop Scanner</>
                ) : (
                  <><Camera className="size-4" /> Scan QR Code</>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Scanned user info */}
            {scannedUser && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-2">
                  <h2 className="text-xl font-bold">
                    {scannedUser.firstName} {scannedUser.lastName}
                  </h2>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{scannedUser.university}</p>
                    <p>{scannedUser.department}</p>
                    <p className="capitalize">Role: {scannedUser.role}</p>
                    <p>
                      Group:{" "}
                      <span className={`font-semibold ${
                        scannedUser.assignedGroup === "A" ? "text-blue-400" :
                        scannedUser.assignedGroup === "B" ? "text-amber-400" :
                        scannedUser.assignedGroup === "Admin" ? "text-emerald-400" :
                        "text-muted-foreground"
                      }`}>
                        {scannedUser.assignedGroup || "Not set"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => assignGroup("A")}
                    disabled={assigning}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                  >
                    <Users className="size-4" />
                    Group A
                  </button>
                  <button
                    onClick={() => assignGroup("B")}
                    disabled={assigning}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
                  >
                    <Users className="size-4" />
                    Group B
                  </button>
                </div>

                {lastAssigned && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 text-center">
                    Assigned to Group {lastAssigned}
                  </div>
                )}

                {scannedUser.enrollments.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Enrollments
                    </h3>
                    <div className="space-y-2">
                      {scannedUser.enrollments.map((e) => (
                        <div
                          key={e.workshopId}
                          className="flex items-center justify-between rounded-lg border border-border/30 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{e.title}</p>
                            {e.startTime && e.endTime && (
                              <p className="text-xs text-muted-foreground">
                                {fmt(e.startTime)} – {fmt(e.endTime)}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            e.status === "enrolled"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {e.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setScannedUser(null)
                    setLastAssigned(null)
                    startScanner()
                  }}
                  className="w-full rounded-lg border border-border/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                >
                  Scan Another
                </button>
              </div>
            )}
          </>
        )}

        {tab === "instructions" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload instruction PDFs for workshops and seminars. Participants will see a download link in the schedule.
            </p>
            {workshopList.map((w) => (
              <div key={w.id} className="rounded-xl border border-border/40 bg-muted/10 p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{w.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{w.type}</p>
                  {w.instructions_url && (
                    <a
                      href={w.instructions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
                    >
                      <FileText className="size-3" /> View PDF
                    </a>
                  )}
                  {uploadMsg?.id === w.id && (
                    <p className={`text-xs mt-1 ${uploadMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                      {uploadMsg.text}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {uploadingId === w.id ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <input
                        ref={(el) => { fileInputRefs.current[w.id] = el }}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadInstructions(w.id, file)
                          e.target.value = ""
                        }}
                      />
                      <button
                        onClick={() => fileInputRefs.current[w.id]?.click()}
                        className="flex items-center justify-center size-9 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        title={w.instructions_url ? "Replace PDF" : "Upload PDF"}
                      >
                        {w.instructions_url ? <Check className="size-4 text-emerald-400" /> : <Upload className="size-4" />}
                      </button>
                      {w.instructions_url && (
                        <button
                          onClick={() => removeInstructions(w.id)}
                          className="flex items-center justify-center size-9 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove PDF"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
