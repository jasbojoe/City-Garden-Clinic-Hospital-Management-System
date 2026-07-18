"use client"

import { useMemo, useState } from "react"
import { UsersRoundIcon, SearchIcon, UserPlusIcon, PhoneIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { staff, initials } from "@/lib/data"
import { toast } from "sonner"

export default function StaffPage() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return staff.filter((s) => {
      const matchesTab = tab === "all" || s.status === tab
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [query, tab])

  const onDuty = staff.filter((s) => s.status === "active").length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff Directory"
        description="Manage clinical and administrative personnel."
        breadcrumbs={[{ label: "Staff" }]}
        actions={
          <Button onClick={() => toast.success("Add staff form opened")}>
            <UserPlusIcon data-icon="inline-start" />
            Add staff
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UsersRoundIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{staff.length}</p>
              <p className="text-sm text-muted-foreground">Total staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UsersRoundIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{onDuty}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <UsersRoundIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{staff.filter((s) => s.status === "on-leave").length}</p>
              <p className="text-sm text-muted-foreground">On leave</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Personnel</CardTitle>
            <CardDescription>{filtered.length} members</CardDescription>
          </div>
          <InputGroup className="sm:max-w-56">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search staff..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on-leave">On leave</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback>{initials(s.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.department}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <PhoneIcon className="size-3.5" />
                  {s.phone}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
