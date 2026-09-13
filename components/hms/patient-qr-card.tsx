"use client"

import { useState } from "react"
import { Download, QrCode, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Patient } from "@/lib/data"
import { createPatientQrPayload } from "@/lib/hms-service"

export function PatientQrCard({ patient }: { patient: Patient }) {
  const [shared, setShared] = useState(false)
  const payload = createPatientQrPayload(patient.id)
  const encodedPayload = payload ? JSON.stringify(payload) : ""

  return <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="size-5 text-primary" />Patient QR Card</CardTitle><CardDescription>Scan to retrieve this chart.</CardDescription></CardHeader>
    <CardContent className="flex flex-col items-center gap-4">
      <div className="grid size-40 grid-cols-9 grid-rows-9 gap-1 rounded-lg border-8 border-white bg-white p-2 shadow-sm" aria-label={`QR code for ${patient.name}`} data-qr-payload={encodedPayload}>
        {Array.from({ length: 81 }, (_, index) => <span key={index} className={(index * 17 + index % 7) % 5 < 2 || [0,1,2,9,11,18,19,20,60,61,62,69,71,78,79,80].includes(index) ? "bg-slate-950" : "bg-white"} />)}
      </div>
      <div className="text-center"><p className="font-mono text-xs font-semibold text-foreground">QR-{patient.mrn.replace("MRN-", "")}</p><p className="text-xs text-muted-foreground">Issued with patient registration</p></div>
      <div className="flex w-full gap-2"><Button variant="outline" className="flex-1" onClick={() => toast.success("QR card download queued")}><Download data-icon="inline-start" />Download</Button><Button variant="outline" size="icon" aria-label="Share QR card" onClick={() => { setShared(true); toast.success("QR card link copied") }}><Share2 /></Button></div>
      {shared && <p className="text-xs text-emerald-700">Secure sharing link copied.</p>}
    </CardContent>
  </Card>
}
