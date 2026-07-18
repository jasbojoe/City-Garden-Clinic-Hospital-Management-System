"use client"

import { useMemo, useState } from "react"
import { PillIcon, SearchIcon, AlertTriangleIcon, PackageIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { medicines, prescriptionQueue, currency, initials } from "@/lib/data"
import { toast } from "sonner"

export default function PharmacyPage() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return medicines.filter(
      (m) => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    )
  }, [query])

  const lowStock = medicines.filter((m) => m.stock <= m.reorderLevel)
  const pending = prescriptionQueue.filter((p) => p.status === "pending")

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pharmacy"
        description="Manage medication inventory and dispense prescriptions."
        breadcrumbs={[{ label: "Pharmacy" }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackageIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{medicines.length}</p>
              <p className="text-sm text-muted-foreground">Active SKUs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangleIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{lowStock.length}</p>
              <p className="text-sm text-muted-foreground">Low stock items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <PillIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Prescriptions to fill</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStock.length > 0 && (
        <Alert>
          <AlertTriangleIcon />
          <AlertTitle>Reorder required</AlertTitle>
          <AlertDescription>
            {lowStock.map((m) => m.name).join(", ")} {lowStock.length === 1 ? "is" : "are"} at or below the reorder
            level.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Stock levels and expiry tracking</CardDescription>
            </div>
            <InputGroup className="sm:max-w-56">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search medicines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead className="hidden sm:table-cell">Batch / Expiry</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Unit price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => {
                  const low = m.stock <= m.reorderLevel
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.category}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm">{m.batch}</p>
                        <p className="text-xs text-muted-foreground">Exp {m.expiry}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.stock}</span>
                          {low && <Badge variant="destructive">Low</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">{currency(m.unitPrice)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispensing queue</CardTitle>
            <CardDescription>Prescriptions awaiting fulfillment</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {prescriptionQueue.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(p.patient)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.patient}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.items} item{p.items > 1 ? "s" : ""} · {p.time}
                  </p>
                </div>
                {p.status === "pending" ? (
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Dispensed for ${p.patient}`)}>
                    Dispense
                  </Button>
                ) : (
                  <StatusBadge status={p.status} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
