import type { ReactNode } from "react"
import { AlertCircle, Inbox, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <Card><CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center"><Inbox className="size-8 text-muted-foreground" /><div><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{action}</CardContent></Card>
}

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return <Card><CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center"><AlertCircle className="size-8 text-destructive" /><p className="text-sm text-muted-foreground">{message}</p>{onRetry ? <Button variant="outline" onClick={onRetry}><RefreshCw data-icon="inline-start" />Try again</Button> : null}</CardContent></Card>
}

export function LoadingState({ label = "Loading records…" }: { label?: string }) {
  return <Card><CardContent className="flex items-center justify-center py-12 text-sm text-muted-foreground"><span className="mr-2 size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />{label}</CardContent></Card>
}
