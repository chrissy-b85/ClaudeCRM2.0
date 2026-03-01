import { useState } from 'react'
import { Plus, FileText, Phone, CheckSquare, Upload, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface QuickActionsProps {
  onAddNote?: () => void
  onLogContact?: () => void
  onNewTask?: () => void
  onUploadDocument?: () => void
}

export function QuickActions({
  onAddNote,
  onLogContact,
  onNewTask,
  onUploadDocument,
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: FileText, label: 'Add Note', onClick: onAddNote, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Phone, label: 'Log Contact', onClick: onLogContact, color: 'bg-green-500 hover:bg-green-600' },
    { icon: CheckSquare, label: 'New Task', onClick: onNewTask, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Upload, label: 'Upload Document', onClick: onUploadDocument, color: 'bg-amber-500 hover:bg-amber-600' },
  ]

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-1" role="menu" aria-label="Quick actions">
          {actions.map(({ icon: Icon, label, onClick, color }) => (
            <button
              key={label}
              role="menuitem"
              onClick={() => {
                onClick?.()
                setIsOpen(false)
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                color,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isOpen && 'rotate-45',
        )}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  )
}
