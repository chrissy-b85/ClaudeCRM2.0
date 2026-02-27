-- Migration: 003_ndis_plan_goals_notes.sql
-- Description: NDIS plan goals, outcomes, and case notes tables

-- NDIS plan goals
CREATE TABLE IF NOT EXISTS plan_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id) ON DELETE CASCADE,
    goal_title VARCHAR(255) NOT NULL,
    goal_description TEXT,
    goal_domain VARCHAR(100), -- 'daily_living', 'relationships', 'health_wellbeing', 'lifelong_learning', 'work', 'social_community', 'choice_control'
    goal_type VARCHAR(50) DEFAULT 'short_term', -- 'short_term', 'long_term'
    target_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'not_started', 'in_progress', 'achieved', 'discontinued'
    priority INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal progress notes
CREATE TABLE IF NOT EXISTS goal_progress_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES plan_goals(id) ON DELETE CASCADE,
    progress_rating INTEGER CHECK (progress_rating BETWEEN 1 AND 5),
    note_text TEXT NOT NULL,
    noted_by UUID REFERENCES users(id),
    noted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case notes (general participant notes not tied to a specific goal)
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES ndis_plans(id),
    note_type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'general', 'phone_call', 'meeting', 'email', 'incident', 'review'
    note_title VARCHAR(255),
    note_content TEXT NOT NULL,
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_confidential BOOLEAN DEFAULT FALSE,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan review notes
CREATE TABLE IF NOT EXISTS plan_review_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id) ON DELETE CASCADE,
    review_type VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'unscheduled', 'annual', 'participant_initiated'
    review_date DATE NOT NULL,
    summary TEXT,
    outcomes TEXT,
    action_items TEXT,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plan_goals_plan ON plan_goals(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_goals_status ON plan_goals(status);
CREATE INDEX IF NOT EXISTS idx_goal_progress_notes_goal ON goal_progress_notes(goal_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_participant ON case_notes(participant_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_plan ON case_notes(plan_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_date ON case_notes(note_date);
CREATE INDEX IF NOT EXISTS idx_plan_review_notes_plan ON plan_review_notes(plan_id);
