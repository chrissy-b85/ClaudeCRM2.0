import { useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AlertBannerProps {
  variant: 'warning' | 'info' | 'success' | 'destructive'
  title: string
  description?: string
  dismissible?: boolean
  className?: string
}

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  destructive: AlertCircle,
}

export function AlertBanner({
  variant,
  title,
  description,
  dismissible = true,
  className,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const Icon = iconMap[variant]

  return (
    <Alert variant={variant} className={cn('flex items-start justify-between gap-2', className)}>
      <div className="flex items-start gap-2 flex-1">
        <Icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  )
}
