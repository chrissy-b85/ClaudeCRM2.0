import ParticipantProfile from './components/participant-profile'
import { mockParticipantData } from './data/mockParticipant'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ParticipantProfile data={mockParticipantData} currentUserRole="support_coordinator" />
    </div>
  )
}

export default App
