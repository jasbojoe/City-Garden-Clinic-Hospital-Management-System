"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon, UsersIcon, TimerIcon, HourglassIcon } from "lucide-react"
import { PageHeader } from "@/components/hms/page-header"
import { StatusBadge } from "@/components/hms/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { queueEntries as seed, initials, type QueueEntry } from "@/lib/data"
import { toast } from "sonner"

export default function QueuePage() {
  const [entries, setEntries] = useState<QueueEntry[]>(seed)

  function advance(id: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const next =
          e.status === "Waiting" ? "In Consultation" : e.status === "In Consultation" ? "Completed" : "Completed"
        return { ...e, status: next }
      })
    )
    toast.success("Queue updated")
  }

  const waiting = entries.filter((e) => e.status === "Waiting")
  const active = entries.filter((e) => e.status === "In Consultation")
  const done = entries.filter((e) => e.status === "Completed")
  const avgWait = Math.round(waiting.reduce((s, e) => s + e.waitMinutes, 0) / (waiting.length || 1))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patient Queue"
        description="Live outpatient queue with real-time token tracking and wait times."
        breadcrumbs={[{ label: "Queue" }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <UsersIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{waiting.length}</p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HourglassIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{active.length}</p>
              <p className="text-sm text-muted-foreground">In consultation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TimerIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgWait}m</p>
              <p className="text-sm text-muted-foreground">Avg. wait time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QueueColumn title="Waiting" entries={waiting} onAdvance={advance} actionLabel="Call in" />
        <QueueColumn title="In Consultation" entries={active} onAdvance={advance} actionLabel="Complete" />
        <QueueColumn title="Completed" entries={done} onAdvance={advance} />
      </div>
    </div>
  )
}

function QueueColumn({
  title,
  entries,
  onAdvance,
  actionLabel,
}: {
  title: string
  entries: QueueEntry[]
  onAdvance: (id: string) => void
  actionLabel?: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary">{entries.length}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No patients</p>
        )}
        {entries.map((e) => (
          <div key={e.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {e.token}
              </div>
              <Avatar className="size-9">
                <AvatarFallback>{initials(e.patientName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{e.patientName}</p>
                <p className="truncate text-sm text-muted-foreground">{e.doctor}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={e.priority} />
                <span className="text-xs text-muted-foreground">{e.waitMinutes}m wait</span>
              </div>
              {actionLabel && (
                <Button size="sm" variant="outline" onClick={() => onAdvance(e.id)}>
                  {actionLabel === "Complete" ? (
                    <CheckIcon data-icon="inline-start" />
                  ) : (
                    <ArrowRightIcon data-icon="inline-start" />
                  )}
                  {actionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
