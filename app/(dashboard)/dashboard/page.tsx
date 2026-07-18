import Link from "next/link"
import {
  BedDouble,
  CalendarCheck,
  DollarSign,
  FlaskConical,
  Timer,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/hms/page-header"
import { StatCard } from "@/components/hms/stat-card"
import { StatusBadge } from "@/components/hms/status-badge"
import {
  AppointmentsChart,
  PatientVisitsChart,
  RevenueChart,
} from "@/components/hms/charts"
import { appointments, queue } from "@/lib/data"

export default function DashboardPage() {
  const todaysAppointments = appointments.slice(0, 5)
  const waiting = queue.filter((q) => q.status === "waiting").slice(0, 5)

  return (
    <>
      <PageHeader
        title="Good morning, Dr. Vasquez"
        description="Here is what is happening across St. Meridian Hospital today."
      >
        <Button variant="outline" render={<Link href="/reports" />}>
          View reports
        </Button>
        <Button render={<Link href="/patients/new" />}>New patient</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Patients" value="12,480" icon={Users} trend="4.2%" trendUp hint="vs last month" />
        <StatCard label="Today's Appointments" value="48" icon={CalendarCheck} trend="6 more" trendUp hint="than yesterday" />
        <StatCard label="Patients Waiting" value="14" icon={Timer} hint="Avg wait 22 min" />
        <StatCard label="Pending Lab Results" value="9" icon={FlaskConical} trend="3 urgent" trendUp={false} hint="need review" />
        <StatCard label="Available Beds" value="41" icon={BedDouble} hint="of 100 total beds" />
        <StatCard label="Today's Revenue" value="$18,240" icon={DollarSign} trend="12.5%" trendUp hint="vs last week" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>
              Outpatient visits and admissions over the last 7 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientVisitsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly gross revenue trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Appointments This Week</CardTitle>
            <CardDescription>Scheduled versus completed.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Upcoming appointments for the day.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {todaysAppointments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                    {a.time}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {a.patient}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {a.doctor} &middot; {a.department}
                    </span>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Queue</CardTitle>
          <CardDescription>Patients currently waiting to be seen.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {waiting.map((q) => (
            <div
              key={q.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                {q.number}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">
                  {q.patient}
                </span>
                <span className="text-xs text-muted-foreground">
                  {q.department} &middot; {q.waitMinutes} min
                </span>
              </div>
              <StatusBadge status={q.priority} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
