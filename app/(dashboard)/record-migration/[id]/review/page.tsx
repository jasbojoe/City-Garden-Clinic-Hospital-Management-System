"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, FileScan, Save, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/hms/page-header"
import { sampleExtractedFields } from "@/lib/data"

export default function MigrationReviewPage() {
  const router = useRouter()
  const [fields, setFields] = useState(sampleExtractedFields)
  const [approved, setApproved] = useState(false)

  function updateField(key: string, value: string) {
    setFields((current) => current.map((field) => field.key === key ? { ...field, value } : field))
  }

  function approve() {
    setApproved(true)
    toast.success("Record verified", { description: "The extracted fields are ready to merge into the patient chart." })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Review OCR Extraction"
        description="Confirm extracted fields before they are merged into the patient record."
        breadcrumbs={[{ label: "Record Migration", href: "/record-migration" }, { label: "MIG-5002" }, { label: "Review" }]}
        actions={<Button variant="outline" onClick={() => router.push("/record-migration")}><ChevronLeft data-icon="inline-start" />Back to records</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Scanned Document</CardTitle>
                <CardDescription>James Bangura · PF-1990-1123 · 41 pages</CardDescription>
              </div>
              <Badge variant="secondary"><FileScan data-icon="inline-start" />Page 1 of 41</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[520px] items-center justify-center bg-muted/30 p-6">
            <div className="flex aspect-[3/4] w-full max-w-md flex-col gap-5 rounded-sm border border-border bg-card p-8 shadow-sm">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="flex flex-col gap-1"><span className="font-serif text-xl font-semibold">City Garden Clinic</span><span className="text-xs text-muted-foreground">Orthopaedic Department · Patient Notes</span></div>
                <span className="text-xs text-muted-foreground">PF-1990-1123</span>
              </div>
              <div className="flex flex-col gap-3 text-sm text-foreground">
                <p className="font-semibold">Patient: James Bangura</p>
                <p>Date of Birth: 02 November 1967</p>
                <p>Presenting complaint: Right knee pain and limited mobility.</p>
                <div className="h-2 w-4/5 rounded bg-muted" /><div className="h-2 w-full rounded bg-muted" /><div className="h-2 w-11/12 rounded bg-muted" />
                <p className="pt-3 font-semibold">Assessment</p>
                <p>Degenerative changes noted. Patient advised to continue physiotherapy and return for review.</p>
                <div className="h-2 w-3/4 rounded bg-muted" /><div className="h-2 w-full rounded bg-muted" />
              </div>
              <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">Scanned from physical record · 16 July 2026</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div><CardTitle>Extracted Patient Fields</CardTitle><CardDescription>Review low-confidence fields before verification.</CardDescription></div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="size-4 text-primary" />OCR confidence</div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {fields.map((field) => {
              const needsReview = field.confidence < 80
              return <div key={field.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3"><Label htmlFor={field.key}>{field.label}</Label><span className={needsReview ? "text-xs font-medium text-amber-700" : "text-xs text-muted-foreground"}>{field.confidence}% confidence</span></div>
                <div className="flex items-center gap-3"><Input id={field.key} value={field.value} onChange={(event) => updateField(field.key, event.target.value)} className={needsReview ? "border-amber-400 bg-amber-50/50" : undefined} /><Progress value={field.confidence} className="hidden w-20 sm:flex" /></div>
              </div>
            })}
            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => { toast.error("Record rejected"); router.push("/record-migration") }}><X data-icon="inline-start" />Reject</Button>
              <Button onClick={approve} disabled={approved}><Check data-icon="inline-start" />{approved ? "Verified" : "Verify & Merge"}</Button>
            </div>
            {approved && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Verified successfully. The record is ready to merge into James Bangura&apos;s patient chart.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
