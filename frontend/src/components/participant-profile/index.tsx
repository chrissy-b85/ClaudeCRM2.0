import { useState } from 'react'
import { ParticipantProfileData } from '../../types/participant'
import { ParticipantProfileHeader } from './ParticipantProfileHeader'
import { ProfileTabs } from './ProfileTabs'
import { QuickActions } from './QuickActions'
import { AlertBanner } from './AlertBanner'
import { PersonalInformation } from './sections/PersonalInformation'
import { ContactDetails } from './sections/ContactDetails'
import { EmergencyContacts } from './sections/EmergencyContacts'
import { DisabilityInformation } from './sections/DisabilityInformation'
import { LegalGuardianship } from './sections/LegalGuardianship'
import { SupportNetwork } from './sections/SupportNetwork'
import { NDISPlans } from './sections/NDISPlans'
import { ServicesProviders } from './sections/ServicesProviders'
import { Documents } from './sections/Documents'
import { CaseNotes } from './sections/CaseNotes'
import { CommunicationsLog } from './sections/CommunicationsLog'
import { daysUntil } from '../../lib/validations'

type TabId = 'overview' | 'plan' | 'goals' | 'services' | 'documents' | 'notes' | 'communications'

interface ParticipantProfileProps {
  data: ParticipantProfileData
  currentUserRole?: 'admin' | 'team_leader' | 'support_coordinator'
}

export default function ParticipantProfile({
  data,
  currentUserRole: _currentUserRole = 'support_coordinator',
}: ParticipantProfileProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const { participant, active_plan, plans, contacts, service_agreements, documents, case_notes, communications } = data

  // Compute tab badge counts
  const tabCounts: Record<string, number> = {
    services: service_agreements.filter((sa) => sa.status === 'active').length,
    documents: documents.length,
    notes: case_notes.length,
    communications: communications.length,
  }

  // Build alert banners
  const alerts: Array<{ id: string; variant: 'warning' | 'info' | 'destructive'; title: string; description?: string }> = []

  if (active_plan) {
    const days = daysUntil(active_plan.plan_end_date)
    if (days < 0) {
      alerts.push({
        id: 'plan-expired',
        variant: 'destructive',
        title: 'NDIS Plan Expired',
        description: `The active plan expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago. Please initiate a plan review.`,
      })
    } else if (days <= 90) {
      alerts.push({
        id: 'plan-expiring',
        variant: 'warning',
        title: `NDIS Plan Expiring in ${days} Days`,
        description: `The current plan expires on ${new Date(active_plan.plan_end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}. Begin plan review preparation.`,
      })
    }
  }

  // Check for expiring documents (within 90 days)
  const expiringDocs = documents.filter((doc) => {
    if (!doc.expiry_date) return false
    const days = daysUntil(doc.expiry_date)
    return days >= 0 && days <= 90
  })
  if (expiringDocs.length > 0) {
    alerts.push({
      id: 'docs-expiring',
      variant: 'warning',
      title: `${expiringDocs.length} Document${expiringDocs.length > 1 ? 's' : ''} Expiring Soon`,
      description: expiringDocs.map((d) => d.document_name).join(', '),
    })
  }

  // Outstanding follow-ups
  const outstandingFollowUps = [
    ...case_notes.filter((n) => n.follow_up_required && !n.follow_up_completed),
    ...communications.filter((c) => c.follow_up_required && !c.follow_up_completed),
  ]
  if (outstandingFollowUps.length > 0) {
    alerts.push({
      id: 'follow-ups',
      variant: 'info',
      title: `${outstandingFollowUps.length} Outstanding Follow-up${outstandingFollowUps.length > 1 ? 's' : ''}`,
      description: 'Review the Notes and Communications tabs for items requiring follow-up.',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <ParticipantProfileHeader participant={participant} activePlan={active_plan} />

      {/* Tab navigation */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        counts={tabCounts}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alert banners */}
        {alerts.length > 0 && (
          <div className="space-y-2 mb-6" role="region" aria-label="Alerts">
            {alerts.map((alert) => (
              <AlertBanner
                key={alert.id}
                variant={alert.variant}
                title={alert.title}
                description={alert.description}
              />
            ))}
          </div>
        )}

        {/* Tab panels */}
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
              <div>
                <PersonalInformation participant={participant} />
                <ContactDetails participant={participant} />
                <EmergencyContacts participant={participant} />
              </div>
              <div>
                <DisabilityInformation participant={participant} />
                <LegalGuardianship participant={participant} />
                <SupportNetwork participant={participant} contacts={contacts} />
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <NDISPlans activePlan={active_plan} plans={plans} />
          )}

          {activeTab === 'goals' && (
            <div>
              {active_plan?.goals && active_plan.goals.length > 0 ? (
                <NDISPlans activePlan={{ ...active_plan, budget_categories: [] }} plans={[]} />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg font-medium">No goals recorded</p>
                  <p className="text-sm mt-1">Goals are set as part of the NDIS plan.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <ServicesProviders serviceAgreements={service_agreements} />
          )}

          {activeTab === 'documents' && (
            <Documents documents={documents} />
          )}

          {activeTab === 'notes' && (
            <CaseNotes caseNotes={case_notes} />
          )}

          {activeTab === 'communications' && (
            <CommunicationsLog communications={communications} />
          )}
        </div>
      </main>

      {/* Floating quick actions */}
      <QuickActions />
    </div>
  )
}
