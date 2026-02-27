
import { Participant, Contact } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { Badge } from '../../ui/badge'
import { Users } from 'lucide-react'

interface SupportNetworkProps {
  participant: Participant
  contacts: Contact[]
}

export function SupportNetwork({ participant, contacts }: SupportNetworkProps) {
  return (
    <ProfileSection
      title="Support Network"
      icon={<Users className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      <div className="space-y-6">
        {/* Support Coordinator */}
        {participant.support_coordinator && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Support Coordinator
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField
                label="Name"
                value={`${participant.support_coordinator.first_name} ${participant.support_coordinator.last_name}`}
              />
              <InfoField
                label="Email"
                value={participant.support_coordinator.email}
                sensitive
              />
            </div>
          </div>
        )}

        {/* LAC */}
        {(participant.lac_name || participant.lac_phone) && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Local Area Coordinator (LAC)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Name" value={participant.lac_name} />
              <InfoField label="Phone" value={participant.lac_phone} sensitive />
              <InfoField label="Email" value={participant.lac_email} sensitive />
            </div>
          </div>
        )}

        {/* Contacts */}
        {contacts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Informal & Formal Supports
            </p>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border rounded-md p-3 bg-gray-50"
                  role="listitem"
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {contact.first_name} {contact.last_name}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {contact.relationship ?? contact.contact_type}
                      </Badge>
                      {contact.is_primary_contact && (
                        <Badge variant="info" className="text-xs">
                          Primary
                        </Badge>
                      )}
                      {contact.is_emergency_contact && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-gray-600">
                    {contact.phone && (
                      <span>
                        📞 <span>{contact.phone}</span>
                      </span>
                    )}
                    {contact.mobile && (
                      <span>
                        📱 <span>{contact.mobile}</span>
                      </span>
                    )}
                    {contact.email && (
                      <span>
                        ✉️ <span>{contact.email}</span>
                      </span>
                    )}
                  </div>
                  {contact.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{contact.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!participant.support_coordinator &&
          !participant.lac_name &&
          contacts.length === 0 && (
            <p className="text-sm text-gray-400 italic">No support network information recorded.</p>
          )}
      </div>
    </ProfileSection>
  )
}
