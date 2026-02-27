-- Migration: 008_participant_documents.sql
-- Description: Participant document management tables

-- Document categories
CREATE TABLE IF NOT EXISTS document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_description TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    retention_years INTEGER DEFAULT 7,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default document categories
INSERT INTO document_categories (category_name, category_description, is_required, retention_years, sort_order)
VALUES
    ('NDIS Plan', 'Official NDIS plan documents', TRUE, 7, 1),
    ('Support Plans', 'Participant support and care plans', TRUE, 7, 2),
    ('Assessment Reports', 'Allied health and specialist assessment reports', FALSE, 7, 3),
    ('Identity Documents', 'Identification documents (redacted)', TRUE, 7, 4),
    ('Medical Reports', 'Medical and health reports', FALSE, 7, 5),
    ('Service Agreements', 'Signed service agreements', TRUE, 7, 6),
    ('Invoices', 'Provider invoices and receipts', TRUE, 7, 7),
    ('Correspondence', 'Letters and email correspondence', FALSE, 7, 8),
    ('Consent Forms', 'Signed consent forms', TRUE, 7, 9),
    ('Meeting Notes', 'Notes from participant meetings', FALSE, 7, 10),
    ('Other', 'Other documents', FALSE, 7, 99)
ON CONFLICT (category_name) DO NOTHING;

-- Participant documents
CREATE TABLE IF NOT EXISTS participant_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES ndis_plans(id),
    service_agreement_id UUID REFERENCES service_agreements(id),
    document_category_id UUID REFERENCES document_categories(id),
    document_name VARCHAR(500) NOT NULL,
    document_type VARCHAR(50), -- MIME type
    file_extension VARCHAR(20),
    file_size_bytes BIGINT,
    storage_path VARCHAR(1000),
    storage_provider VARCHAR(50) DEFAULT 'local', -- 'local', 's3', 'azure', 'gcs'
    original_filename VARCHAR(500),
    description TEXT,
    document_date DATE,
    expiry_date DATE,
    is_confidential BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'all_staff', -- 'all_staff', 'coordinator_only', 'admin_only'
    uploaded_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document access log
CREATE TABLE IF NOT EXISTS document_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES participant_documents(id) ON DELETE CASCADE,
    accessed_by UUID NOT NULL REFERENCES users(id),
    access_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'update', 'delete'
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    notes TEXT
);

-- Document templates (reusable document templates)
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255) NOT NULL,
    template_category VARCHAR(100),
    template_type VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'docx', 'html'
    storage_path VARCHAR(1000),
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participant_documents_participant ON participant_documents(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_documents_plan ON participant_documents(plan_id);
CREATE INDEX IF NOT EXISTS idx_participant_documents_category ON participant_documents(document_category_id);
CREATE INDEX IF NOT EXISTS idx_participant_documents_expiry ON participant_documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_document_access_log_document ON document_access_log(document_id);
CREATE INDEX IF NOT EXISTS idx_document_access_log_user ON document_access_log(accessed_by);
