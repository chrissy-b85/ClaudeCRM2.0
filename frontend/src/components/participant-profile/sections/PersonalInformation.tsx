
import { Participant } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { User } from 'lucide-react'
import { formatDate } from '../../../lib/validations'

interface PersonalInformationProps {
  participant: Participant
}

export function PersonalInformation({ participant }: PersonalInformationProps) {
  return (
    <ProfileSection
      title="Personal Information"
      icon={<User className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <InfoField label="First Name" value={participant.first_name} />
        <InfoField label="Last Name" value={participant.last_name} />
        <InfoField label="Preferred Name" value={participant.preferred_name} />
        <InfoField label="Pronouns" value={participant.pronouns} />
        <InfoField
          label="Date of Birth"
          value={formatDate(participant.date_of_birth)}
          sensitive
        />
        <InfoField label="Gender" value={participant.gender} />
        <InfoField label="NDIS Number" value={participant.ndis_number} sensitive />
        <InfoField label="Cultural Background" value={participant.cultural_background} />
        <InfoField label="Languages Spoken" value={participant.language_spoken} />
        <InfoField
          label="Interpreter Required"
          value={
            participant.interpreter_required
              ? `Yes – ${participant.interpreter_language ?? 'Language not specified'}`
              : 'No'
          }
        />
        <InfoField label="Indigenous Status" value={participant.indigenous_status} />
        <InfoField label="Onboarding Date" value={formatDate(participant.onboarding_date)} />
      </div>
    </ProfileSection>
  )
}
