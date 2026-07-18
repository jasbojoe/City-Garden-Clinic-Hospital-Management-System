"use client"

import { BedDoubleIcon, ActivityIcon, UserPlusIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { wards, admissions, initials } from "@/lib/data"
import { toast } from "sonner"

export default function AdmissionsPage() {
  const totalBeds = wards.reduce((s, w) => s + w.totalBeds, 0)
  const occupied = wards.reduce((s, w) => s + w.occupied, 0)
  const occupancyRate = Math.round((occupied / totalBeds) * 100)
  const critical = admissions.filter((a) => a.status === "critical").length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admissions & Wards"
        description="Inpatient bed management and admission tracking."
        breadcrumbs={[{ label: "Admissions" }]}
        actions={
          <Button onClick={() => toast.success("Admission form opened")}>
            <UserPlusIcon data-icon="inline-start" />
            New admission
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BedDoubleIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {occupied}
                <span className="text-base font-normal text-muted-foreground">/{totalBeds}</span>
              </p>
              <p className="text-sm text-muted-foreground">Beds occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ActivityIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{occupancyRate}%</p>
              <p className="text-sm text-muted-foreground">Occupancy rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ActivityIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{critical}</p>
              <p className="text-sm text-muted-foreground">Critical patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ward occupancy</CardTitle>
            <CardDescription>Bed utilization by ward</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {wards.map((w) => {
              const rate = Math.round((w.occupied / w.totalBeds) * 100)
              return (
                <div key={w.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{w.name}</span>
                    <span className="text-muted-foreground">
                      {w.occupied}/{w.totalBeds}
                    </span>
                  </div>
                  <Progress value={rate} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current admissions</CardTitle>
            <CardDescription>Active inpatients under care</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Ward / Bed</TableHead>
                  <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">{initials(a.patient)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{a.patient}</p>
                          <p className="text-xs text-muted-foreground">{a.doctor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-sm">{a.ward}</p>
                      <p className="text-xs text-muted-foreground">Bed {a.bed}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {a.diagnosis}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
