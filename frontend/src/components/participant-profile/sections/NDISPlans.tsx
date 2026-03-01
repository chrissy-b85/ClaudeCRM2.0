import { useState } from 'react'
import { NDISPlan } from '../../../types/participant'
import { ProfileSection } from '../ProfileSection'
import { StatusBadge } from '../StatusBadge'
import { Button } from '../../ui/button'
import { Briefcase, ChevronDown, ChevronRight, Target } from 'lucide-react'
import { formatDate, formatCurrency, daysUntil } from '../../../lib/validations'
import { cn } from '../../../lib/utils'

interface NDISPlansProps {
  activePlan?: NDISPlan
  plans: NDISPlan[]
}

// Stacked bar showing spent / committed / available portions of a budget
function BudgetBar({
  allocated,
  spent,
  committed,
}: {
  allocated: number
  spent: number
  committed: number
}) {
  const spentPct = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0
  const committedPct =
    allocated > 0 ? Math.min((committed / allocated) * 100, 100 - spentPct) : 0
  const available = allocated - spent - committed
  const availablePct = Math.max(100 - spentPct - committedPct, 0)

  return (
    <div className="space-y-1">
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100">
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${spentPct}%` }}
          title={`Spent: ${formatCurrency(spent)}`}
          aria-hidden="true"
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${committedPct}%` }}
          title={`Committed: ${formatCurrency(committed)}`}
          aria-hidden="true"
        />
        <div
          className="bg-green-100 transition-all"
          style={{ width: `${availablePct}%` }}
          title={`Available: ${formatCurrency(available)}`}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
          Spent {formatCurrency(spent)}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
          Committed {formatCurrency(committed)}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
          Available {formatCurrency(available)}
        </span>
      </div>
    </div>
  )
}

const goalStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  not_started: { label: 'Not Started', className: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
  achieved: { label: 'Achieved', className: 'bg-green-100 text-green-700' },
  discontinued: { label: 'Discontinued', className: 'bg-red-100 text-red-700' },
}

export function NDISPlans({ activePlan, plans }: NDISPlansProps) {
  const [showHistory, setShowHistory] = useState(false)
  const historicalPlans = plans.filter((p) => p.id !== activePlan?.id)

  return (
    <ProfileSection
      title="NDIS Plans"
      icon={<Briefcase className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    >
      <div className="space-y-6">
        {activePlan ? (
          <div>
            {/* Plan summary header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Active Plan
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    {formatDate(activePlan.plan_start_date)} –{' '}
                    {formatDate(activePlan.plan_end_date)}
                  </span>
                  <StatusBadge
                    status={
                      daysUntil(activePlan.plan_end_date) <= 90 &&
                      daysUntil(activePlan.plan_end_date) > 0
                        ? 'expiring_soon'
                        : activePlan.plan_status
                    }
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Plan Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {activePlan.total_plan_value
                    ? formatCurrency(activePlan.total_plan_value)
                    : '—'}
                </p>
              </div>
            </div>

            {/* Plan metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                {
                  label: 'Management',
                  value: activePlan.management_type.replace(/_/g, ' '),
                },
                { label: 'Plan Number', value: activePlan.plan_number ?? '—' },
                { label: 'Review Date', value: formatDate(activePlan.plan_review_date) },
                { label: 'NDIS Office', value: activePlan.ndis_office ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium text-gray-900 text-sm capitalize">{value}</p>
                </div>
              ))}
            </div>

            {/* Budget categories */}
            {activePlan.budget_categories && activePlan.budget_categories.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Budget Breakdown
                </p>
                <div className="space-y-3">
                  {activePlan.budget_categories.map((cat) => {
                    const pctUsed =
                      cat.allocated_amount > 0
                        ? ((cat.spent_amount + cat.committed_amount) / cat.allocated_amount) * 100
                        : 0
                    return (
                      <div key={cat.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              Cat{' '}
                              {String(cat.support_category?.category_number ?? '?').padStart(
                                2,
                                '0',
                              )}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {cat.support_category?.name ?? 'Unknown Category'}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'text-xs font-medium',
                              pctUsed > 90
                                ? 'text-red-600'
                                : pctUsed > 70
                                  ? 'text-amber-600'
                                  : 'text-gray-600',
                            )}
                          >
                            {pctUsed.toFixed(0)}% used
                          </span>
                        </div>
                        <BudgetBar
                          allocated={cat.allocated_amount}
                          spent={cat.spent_amount}
                          committed={cat.committed_amount}
                        />
                        <p className="text-right text-xs text-gray-500 mt-1">
                          Allocated: {formatCurrency(cat.allocated_amount)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Goals */}
            {activePlan.goals && activePlan.goals.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Plan Goals
                </p>
                <div className="space-y-2">
                  {activePlan.goals.map((goal) => {
                    const status = goalStatusConfig[goal.status] ?? {
                      label: goal.status,
                      className: 'bg-gray-100 text-gray-700',
                    }
                    return (
                      <div key={goal.id} className="border rounded-md p-3">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-start gap-2">
                            <Target
                              className="h-4 w-4 text-gray-400 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {goal.goal_title}
                              </p>
                              {goal.domain && (
                                <p className="text-xs text-gray-500">{goal.domain}</p>
                              )}
                            </div>
                          </div>
                          <span
                            className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </div>
                        {goal.progress_notes && (
                          <p className="text-xs text-gray-600 mt-2 pl-6 italic">
                            {goal.progress_notes}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No active NDIS plan found.</p>
        )}

        {/* Plan history */}
        {historicalPlans.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-600 px-0"
              aria-expanded={showHistory}
            >
              {showHistory ? (
                <ChevronDown className="h-4 w-4 mr-1" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" aria-hidden="true" />
              )}
              Plan History ({historicalPlans.length})
            </Button>

            {showHistory && (
              <div className="mt-2 space-y-2">
                {historicalPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between border rounded-md p-3 bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(plan.plan_start_date)} – {formatDate(plan.plan_end_date)}
                      </p>
                      {plan.plan_number && (
                        <p className="text-xs text-gray-500 font-mono">{plan.plan_number}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {plan.total_plan_value && (
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency(plan.total_plan_value)}
                        </span>
                      )}
                      <StatusBadge status={plan.plan_status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProfileSection>
  )
}
