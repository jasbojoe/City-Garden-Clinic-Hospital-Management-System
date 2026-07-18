"use client"

import { useMemo, useState } from "react"
import { DollarSignIcon, SearchIcon, ReceiptIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { RevenueChart } from "@/components/hms/charts"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { invoices, currency, type Invoice } from "@/lib/data"
import { toast } from "sonner"

export default function BillingPage() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")
  const [selected, setSelected] = useState<Invoice | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return invoices.filter((inv) => {
      const matchesTab = tab === "all" || inv.status === tab
      const matchesQuery = !q || inv.patient.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [query, tab])

  const totalBilled = invoices.reduce((s, i) => s + i.total, 0)
  const totalCollected = invoices.reduce((s, i) => s + i.paid, 0)
  const outstanding = totalBilled - totalCollected

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing & Payments"
        description="Invoices, collections, and revenue performance."
        breadcrumbs={[{ label: "Billing" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ReceiptIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{currency(totalBilled)}</p>
              <p className="text-sm text-muted-foreground">Total billed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <WalletIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{currency(totalCollected)}</p>
              <p className="text-sm text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <DollarSignIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{currency(outstanding)}</p>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All patient invoices</CardDescription>
            </div>
            <InputGroup className="sm:max-w-56">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search invoices..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="partial">Partial</TabsTrigger>
                <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <p className="font-medium">{inv.id}</p>
                        <p className="text-xs text-muted-foreground">{inv.patient}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-right font-medium">{currency(inv.total)}</TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(inv)}>
                          View
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="size-5 text-primary" />
              Revenue trend
            </CardTitle>
            <CardDescription>Monthly gross revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.id}</DialogTitle>
            <DialogDescription>
              {selected?.patient} · {selected?.mrn}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-2 text-sm">
              <Row label="Consultation" value={currency(selected.consultation)} />
              <Row label="Laboratory" value={currency(selected.laboratory)} />
              <Row label="Medication" value={currency(selected.medication)} />
              <Row label="Admission" value={currency(selected.admission)} />
              <Separator className="my-1" />
              <Row label="Total" value={currency(selected.total)} bold />
              <Row label="Paid" value={currency(selected.paid)} />
              <Row label="Balance" value={currency(selected.total - selected.paid)} bold />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
            <Button
              onClick={() => {
                toast.success("Payment recorded")
                setSelected(null)
              }}
            >
              Record payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  )
}
