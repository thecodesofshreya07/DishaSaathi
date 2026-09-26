# DishaSaathi — Hackathon Demo Guide

---

## 1. One-Line Pitch

> **DishaSaathi transforms a citizen's natural-language goal into a verified, jurisdiction-aware, dependency-ordered civic roadmap backed by official government evidence.**

---

## 2. The Problem

Citizens and small business entrepreneurs in India navigate a fragmented administrative maze:
- **Dispersed Portals**: Rules and licenses are scattered across central ministries (FSSAI, GSTN, MSME), state departments (Labour Commissionerate, Revenue), and municipal corporations (BMC/MCGM, Health, Fire).
- **Hidden Dependencies**: Citizens discover that Step C is blocked by Step A only after standing in line or having an application rejected by a municipal officer.
- **Unverified Chatbot Advice**: Generic AI chatbots produce hallucinated requirements, out-of-state rules, or fabricated fees that lead to regulatory non-compliance.

---

## 3. The Solution: DishaSaathi

DishaSaathi replaces unstructured text searches and generic chatbots with a **structured procedural pipeline**:
- Converts natural-language intent into an ordered procedural journey.
- Respects municipal and state jurisdiction boundaries.
- Models prerequisites as a directed acyclic graph (DAG).
- Assembles dynamic document checklists.
- Highlights the citizen's single **Next Best Action**.
- Connects every requirement to an official, verified government source (`*.gov.in`).

---

## 4. Main Demo Scenario

- **Goal**: *"I want to start a small bakery in Mumbai."*
- **Location**: Mumbai, Maharashtra, India
- **Activity**: Food Business / Bakery
- **Scope**: Mumbai Municipal Guidance

---

## 5. Step-by-Step Demo Sequence

### Scene 1: The Landing Experience
- Open `http://localhost:5173`.
- View the civic hero headline: *"Tell us what you want to do. We'll show you how to get there."*
- Click **"Create My Roadmap"**.

### Scene 2: Natural-Language Goal Intake
- Select or type: `"I want to start a small bakery in Mumbai."`
- Location auto-resolves to **State: Maharashtra**, **City: Mumbai**.
- Click **"Generate My Roadmap"**.
- Watch the 4-stage generation loader extract intent, filter jurisdiction, evaluate statutory dependencies, and assemble documents.

### Scene 3: The Interactive Civic Roadmap
- Arrive at `/roadmap`.
- Notice the **"Mumbai Municipal Guidance"** scope tag and verified government badges.
- Observe the **"YOUR NEXT STEP"** card clearly indicating the immediate priority:
  - Step 1: *Entity Constitution & Commercial PAN Allocation*.
  - *Why this matters*: Mandatory before commercial bank accounts or MSME registration can be opened.

### Scene 4: "Why Do I Need This?" & Official Evidence
- Click on **Step 3 (Maharashtra Gumasta License)**.
- In the detail modal, inspect:
  - **Legal Basis**: Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017.
  - **Document Checklist**: Check off documents (Aadhaar Card, Premises Electricity Bill) and watch the readiness percentage increase.
  - **Official Source**: Click *"View Official Source ↗"* to verify the link points to `lms.mahaonline.gov.in`.

### Scene 5: Blocked Step Detection
- Click on **Step 6 (Municipal Health Trade License)**.
- Note the **BLOCKED** status: The modal informs the user that Step 3 (Gumasta) and Step 4 (FSSAI) must be completed first.
- Prevents premature application and wasted municipal application fees.

### Scene 6: Contextual Civic Copilot
- Click **"Civic Copilot"** on the top toolbar or right drawer.
- Click the suggestion chip: *"What should I do next?"*
- Observe the grounded response citing the active step and required documents.
- Ask: *"What can I do in parallel?"*
- The copilot explains that FSSAI Registration and GSTIN application can proceed concurrently once the Gumasta certificate is issued.

### Scene 7: Anti-Hallucination & Trust
- Ask the Copilot an out-of-domain question: *"How do I buy rocket fuel?"*
- The Copilot answers honestly:
  > *"I don't have verified information about that in the current DishaSaathi knowledge base. Please check official authority portals before proceeding."*

### Scene 8: Progress Persistence
- Mark Step 1 as completed.
- Refresh the browser (`F5`).
- The journey instantly rehydrates with Step 1 completed, Step 2 highlighted as **CURRENT**, and document readiness preserved.

---

## 6. Key Differentiators

| Feature | Generic Chatbots | Static Checklists | DishaSaathi |
| :--- | :--- | :--- | :--- |
| **Output Type** | Wall of conversational text | Generic static PDF/list | Interactive, dependency-sequenced DAG roadmap |
| **Jurisdiction Boundary** | Frequently mixes state laws | Static or one-size-fits-all | Strict Municipal $\to$ State $\to$ National boundary isolation |
| **Prerequisites & Blockers** | Does not model dependencies | Does not enforce order | DFS-validated DAG preventing circular or impossible flows |
| **Evidence Grounding** | Uncited or hallucinated | Unlinked | Every procedure backed by verified `.gov.in` source |
| **Adaptive Next Step** | Citizen must reread everything | Static | Recalculates primary blocker and parallel shortcuts |

---

## 7. Role of AI vs Deterministic Systems

- **AI Layer (Gemini + Local Fallback Parser)**:
  - Understands ambiguous citizen queries and extracts entities (`domain`, `activity`, `scale`, `location`).
  - Formats conversational replies in the Civic Copilot.
- **Deterministic Procedural Layer**:
  - The procedure catalog, statutory acts, required document schemas, dependency DAGs, and source URLs are strictly deterministic.
  - **The AI never fabricates government requirements, fees, or legislation.**

---

## 8. Trust & Verification Hierarchy

1. **`OFFICIAL_VERIFIED`**: Cross-referenced against gazette notifications, municipal circulars, and live government portals.
2. **`NEEDS_VERIFICATION`**: Known procedure whose statutory schedule is pending recent gazette re-scrutiny.
3. **`DEMO`**: Prototype demonstration scenario clearly disclosed to the user.

---

## 9. Known Limitations

- **Geographic Coverage**: Deep municipal procedure catalogs are currently curated for Mumbai (MCGM/BMC) and pan-India national requirements. Other cities receive national guidance with advice to consult local ULBs.
- **Physical Ward Inspections**: Municipal officer scheduling depends on local ward administrative capacity; physical inspection dates must be booked directly with the ward office.
- **Prototype Status**: DishaSaathi is an open civic-tech hackathon prototype designed to demonstrate modern public digital infrastructure.
