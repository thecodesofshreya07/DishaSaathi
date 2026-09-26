# DishaSaathi — Final Project State Snapshot

---

## 1. Product Identification
- **Name**: DishaSaathi (Municipal Bureaucracy Path Visualizer)
- **Problem Statement Code**: PSWB02
- **Current Version**: `1.0.0`
- **Release Status**: **FEATURE FROZEN & SUBMISSION READY**

---

## 2. Completed Capabilities

| Capability | Module / Layer | Implementation Status |
| :--- | :--- | :--- |
| **Natural Language Intake** | `GoalIntakePage.tsx` | Complete. Entity extraction with city/state mapping. |
| **AI Goal Understanding** | `goalParser.ts` | Complete. Gemini AI parsing with deterministic local regex fallback. |
| **Jurisdiction Boundary Engine** | `procedureMapper.ts` | Complete. Municipal $\to$ State $\to$ National boundary isolation and scope labeling. |
| **Dependency-Aware Roadmap** | `roadmapBuilder.ts` | Complete. DFS graph cycle detection, prerequisite sequencing, and step-binding. |
| **Document Intelligence** | `StepDetailModal.tsx` | Complete. Categorized checklists, live readiness scoring, and zero orphan documents. |
| **Visual DAG Graph** | `ReactFlowGraphModal.tsx` | Complete. Interactive ReactFlow diagram with zoom, pan, and minimap. |
| **Adaptive Next Best Action** | `adaptiveEngine.ts` | Complete. Recalculates blockers, parallel tasks, and primary action upon document toggle. |
| **Grounded Civic Copilot** | `copilotService.ts` | Complete. Structured response types, anti-hallucination guardrails, and `.gov.in` citations. |
| **Regulatory Change Detection** | `ChangeDetectionModal.tsx` | Complete. Gazette update simulation, semantic diff (*"What Changed?"*), and roadmap sync. |
| **Human-in-the-Loop Admin** | `AdminValidationModal.tsx` | Complete. Officer review queue for approving or rejecting regulatory updates. |
| **Persistence & Resilience** | `RoadmapContext.tsx` | Complete. Safe schema-validated `localStorage` sync with `DATA_VERSION = 1` checks. |
| **Deterministic Demo Suite** | `demoScenarios.ts` | Complete. Instant loading for Bakery, Vehicle, Property, and Certificate scenarios. |

---

## 3. Architecture Overview

```text
Citizen / User
    │
    ▼
Frontend Client (React 19 + TypeScript + Tailwind CSS + ReactFlow)
    │  HTTP / REST API (Port 5173 ➔ Port 5000)
    ▼
Backend API (Node.js + Express + TypeScript)
    ├── Goal Parser (Gemini API with Regex Fallback)
    ├── Procedure Knowledge Base (Grounded in Statutory Acts)
    ├── Jurisdiction Engine (Municipal, State, and National Tiers)
    ├── Roadmap Validator & Builder (DFS Cycle Detection, Document Binding)
    ├── Adaptive Engine (Dynamic Blockers & Parallel Action Discovery)
    ├── Civic Copilot (Grounding RAG Engine)
    └── Static SPA Serving & Fallback Layer
```

---

## 4. Role of AI vs Deterministic Systems

- **AI Responsibilities**:
  - Understanding conversational, unformatted user prompts (e.g. *"I want to open a small bakery from my home in Bandra"*).
  - Extracting high-level intent, domain, activity, location, and scale entities.
  - Generating polite, contextual conversational formatting in the Civic Copilot.
- **Deterministic System Responsibilities**:
  - The entire database of administrative procedures, statutory legislation (e.g. Maharashtra Act 2017 Section 6, FSSAI Act 2006), official portal links, fees, and processing times is **100% deterministic**.
  - Dependency DAG validation and prerequisite ordering are strictly mathematical (DFS cycle detection).
  - **The system never allows an LLM to hallucinate government fees, legal acts, or official URLs.**
- **Fallback Guarantee**:
  - If the AI model times out or the network is offline, the local regex parser extracts entities and builds the roadmap deterministically.

---

## 5. Civic Data & Verification Model

### Verification Statuses:
- **`OFFICIAL_VERIFIED`**: Cross-referenced against gazette notifications, municipal circulars, and live government portals (`*.gov.in`).
- **`NEEDS_VERIFICATION`**: Procedural step is administratively known, but fee or document schedule is pending recent gazette re-scrutiny.
- **`DEMO`**: Prototype demonstration scenario clearly disclosed to the user.

### Source Types:
- `OFFICIAL_GOVERNMENT` (National ministries, e.g. FSSAI, GSTN, MSME, MoRTH)
- `OFFICIAL_DEPARTMENT` (State departments, e.g. Maharashtra Labour, Revenue)
- `OFFICIAL_MUNICIPAL` (Urban Local Bodies, e.g. Brihanmumbai Municipal Corporation)
- `DEMO` (Clearly disclosed simulation data)

---

## 6. Primary Demo Walkthrough (Bakery in Mumbai)

1. **Intake**: Citizen inputs *"I want to start a small bakery in Mumbai"*.
2. **Analysis**: Parsed into Intent: `START_BUSINESS`, Domain: `FOOD_BUSINESS`, Location: `Mumbai, Maharashtra`.
3. **Roadmap**: 6-step ordered journey tagged with **"Mumbai Municipal Guidance"**.
4. **Next Best Action**: Prominently guides the user to assemble PAN and business constitution documents first.
5. **Prerequisite Enforcement**: Step 6 (BMC Health Trade License) is clearly marked **BLOCKED**, preventing premature application until Gumasta and FSSAI are approved.
6. **Copilot**: Citizen asks *"What can I do in parallel?"*, and the Copilot identifies concurrent tracks.

---

## 7. Actual Deployment Status

```text
DEPLOYMENT READY — EXTERNAL DEPLOYMENT STEP REMAINING
```
- The codebase builds cleanly in production mode with zero errors (`tsc -b && vite build` and `tsc`).
- The Express server is equipped with static SPA serving and client fallback routing.
- Deployment to cloud providers (e.g., Render, Railway, AWS, Docker, or Vercel) requires providing live cloud host credentials and configuring standard environment variables as documented in `docs/DEPLOYMENT.md`.

---

## 8. Honest Known Limitations

1. **Curated Geographic Scope**: Deep municipal bylaws are fully populated for Mumbai (MCGM/BMC) and national agencies. Other Indian cities trigger national guidance with advice to consult local municipal bodies.
2. **Physical Ward Inspections**: Municipal officer scheduling depends on local ward capacity; physical inspection dates must be scheduled directly with the ward office.
3. **Prototype Status**: DishaSaathi is an open civic-tech hackathon prototype designed to demonstrate modern public digital infrastructure.
