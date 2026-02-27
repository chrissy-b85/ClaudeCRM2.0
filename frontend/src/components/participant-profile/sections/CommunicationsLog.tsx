
import { Communication } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { Badge } from '../../ui/badge'
import {
  Phone,
  Mail,
  MessageSquare,
  Video,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
} from 'lucide-react'
import { formatDate, formatDateTime } from '../../../lib/validations'
import { cn } from '../../../lib/utils'

interface CommunicationsLogProps {
  communications: Communication[]
}

const commTypeConfig: Record<
  string,
  { icon: React.ElementType; label: string; className: string }
> = {
  email: { icon: Mail, label: 'Email', className: 'bg-blue-100 text-blue-700' },
  sms: { icon: MessageSquare, label: 'SMS', className: 'bg-green-100 text-green-700' },
  phone_call: { icon: Phone, label: 'Phone Call', className: 'bg-purple-100 text-purple-700' },
  letter: { icon: FileText, label: 'Letter', className: 'bg-gray-100 text-gray-700' },
  in_person: { icon: Users, label: 'In Person', className: 'bg-amber-100 text-amber-700' },
  video_call: { icon: Video, label: 'Video Call', className: 'bg-teal-100 text-teal-700' },
}

const outcomeConfig: Record<string, { label: string; className: string }> = {
  successful: { label: 'Successful', className: 'text-green-600' },
  no_answer: { label: 'No Answer', className: 'text-gray-500' },
  left_message: { label: 'Left Message', className: 'text-amber-600' },
  failed: { label: 'Failed', className: 'text-red-600' },
}

export function CommunicationsLog({ communications }: CommunicationsLogProps) {
  const outstanding = communications.filter(
    (c) => c.follow_up_required && !c.follow_up_completed,
  )

  return (
    <ProfileSection
      title="Communications Log"
      icon={<Phone className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      actions={
        <span className="text-xs text-gray-400">
          {communications.length} record{communications.length !== 1 ? 's' : ''}
        </span>
      }
    >
      {communications.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No communications logged.</p>
      ) : (
        <div className="space-y-4">
          {/* Pending follow-ups */}
          {outstanding.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-md p-3">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Pending Follow-ups ({outstanding.length})
              </p>
              <ul className="space-y-1">
                {outstanding.map((comm) => (
                  <li key={comm.id} className="text-xs text-amber-800">
                    <span className="font-medium">{comm.subject ?? 'No subject'}</span>
                    {comm.follow_up_date && (
                      <span className="text-amber-600">
                        {' '}
                        – Due {formatDate(comm.follow_up_date)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Communications list */}
          <div className="space-y-2">
            {communications.map((comm) => {
              const typeConf =
                commTypeConfig[comm.communication_type] ?? {
                  icon: MessageSquare,
                  label: comm.communication_type,
                  className: 'bg-gray-100 text-gray-700',
                }
              const Icon = typeConf.icon
              const outcomeConf = comm.outcome ? outcomeConfig[comm.outcome] : null

              return (
                <div key={comm.id} className="border rounded-md p-4 bg-white">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                          typeConf.className,
                        )}
                      >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {typeConf.label}
                      </span>
                      {comm.direction === 'inbound' ? (
                        <span className="text-xs text-gray-500 flex items-center gap-0.5">
                          <ArrowDownLeft className="h-3 w-3 text-blue-500" aria-hidden="true" />
                          Inbound
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-0.5">
                          <ArrowUpRight className="h-3 w-3 text-green-500" aria-hidden="true" />
                          Outbound
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(comm.communication_date)}
                    </span>
                  </div>

                  {comm.subject && (
                    <p className="font-medium text-sm text-gray-900 mb-1">{comm.subject}</p>
                  )}

                  {comm.content && (
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {comm.content}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t text-xs text-gray-500">
                    {comm.handled_by_name && <span>By: {comm.handled_by_name}</span>}
                    {comm.duration_minutes && (
                      <span>Duration: {comm.duration_minutes} min</span>
                    )}
                    {outcomeConf && (
                      <span className={outcomeConf.className}>{outcomeConf.label}</span>
                    )}
                    {comm.follow_up_required && !comm.follow_up_completed && (
                      <Badge variant="warning" className="text-xs">
                        Follow-up{comm.follow_up_date ? ` ${formatDate(comm.follow_up_date)}` : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </ProfileSection>
  )
}
