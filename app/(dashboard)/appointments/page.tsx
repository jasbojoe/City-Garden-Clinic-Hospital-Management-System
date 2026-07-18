"use client"

import { useMemo, useState } from "react"
import { CalendarPlusIcon, ClockIcon, VideoIcon, StethoscopeIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { appointments, doctors, patients, initials } from "@/lib/data"
import { toast } from "sonner"

const days = ["Mon 15", "Tue 16", "Wed 17", "Thu 18", "Fri 19"]

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    if (filter === "all") return appointments
    return appointments.filter((a) => a.status === filter)
  }, [filter])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointments"
        description="Schedule, confirm, and manage patient appointments across departments."
        breadcrumbs={[{ label: "Appointments" }]}
        actions={<NewAppointmentDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarPlusIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Total today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ClockIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {appointments.filter((a) => a.status === "Scheduled").length}
              </p>
              <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <VideoIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {appointments.filter((a) => a.mode === "Telemedicine").length}
              </p>
              <p className="text-sm text-muted-foreground">Telemedicine</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>Schedule</CardTitle>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex w-16 shrink-0 flex-col items-center rounded-md bg-muted px-2 py-1.5">
                  <span className="text-sm font-semibold text-foreground">{a.time}</span>
                  <span className="text-xs text-muted-foreground">{a.duration}m</span>
                </div>
                <Avatar className="size-9">
                  <AvatarFallback>{initials(a.patientName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.patientName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.doctor} · {a.department}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.mode} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This week</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {days.map((d, i) => (
              <div key={d}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{d}</span>
                  <span className="text-xs text-muted-foreground">{6 + i * 3} appts</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${40 + i * 12}%` }}
                  />
                </div>
                {i < days.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NewAppointmentDialog() {
  const [open, setOpen] = useState(false)

  function handleSave() {
    setOpen(false)
    toast.success("Appointment scheduled", {
      description: "The patient will receive a confirmation reminder.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><CalendarPlusIcon data-icon="inline-start" />New appointment</Button>} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New appointment</DialogTitle>
          <DialogDescription>Book a consultation slot for a patient.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Patient</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.slice(0, 8).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} · {p.mrn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Doctor</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} · {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date</FieldLabel>
              <Input type="date" defaultValue="2026-07-18" />
            </Field>
            <Field>
              <FieldLabel>Time</FieldLabel>
              <Input type="time" defaultValue="09:30" />
            </Field>
          </div>
          <Field>
            <FieldLabel>Mode</FieldLabel>
            <Select defaultValue="In-person">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-person">In-person</SelectItem>
                <SelectItem value="Telemedicine">Telemedicine</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleSave}>
            <StethoscopeIcon data-icon="inline-start" />
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
