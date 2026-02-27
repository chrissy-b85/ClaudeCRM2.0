-- Seed: 001_pace_categories.sql
-- Description: NDIS PACE (Planning and Carer Expenses) support categories seed data
-- Source: NDIS Price Guide and PACE system budget categories

-- Insert NDIS support categories (PACE system)
INSERT INTO support_categories (category_number, name, short_name, support_purpose)
VALUES
    (1,  'Assistance with Daily Life', 'Daily Life', 'daily_activities'),
    (2,  'Transport', 'Transport', 'daily_activities'),
    (3,  'Consumables', 'Consumables', 'daily_activities'),
    (4,  'Assistance with Social, Economic and Community Participation', 'Social Participation', 'social_participation'),
    (5,  'Assistive Technology', 'Assistive Technology', 'capital'),
    (6,  'Home Modifications', 'Home Mods', 'capital'),
    (7,  'Support Coordination', 'Support Coord', 'capacity_building'),
    (8,  'Improved Living Arrangements', 'Living Arrangements', 'capacity_building'),
    (9,  'Increased Social and Community Participation', 'Community Participation', 'capacity_building'),
    (10, 'Finding and Keeping a Job', 'Employment', 'capacity_building'),
    (11, 'Improved Health and Wellbeing', 'Health Wellbeing', 'capacity_building'),
    (12, 'Improved Learning', 'Learning', 'capacity_building'),
    (13, 'Improved Life Choices', 'Life Choices', 'capacity_building'),
    (14, 'Improved Daily Living Skills', 'Daily Living Skills', 'capacity_building'),
    (15, 'Improved Relationships', 'Relationships', 'capacity_building')
ON CONFLICT (category_number) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    support_purpose = EXCLUDED.support_purpose,
    updated_at = NOW();

-- Insert PACE category mappings
-- PACE Budget 1: Core Supports
INSERT INTO pace_category_mappings (support_category_id, pace_budget_name, pace_support_category_number, pace_support_category_name)
SELECT
    sc.id,
    'Core Supports',
    sc.category_number,
    sc.name
FROM support_categories sc
WHERE sc.category_number IN (1, 2, 3, 4)
ON CONFLICT DO NOTHING;

-- PACE Budget 2: Capital Supports
INSERT INTO pace_category_mappings (support_category_id, pace_budget_name, pace_support_category_number, pace_support_category_name)
SELECT
    sc.id,
    'Capital Supports',
    sc.category_number,
    sc.name
FROM support_categories sc
WHERE sc.category_number IN (5, 6)
ON CONFLICT DO NOTHING;

-- PACE Budget 3: Capacity Building Supports
INSERT INTO pace_category_mappings (support_category_id, pace_budget_name, pace_support_category_number, pace_support_category_name)
SELECT
    sc.id,
    'Capacity Building',
    sc.category_number,
    sc.name
FROM support_categories sc
WHERE sc.category_number IN (7, 8, 9, 10, 11, 12, 13, 14, 15)
ON CONFLICT DO NOTHING;

-- Insert support category groups for PACE
INSERT INTO support_category_groups (group_code, group_name, group_description, support_purpose, sort_order)
VALUES
    ('PACE_CORE',    'PACE Core Supports',             'Core everyday supports including assistance with daily life, transport, consumables and social participation', 'daily_activities', 1),
    ('PACE_CAP',     'PACE Capital Supports',          'Capital items including assistive technology and home modifications', 'capital', 2),
    ('PACE_CB',      'PACE Capacity Building Supports','Supports to build skills and independence including support coordination', 'capacity_building', 3),
    ('PACE_CB_SC',   'Support Coordination',           'Support Coordination and Specialist Support Coordination', 'capacity_building', 4),
    ('PACE_CB_DL',   'Improved Daily Living',          'Therapy and training to increase skills for independence', 'capacity_building', 5),
    ('PACE_CB_EMP',  'Finding and Keeping a Job',      'Supports to help find and keep employment', 'capacity_building', 6),
    ('PACE_CORE_DA', 'Assistance with Daily Life',     'Personal care and community access supports', 'daily_activities', 7),
    ('PACE_CORE_T',  'Transport',                      'Transport to access community and services', 'daily_activities', 8),
    ('PACE_CORE_C',  'Consumables',                    'Everyday items needed because of disability', 'daily_activities', 9),
    ('PACE_CORE_SP', 'Social Participation',           'Supports to participate in social and community activities', 'social_participation', 10)
ON CONFLICT (group_code) DO UPDATE SET
    group_name = EXCLUDED.group_name,
    group_description = EXCLUDED.group_description,
    updated_at = NOW();
