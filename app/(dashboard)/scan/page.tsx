"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, CheckCircle2, ClipboardList, Loader2, QrCode, ScanLine, UserRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/hms/page-header"
import { patients } from "@/lib/data"

export default function ScanPage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [found, setFound] = useState(false)

  function scan() {
    setScanning(true)
    setFound(false)
    window.setTimeout(() => { setScanning(false); setFound(true); toast.success("Patient QR code recognised") }, 900)
  }

  const patient = patients[0]

  return <div className="flex flex-col gap-6">
    <PageHeader title="Scan Patient QR" description="Quickly retrieve a patient chart using their City Garden Clinic QR card." breadcrumbs={[{ label: "Scan QR" }]} />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <Card>
        <CardHeader><CardTitle>QR Scanner</CardTitle><CardDescription>Position the patient QR card inside the frame.</CardDescription></CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary/50 bg-slate-950">
            <div className="absolute inset-8 rounded-xl border border-cyan-400/70" />
            <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-cyan-300 shadow-[0_0_18px_4px_rgba(103,232,249,0.55)]" />
            {scanning ? <Loader2 className="size-12 animate-spin text-cyan-300" /> : <Camera className="size-12 text-cyan-300/80" />}
            <span className="absolute bottom-5 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{scanning ? "Reading QR code..." : "Scanner ready"}</span>
          </div>
          <Button size="lg" onClick={scan} disabled={scanning}><ScanLine data-icon="inline-start" />{scanning ? "Scanning..." : "Simulate QR scan"}</Button>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6">
        <Card><CardHeader><CardTitle>How it works</CardTitle></CardHeader><CardContent className="flex flex-col gap-4 text-sm text-muted-foreground"><div className="flex gap-3"><QrCode className="mt-0.5 size-5 text-primary" /><span>Each patient receives a unique QR card after registration.</span></div><div className="flex gap-3"><ScanLine className="mt-0.5 size-5 text-primary" /><span>Scan at reception, triage, laboratory, pharmacy, or billing.</span></div><div className="flex gap-3"><ClipboardList className="mt-0.5 size-5 text-primary" /><span>Open the correct chart without manually searching the patient list.</span></div></CardContent></Card>
        {found && <Card className="border-primary/30"><CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-600" />Patient found</CardTitle><Badge variant="secondary">Active</Badge></div><CardDescription>QR-10234 · Last scanned just now</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="size-5" /></span><div><p className="font-semibold text-foreground">{patient.name}</p><p className="text-sm text-muted-foreground">{patient.mrn} · {patient.department}</p></div></div><Separator /><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted-foreground">Phone</p><p className="font-medium text-foreground">{patient.phone}</p></div><div><p className="text-muted-foreground">Blood group</p><p className="font-medium text-foreground">{patient.bloodGroup}</p></div></div><Button onClick={() => router.push(`/patients/${patient.id}`)}>Open patient chart</Button></CardContent></Card>}
      </div>
    </div>
  </div>
}
