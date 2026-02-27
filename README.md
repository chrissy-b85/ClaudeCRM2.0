# ClaudeCRM2.0 — NDIS CRM Development Specification

A comprehensive CRM system specification and database schema for NDIS (National Disability Insurance Scheme) support coordination and service management.

---

## Repository Structure

```
ClaudeCRM2.0/
├── database/
│   ├── migrations/          ← SQL migration files (run in order)
│   │   ├── 001_initial_setup.sql
│   │   ├── 002_ndis_plan_categories.sql
│   │   ├── 003_ndis_plan_goals_notes.sql
│   │   ├── 004_support_category_groups.sql
│   │   ├── 005_price_guide.sql
│   │   ├── 006_bank_details.sql
│   │   ├── 007_service_agreements.sql
│   │   ├── 008_participant_documents.sql
│   │   └── 009_participant_communications.sql
│   └── seeds/               ← Reference/seed data (run after migrations)
│       ├── 001_pace_categories.sql
│       └── 002_proda_categories.sql
├── docs/
│   └── specs/               ← Feature and module specifications
│       ├── participant-profile-complete.txt
│       ├── service-agreements-spec.txt
│       ├── pace-budget-mapping.txt
│       ├── proda-budget-mapping.txt
│       ├── price-guide-module.txt
│       ├── ndis-plan-budget-tab.txt
│       └── add-ndis-plan-modal.txt
└── README.md
```

---

## Database Migrations

Migrations should be run in order against a PostgreSQL database. Each file is idempotent (safe to re-run).

| File | Description |
|------|-------------|
| `001_initial_setup.sql` | Core tables: users, participants, providers, contacts, audit log |
| `002_ndis_plan_categories.sql` | NDIS plans, support categories, plan budget allocations |
| `003_ndis_plan_goals_notes.sql` | Plan goals, progress notes, case notes, plan review notes |
| `004_support_category_groups.sql` | Support category groups, support items, registration groups, PACE/PRODA mappings |
| `005_price_guide.sql` | Price guide versions, support item prices, plan line items |
| `006_bank_details.sql` | Bank accounts, payment schedules, payment transactions, NDIS payment requests |
| `007_service_agreements.sql` | Service agreements, agreement line items, amendments, service bookings |
| `008_participant_documents.sql` | Document categories, participant documents, access log, templates |
| `009_participant_communications.sql` | Communications log, tasks, appointments, notifications |

### Running Migrations

```bash
# Run all migrations in order
for f in database/migrations/*.sql; do
  psql -U your_user -d your_database -f "$f"
done

# Or individually
psql -U your_user -d your_database -f database/migrations/001_initial_setup.sql
```

---

## Seed Data

Seed files populate reference data required for the system to function.

| File | Description |
|------|-------------|
| `001_pace_categories.sql` | NDIS support categories and PACE budget groupings |
| `002_proda_categories.sql` | PRODA/myplace category mappings and provider registration groups |

### Running Seeds

```bash
# Run seeds after all migrations
for f in database/seeds/*.sql; do
  psql -U your_user -d your_database -f "$f"
done
```

---

## Documentation & Specifications

| File | Description |
|------|-------------|
| `participant-profile-complete.txt` | Full specification for the participant profile view |
| `service-agreements-spec.txt` | Service agreement lifecycle, fields, and validation rules |
| `pace-budget-mapping.txt` | PACE system budget structure and CRM field mapping |
| `proda-budget-mapping.txt` | PRODA/myplace integration, service bookings and claim mapping |
| `price-guide-module.txt` | NDIS price guide import, lookup and validation module spec |
| `ndis-plan-budget-tab.txt` | Plan budget tab UI specification with PACE budget view |
| `add-ndis-plan-modal.txt` | Add NDIS plan multi-step modal specification |

---

## Technology Stack

- **Database**: PostgreSQL 14+
- **UUID**: `uuid-ossp` extension required
- **Backend**: (TBD - Node.js / Python / PHP)
- **Frontend**: (TBD - React / Vue)

---

## NDIS Context

This CRM is designed for **NDIS Support Coordination** organisations. Key concepts:

- **NDIS**: National Disability Insurance Scheme (Australia)
- **Participant**: Person with a disability who has an approved NDIS plan
- **Plan**: NDIS-funded budget allocated to a participant for a plan period (typically 12 months)
- **Support Categories**: 15 categories of supports (Core, Capital, Capacity Building)
- **PACE**: NDIS's internal planning and budget management system
- **PRODA**: Government identity system for accessing NDIS provider portals
- **Plan Managed**: A registered plan manager handles invoicing and claims on participant's behalf
- **Agency Managed**: NDIS directly pays providers (no invoices to participant)
- **Self Managed**: Participant pays providers directly and claims reimbursement from NDIS

---

## Licence

Proprietary — internal development specification. Not for public distribution.
