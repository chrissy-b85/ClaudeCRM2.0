import { useState } from 'react'
import { CaseNote } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { Badge } from '../../ui/badge'
import { MessageSquare, Lock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDateTime, formatDate } from '../../../lib/validations'
import { cn } from '../../../lib/utils'

interface CaseNotesProps {
  caseNotes: CaseNote[]
}

const noteTypeConfig: Record<
  string,
  { label: string; className: string }
> = {
  progress: { label: 'Progress Note', className: 'bg-blue-100 text-blue-700' },
  case_note: { label: 'Case Note', className: 'bg-gray-100 text-gray-700' },
  review: { label: 'Review', className: 'bg-purple-100 text-purple-700' },
  incident: { label: 'Incident', className: 'bg-red-100 text-red-700' },
}

export function CaseNotes({ caseNotes }: CaseNotesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const outstanding = caseNotes.filter(
    (n) => n.follow_up_required && !n.follow_up_completed,
  )

  return (
    <ProfileSection
      title="Case Notes"
      icon={<MessageSquare className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      actions={
        <span className="text-xs text-gray-400">
          {caseNotes.length} note{caseNotes.length !== 1 ? 's' : ''}
        </span>
      }
    >
      {caseNotes.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No case notes recorded.</p>
      ) : (
        <div className="space-y-4">
          {/* Outstanding follow-ups */}
          {outstanding.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-md p-3">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Outstanding Follow-ups ({outstanding.length})
              </p>
              <ul className="space-y-1">
                {outstanding.map((note) => (
                  <li key={note.id} className="text-xs text-amber-800">
                    <span className="font-medium">{note.title ?? 'Untitled note'}</span>
                    {note.follow_up_date && (
                      <span className="text-amber-600"> – Due {formatDate(note.follow_up_date)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes list */}
          <div className="space-y-2">
            {caseNotes.map((note) => {
              const typeConfig = noteTypeConfig[note.note_type] ?? {
                label: note.note_type,
                className: 'bg-gray-100 text-gray-700',
              }
              const isExpanded = expandedId === note.id

              return (
                <div key={note.id} className="border rounded-md overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : note.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {note.title ?? 'Untitled note'}
                        </span>
                        {note.is_confidential && (
                          <Lock className="h-3 w-3 text-amber-500 shrink-0" aria-label="Confidential" />
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                        <span>{formatDateTime(note.created_at)}</span>
                        {note.created_by_name && <span>by {note.created_by_name}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          typeConfig.className,
                        )}
                      >
                        {typeConfig.label}
                      </span>
                      {note.follow_up_required && !note.follow_up_completed && (
                        <Badge variant="warning" className="text-xs">Follow-up</Badge>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                      {note.follow_up_required && (
                        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs">
                          <AlertCircle
                            className={cn(
                              'h-3.5 w-3.5',
                              note.follow_up_completed ? 'text-green-500' : 'text-amber-500',
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={
                              note.follow_up_completed ? 'text-green-600' : 'text-amber-600'
                            }
                          >
                            {note.follow_up_completed ? 'Follow-up completed' : 'Follow-up required'}
                            {note.follow_up_date && !note.follow_up_completed
                              ? ` – Due ${formatDate(note.follow_up_date)}`
                              : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </ProfileSection>
  )
}
