import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface InfoFieldProps {
  label: string
  value?: string | null
  sensitive?: boolean
  className?: string
  fullWidth?: boolean
}

export function InfoField({
  label,
  value,
  sensitive = false,
  className,
  fullWidth = false,
}: InfoFieldProps) {
  const [revealed, setRevealed] = useState(false)
  const isEmpty = !value

  const displayValue = () => {
    if (isEmpty) return <span className="text-gray-400 italic text-sm">Not provided</span>
    if (sensitive && !revealed)
      return <span className="font-mono tracking-widest text-gray-400 text-sm">••••••••</span>
    return <span className="text-gray-900 text-sm">{value}</span>
  }

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'col-span-full', className)}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-1.5 min-h-[1.5rem]">
        {displayValue()}
        {sensitive && !isEmpty && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-gray-400 hover:text-gray-600 flex-shrink-0"
            onClick={() => setRevealed(!revealed)}
            aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
          >
            {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
      </div>
    </div>
  )
}
