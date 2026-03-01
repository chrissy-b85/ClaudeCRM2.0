
import { ServiceAgreement } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { Badge } from '../../ui/badge'
import { Heart } from 'lucide-react'
import { formatDate, formatCurrency } from '../../../lib/validations'


interface ServicesProvidersProps {
  serviceAgreements: ServiceAgreement[]
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'info' | 'secondary' | 'destructive' }> = {
  active: { label: 'Active', variant: 'success' },
  pending: { label: 'Pending', variant: 'info' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function ServicesProviders({ serviceAgreements }: ServicesProvidersProps) {
  const active = serviceAgreements.filter((sa) => sa.status === 'active')
  const inactive = serviceAgreements.filter((sa) => sa.status !== 'active')

  return (
    <ProfileSection
      title="Services & Providers"
      icon={<Heart className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      {serviceAgreements.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No service agreements recorded.</p>
      ) : (
        <div className="space-y-4">
          {active.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Active Service Agreements ({active.length})
              </p>
              <div className="space-y-3">
                {active.map((sa) => (
                  <ServiceAgreementCard key={sa.id} agreement={sa} />
                ))}
              </div>
            </div>
          )}

          {inactive.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Previous / Inactive Agreements ({inactive.length})
              </p>
              <div className="space-y-3">
                {inactive.map((sa) => (
                  <ServiceAgreementCard key={sa.id} agreement={sa} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ProfileSection>
  )
}

function ServiceAgreementCard({ agreement }: { agreement: ServiceAgreement }) {
  const status = statusConfig[agreement.status] ?? { label: agreement.status, variant: 'secondary' as const }

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {agreement.provider?.business_name ?? 'Unknown Provider'}
          </p>
          {agreement.provider?.trading_name &&
            agreement.provider.trading_name !== agreement.provider.business_name && (
              <p className="text-xs text-gray-500">
                Trading as: {agreement.provider.trading_name}
              </p>
            )}
        </div>
        <Badge variant={status.variant} className="shrink-0">
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {agreement.service_type && (
          <div>
            <p className="text-gray-500">Service Type</p>
            <p className="font-medium text-gray-900">{agreement.service_type}</p>
          </div>
        )}
        <div>
          <p className="text-gray-500">Period</p>
          <p className="font-medium text-gray-900">
            {formatDate(agreement.start_date)}
            {agreement.end_date ? ` – ${formatDate(agreement.end_date)}` : '+'}
          </p>
        </div>
        {agreement.total_value !== undefined && (
          <div>
            <p className="text-gray-500">Value</p>
            <p className="font-medium text-gray-900">{formatCurrency(agreement.total_value)}</p>
          </div>
        )}
        {agreement.frequency && (
          <div>
            <p className="text-gray-500">Frequency</p>
            <p className="font-medium text-gray-900">{agreement.frequency}</p>
          </div>
        )}
      </div>

      {(agreement.provider?.phone || agreement.provider?.email) && (
        <div className="flex gap-3 mt-3 pt-3 border-t text-xs text-gray-500">
          {agreement.provider.phone && (
            <span>📞 {agreement.provider.phone}</span>
          )}
          {agreement.provider.email && (
            <span>✉️ {agreement.provider.email}</span>
          )}
          {agreement.provider.is_registered_provider && (
            <span className="text-green-600 font-medium">✓ Registered Provider</span>
          )}
        </div>
      )}
    </div>
  )
}
