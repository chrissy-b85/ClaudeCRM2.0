// ─── Core Users & Staff ────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'team_leader' | 'support_coordinator'
  is_active: boolean
}

// ─── Participants ───────────────────────────────────────────────────────────

export interface Participant {
  id: string
  ndis_number: string
  first_name: string
  last_name: string
  preferred_name?: string
  pronouns?: string
  date_of_birth?: string
  gender?: string
  email?: string
  phone?: string
  mobile?: string
  // Postal address
  address_line1?: string
  address_line2?: string
  suburb?: string
  state?: string
  postcode?: string
  country: string
  // Residential address (if different)
  residential_address_line1?: string
  residential_address_line2?: string
  residential_suburb?: string
  residential_state?: string
  residential_postcode?: string
  communication_preferences?: Array<'phone' | 'email' | 'letter' | 'sms'>
  // Disability info
  primary_disability?: string
  secondary_disability?: string
  functional_impact_summary?: string
  behaviour_support_notes?: string
  communication_needs?: string
  mobility_physical_needs?: string
  dietary_health_requirements?: string
  // Cultural
  cultural_background?: string
  language_spoken: string
  interpreter_required: boolean
  interpreter_language?: string
  indigenous_status?: string
  // Emergency contacts
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  emergency_contact_2_name?: string
  emergency_contact_2_phone?: string
  emergency_contact_2_relationship?: string
  medical_emergency_notes?: string
  // Legal & guardianship
  legal_guardian_name?: string
  legal_guardian_relationship?: string
  legal_guardian_phone?: string
  power_of_attorney?: string
  guardianship_order_reference?: string
  decision_making_capacity_notes?: string
  // Support network
  support_coordinator_id?: string
  support_coordinator?: User
  lac_name?: string
  lac_phone?: string
  lac_email?: string
  // Meta
  is_active: boolean
  onboarding_date?: string
  photo_url?: string
  created_at: string
  updated_at: string
}

// ─── Contacts ──────────────────────────────────────────────────────────────

export interface Contact {
  id: string
  participant_id: string
  contact_type: 'guardian' | 'carer' | 'family' | 'other'
  first_name: string
  last_name: string
  relationship?: string
  email?: string
  phone?: string
  mobile?: string
  is_primary_contact: boolean
  is_emergency_contact: boolean
  notes?: string
}

// ─── NDIS Plans ────────────────────────────────────────────────────────────

export interface SupportCategory {
  id: string
  category_number: number
  name: string
  short_name?: string
  support_purpose: 'daily_activities' | 'social_participation' | 'capacity_building' | 'capital'
}

export interface PlanBudgetCategory {
  id: string
  plan_id: string
  support_category_id: string
  support_category?: SupportCategory
  allocated_amount: number
  spent_amount: number
  committed_amount: number
  pace_category_code?: string
  notes?: string
}

export interface PlanGoal {
  id: string
  plan_id: string
  goal_title: string
  goal_description?: string
  domain?: string
  target_date?: string
  status: 'not_started' | 'in_progress' | 'achieved' | 'discontinued'
  progress_notes?: string
}

export interface NDISPlan {
  id: string
  participant_id: string
  plan_number?: string
  plan_start_date: string
  plan_end_date: string
  plan_status: 'active' | 'expired' | 'superseded' | 'pending'
  management_type: 'self_managed' | 'plan_managed' | 'agency_managed' | 'combination'
  total_plan_value?: number
  ndis_office?: string
  ndis_planner_name?: string
  ndis_planner_phone?: string
  plan_review_date?: string
  notes?: string
  budget_categories?: PlanBudgetCategory[]
  goals?: PlanGoal[]
}

// ─── Providers & Service Agreements ────────────────────────────────────────

export interface Provider {
  id: string
  business_name: string
  trading_name?: string
  email?: string
  phone?: string
  registration_groups?: string[]
  is_registered_provider: boolean
}

export interface ServiceAgreement {
  id: string
  participant_id: string
  plan_id?: string
  provider_id: string
  provider?: Provider
  agreement_number?: string
  service_type?: string
  start_date: string
  end_date?: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  total_value?: number
  frequency?: string
  notes?: string
}

// ─── Documents ─────────────────────────────────────────────────────────────

export interface ParticipantDocument {
  id: string
  participant_id: string
  document_name: string
  document_category?: string
  document_date?: string
  expiry_date?: string
  is_confidential: boolean
  access_level: 'all_staff' | 'coordinator_only' | 'admin_only'
  description?: string
  file_extension?: string
  uploaded_by?: string
}

// ─── Case Notes ────────────────────────────────────────────────────────────

export interface CaseNote {
  id: string
  participant_id: string
  plan_id?: string
  note_type: 'progress' | 'case_note' | 'review' | 'incident'
  title?: string
  content: string
  is_confidential: boolean
  follow_up_required: boolean
  follow_up_date?: string
  follow_up_completed: boolean
  created_by_name?: string
  created_at: string
}

// ─── Communications ────────────────────────────────────────────────────────

export interface Communication {
  id: string
  participant_id: string
  communication_type: 'email' | 'sms' | 'phone_call' | 'letter' | 'in_person' | 'video_call'
  direction: 'inbound' | 'outbound'
  subject?: string
  content?: string
  communication_date: string
  duration_minutes?: number
  outcome?: 'successful' | 'no_answer' | 'left_message' | 'failed'
  follow_up_required: boolean
  follow_up_date?: string
  follow_up_completed: boolean
  handled_by_name?: string
}

// ─── Tasks ─────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  participant_id?: string
  task_type: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  due_date?: string
  assigned_to_name?: string
}

// ─── Aggregate Profile Data ─────────────────────────────────────────────────

export interface ParticipantProfileData {
  participant: Participant
  active_plan?: NDISPlan
  plans: NDISPlan[]
  contacts: Contact[]
  service_agreements: ServiceAgreement[]
  documents: ParticipantDocument[]
  case_notes: CaseNote[]
  communications: Communication[]
  tasks: Task[]
}
