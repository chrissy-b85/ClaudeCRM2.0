
import { ParticipantDocument } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { Badge } from '../../ui/badge'
import { FileText, Lock, AlertTriangle } from 'lucide-react'
import { formatDate, daysUntil } from '../../../lib/validations'
import { cn } from '../../../lib/utils'

interface DocumentsProps {
  documents: ParticipantDocument[]
}

const fileExtIcons: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
}

export function Documents({ documents }: DocumentsProps) {
  const categorised = documents.reduce<Record<string, ParticipantDocument[]>>((acc, doc) => {
    const cat = doc.document_category ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null
    const days = daysUntil(expiryDate)
    if (days < 0) return { label: 'Expired', className: 'text-red-600 bg-red-50' }
    if (days <= 30) return { label: `${days}d left`, className: 'text-red-600 bg-red-50' }
    if (days <= 90) return { label: `${days}d left`, className: 'text-amber-600 bg-amber-50' }
    return null
  }

  return (
    <ProfileSection
      title="Documents"
      icon={<FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      actions={
        <span className="text-xs text-gray-400">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
      }
    >
      {documents.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No documents uploaded.</p>
      ) : (
        <div className="space-y-5">
          {Object.entries(categorised).map(([category, docs]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {category}
              </p>
              <div className="space-y-2">
                {docs.map((doc) => {
                  const expiryStatus = getExpiryStatus(doc.expiry_date)
                  const icon = fileExtIcons[doc.file_extension?.toLowerCase() ?? ''] ?? '📎'

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 border rounded-md px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg shrink-0" aria-hidden="true">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {doc.document_name}
                          </span>
                          {doc.is_confidential && (
                            <Lock
                              className="h-3 w-3 text-amber-500 shrink-0"
                              aria-label="Confidential"
                            />
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                          {doc.document_date && (
                            <span>{formatDate(doc.document_date)}</span>
                          )}
                          {doc.expiry_date && (
                            <span>Expires: {formatDate(doc.expiry_date)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {expiryStatus && (
                          <span
                            className={cn(
                              'text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1',
                              expiryStatus.className,
                            )}
                          >
                            <AlertTriangle className="h-2.5 w-2.5" aria-hidden="true" />
                            {expiryStatus.label}
                          </span>
                        )}
                        {doc.access_level !== 'all_staff' && (
                          <Badge variant="secondary" className="text-xs">
                            {doc.access_level === 'coordinator_only' ? 'Restricted' : 'Admin Only'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  )
}
