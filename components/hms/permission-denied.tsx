import { ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function PermissionDenied({
  message = 'You do not have permission to view this section.',
}: {
  message?: string
}) {
  return (
    <Card role="status">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <ShieldAlert aria-hidden="true" className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}
