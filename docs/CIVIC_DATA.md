# DishaSaathi — Civic Data Specification

This document details the canonical civic data model, verification statuses, source classification, jurisdiction hierarchy, and data governance rules implemented in **DishaSaathi**.

---

## 1. Canonical Procedure Data Model

DishaSaathi unifies civic procedures across the roadmap builder, dependency graph, document checklists, next-action engine, and civic copilot into a single canonical definition:

```typescript
export interface CivicProcedure {
  id: string;                     // e.g. 'proc-gumasta-shop'
  title: string;                  // e.g. 'Maharashtra Shop & Establishment Registration'
  description: string;            // Plain-language administrative summary
  category: string;               // e.g. 'Legal & Licensing', 'Food Business'
  department: string;             // e.g. 'Labour Department, Govt of Maharashtra'
  jurisdictionLevel: JurisdictionLevel; // 'National' | 'State' | 'Municipal'
  state?: string;                 // e.g. 'Maharashtra'
  city?: string;                  // e.g. 'Mumbai'
  appliesTo: string[];            // Keyword triggers: ['business', 'shop', 'bakery']
  whyRequired: string;            // Legal grounding (Act, section, or municipal circular)
  legalBasis?: {
    act: string;                  // e.g. 'Maharashtra Shops and Establishments Act, 2017'
    section?: string;             // e.g. 'Section 6'
    circularNumber?: string;
  };
  requiredDocuments: CivicDocumentRequirement[];
  dependsOn: string[];            // Prerequisite procedure IDs
  fee: {
    amount: string;
    description?: string;
    isExempt?: boolean;
  };
  processingTime: string;
  applicationMode: 'Online' | 'Offline' | 'Hybrid';
  applicationUrl: string;         // Verified official departmental URL
  source: SourceEvidence;         // Grounded source metadata
  verificationStatus: VerificationStatus;
  lastVerified: string;           // ISO 8601 date string
  confidence?: MatchConfidence;   // DIRECT_MATCH | RELEVANT | REQUIRES_CLARIFICATION
}
```

---

## 2. Source Classification & Verification Model

To eliminate hallucinations and prevent unofficial or fabricated claims from misleading citizens, every procedure step must link to an official or clearly labeled demo source.

### Source Types (`SourceType`)

| Source Type | Description | Allowed Domains |
| :--- | :--- | :--- |
| `OFFICIAL_GOVERNMENT` | Apex national government portals | `*.gov.in`, `*.nic.in` |
| `OFFICIAL_DEPARTMENT` | State department online service portals | `*.maharashtra.gov.in`, `*.karnataka.gov.in` |
| `OFFICIAL_MUNICIPAL` | Urban Local Body (ULB) portals | `*.mcgm.gov.in`, `*.bbmp.gov.in` |
| `DEMO` | Prototype simulation data for testing | Stored local reference only |

### Verification Statuses (`VerificationStatus`)

* **`OFFICIAL_VERIFIED`**: Verified against official gazette notifications, municipal circulars, or live government portals.
* **`NEEDS_VERIFICATION`**: Procedural step is administratively known, but fee or document checklist is pending re-verification from the latest gazette.
* **`DEMO`**: Synthetic scenario used exclusively for hackathon demonstration purposes.

### Source Metadata Schema

```typescript
export interface SourceEvidence {
  title: string;               // Official title of the portal / regulation
  authority: string;           // E.g. 'Food Safety and Standards Authority of India (FSSAI)'
  url: string;                 // Real, verified HTTPS portal link
  type: SourceType;            // OFFICIAL_GOVERNMENT | OFFICIAL_DEPARTMENT | OFFICIAL_MUNICIPAL | DEMO
  lastVerified: string;        // Date verified
  confidenceScore?: number;
  verificationStatus: VerificationStatus;
  isAvailable?: boolean;       // Availability flag; if false, shows 'Official source currently unavailable'
}
```

---

## 3. Jurisdiction Engine & Scope Fallback

Procedures are bound to specific administrative tiers:

```text
Municipal (City-level, e.g. Mumbai BMC)
       ↓ (if no city-specific procedure)
State-level (e.g. Maharashtra Aaple Sarkar)
       ↓ (if no state-specific procedure)
National (e.g. FSSAI, GST, MSME Udyam)
```

### Jurisdiction Isolation Rules:
1. **No Municipal Leakage**: BMC Mumbai procedures (`proc-bmc-health-license`, `proc-fire-noc`) are strictly excluded if the selected city is outside Mumbai (e.g. Bengaluru, Pune, Delhi).
2. **No State Leakage**: State-specific legislation (e.g. Maharashtra Gumasta under the 2017 Act) is excluded for other states unless a national counterpart exists.
3. **Transparent Scope Labeling**: Every generated journey displays its `jurisdictionScope`:
   - `Mumbai Municipal Guidance` (Municipal + State + National)
   - `Maharashtra State Guidance` (State + National)
   - `National Guidance` (National procedures applicable pan-India)

---

## 4. Document Model & Bidirectional Relationship

Documents are not maintained independently from procedures. Every document references its parent procedure (`requiredFor`):

```typescript
export interface CivicDocumentRequirement {
  id: string;
  name: string;
  description: string;
  requiredFor: string;         // Procedure ID (must be a valid step in the journey)
  priority: 'Mandatory' | 'Conditional' | 'Optional';
  issuingAuthority?: string;
  whereToGet?: string;
  status: 'Ready' | 'Missing' | 'In Review';
}
```

### Integrity Rules:
- **Zero Orphan Documents**: The document checklist is derived exclusively from the steps active in the citizen's roadmap.
- **Prerequisite Blocking**: If a mandatory document for a step is missing, the next-action engine highlights the document as the primary blocker before the step can be marked completed.

---

## 5. Verified Dataset vs Demo Data Separation

| Procedure ID | Procedure Title | Authority | Jurisdiction | Status |
| :--- | :--- | :--- | :--- | :--- |
| `proc-fssai-reg` | FSSAI Food Business Registration | FSSAI (Govt of India) | National | `OFFICIAL_VERIFIED` |
| `proc-udyam-msme` | Udyam MSME Registration | Ministry of MSME | National | `OFFICIAL_VERIFIED` |
| `proc-gst-reg` | GST Registration | Goods & Services Tax Network | National | `OFFICIAL_VERIFIED` |
| `proc-gumasta-shop` | Maharashtra Gumasta License | Labour Dept, Govt of Maharashtra | State (Maharashtra) | `OFFICIAL_VERIFIED` |
| `proc-bmc-health-license` | BMC Health Trade License | Municipal Corp of Greater Mumbai | Municipal (Mumbai) | `OFFICIAL_VERIFIED` |
| `proc-fire-noc` | Mumbai Fire Brigade Safety NOC | Mumbai Fire Brigade (MCGM) | Municipal (Mumbai) | `OFFICIAL_VERIFIED` |
| `proc-vehicle-rc-transfer` | Parivahan Vehicle RC Transfer | MoRTH (Govt of India) | National / State | `OFFICIAL_VERIFIED` |
| `proc-birth-cert-delay` | Late Registration Birth Certificate | Dept of Health, MCGM | Municipal (Mumbai) | `OFFICIAL_VERIFIED` |
| `proc-property-mutation` | Property Tax Mutation | Revenue Dept, MCGM | Municipal (Mumbai) | `OFFICIAL_VERIFIED` |
| `proc-demo-bakery` | Fast-Track Demo Bakery Journey | DishaSaathi Hackathon Suite | Municipal (Mumbai) | `DEMO` |
