
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

interface ProfileSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function ProfileSection({
  title,
  icon,
  children,
  className,
  actions,
}: ProfileSectionProps) {
  return (
    <Card className={cn('mb-4', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            {icon}
            {title}
          </CardTitle>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
