-- Migration: 005_price_guide.sql
-- Description: NDIS price guide and support item pricing tables

-- Price guide versions
CREATE TABLE IF NOT EXISTS price_guide_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_name VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    financial_year VARCHAR(10) NOT NULL, -- e.g. '2024-25'
    is_current BOOLEAN DEFAULT FALSE,
    source_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support item prices (by price guide version and state/territory)
CREATE TABLE IF NOT EXISTS support_item_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_guide_version_id UUID NOT NULL REFERENCES price_guide_versions(id) ON DELETE CASCADE,
    support_item_id UUID NOT NULL REFERENCES support_items(id) ON DELETE CASCADE,
    state_territory VARCHAR(10) NOT NULL DEFAULT 'National', -- 'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA', 'Remote', 'VeryRemote', 'National'
    price NUMERIC(10, 2) NOT NULL,
    price_limit NUMERIC(10, 2),
    non_face_to_face_price NUMERIC(10, 2),
    provider_travel_price NUMERIC(10, 2),
    short_notice_cancellation_price NUMERIC(10, 2),
    ndis_requested_reports_price NUMERIC(10, 2),
    irregular_supports_price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(price_guide_version_id, support_item_id, state_territory)
);

-- Plan line items (actual service bookings/claims)
CREATE TABLE IF NOT EXISTS plan_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_budget_category_id UUID NOT NULL REFERENCES plan_budget_categories(id) ON DELETE CASCADE,
    support_item_id UUID NOT NULL REFERENCES support_items(id),
    provider_id UUID REFERENCES providers(id),
    service_booking_number VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    claim_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'cancellation', 'travel', 'non_face_to_face'
    claim_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'submitted', 'approved', 'rejected', 'paid'
    invoice_number VARCHAR(100),
    payment_date DATE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price guide import log
CREATE TABLE IF NOT EXISTS price_guide_import_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_guide_version_id UUID REFERENCES price_guide_versions(id),
    import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    imported_by UUID REFERENCES users(id),
    records_processed INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_price_guide_versions_current ON price_guide_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_price_guide_versions_year ON price_guide_versions(financial_year);
CREATE INDEX IF NOT EXISTS idx_support_item_prices_version ON support_item_prices(price_guide_version_id);
CREATE INDEX IF NOT EXISTS idx_support_item_prices_item ON support_item_prices(support_item_id);
CREATE INDEX IF NOT EXISTS idx_plan_line_items_budget_category ON plan_line_items(plan_budget_category_id);
CREATE INDEX IF NOT EXISTS idx_plan_line_items_provider ON plan_line_items(provider_id);
CREATE INDEX IF NOT EXISTS idx_plan_line_items_status ON plan_line_items(claim_status);
CREATE INDEX IF NOT EXISTS idx_plan_line_items_dates ON plan_line_items(start_date, end_date);
