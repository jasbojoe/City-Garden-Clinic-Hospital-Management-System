import { cn } from "@/lib/utils"

type Tone = "green" | "amber" | "red" | "blue" | "teal" | "slate"

const toneClasses: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
}

// Maps any known status string to a tone + readable label.
const statusMap: Record<string, { tone: Tone; label?: string }> = {
  // patients
  active: { tone: "green" },
  admitted: { tone: "blue" },
  discharged: { tone: "slate" },
  inactive: { tone: "slate" },
  // appointments
  scheduled: { tone: "blue" },
  "checked-in": { tone: "teal", label: "Checked in" },
  completed: { tone: "green" },
  cancelled: { tone: "red" },
  // queue
  waiting: { tone: "amber" },
  "in-consultation": { tone: "teal", label: "In consultation" },
  // priority
  Normal: { tone: "slate" },
  Routine: { tone: "slate" },
  Urgent: { tone: "amber" },
  Emergency: { tone: "red" },
  // lab
  pending: { tone: "amber" },
  "in-progress": { tone: "teal", label: "In progress" },
  // billing
  paid: { tone: "green" },
  partial: { tone: "amber" },
  unpaid: { tone: "red" },
  dispensed: { tone: "green" },
  // admissions / staff
  observation: { tone: "amber" },
  critical: { tone: "red" },
  "on-leave": { tone: "amber", label: "On leave" },
}

function humanize(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config = statusMap[status] ?? { tone: "slate" as Tone }
  const label = config.label ?? humanize(status)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClasses[config.tone],
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500": config.tone === "green",
          "bg-amber-500": config.tone === "amber",
          "bg-red-500": config.tone === "red",
          "bg-blue-500": config.tone === "blue",
          "bg-teal-500": config.tone === "teal",
          "bg-slate-400": config.tone === "slate",
        })}
      />
      {label}
    </span>
  )
}
