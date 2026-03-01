
import { Participant } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { AlertTriangle } from 'lucide-react'

interface EmergencyContactsProps {
  participant: Participant
}

export function EmergencyContacts({ participant }: EmergencyContactsProps) {
  const hasPrimary =
    participant.emergency_contact_name || participant.emergency_contact_phone
  const hasSecondary = participant.emergency_contact_2_name

  return (
    <ProfileSection
      title="Emergency Contacts"
      icon={<AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />}
    >
      <div className="space-y-6">
        {hasPrimary && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Primary Emergency Contact
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Name" value={participant.emergency_contact_name} />
              <InfoField
                label="Relationship"
                value={participant.emergency_contact_relationship}
              />
              <InfoField
                label="Phone"
                value={participant.emergency_contact_phone}
                sensitive
              />
            </div>
          </div>
        )}

        {hasSecondary && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Secondary Emergency Contact
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Name" value={participant.emergency_contact_2_name} />
              <InfoField
                label="Relationship"
                value={participant.emergency_contact_2_relationship}
              />
              <InfoField
                label="Phone"
                value={participant.emergency_contact_2_phone}
                sensitive
              />
            </div>
          </div>
        )}

        {participant.medical_emergency_notes && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Medical Emergency Notes
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800 leading-relaxed">
                {participant.medical_emergency_notes}
              </p>
            </div>
          </div>
        )}

        {!hasPrimary && !hasSecondary && !participant.medical_emergency_notes && (
          <p className="text-sm text-gray-400 italic">No emergency contact information recorded.</p>
        )}
      </div>
    </ProfileSection>
  )
}
