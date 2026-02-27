
import { Participant } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { Phone } from 'lucide-react'

interface ContactDetailsProps {
  participant: Participant
}

export function ContactDetails({ participant }: ContactDetailsProps) {
  const postalAddress = [
    participant.address_line1,
    participant.address_line2,
    [participant.suburb, participant.state, participant.postcode].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  const residentialAddress = [
    participant.residential_address_line1,
    participant.residential_address_line2,
    [
      participant.residential_suburb,
      participant.residential_state,
      participant.residential_postcode,
    ]
      .filter(Boolean)
      .join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  const commPrefs = participant.communication_preferences?.join(', ') || undefined

  return (
    <ProfileSection
      title="Contact Details"
      icon={<Phone className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <InfoField label="Primary Phone" value={participant.phone} sensitive />
        <InfoField label="Mobile" value={participant.mobile} sensitive />
        <InfoField label="Email" value={participant.email} sensitive />
        <InfoField
          label="Postal Address"
          value={postalAddress || undefined}
          fullWidth
        />
        {residentialAddress && (
          <InfoField
            label="Residential Address (if different)"
            value={residentialAddress}
            fullWidth
          />
        )}
        <InfoField
          label="Communication Preferences"
          value={commPrefs}
        />
      </div>
    </ProfileSection>
  )
}
