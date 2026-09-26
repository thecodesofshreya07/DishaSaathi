# DishaSaathi — Verification & Test Documentation

This document records the end-to-end verification and testing suite executed for **DishaSaathi** across Phase 6.

---

## 1. Automated Integration Test Suite (`test_phase6.js`)

All 29 integration tests pass with 100% compliance:

```bash
cd server
node test_phase6.js
```

### Test Results Breakdown:

| # | Test Suite / Category | Test Case | Status |
| :--- | :--- | :--- | :--- |
| 1 | **Canonical Data Model** | Every procedure contains `jurisdictionLevel`, `requiredDocuments`, `source.type`, `verificationStatus`, `whyRequired` | `PASS` |
| 2 | **Source Metadata Safety** | Verified procedures have valid HTTPS URLs pointing to real government domains (`*.gov.in`) | `PASS` |
| 3 | **Cycle Detection** | Graph validator detects circular dependency (`A -> B -> C -> A`) and rejects with diagnostic error | `PASS` |
| 4 | **Self-Dependency Detection** | Graph validator detects self-referencing step (`A -> A`) and rejects | `PASS` |
| 5 | **Missing Dependency ID** | Roadmap builder detects nonexistent dependency references and cleans them safely | `PASS` |
| 6 | **Sanitization & Versioning** | Roadmap sanitizer stamps `DATA_VERSION = 1` and isolates step documents | `PASS` |
| 7 | **Jurisdiction Boundary** | Bengaluru bakery query excludes BMC Health License and Maharashtra Gumasta | `PASS` |
| 8 | **Jurisdiction Scope** | Bengaluru roadmap is labeled `National Guidance`; Mumbai is labeled `Mumbai Municipal Guidance` | `PASS` |
| 9 | **Food Activity Isolation** | General business query (`"start a tech consulting firm"`) does not include FSSAI food registration | `PASS` |
| 10 | **Food Business Matching** | Bakery goal correctly includes FSSAI and assigns `DIRECT_MATCH` / `RELEVANT` | `PASS` |
| 11 | **Ambiguous Goal Detection** | Query `"I want to start a business"` triggers clarification request (`REQUIRES_CLARIFICATION`) | `PASS` |
| 12 | **Unknown Goal Detection** | Query `"I need help."` returns clarification prompt without generating a random roadmap | `PASS` |
| 13 | **Grounded Copilot: Documents** | Asking `"What documents do I need?"` returns response type `DOCUMENT_GUIDANCE` with exact roadmap docs | `PASS` |
| 14 | **Grounded Copilot: Next Action** | Asking `"What should I do next?"` returns response type `NEXT_ACTION` matching `currentStep` | `PASS` |
| 15 | **Grounded Copilot: Why Required** | Asking `"Why do I need Gumasta?"` returns legal basis (Section 6, Maharashtra Act 2017) | `PASS` |
| 16 | **Anti-Hallucination Guardrail** | Query about unverified domain (e.g. `"How do I build a spaceship?"`) returns `responseType: 'UNKNOWN'` | `PASS` |
| 17 | **Source Citations** | Factual responses include grounded `sources` array with official URLs | `PASS` |
| 18 | **Adaptive Engine: Primary Blocker** | Missing mandatory document is correctly identified as `primaryBlocker` | `PASS` |
| 19 | **Adaptive Engine: Parallel Actions** | Identifies independent available actions that can proceed concurrently | `PASS` |
| 20 | **Storage Resilience** | Stale or corrupt localStorage data is safely discarded without crashing React app | `PASS` |
| 21–25 | **Deterministic Demo Scenarios** | Bakery, Vehicle Transfer, Birth Certificate, Property Mutation load instantaneously without AI latency | `PASS` |
| 26–29 | **API Endpoint Fallback** | Fallback parser handles AI outage gracefully without breaking the user journey | `PASS` |

---

## 2. Journey Scenarios Tested

### Scenario 1: Primary Demo — Small Bakery in Mumbai
- **Input**: `"I want to start a small bakery in Mumbai"`
- **Parsed Intent**: `START_BUSINESS`
- **Location**: `Mumbai, Maharashtra, India`
- **Activity**: `FOOD_BUSINESS` (Bakery)
- **Jurisdiction Scope**: `Mumbai Municipal Guidance`
- **Selected Steps**:
  1. Maharashtra Gumasta (Shop & Establishment) Registration
  2. FSSAI Food Safety Registration / License
  3. BMC Health Trade License (MCGM)
  4. Mumbai Fire Brigade Safety NOC
- **Verification**: All steps are backed by official `.gov.in` URLs and statutory legal acts.

### Scenario 2: Jurisdiction Isolation — Bakery in Bengaluru
- **Input**: `"I want to start a bakery in Bengaluru"`
- **Result**:
  - Mumbai BMC Health License: **EXCLUDED**
  - Maharashtra Gumasta: **EXCLUDED**
  - FSSAI National Food License: **INCLUDED**
  - Scope Note: **National Guidance** (alerts user that city-specific municipal rules for Bengaluru require local BBMP verification).

### Scenario 3: Unknown Goal
- **Input**: `"I need help."`
- **Result**: System does not generate an arbitrary roadmap. It prompts:
  > *"What civic procedure or administrative goal would you like to accomplish? For example: starting a business, registering a vehicle, or applying for a certificate."*

### Scenario 4: Ambiguous Goal
- **Input**: `"I want to start a business"`
- **Result**: Flags `REQUIRES_CLARIFICATION`. Prompts the user:
  > *"What kind of business are you planning to start (e.g., bakery, retail store, IT services), and where will you operate it?"*

---

## 3. UI, Resilience & Responsive Validation

### Error Boundaries
- Implemented `<ErrorBoundary>` component in `client/src/components/ErrorBoundary.tsx`.
- Wrapped `<CivicJourneyPipeline />` and `<CivicCopilot />` on `RoadmapPage.tsx`.
- Verified that synthetic render errors in one panel do not crash the rest of the application.

### Viewport Audit:
- **390px (Mobile portrait)**: Navigation stacks cleanly, document checklist wraps without horizontal overflow, modal dialogs display full-width with touch-friendly tap targets.
- **768px (Tablet portrait)**: Two-column layout transitions smoothly; copilot drawer accessible.
- **1024px (Tablet landscape / small laptop)**: Side-by-side journey and copilot view with responsive grid.
- **1440px (Desktop)**: Full administrative dashboard with visual DAG graph, source panel, and sticky copilot.

### Accessibility Validation:
- Keyboard navigation: Full tab navigation through steps, document checkboxes, and copilot input.
- ARIA: Modals include accessible labels and close triggers.
- Contrast: Semantic status badges (Completed, In Progress, Blocked) use high-contrast color pairings paired with icon indicators.
