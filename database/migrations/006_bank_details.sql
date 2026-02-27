-- Migration: 006_bank_details.sql
-- Description: Bank details for participants and providers (for payment processing)

-- Bank accounts table (shared for participants and providers)
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL, -- 'participant', 'provider'
    entity_id UUID NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    bsb VARCHAR(10) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    account_type VARCHAR(50) DEFAULT 'savings', -- 'savings', 'cheque', 'transaction'
    is_primary BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_date DATE,
    verified_by UUID REFERENCES users(id),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment schedules for plan-managed participants
CREATE TABLE IF NOT EXISTS payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id) ON DELETE CASCADE,
    schedule_name VARCHAR(255),
    frequency VARCHAR(50) NOT NULL DEFAULT 'monthly', -- 'weekly', 'fortnightly', 'monthly', 'quarterly', 'as_needed'
    next_payment_date DATE,
    last_payment_date DATE,
    payment_amount NUMERIC(12, 2),
    bank_account_id UUID REFERENCES bank_accounts(id),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_line_item_id UUID REFERENCES plan_line_items(id),
    payment_schedule_id UUID REFERENCES payment_schedules(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'payment', 'refund', 'adjustment'
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL,
    reference_number VARCHAR(100),
    bank_account_id UUID REFERENCES bank_accounts(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'reversed'
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NDIS payment request records (for plan-managed participants)
CREATE TABLE IF NOT EXISTS ndis_payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ndis_plans(id),
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    support_item_id UUID REFERENCES support_items(id),
    provider_id UUID REFERENCES providers(id),
    claim_reference VARCHAR(100),
    service_start_date DATE NOT NULL,
    service_end_date DATE NOT NULL,
    hours NUMERIC(8, 2),
    unit_price NUMERIC(10, 2) NOT NULL,
    gst_applicable BOOLEAN DEFAULT FALSE,
    total_amount NUMERIC(12, 2) NOT NULL,
    claim_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'submitted', 'approved', 'rejected', 'paid'
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bank_accounts_entity ON bank_accounts(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_primary ON bank_accounts(entity_type, entity_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_payment_schedules_plan ON payment_schedules(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_line_item ON payment_transactions(plan_line_item_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_ndis_payment_requests_plan ON ndis_payment_requests(plan_id);
CREATE INDEX IF NOT EXISTS idx_ndis_payment_requests_status ON ndis_payment_requests(claim_status);
