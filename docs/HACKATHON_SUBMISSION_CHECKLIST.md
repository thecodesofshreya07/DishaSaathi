# DishaSaathi — Hackathon Submission Checklist

This checklist confirms the operational readiness of **DishaSaathi** across product, reliability, security, deployment, and presentation dimensions.

---

## 1. Product Capabilities
- [x] **Landing Page**: Clean civic hero banner, Gateway of India monument artwork, value proposition, and prominent *"Create My Roadmap"* primary CTA.
- [x] **Goal Intake**: Natural-language query intake with city/state auto-mapping, representative suggestion pills, and context notes.
- [x] **Roadmap Generation**: 4-stage generation loader resolving intent, jurisdiction, statutory prerequisites, and document requirements.
- [x] **Jurisdiction Awareness**: Clear scope labeling (`Mumbai Municipal Guidance`, `Maharashtra State Guidance`, or `National Guidance`) and strict boundary isolation (e.g. BMC health license excluded for Bengaluru).
- [x] **"YOUR NEXT STEP" Card**: Prominent banner highlighting the immediate priority with active pulse indicator and statutory *"Why this matters"* explanation.
- [x] **Document Intelligence**: Checklist categorized into Identity, Address, Premises, and Enterprise proofs with live progress tracking and zero orphan documents.
- [x] **Dependency DAG Graph**: Directed acyclic graph enforcement with DFS cycle detection and visual ReactFlow interactive modal.
- [x] **Grounded Civic Copilot**: Contextual assistance answering *"What should I do next?"*, *"What documents am I missing?"*, and *"What can I do in parallel?"* with verified citations.
- [x] **Official Source Grounding**: Every procedure links to an official `.gov.in` portal with statutory act citations and verification tier badges.
- [x] **Regulatory Change Detection**: Simulated gazette update pipeline featuring side-by-side **Semantic Diff ("What Changed?")** and one-click roadmap sync.
- [x] **Demo Mode Toolbar**: Persistent top bar allowing one-click scenario switching across 4 scenarios and instant baseline reset.

---

## 2. Reliability & Resilience
- [x] **AI Offline Fallback**: Deterministic local regex parser extracts entities seamlessly when external AI APIs are unreachable.
- [x] **Ambiguous Goal Handling**: Input `"I want to start a business"` requests clarification without guessing or generating arbitrary roadmaps.
- [x] **Unknown Goal Handling**: Input `"I need help."` returns targeted clarification suggestions rather than hallucinating requirements.
- [x] **Storage Resilience (`DATA_VERSION = 1`)**: Stale or corrupted `localStorage` state is safely discarded without crashing React.
- [x] **React Error Boundaries**: `<ErrorBoundary>` wraps the main roadmap pipeline and copilot drawer to isolate runtime errors.
- [x] **Page Refresh Continuity**: Marking steps completed or checking documents survives full browser refresh (`F5`).

---

## 3. Security & Privacy
- [x] **Zero Committed Secrets**: `.env` is strictly ignored in `.gitignore`; `.env.example` provides variable names only.
- [x] **Clean Repository Scan**: Automated search confirms zero exposed API keys, private tokens, or database passwords in tracked files.
- [x] **Safe URL Rendering**: External links open via secure `target="_blank"` with `rel="noopener noreferrer"`.
- [x] **No Personal Data Collected**: Fully anonymous, zero signup required for citizens to chart their civic roadmaps.

---

## 4. Deployment Readiness
- [x] **Production Builds Passing**: Both `npm run build:server` and `npm run build:client` compile with exit code 0.
- [x] **Unified Root Build**: `npm run build` from project root builds both tiers in parallel in under 3 seconds.
- [x] **SPA Routing Fallback**: Server automatically serves compiled client bundles and routes non-API requests to `index.html`.
- [x] **Live Health Check**: `GET /api/health` returns healthy JSON service metadata.
- [x] **Operational Documentation**: Complete deployment architecture and troubleshooting detailed in `docs/DEPLOYMENT.md`.

---

## 5. Presentation & Judging
- [x] **Deterministic Primary Demo**: Bakery in Mumbai setup loads reliably every time.
- [x] **One-Click Demo Reset**: Reset button instantly returns active journey to clean baseline.
- [x] **Presentation Mode**: One-click toggle maximizes readability for projectors by collapsing sidebars.
- [x] **Verbal Demo Pitch**: 2.5-minute script ready in `docs/JUDGE_DEMO_SCRIPT.md`.
- [x] **Comprehensive Readme**: Architectural diagrams, run instructions, and documentation index up to date in `README.md`.
