
import { Badge } from '../ui/badge'

interface StatusBadgeProps {
  status: string
}

const planStatusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' | 'info' }
> = {
  active: { label: 'Active', variant: 'success' },
  expiring_soon: { label: 'Expiring Soon', variant: 'warning' },
  expired: { label: 'Expired', variant: 'destructive' },
  superseded: { label: 'Superseded', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'info' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = planStatusConfig[status] ?? { label: status, variant: 'secondary' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
