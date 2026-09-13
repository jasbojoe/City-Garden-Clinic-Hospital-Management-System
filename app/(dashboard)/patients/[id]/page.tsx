import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarPlus,
  Droplet,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Stethoscope,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/hms/status-badge"
import { PatientQrCard } from "@/components/hms/patient-qr-card"
import {
  appointments,
  currency,
  initials,
  invoices,
  labTests,
  patients,
} from "@/lib/data"

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const patient = patients.find((p) => p.id === id)
  if (!patient) notFound()

  const patientAppointments = appointments.filter(
    (a) => a.mrn === patient.mrn,
  )
  const patientLabs = labTests.filter((l) => l.mrn === patient.mrn)
  const patientInvoices = invoices.filter((i) => i.mrn === patient.mrn)

  const history = [
    { date: "2026-07-14", title: "Hypertension follow-up", doctor: "Dr. Elena Vasquez", note: "BP controlled on current medication. Continue Atorvastatin." },
    { date: "2026-05-02", title: "Annual physical", doctor: "Dr. Thomas Reed", note: "All vitals within normal range. Recommended routine bloodwork." },
    { date: "2026-01-18", title: "Chest pain evaluation", doctor: "Dr. Elena Vasquez", note: "ECG normal. Prescribed rest and monitoring." },
  ]

  const prescriptions = [
    { date: "2026-07-14", drug: "Atorvastatin 20mg", dosage: "1 tablet nightly", duration: "90 days", doctor: "Dr. Elena Vasquez" },
    { date: "2026-07-14", drug: "Aspirin 75mg", dosage: "1 tablet daily", duration: "90 days", doctor: "Dr. Elena Vasquez" },
    { date: "2026-05-02", drug: "Amoxicillin 500mg", dosage: "3x daily", duration: "7 days", doctor: "Dr. Thomas Reed" },
  ]

  const documents = [
    { name: "Discharge summary — Jul 2026", type: "PDF", size: "248 KB", date: "2026-07-15" },
    { name: "ECG report", type: "PDF", size: "1.2 MB", date: "2026-07-14" },
    { name: "Insurance authorization", type: "PDF", size: "96 KB", date: "2026-06-30" },
    { name: "Consent form", type: "PDF", size: "72 KB", date: "2026-01-18" },
  ]

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          render={<Link href="/patients" aria-label="Back to patients" />}
        >
          <ArrowLeft />
        </Button>
        <span className="text-sm text-muted-foreground">
          Patients / {patient.name}
        </span>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {initials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-semibold text-foreground">
                  {patient.name}
                </h2>
                <StatusBadge status={patient.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-mono text-xs">{patient.mrn}</span>
                <span>{patient.age} yrs &middot; {patient.gender}</span>
                <span className="flex items-center gap-1">
                  <Droplet className="size-3.5" /> {patient.bloodGroup}
                </span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="size-3.5" /> {patient.department}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" render={<Link href="/appointments" />}>
              <CalendarPlus data-icon="inline-start" />
              Book appointment
            </Button>
            <Button render={<Link href="/consultations" />}>
              <Stethoscope data-icon="inline-start" />
              Start consultation
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

      <TabsContent value="overview" className="mt-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Phone} label="Phone" value={patient.phone} />
                <InfoRow icon={Mail} label="Email" value={patient.email} />
                <InfoRow icon={MapPin} label="Address" value={patient.address} />
                <InfoRow
                  icon={ShieldAlert}
                  label="Emergency contact"
                  value={patient.emergencyContact}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinical Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground">Allergies</span>
                  {patient.allergies.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {patient.allergies.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-foreground">No known allergies</span>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="text-foreground">{patient.insurance}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last visit</span>
                  <span className="text-foreground">{patient.lastVisit}</span>
                </div>
              </CardContent>
          </Card>
          <PatientQrCard patient={patient} />
        </div>
      </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientAppointments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>{a.time}</TableCell>
                      <TableCell>{a.doctor}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {a.type}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {patientAppointments.length === 0 ? (
                    <EmptyRow cols={5} label="No appointments on record." />
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-0 p-6">
              {history.map((h, i) => (
                <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 size-2.5 rounded-full bg-primary" />
                    {i < history.length - 1 ? (
                      <span className="w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {h.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {h.date}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {h.doctor}
                    </span>
                    <p className="text-sm text-muted-foreground">{h.note}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead className="hidden sm:table-cell">Duration</TableHead>
                    <TableHead className="hidden md:table-cell">Prescriber</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{p.drug}</TableCell>
                      <TableCell>{p.dosage}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {p.duration}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {p.doctor}
                      </TableCell>
                      <TableCell>{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Requested</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientLabs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.test}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {l.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {l.requestedAt}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={l.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {patientLabs.length === 0 ? (
                    <EmptyRow cols={4} label="No lab tests on record." />
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">
                        {inv.id}
                      </TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell>{currency(inv.total)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {currency(inv.paid)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {patientInvoices.length === 0 ? (
                    <EmptyRow cols={5} label="No invoices on record." />
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
                    {doc.type}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {doc.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.size} &middot; {doc.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm text-foreground">{value}</span>
      </div>
    </div>
  )
}

function EmptyRow({ cols, label }: { cols: number; label: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={cols}
        className="py-8 text-center text-sm text-muted-foreground"
      >
        {label}
      </TableCell>
    </TableRow>
  )
}
