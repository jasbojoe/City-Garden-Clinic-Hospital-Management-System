"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  appointmentsByDay,
  departmentDistribution,
  labActivityData,
  patientVisitsData,
  pharmacySalesData,
  revenueData,
} from "@/lib/data"

const compact = (v: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(v)

export function PatientVisitsChart() {
  const config = {
    visits: { label: "Visits", color: "var(--chart-1)" },
    admissions: { label: "Admissions", color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <AreaChart data={patientVisitsData} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillAdmissions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-admissions)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-admissions)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} tickFormatter={compact} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="visits"
          type="monotone"
          fill="url(#fillVisits)"
          stroke="var(--color-visits)"
          strokeWidth={2}
        />
        <Area
          dataKey="admissions"
          type="monotone"
          fill="url(#fillAdmissions)"
          stroke="var(--color-admissions)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function AppointmentsChart() {
  const config = {
    scheduled: { label: "Scheduled", color: "var(--chart-1)" },
    completed: { label: "Completed", color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <BarChart data={appointmentsByDay} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function RevenueChart() {
  const config = {
    revenue: { label: "Revenue", color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <AreaChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v) => `$${compact(v)}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          fill="url(#fillRevenue)"
          stroke="var(--color-revenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function DepartmentChart() {
  const config = {
    patients: { label: "Patients" },
    cardiology: { label: "Cardiology", color: "var(--chart-1)" },
    orthopedics: { label: "Orthopedics", color: "var(--chart-2)" },
    neurology: { label: "Neurology", color: "var(--chart-3)" },
    general: { label: "General", color: "var(--chart-4)" },
    others: { label: "Others", color: "var(--chart-5)" },
  } satisfies ChartConfig

  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  return (
    <ChartContainer config={config} className="mx-auto h-[260px] w-full">
      <PieChart margin={{ top: 0, bottom: 0 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={departmentDistribution}
          dataKey="patients"
          nameKey="department"
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={85}
          strokeWidth={4}
        >
          {departmentDistribution.map((entry, index) => (
            <Cell key={entry.department} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="department" />} />
      </PieChart>
    </ChartContainer>
  )
}

export function LabActivityChart() {
  const config = {
    tests: { label: "Tests", color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <LineChart data={labActivityData} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} tickFormatter={compact} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="tests"
          type="monotone"
          stroke="var(--color-tests)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function PharmacySalesChart() {
  const config = {
    sales: { label: "Sales", color: "var(--chart-4)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <BarChart data={pharmacySalesData} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v) => `$${compact(v)}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          }
        />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
