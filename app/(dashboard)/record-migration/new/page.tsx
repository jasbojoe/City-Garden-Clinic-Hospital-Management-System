"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileScan, UploadCloud, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/hms/page-header"
import { documentCategories, departments, patients, staff } from "@/lib/data"

type UploadFile = { name: string; size: string }

const SAMPLE_FILES: UploadFile[] = [
  { name: "folder-page-01.jpg", size: "1.8 MB" },
  { name: "folder-page-02.jpg", size: "2.1 MB" },
  { name: "lab-result-scan.pdf", size: "640 KB" },
]

export default function NewMigrationRecordPage() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadFile[]>([])

  function simulateUpload() {
    setFiles(SAMPLE_FILES)
    toast.success("3 pages captured", {
      description: "Documents queued for OCR processing.",
    })
  }

  function removeFile(name: string) {
    setFiles((f) => f.filter((x) => x.name !== name))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Migration record created", {
      description: "Sent to the OCR pipeline for extraction.",
    })
    router.push("/record-migration")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Migration Record"
        description="Register a paper folder and capture its pages for digitization."
        breadcrumbs={[
          { label: "Record Migration", href: "/record-migration" },
          { label: "New Record" },
        ]}
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Folder Details</CardTitle>
              <CardDescription>
                Link this paper folder to an existing patient record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="patient">Patient</FieldLabel>
                  <Select defaultValue={patients[1].id}>
                    <SelectTrigger id="patient">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — {p.mrn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="folder">Paper Folder No.</FieldLabel>
                  <Input id="folder" defaultValue="PF-1990-1123" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="dept">Source Department</FieldLabel>
                  <Select defaultValue={departments[1]}>
                    <SelectTrigger id="dept">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Document Category</FieldLabel>
                  <Select defaultValue={documentCategories[0]}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="assignee">Assigned Staff</FieldLabel>
                  <Select defaultValue={staff[4].id}>
                    <SelectTrigger id="assignee">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="pages">Page Count</FieldLabel>
                  <Input id="pages" type="number" defaultValue={41} min={1} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capture Documents</CardTitle>
              <CardDescription>
                Scan or upload the folder pages. This demo simulates capture.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <button
                type="button"
                onClick={simulateUpload}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-6 py-10 text-center transition-colors hover:bg-muted"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-5" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Click to simulate scanning folder pages
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG or PDF up to 20 MB each
                </span>
              </button>

              {files.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {files.map((f) => (
                    <li
                      key={f.name}
                      className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <FileScan className="size-4 text-muted-foreground" />
                        {f.name}
                        <span className="text-xs text-muted-foreground">
                          {f.size}
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeFile(f.name)}
                        aria-label={`Remove ${f.name}`}
                      >
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>How this record flows.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3 text-sm">
                {[
                  "Pages captured and queued",
                  "OCR extracts patient fields",
                  "Staff reviews low-confidence data",
                  "Verified data merged to patient chart",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={files.length === 0}>
              Create &amp; Send to OCR
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/record-migration")}
            >
              Cancel
            </Button>
            {files.length === 0 && (
              <FieldDescription className="text-center">
                Capture at least one page to continue.
              </FieldDescription>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
