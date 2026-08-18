"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  FileText,
  ScanLine,
  FileCheck2,
  ClipboardCheck,
  BadgeCheck,
  CalendarCheck,
  Plus,
  Eye,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/hms/page-header"
import { StatCard } from "@/components/hms/stat-card"
import { StatusBadge } from "@/components/hms/status-badge"
import {
  departments,
  migrationRecords,
  migrationStatuses,
} from "@/lib/data"

export default function RecordMigrationPage() {
  const [status, setStatus] = useState("all")
  const [department, setDepartment] = useState("all")
  const [assignee, setAssignee] = useState("all")
  const [date, setDate] = useState("")

  const assignees = Array.from(
    new Set(migrationRecords.map((r) => r.assignedStaff)),
  )

  const filtered = useMemo(() => {
    return migrationRecords.filter((r) => {
      const matchStatus = status === "all" || r.status === status
      const matchDept = department === "all" || r.department === department
      const matchAssignee = assignee === "all" || r.assignedStaff === assignee
      const matchDate = !date || r.dateScanned === date
      return matchStatus && matchDept && matchAssignee && matchDate
    })
  }, [status, department, assignee, date])

  const count = (s: string) =>
    migrationRecords.filter((r) => r.status === s).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Record Migration"
        description="Digitise legacy paper folders into the electronic medical record."
        breadcrumbs={[{ label: "Record Migration" }]}
      >
        <Button variant="outline" render={<Link href="/record-migration/review/MIG-5002" />}>
          <Eye data-icon="inline-start" />
          OCR review queue
        </Button>
        <Button render={<Link href="/record-migration/new" />}>
          <Plus data-icon="inline-start" />
          New migration
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Legacy Paper Records" value="18,420" icon={FileText} hint="estimated folders" />
        <StatCard label="Awaiting Scan" value={String(count("awaiting-scan"))} icon={ScanLine} hint="in current batch" />
        <StatCard label="Scanned" value={String(count("scanned"))} icon={FileCheck2} hint="ready for OCR" />
        <StatCard label="Needs Verification" value={String(count("needs-review"))} icon={ClipboardCheck} hint="pending review" />
        <StatCard label="Verified" value={String(count("verified"))} icon={BadgeCheck} hint="approved records" />
        <StatCard label="Completed Today" value={String(count("completed"))} icon={CalendarCheck} trend="on track" trendUp hint="migrations closed" />
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Migration Records</CardTitle>
            <CardDescription>
              Track each paper folder from scan to verified digital record.
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {migrationStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full" aria-label="Filter by department">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="w-full" aria-label="Filter by staff">
                <SelectValue placeholder="Assigned staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All staff</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Filter by date scanned"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Migration ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Folder No.</TableHead>
                  <TableHead className="hidden lg:table-cell">MRN</TableHead>
                  <TableHead className="hidden sm:table-cell">Pages</TableHead>
                  <TableHead className="hidden lg:table-cell">Department</TableHead>
                  <TableHead className="hidden xl:table-cell">Assigned</TableHead>
                  <TableHead className="hidden xl:table-cell">Scanned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.patient}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                      {r.folderNo}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {r.mrn}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell tabular-nums">
                      {r.pages}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {r.department}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                      {r.assignedStaff}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                      {r.dateScanned ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/record-migration/review/${r.id}`} />}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No migration records match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
