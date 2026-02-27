-- Migration: 007_service_agreements.sql
-- Description: Service agreements between participants and providers

-- Service agreements
CREATE TABLE IF NOT EXISTS service_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id),
    plan_id UUID REFERENCES ndis_plans(id),
    agreement_number VARCHAR(100),
    agreement_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'block_booking', 'service_booking'
    title VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_signature', 'active', 'expired', 'terminated', 'suspended'
    total_value NUMERIC(12, 2),
    cancellation_policy TEXT,
    cancellation_notice_days INTEGER DEFAULT 7,
    payment_terms TEXT,
    dispute_resolution TEXT,
    special_conditions TEXT,
    participant_signed_date DATE,
    participant_signed_by VARCHAR(255),
    provider_signed_date DATE,
    provider_signed_by VARCHAR(255),
    termination_date DATE,
    termination_reason TEXT,
    terminated_by UUID REFERENCES users(id),
    review_date DATE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service agreement line items (services included in the agreement)
CREATE TABLE IF NOT EXISTS service_agreement_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_agreement_id UUID NOT NULL REFERENCES service_agreements(id) ON DELETE CASCADE,
    support_item_id UUID NOT NULL REFERENCES support_items(id),
    support_category_id UUID REFERENCES support_categories(id),
    description TEXT,
    frequency VARCHAR(100),
    hours_per_week NUMERIC(6, 2),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_hours NUMERIC(10, 2),
    total_amount NUMERIC(12, 2),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service agreement amendments
CREATE TABLE IF NOT EXISTS service_agreement_amendments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_agreement_id UUID NOT NULL REFERENCES service_agreements(id) ON DELETE CASCADE,
    amendment_number INTEGER NOT NULL DEFAULT 1,
    amendment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amendment_reason TEXT,
    changes_summary TEXT,
    old_values JSONB,
    new_values JSONB,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES users(id),
    approved_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service bookings (NDIS portal service booking records)
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_agreement_id UUID REFERENCES service_agreements(id),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    support_category_id UUID NOT NULL REFERENCES support_categories(id),
    ndis_booking_number VARCHAR(100),
    booking_start_date DATE NOT NULL,
    booking_end_date DATE NOT NULL,
    allocated_amount NUMERIC(12, 2) NOT NULL,
    remaining_amount NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'exhausted'
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_agreements_participant ON service_agreements(participant_id);
CREATE INDEX IF NOT EXISTS idx_service_agreements_provider ON service_agreements(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_agreements_plan ON service_agreements(plan_id);
CREATE INDEX IF NOT EXISTS idx_service_agreements_status ON service_agreements(status);
CREATE INDEX IF NOT EXISTS idx_service_agreement_items_agreement ON service_agreement_items(service_agreement_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_plan ON service_bookings(plan_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider ON service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON service_bookings(status);
