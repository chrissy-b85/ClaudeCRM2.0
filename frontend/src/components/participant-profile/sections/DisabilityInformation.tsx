
import { Participant } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { InfoField } from '../InfoField'
import { Heart } from 'lucide-react'

interface DisabilityInformationProps {
  participant: Participant
}

export function DisabilityInformation({ participant }: DisabilityInformationProps) {
  return (
    <ProfileSection
      title="Disability Information"
      icon={<Heart className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <InfoField label="Primary Disability" value={participant.primary_disability} />
          <InfoField label="Secondary Disability" value={participant.secondary_disability} />
        </div>

        {participant.functional_impact_summary && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Functional Impact Summary
            </span>
            <p className="text-sm text-gray-900 mt-1 leading-relaxed">
              {participant.functional_impact_summary}
            </p>
          </div>
        )}

        {participant.behaviour_support_notes && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Behaviour Support Notes
            </span>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-1">
              <p className="text-sm text-amber-900 leading-relaxed">
                {participant.behaviour_support_notes}
              </p>
            </div>
          </div>
        )}

        {participant.communication_needs && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Communication Needs
            </span>
            <p className="text-sm text-gray-900 mt-1 leading-relaxed">
              {participant.communication_needs}
            </p>
          </div>
        )}

        {participant.mobility_physical_needs && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Mobility / Physical Needs
            </span>
            <p className="text-sm text-gray-900 mt-1">{participant.mobility_physical_needs}</p>
          </div>
        )}

        {participant.dietary_health_requirements && (
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Dietary / Health Requirements
            </span>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-1">
              <p className="text-sm text-blue-900">{participant.dietary_health_requirements}</p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  )
}
