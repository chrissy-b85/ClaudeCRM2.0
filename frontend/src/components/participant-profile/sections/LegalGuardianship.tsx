
import { Participant } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { Scale } from 'lucide-react'

interface LegalGuardianshipProps {
  participant: Participant
}

export function LegalGuardianship({ participant }: LegalGuardianshipProps) {
  const hasLegalInfo =
    participant.legal_guardian_name ||
    participant.power_of_attorney ||
    participant.guardianship_order_reference ||
    participant.decision_making_capacity_notes

  return (
    <ProfileSection
      title="Legal & Guardianship"
      icon={<Scale className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      {!hasLegalInfo ? (
        <p className="text-sm text-gray-400 italic">
          No legal or guardianship information recorded.
        </p>
      ) : (
        <div className="space-y-4">
          {(participant.legal_guardian_name || participant.legal_guardian_phone) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Legal Guardian / Nominee
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                <InfoField label="Name" value={participant.legal_guardian_name} />
                <InfoField
                  label="Relationship"
                  value={participant.legal_guardian_relationship}
                />
                <InfoField label="Phone" value={participant.legal_guardian_phone} sensitive />
              </div>
            </div>
          )}

          {participant.power_of_attorney && (
            <InfoField
              label="Power of Attorney"
              value={participant.power_of_attorney}
              fullWidth
            />
          )}

          {participant.guardianship_order_reference && (
            <InfoField
              label="Guardianship Order Reference"
              value={participant.guardianship_order_reference}
            />
          )}

          {participant.decision_making_capacity_notes && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Decision-Making Capacity Notes
              </span>
              <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                {participant.decision_making_capacity_notes}
              </p>
            </div>
          )}
        </div>
      )}
    </ProfileSection>
  )
}
