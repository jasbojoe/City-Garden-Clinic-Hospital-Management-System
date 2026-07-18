"use client"

import { useState } from "react"
import { ClipboardListIcon, SaveIcon, PillIcon, FlaskConicalIcon, PlusIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { queue, initials } from "@/lib/data"
import { toast } from "sonner"

const vitals = [
  { label: "Blood Pressure", value: "128/82", unit: "mmHg" },
  { label: "Heart Rate", value: "76", unit: "bpm" },
  { label: "Temperature", value: "37.1", unit: "°C" },
  { label: "SpO₂", value: "98", unit: "%" },
]

export default function ConsultationsPage() {
  const waiting = queue.filter((q) => q.status !== "completed")
  const [activeId, setActiveId] = useState(waiting[0]?.id ?? queue[0].id)
  const active = queue.find((q) => q.id === activeId) ?? queue[0]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Consultations"
        description="Clinical workspace for recording examinations, diagnoses, and orders."
        breadcrumbs={[{ label: "Consultations" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Consultation queue</CardTitle>
            <CardDescription>Patients ready to be seen</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {waiting.map((q) => (
              <button
                key={q.id}
                onClick={() => setActiveId(q.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                  q.id === activeId
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <Avatar className="size-9">
                  <AvatarFallback>{initials(q.patient)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{q.patient}</p>
                  <p className="truncate text-xs text-muted-foreground">{q.department}</p>
                </div>
                <StatusBadge status={q.priority} />
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback className="text-base">{initials(active.patient)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{active.patient}</CardTitle>
                <CardDescription>
                  {active.mrn} · {active.department} · {active.doctor}
                </CardDescription>
              </div>
              <StatusBadge status={active.status} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vitals.map((v) => (
                  <div key={v.label} className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                    <p className="mt-1 text-lg font-semibold">
                      {v.value}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">{v.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardListIcon className="size-5 text-primary" />
                Clinical notes
              </CardTitle>
              <CardDescription>SOAP-format consultation record</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Subjective (presenting complaint)</FieldLabel>
                  <Textarea rows={2} placeholder="Patient reports intermittent chest tightness for 3 days..." />
                </Field>
                <Field>
                  <FieldLabel>Objective (examination findings)</FieldLabel>
                  <Textarea rows={2} placeholder="Chest clear, no murmurs, ECG shows normal sinus rhythm..." />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Assessment / Diagnosis</FieldLabel>
                    <Input placeholder="e.g. Stable angina" />
                  </Field>
                  <Field>
                    <FieldLabel>ICD-10 code</FieldLabel>
                    <Input placeholder="I20.9" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Plan</FieldLabel>
                  <Textarea rows={2} placeholder="Continue current medication, review in 2 weeks..." />
                </Field>
              </FieldGroup>

              <Separator className="my-5" />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Quick orders:</span>
                <Button variant="outline" size="sm" onClick={() => toast.success("Lab order added")}>
                  <FlaskConicalIcon data-icon="inline-start" />
                  Order lab
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Prescription added")}>
                  <PillIcon data-icon="inline-start" />
                  Prescribe
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Referral created")}>
                  <PlusIcon data-icon="inline-start" />
                  Referral
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary">Auto-saved 2 min ago</Badge>
            <div className="flex gap-2">
              <Button variant="outline">Save draft</Button>
              <Button onClick={() => toast.success("Consultation completed", { description: `${active.patient}'s record has been finalized.` })}>
                <SaveIcon data-icon="inline-start" />
                Complete consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
