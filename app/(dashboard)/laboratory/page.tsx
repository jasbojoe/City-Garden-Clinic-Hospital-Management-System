"use client"

import { useMemo, useState } from "react"
import { FlaskConicalIcon, SearchIcon, ClipboardCheckIcon, ActivityIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { LabActivityChart } from "@/components/hms/charts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { labTests, type LabStatus } from "@/lib/data"
import { toast } from "sonner"

export default function LaboratoryPage() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<string>("all")

  const filtered = useMemo(() => {
    return labTests.filter((t) => {
      const matchesTab = tab === "all" || t.status === tab
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        t.patient.toLowerCase().includes(q) ||
        t.test.toLowerCase().includes(q) ||
        t.mrn.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [query, tab])

  const counts = {
    pending: labTests.filter((t) => t.status === "pending").length,
    inProgress: labTests.filter((t) => t.status === "in-progress").length,
    completed: labTests.filter((t) => t.status === "completed").length,
  }

  function nextStatus(id: string) {
    const t = labTests.find((x) => x.id === id)
    const map: Record<LabStatus, string> = {
      pending: "marked in progress",
      "in-progress": "marked completed",
      completed: "already completed",
    }
    toast.success(`${t?.test} ${map[t?.status ?? "pending"]}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Laboratory"
        description="Track test requisitions, sample processing, and result turnaround."
        breadcrumbs={[{ label: "Laboratory" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FlaskConicalIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.pending}</p>
              <p className="text-sm text-muted-foreground">Pending collection</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <ActivityIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.inProgress}</p>
              <p className="text-sm text-muted-foreground">In progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ClipboardCheckIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.completed}</p>
              <p className="text-sm text-muted-foreground">Completed today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Test worklist</CardTitle>
              <CardDescription>Requisitions across all departments</CardDescription>
            </div>
            <InputGroup className="sm:max-w-56">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search tests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead className="hidden md:table-cell">Patient</TableHead>
                    <TableHead className="hidden sm:table-cell">Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <p className="font-medium">{t.test}</p>
                        <p className="text-xs text-muted-foreground">{t.category}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm">{t.patient}</p>
                        <p className="text-xs text-muted-foreground">{t.mrn}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusBadge status={t.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={t.status === "completed"}
                          onClick={() => nextStatus(t.id)}
                        >
                          {t.status === "pending" ? "Start" : t.status === "in-progress" ? "Enter result" : "Done"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab throughput</CardTitle>
            <CardDescription>Tests processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <LabActivityChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
