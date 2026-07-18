"use client"

import { DownloadIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import {
  PatientVisitsChart,
  AppointmentsChart,
  RevenueChart,
  DepartmentChart,
  LabActivityChart,
  PharmacySalesChart,
} from "@/components/hms/charts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Operational and financial performance across the hospital."
        breadcrumbs={[{ label: "Reports" }]}
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last quarter</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.success("Report exported as PDF")}>
              <DownloadIcon data-icon="inline-start" />
              Export
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient visits & admissions</CardTitle>
            <CardDescription>Monthly volume trend</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientVisitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments by day</CardTitle>
            <CardDescription>Scheduled vs completed</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Gross monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patients by department</CardTitle>
            <CardDescription>Distribution of active patients</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laboratory throughput</CardTitle>
            <CardDescription>Tests processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <LabActivityChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pharmacy sales</CardTitle>
            <CardDescription>Monthly dispensing revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <PharmacySalesChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
