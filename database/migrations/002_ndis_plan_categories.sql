-- Migration: 002_ndis_plan_categories.sql
-- Description: NDIS plan and support category tables

-- NDIS support categories (aligned with NDIS price guide)
CREATE TABLE IF NOT EXISTS support_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_number INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    support_purpose VARCHAR(50), -- 'daily_activities', 'social_participation', 'capacity_building', 'capital'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NDIS plans table
CREATE TABLE IF NOT EXISTS ndis_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    plan_number VARCHAR(50),
    plan_start_date DATE NOT NULL,
    plan_end_date DATE NOT NULL,
    plan_status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'superseded', 'pending'
    management_type VARCHAR(50) NOT NULL DEFAULT 'plan_managed', -- 'self_managed', 'plan_managed', 'agency_managed', 'combination'
    total_plan_value NUMERIC(12, 2),
    ndis_office VARCHAR(255),
    ndis_planner_name VARCHAR(200),
    ndis_planner_phone VARCHAR(20),
    plan_review_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NDIS plan budget allocations by category
CREATE TABLE IF NOT EXISTS plan_budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id) ON DELETE CASCADE,
    support_category_id UUID NOT NULL REFERENCES support_categories(id),
    allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    spent_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    committed_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pace_category_code VARCHAR(20),
    proda_category_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, support_category_id)
);

-- Plan funding sources
CREATE TABLE IF NOT EXISTS plan_funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_budget_category_id UUID NOT NULL REFERENCES plan_budget_categories(id) ON DELETE CASCADE,
    funding_source VARCHAR(50) NOT NULL, -- 'ndis', 'state', 'other'
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ndis_plans_participant ON ndis_plans(participant_id);
CREATE INDEX IF NOT EXISTS idx_ndis_plans_status ON ndis_plans(plan_status);
CREATE INDEX IF NOT EXISTS idx_ndis_plans_dates ON ndis_plans(plan_start_date, plan_end_date);
CREATE INDEX IF NOT EXISTS idx_plan_budget_categories_plan ON plan_budget_categories(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_budget_categories_support_category ON plan_budget_categories(support_category_id);
