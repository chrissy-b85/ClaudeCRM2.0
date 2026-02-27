-- Seed: 002_proda_categories.sql
-- Description: NDIS PRODA (Provider Registration and Online Directories and Agreements)
--              support categories and registration group seed data
-- Source: NDIS myplace provider portal and PRODA system

-- Insert PRODA category mappings aligned with myplace portal categories
INSERT INTO proda_category_mappings (support_category_id, proda_budget_name, proda_support_category_number, proda_support_category_name)
SELECT
    sc.id,
    CASE
        WHEN sc.category_number IN (1, 2, 3, 4) THEN 'Core Supports Budget'
        WHEN sc.category_number IN (5, 6)         THEN 'Capital Supports Budget'
        ELSE 'Capacity Building Budget'
    END AS proda_budget_name,
    sc.category_number,
    sc.name
FROM support_categories sc
ON CONFLICT DO NOTHING;

-- Insert NDIS registration groups (PRODA provider registration groups)
INSERT INTO registration_groups (group_number, group_name, group_description)
VALUES
    ('0101', 'Accommodation/Tenancy Assistance',          'Accommodation and tenancy assistance supports'),
    ('0102', 'Assistance with Daily Life Tasks in a Group or Shared Living Arrangement', 'Daily living in group/shared settings'),
    ('0103', 'Assistance with Daily Life Tasks in a Supported Living Environment',        'Supported accommodation assistance'),
    ('0104', 'Community Nursing Care',                    'Nursing care in the community'),
    ('0105', 'Assistance with Daily Personal Activities',  'Personal care and daily activity assistance'),
    ('0106', 'Assistance in Coordinating or Managing Life Stages, Transitions and Supports', 'Life stage transitions support'),
    ('0107', 'Specialist Support Coordination',           'Complex support coordination'),
    ('0108', 'Exercise Physiology and Personal Training', 'Exercise physiology services'),
    ('0110', 'Hearing Services',                          'Hearing assessment and services'),
    ('0112', 'Behaviour Support',                         'Positive behaviour support'),
    ('0113', 'Specialised Driver Training',               'Specialised driving lessons'),
    ('0114', 'Assistance with Travel and Transport',      'Travel and transport assistance'),
    ('0115', 'Assistive Technology – Maintenance, Repair and Rental', 'AT maintenance and repair'),
    ('0116', 'Innovative Community Participation',        'Innovative community inclusion supports'),
    ('0117', 'Development of Daily Living and Life Skills', 'Skills development for daily living'),
    ('0118', 'Assistance with Daily Life Tasks (Unregistered)', 'Unregistered daily life support'),
    ('0119', 'Therapeutic Supports',                      'Therapy services including OT, speech, psychology'),
    ('0120', 'Household Tasks',                           'Cleaning, gardening and household maintenance'),
    ('0121', 'Interpreting and Translating',              'Language interpretation and translation services'),
    ('0122', 'Specialised Hearing Services',              'Specialised hearing loss services'),
    ('0123', 'Specialised Mental Health Support Services', 'Specialised mental health services'),
    ('0124', 'High Intensity Daily Personal Activities', 'High-complexity personal care'),
    ('0125', 'Specialised Disability Accommodation',      'Specialist disability accommodation (SDA)'),
    ('0126', 'Specialised Support Coordination',          'Support coordination for complex situations'),
    ('0127', 'Early Childhood Early Intervention',        'Early childhood supports'),
    ('0128', 'Assistance Products for Personal Care and Safety', 'Personal care and safety aids'),
    ('0129', 'Customised Prosthetics',                    'Custom-made prosthetic devices'),
    ('0130', 'Daily Activities - Unregistered',           'Unregistered daily activities support'),
    ('0131', 'Supported Employment',                      'Assistance to find and maintain employment'),
    ('0132', 'Assistance to Access and Maintain Employment or Higher Education', 'Employment and education support'),
    ('0133', 'Management of Funding',                     'Plan management services'),
    ('0134', 'Support Coordination',                      'Support coordination services'),
    ('0136', 'Group and Centre Based Activities',         'Group day programs and centre-based activities'),
    ('0137', 'Specialised Hearing Services (Early Intervention)', 'Early intervention for hearing loss'),
    ('0138', 'Assistive Products for Household Tasks',    'Products to assist with household tasks'),
    ('0140', 'Specialised Driver Training',               'Specialised driver training/assessment')
ON CONFLICT (group_number) DO UPDATE SET
    group_name = EXCLUDED.group_name,
    group_description = EXCLUDED.group_description,
    updated_at = NOW();

-- PRODA support category groups
INSERT INTO support_category_groups (group_code, group_name, group_description, support_purpose, sort_order)
VALUES
    ('PRODA_CORE',    'PRODA Core Budget',              'Core supports budget in NDIS myplace portal',     'daily_activities', 11),
    ('PRODA_CAP',     'PRODA Capital Budget',           'Capital supports budget in NDIS myplace portal',  'capital', 12),
    ('PRODA_CB',      'PRODA Capacity Building Budget', 'Capacity building budget in NDIS myplace portal', 'capacity_building', 13),
    ('PRODA_PM',      'Plan Management',                'Funding for plan management (category 7 CB)',      'capacity_building', 14),
    ('PRODA_SDA',     'Specialist Disability Accommodation', 'SDA funding within capital supports',         'capital', 15),
    ('PRODA_SIL',     'Supported Independent Living',   'SIL funding within core supports',                'daily_activities', 16)
ON CONFLICT (group_code) DO UPDATE SET
    group_name = EXCLUDED.group_name,
    group_description = EXCLUDED.group_description,
    updated_at = NOW();

-- Insert initial price guide version (current year placeholder)
INSERT INTO price_guide_versions (version_name, effective_date, financial_year, is_current, notes)
VALUES
    ('NDIS Price Guide 2024-25', '2024-07-01', '2024-25', TRUE,
     'NDIS Support Catalogue and Price Guide effective 1 July 2024. See NDIS website for full catalogue.')
ON CONFLICT DO NOTHING;
