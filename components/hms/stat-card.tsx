import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  hint,
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  hint?: string
}) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </span>
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trendUp ? "text-emerald-600" : "text-red-600",
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {trend}
              {hint ? (
                <span className="font-normal text-muted-foreground">
                  {hint}
                </span>
              ) : null}
            </span>
          ) : hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
