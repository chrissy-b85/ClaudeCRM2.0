-- Migration: 009_participant_communications.sql
-- Description: Participant communications, tasks, and scheduling tables

-- Communication channels/templates
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'letter'
    subject VARCHAR(500),
    body TEXT NOT NULL,
    variables TEXT[], -- List of template variables e.g. {first_name}, {plan_end_date}
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participant communications log
CREATE TABLE IF NOT EXISTS participant_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES ndis_plans(id),
    communication_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'phone_call', 'letter', 'in_person', 'video_call'
    direction VARCHAR(20) NOT NULL DEFAULT 'outbound', -- 'inbound', 'outbound'
    subject VARCHAR(500),
    content TEXT,
    communication_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    duration_minutes INTEGER, -- For phone calls and meetings
    outcome VARCHAR(50), -- 'successful', 'no_answer', 'left_message', 'failed'
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    related_document_id UUID REFERENCES participant_documents(id),
    template_id UUID REFERENCES communication_templates(id),
    handled_by UUID REFERENCES users(id),
    is_confidential BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks and action items
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES ndis_plans(id),
    task_type VARCHAR(50) DEFAULT 'general', -- 'general', 'follow_up', 'document_request', 'plan_review', 'service_booking', 'reporting'
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled', 'overdue'
    due_date DATE,
    completed_date DATE,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    related_communication_id UUID REFERENCES participant_communications(id),
    related_document_id UUID REFERENCES participant_documents(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments and meetings
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    appointment_type VARCHAR(50) NOT NULL, -- 'planning_meeting', 'review_meeting', 'support_coordination', 'provider_meeting', 'ndis_meeting', 'other'
    title VARCHAR(500),
    description TEXT,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
    cancellation_reason TEXT,
    attendees JSONB, -- Array of {name, role, email}
    notes TEXT,
    outcome TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated notifications/reminders
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_type VARCHAR(100) NOT NULL, -- 'plan_expiry', 'review_due', 'document_expiry', 'task_due', 'appointment_reminder'
    recipient_user_id UUID REFERENCES users(id),
    participant_id UUID REFERENCES participants(id),
    title VARCHAR(500) NOT NULL,
    message TEXT,
    related_entity_type VARCHAR(50), -- 'plan', 'document', 'task', 'appointment'
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_channel VARCHAR(50) DEFAULT 'in_app', -- 'in_app', 'email', 'sms'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participant_communications_participant ON participant_communications(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_communications_type ON participant_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_participant_communications_date ON participant_communications(communication_date);
CREATE INDEX IF NOT EXISTS idx_tasks_participant ON tasks(participant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_appointments_participant ON appointments(participant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_datetime);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_user_id, is_read) WHERE is_read = FALSE;
