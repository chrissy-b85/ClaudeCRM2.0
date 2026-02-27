
import { Participant, NDISPlan } from '../../types/participant'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { StatusBadge } from './StatusBadge'
import { daysUntil, formatDate } from '../../lib/validations'
import { Phone, Mail, MapPin, Calendar, Edit, MoreVertical } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ParticipantProfileHeaderProps {
  participant: Participant
  activePlan?: NDISPlan
}

export function ParticipantProfileHeader({
  participant,
  activePlan,
}: ParticipantProfileHeaderProps) {
  const initials = `${participant.first_name[0]}${participant.last_name[0]}`.toUpperCase()
  const displayName = participant.preferred_name
    ? `${participant.first_name} "${participant.preferred_name}" ${participant.last_name}`
    : `${participant.first_name} ${participant.last_name}`

  const planStatus = (() => {
    if (!activePlan) return null
    const days = daysUntil(activePlan.plan_end_date)
    if (days < 0) return 'expired'
    if (days <= 90) return 'expiring_soon'
    return activePlan.plan_status
  })()

  const daysRemaining = activePlan ? daysUntil(activePlan.plan_end_date) : null

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-primary/20 shrink-0">
            {participant.photo_url && (
              <AvatarImage src={participant.photo_url} alt={displayName} />
            )}
            <AvatarFallback className="text-lg sm:text-xl bg-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{displayName}</h1>
              {participant.pronouns && (
                <span className="text-sm text-gray-500">({participant.pronouns})</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-500 text-xs">NDIS</span>
                <span className="font-mono font-semibold text-gray-800">
                  {participant.ndis_number}
                </span>
              </span>
              {planStatus && <StatusBadge status={planStatus} />}
              {daysRemaining !== null && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    daysRemaining < 0
                      ? 'bg-red-100 text-red-700'
                      : daysRemaining <= 30
                        ? 'bg-red-100 text-red-700'
                        : daysRemaining <= 90
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700',
                  )}
                >
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)}d overdue`
                    : `${daysRemaining}d remaining`}
                </span>
              )}
              {!participant.is_active && <Badge variant="secondary">Inactive</Badge>}
            </div>

            {/* Quick contact info */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              {participant.mobile && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  {participant.mobile}
                </span>
              )}
              {participant.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" aria-hidden="true" />
                  {participant.email}
                </span>
              )}
              {participant.suburb && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {participant.suburb}, {participant.state}
                </span>
              )}
              {activePlan && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  Plan: {formatDate(activePlan.plan_start_date)} –{' '}
                  {formatDate(activePlan.plan_end_date)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
              Edit Profile
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="More options">
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
