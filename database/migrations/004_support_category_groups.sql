-- Migration: 004_support_category_groups.sql
-- Description: Support category groupings aligned with NDIS PACE and PRODA systems

-- Support category groups (high-level groupings)
CREATE TABLE IF NOT EXISTS support_category_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_code VARCHAR(20) UNIQUE NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    group_description TEXT,
    support_purpose VARCHAR(50) NOT NULL, -- 'daily_activities', 'social_participation', 'capacity_building', 'capital'
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support items (specific line items within categories)
CREATE TABLE IF NOT EXISTS support_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    support_category_id UUID NOT NULL REFERENCES support_categories(id),
    support_category_group_id UUID REFERENCES support_category_groups(id),
    item_number VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(500) NOT NULL,
    item_description TEXT,
    unit_of_measure VARCHAR(50) DEFAULT 'H', -- H=hourly, EA=each, D=daily, WK=weekly, MON=monthly, YR=yearly, job
    registration_group_id VARCHAR(50),
    support_purpose VARCHAR(50),
    is_provider_travel BOOLEAN DEFAULT FALSE,
    is_non_face_to_face BOOLEAN DEFAULT FALSE,
    is_irregular_supports BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registration groups (NDIS provider registration groups)
CREATE TABLE IF NOT EXISTS registration_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_number VARCHAR(20) UNIQUE NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    group_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support item to registration group mapping
CREATE TABLE IF NOT EXISTS support_item_registration_groups (
    support_item_id UUID NOT NULL REFERENCES support_items(id) ON DELETE CASCADE,
    registration_group_id UUID NOT NULL REFERENCES registration_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (support_item_id, registration_group_id)
);

-- PACE support category mappings
CREATE TABLE IF NOT EXISTS pace_category_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    support_category_id UUID NOT NULL REFERENCES support_categories(id),
    pace_budget_name VARCHAR(255) NOT NULL,
    pace_support_category_number INTEGER NOT NULL,
    pace_support_category_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODA support category mappings
CREATE TABLE IF NOT EXISTS proda_category_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    support_category_id UUID NOT NULL REFERENCES support_categories(id),
    proda_budget_name VARCHAR(255) NOT NULL,
    proda_support_category_number INTEGER NOT NULL,
    proda_support_category_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_items_category ON support_items(support_category_id);
CREATE INDEX IF NOT EXISTS idx_support_items_number ON support_items(item_number);
CREATE INDEX IF NOT EXISTS idx_pace_category_mappings_category ON pace_category_mappings(support_category_id);
CREATE INDEX IF NOT EXISTS idx_proda_category_mappings_category ON proda_category_mappings(support_category_id);
