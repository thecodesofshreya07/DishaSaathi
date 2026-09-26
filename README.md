# DishaSaathi (PSWB02 — Municipal Bureaucracy Path Visualizer)

> **"Government processes shouldn't feel like a maze."**  
> DishaSaathi converts fragmented government information into a **clear, source-verified, dependency-aware civic roadmap** that actively guides citizens and updates when policies change.

---

## 🏛️ What is DishaSaathi?

* **Disha** = Direction  
* **Saathi** = Digital Companion  

Unlike generic AI chatbots that return unstructured, unverified, or hallucinated advice, **DishaSaathi structures civic journeys as end-to-end procedural pipelines**. It models:

$$\text{User Goal} \longrightarrow \text{Jurisdiction} \longrightarrow \text{Procedures} \longrightarrow \text{Official Evidence} \longrightarrow \text{Requirements} \longrightarrow \text{Documents} \longrightarrow \text{Dependencies} \longrightarrow \text{Adaptive Roadmap} \longrightarrow \text{Civic Copilot}$$

---

## 🌟 Key Differentiators

1. **Procedural Roadmap, Not Chat**: Generates structured, step-by-step administrative journeys with dependency sequencing and an interactive **ReactFlow DAG graph**.
2. **Strict Official Source Grounding**: Every procedure links to a verified government authority portal (`*.gov.in`) with statutory legal citations (e.g. Maharashtra Shops & Establishments Act 2017, FSSAI Act 2006).
3. **Jurisdiction Boundary Isolation**: Automatically isolates municipal and state-specific regulations. Mumbai BMC Health Licenses and Maharashtra Gumasta are excluded for non-Maharashtra cities, with transparent scope labels (*"Mumbai Municipal Guidance"*, *"National Guidance"*).
4. **Adaptive Next-Action Engine**: Evaluates active progress, identifies primary blockers (e.g., missing mandatory documents or unfinished prerequisite steps), and highlights available parallel tasks.
5. **Grounded Civic Copilot with Anti-Hallucination**: Employs structured response types (`ANSWER`, `DOCUMENT_GUIDANCE`, `NEXT_ACTION`, `UNKNOWN`) and explicitly declares when a query falls outside verified administrative records.
6. **Change Detection & Regulatory Diff**: Detects updates in government circulars, computes a semantic diff (*"What Changed?"*), and provides one-click roadmap synchronization.
7. **Deterministic Demo Mode**: Pre-configured civic journeys (Bakery in Mumbai, Vehicle Registration Transfer, Late Birth Certificate, Property Tax Mutation) load reliably with zero external AI latency.

---

## 🏗️ Architecture & AI Pipeline

```text
Frontend (React 19 + TypeScript + Tailwind CSS + ReactFlow)
    │
    ▼
Goal Intake & Entity Extraction (Gemini AI with Local Fallback Parser)
    │
    ▼
Jurisdiction Engine (Municipal / State / National Boundary Filtering)
    │
    ▼
Roadmap Builder & Graph Validator (DFS Cycle Detection & Document Binding)
    │
    ▼
Adaptive Engine & Progress State (DATA_VERSION = 1 & Safe LocalStorage)
    │
    ▼
Civic Copilot (RAG Grounding & Anti-Hallucination Guardrails)
    │
    ▼
Change Detection & Human-in-the-Loop Admin Layer
```

### AI & Grounding Architecture:
- **LLM Layer**: Used for natural language intent and entity parsing (`START_BUSINESS`, `VEHICLE_REGISTRATION`, etc.).
- **Deterministic Procedural Layer**: Procedures, legal acts, fees, and official links are stored in canonical, verified datasets. The AI model never invents administrative requirements.
- **Resilience**: If the AI model is unreachable, the system automatically falls back to local regex-based parsing without crashing.

---

## 🔒 Verification & Source Model

Every procedure step in DishaSaathi is categorized under strict verification standards:

| Status | Meaning |
| :--- | :--- |
| `OFFICIAL_VERIFIED` | Verified against gazette circulars or official online portals (`*.gov.in`) |
| `NEEDS_VERIFICATION` | Procedural step known, but fee or document list requires recent gazette re-check |
| `DEMO` | Prototype scenario clearly labeled for hackathon evaluation |

