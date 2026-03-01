
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  Target,
  Heart,
  FileText,
  MessageSquare,
  Phone,
  Briefcase,
} from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'plan', label: 'Plan & Budget', icon: Briefcase },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'services', label: 'Services', icon: Heart },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'notes', label: 'Notes', icon: MessageSquare },
  { id: 'communications', label: 'Communications', icon: Phone },
]

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  counts?: Record<string, number>
}

export function ProfileTabs({ activeTab, onTabChange, counts = {} }: ProfileTabsProps) {
  return (
    <div className="bg-white border-b sticky top-[88px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex overflow-x-auto no-scrollbar"
          aria-label="Profile sections"
          role="tablist"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => onTabChange(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
              {counts[id] !== undefined && counts[id] > 0 && (
                <span
                  className={cn(
                    'ml-0.5 text-xs rounded-full px-1.5 py-0.5 font-medium leading-none',
                    activeTab === id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-100 text-gray-600',
                  )}
                  aria-label={`${counts[id]} items`}
                >
                  {counts[id]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