Source types are distinguished between `OFFICIAL_GOVERNMENT` (National), `OFFICIAL_DEPARTMENT` (State), `OFFICIAL_MUNICIPAL` (Urban Local Body), and `DEMO`.

---

## ⚙️ Environment Configuration

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
# Optional: GEMINI_API_KEY=your_gemini_api_key_here (falls back to local parser if omitted)
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Locally

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 2. Server Setup
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Client Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Running the Verification & Test Suite
```bash
cd server
node test_phase6.js
```
Runs all 29 integration and reliability tests (100% pass rate).

---

## 🎯 Demo Walkthrough for Judges

1. **Landing Page**: View the civic hero banner with Mumbai heritage styling and the core mission: *"Government processes shouldn't feel like a maze."*
2. **Goal Intake**: Enter `"I want to start a small bakery in Mumbai"` or pick a pre-configured scenario from the Demo Toolbar.
3. **Jurisdiction-Aware Roadmap**: Observe the 4-step pipeline stamped with `Mumbai Municipal Guidance` and verified `.gov.in` source badges.
4. **"Why Do I Need This?"**: Click any step to inspect the statutory legal basis (e.g. Maharashtra Act 2017 Section 6).
5. **Dependency Validation**: Notice steps marked `Blocked` until preceding prerequisites are finished.
6. **Document Readiness**: Check off documents in the checklist and watch the Adaptive Engine recalculate the next action.
7. **Civic Copilot**: Ask *"What documents do I need?"* or *"What should I do next?"* to receive grounded, source-cited responses.
8. **Anti-Hallucination**: Ask an out-of-domain question (e.g. *"How do I build a spaceship?"*) to observe the assistant decline responsibly.
9. **Persistence**: Refresh the page — all roadmap progress, document checks, and active steps are preserved via schema-validated storage.

---

## ⚠️ Known Limitations
1. **Curated Geographic Scope**: For the hackathon demonstration, verified procedures are fully populated for Mumbai (Maharashtra) and core national procedures (FSSAI, GST, MSME, Parivahan). Other cities trigger graceful fallback to national-level guidance.
2. **Statutory Variation**: Municipal rules frequently vary by municipal ward or zone; citizens should verify ward-specific physical inspection schedules directly with the local ward office.
3. **Prototype Status**: DishaSaathi is an open civic-tech prototype developed for a hackathon and is not an official government service.

---

## 📚 Project Documentation Index

- **[Complete Project & Architecture Guide](docs/COMPLETE_PROJECT_GUIDE.md)**: **Master Reference** detailing all functionality, every button, all modals, data flows, and behind-the-scenes algorithms.
- **[Hackathon Submission Checklist](docs/HACKATHON_SUBMISSION_CHECKLIST.md)**: Product, reliability, security, and judging verification checklist.
- **[Final Project State Snapshot](docs/FINAL_PROJECT_STATE.md)**: Product release status, capabilities snapshot, and deployment readiness.
- **[Hackathon Demo Guide](docs/HACKATHON_DEMO.md)**: End-to-end demo walkthrough, pitch, differentiators, and trust model.
- **[Judge Presentation Script](docs/JUDGE_DEMO_SCRIPT.md)**: Structured 2.5-minute verbal demo pitch script.
- **[System Architecture](docs/ARCHITECTURE.md)**: Pipeline layers, entity parsing, dependency validation, and copilot grounding.
- **[Civic Data Specification](docs/CIVIC_DATA.md)**: Canonical procedure schema, source tiers, jurisdiction boundaries, and document rules.
- **[Testing & Reliability Report](docs/TESTING.md)**: Matrix of automated integration tests, responsive audit, and accessibility compliance.
- **[Deployment & Operations Guide](docs/DEPLOYMENT.md)**: Production build steps, environment variables, SPA routing, and health checks.
- **[Product Specification](docs/PRODUCT_SPEC.md)**: Comprehensive hackathon functional specification (PSWB02).
