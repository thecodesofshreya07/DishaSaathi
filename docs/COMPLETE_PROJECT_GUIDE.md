# DishaSaathi — Complete Project & Architecture Guide
**Comprehensive Master Reference: Functionality, UI Elements, Data Flow & Behind-the-Scenes Architecture**

---

## 1. Executive Summary & Vision

### What is DishaSaathi?
* **Disha** (दिशा) = *Direction*  
* **Saathi** (साथी) = *Digital Companion / Guide*  
* **PSWB02**: Municipal Bureaucracy Path Visualizer

DishaSaathi is an open civic-tech guidance platform designed to solve the bureaucratic maze in India. When a citizen or entrepreneur wants to achieve a civic goal (such as opening a small bakery, registering a vehicle, constructing a home, or applying for a government certificate), they face:
1. **Departmental Fragmentation**: Procedures split across Central Ministries (FSSAI, GSTN, MSME), State Departments (Labour Commissionerate, Revenue), and Municipal Urban Local Bodies (BMC / MCGM, BBMP).
2. **Hidden Prerequisites**: Applying for Step C before completing Step A leads to rejected applications and lost municipal fees.
3. **Chatbot Hallucinations**: Generic AI chatbots output unstructured text, often citing regulations from the wrong state or fabricating nonexistent fees.

**DishaSaathi transforms natural-language citizen goals into a verified, jurisdiction-aware, dependency-ordered procedural roadmap backed by official government evidence.**

```text
Citizen Goal (Natural Language)
    │
    ▼
Goal Understanding & Entity Parsing (Gemini AI + Regex Fallback)
    │
    ▼
Jurisdiction Engine (Municipal / State / National Boundary Isolation)
    │
    ▼
Procedure Knowledge Base (Statutory Legislation & Gazette Rules)
    │
    ▼
Roadmap Builder & Graph Validator (DFS Cycle Detection & Document Binding)
    │
    ▼
Adaptive Next-Action Engine (Dynamic Blocker & Parallel Action Discovery)
    │
    ▼
Interactive UI & Civic Copilot (Grounded Assistant + ReactFlow DAG)
    │
    ▼
Regulatory Change Detection & Human-in-the-Loop Admin Review
```

---

## 2. Technology Stack & Repository Structure

### Technology Stack
- **Frontend**:
  - React 19 (`react`, `react-dom`)
  - TypeScript (strict type checking)
  - Vite (build tool & dev server with `/api` reverse proxy)
  - Tailwind CSS (responsive design & design tokens)
  - Lucide React (vector iconography)
  - ReactFlow (`reactflow` for interactive visual DAG rendering)
- **Backend**:
  - Node.js & Express
  - TypeScript (compiled via `tsc` to CommonJS / NodeNext)
  - CORS middleware
  - Built-in Static File Server (serves compiled `client/dist` in production with SPA fallback)
- **AI & Grounding**:
  - Google Gemini API (`@google/genai` / REST)
  - Local Deterministic Regex Parser (100% offline fallback)
  - Statutory Knowledge Base (FSSAI Act 2006, Maharashtra Act 2017, MMC Act 1888, Central Motor Vehicles Act 1988)

### Repository Directory Structure
```text
d:\DishaSaathi\
├── client/                     # Vite + React 19 Frontend
│   ├── src/
│   │   ├── components/         # 18 reusable UI components & modals
│   │   │   ├── CivicJourneyPipeline.tsx    # Core interactive roadmap view
│   │   │   ├── CivicCopilot.tsx            # Context-grounded AI copilot drawer
│   │   │   ├── StepDetailModal.tsx         # Detailed step modal with document checklist
│   │   │   ├── ReactFlowGraphModal.tsx     # Fullscreen interactive DAG graph
│   │   │   ├── DemoModeToolbar.tsx         # Top demo switcher & reset bar
│   │   │   ├── ChangeDetectionModal.tsx    # "What Changed?" semantic diff modal
│   │   │   ├── AdminValidationModal.tsx    # Civic officer review queue
│   │   │   ├── SourcesPanelModal.tsx       # Grounded official sources modal
│   │   │   ├── GoalRefinementModal.tsx     # Refine scale, city, or activity
│   │   │   ├── GenerationLoader.tsx        # 4-stage animated loading screen
│   │   │   ├── ErrorBoundary.tsx           # React error boundary
│   │   │   ├── Navbar.tsx                  # Global header with search & alerts
│   │   │   ├── Sidebar.tsx                 # Left navigation tabs
│   │   │   ├── RightSidebar.tsx            # Radial progress & updates feed
│   │   │   └── LandingPage/                # Landing page sections
│   │   │       ├── LandingNavbar.tsx
│   │   │       ├── LandingHero.tsx
│   │   │       ├── HowItWorks.tsx
│   │   │       ├── ExampleGoals.tsx
│   │   │       └── LandingFeatures.tsx
│   │   ├── context/
│   │   │   └── RoadmapContext.tsx          # Global state, API sync, localStorage
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx             # Public landing page (Route: /)
│   │   │   ├── GoalIntakePage.tsx          # Goal intake & location (Route: /create)
│   │   │   └── RoadmapPage.tsx             # Active roadmap dashboard (Route: /roadmap)
│   │   ├── types.ts                        # Shared TypeScript definitions
│   │   └── App.tsx                         # Client router & context provider
│   ├── vite.config.ts                      # Proxy /api to http://localhost:5000
│   └── package.json
├── server/                     # Express + TypeScript Backend
│   ├── src/
│   │   ├── data/
│   │   │   ├── seedData.ts                 # Initial regulatory updates
│   │   │   └── verifiedProcedures.ts       # Canonical statutory procedure dataset
│   │   ├── services/
│   │   │   ├── civic/
│   │   │   │   ├── goalParser.ts           # Gemini AI parser + local fallback
│   │   │   │   ├── procedureMapper.ts      # Jurisdiction isolation & procedure filter
│   │   │   │   ├── roadmapValidator.ts     # DFS cycle detection & document binding
│   │   │   │   ├── roadmapBuilder.ts       # Sequential roadmap assembly
│   │   │   │   ├── adaptiveEngine.ts       # Dynamic blockers & parallel action engine
│   │   │   │   ├── copilotService.ts       # Structured response types & RAG
│   │   │   │   └── demoScenarios.ts        # Deterministic hackathon scenarios
│   │   │   └── procedureEngine.ts          # Semantic diff & update comparison
│   │   ├── types.ts                        # Canonical backend data model
│   │   └── index.ts                        # Express server & REST API endpoints
│   ├── test_phase6.js                      # 29 automated integration tests
│   └── package.json
├── docs/                       # 10 comprehensive architectural & demo docs
└── README.md                   # Main project overview & documentation index
```

---

## 3. Page-by-Page & Button-by-Button Breakdown

### Page 1: Landing Page (`/`)
The landing page introduces citizens and evaluators to the platform.

#### Key Sections & Buttons:
1. **`LandingNavbar`**:
   - **DishaSaathi Logo & Brand**: Clicking redirects to `/`.
   - **"How It Works" Nav Link**: Smooth-scrolls to the `#how-it-works` workflow section.
   - **"Example Scenarios" Nav Link**: Smooth-scrolls to the pre-built demo cards.
   - **"Key Features" Nav Link**: Smooth-scrolls to the core differentiator breakdown.
   - **"Start My Roadmap" CTA Button**: Directs immediately to `/create`.
2. **`LandingHero`**:
   - **Eyebrow Badge**: *"Civic Guidance Engine for Indian Municipal & State Services"*.
   - **Headline**: *"Tell us what you want to do. We'll show you how to get there."*
   - **5-Stage Animated Preview Bar**: Visualizes the procedural flow (`Goal` $\to$ `Documents` $\to$ `Application` $\to$ `Approval` $\to$ `Completion`).
   - **"Create My Roadmap" Button (Primary CTA)**: Large green button (`#1B4D3E`) routing to `/create`.
   - **"See How It Works" Button**: Smooth-scrolls to the explanation section.
3. **`HowItWorks`**:
   - Explains the 3-step paradigm:
     1. *Describe Your Goal in plain language.*
     2. *Receive a Dependency-Ordered Roadmap.*
     3. *Track Documents & Progress with Civic Copilot.*
4. **`ExampleGoals`**:
   - 4 pre-configured scenario cards:
     - *Start a Small Bakery in Mumbai* (Food & Health Licensing)
     - *Construct a Residential Property* (AutoDCR & IOD/CC)
     - *Register a New Vehicle* (RTO & HSRP)
     - *Apply for a Government Certificate* (Revenue & Caste/Income)
   - Clicking any card pre-fills the goal and routes directly to `/create`.

---

### Page 2: Goal Intake & Jurisdiction Mapping (`/create`)
The intake form captures the citizen's goal and isolates their administrative jurisdiction.

#### Key Form Controls & Buttons:
1. **Header**:
   - **"Back to Home" Button**: Returns to `/`.
   - **Breadcrumb Tracker**: *"Step 1 of 2: Goal Intake"*.
2. **Main Goal Input Area**:
   - **Textarea (`goal-input`)**: Accepts natural language (e.g. *"I want to open a small bakery in Mumbai"*).
   - **Inline Error Alert**: Appears if the user tries to submit an empty goal (*"Tell us what you'd like to accomplish"*).
   - **Quick Suggestion Pills (`+ Start a small bakery in Mumbai`, etc.)**: Clicking any pill instantly populates the textarea.
   - **Disclaimer Note**: Explains that pills are examples and any civic goal can be entered.
3. **Location Selectors**:
   - **State Dropdown (`state-select`)**: Supports 9 Indian states (Maharashtra, Delhi, Karnataka, Tamil Nadu, Telangana, Gujarat, Rajasthan, Uttar Pradesh, West Bengal).
   - **City / Municipal Corporation Dropdown (`city-select`)**: Dynamically updates based on the selected state. For Maharashtra: Mumbai, Pune, Nagpur, Thane, Nashik, etc. For Karnataka: Bengaluru, Mysuru, Hubballi, etc.
   - **Jurisdiction Note**: Explains why location is required: municipal bylaws and fees differ by city.
4. **Additional Context Area (Optional)**:
   - **Textarea (`context-input`)**: Allows citizens to enter operational details (e.g., *"Home-based with under 5 employees"*).
5. **Primary CTA: "Generate My Roadmap" Button**:
   - Validates inputs, shows visual feedback, and triggers the `generateRoadmap()` action.
   - Activates `GenerationLoader`.
6. **`GenerationLoader` (Animated Modal)**:
   - Displays 4 real-time animated processing steps:
     1. *Analyzing natural-language intent...*
     2. *Identifying municipal and state jurisdiction...*
     3. *Evaluating prerequisite dependencies...*
     4. *Generating verified procedural roadmap...*
   - Once complete, automatically transitions to `/roadmap`.

---

### Page 3: Interactive Civic Roadmap Dashboard (`/roadmap`)
The core product workspace where the citizen interacts with the generated roadmap.

#### 1. Top Demo Mode Toolbar (`DemoModeToolbar.tsx`)
- **"Hackathon Demo Mode" Pill**: Distinguishes the hackathon suite.
- **Scenario Dropdown**:
  - `Bakery in Mumbai (Primary Demo)`
  - `Vehicle Registration (Transport)`
  - `Residential Construction (Urban)`
  - `Government Certificate (Revenue)`
  - Selecting any option calls `POST /api/demo/load/:id` and instantaneously swaps the active roadmap.
- **"Reset Demo" Button**: Calls `POST /api/journey/reset` and clears state to the clean baseline.
- **"Presentation View" Button**: Toggles compact presentation mode, hiding sidebars for projectors and pitch decks.
- **"Open/Close Civic Copilot" Button**: Opens or collapses the right-side AI assistant drawer.

#### 2. Sub-Bar & Global Navbar (`Navbar.tsx`)
- **Sub-Bar**:
  - `"Goal Intake"` link (back to `/create`).
  - Active goal summary: *Active Roadmap for: "Bakery Setup Roadmap — Mumbai" (Mumbai, Maharashtra)*.
  - `"Start New Roadmap"`: Prompts confirmation, resets localStorage, and routes to `/create`.
  - `"Create New Roadmap"`: Routes to `/create` without clearing existing cache.
- **Global Navbar**:
  - **Search Input Bar**: Allows typing a new goal directly from the roadmap page. Pressing Enter calls `handleSearch()`.
  - **Notifications Bell**: Displays unread regulatory updates badge. Clicking opens the latest update modal.
  - **"Admin Review" Button**: Opens the human-in-the-loop regulatory update validation queue.

#### 3. Main Center Stage: Civic Journey Pipeline (`CivicJourneyPipeline.tsx`)
- **Pipeline Header**:
  - Journey icon and title.
  - **Scope Tag**: E.g. `Mumbai Municipal Guidance` (Municipal + State + National) or `National Guidance`.
  - **Health Badge**: `Journey On Track` (green) or `Blocker Needs Attention` (amber).
  - **Steps Progress Bar**: E.g. *1 / 6 completed (17%)*.
  - **Document Readiness Bar**: E.g. *3 / 21 ready (14%)*.
- **Action Control Buttons**:
  - **"Refine Goal"**: Opens `GoalRefinementModal` to adjust scale or city.
  - **"View Sources"**: Opens `SourcesPanelModal` listing all authoritative `.gov.in` links.
  - **"Re-check Roadmap"**: Calls `POST /api/journey/recheck` and displays an animated toast.
  - **"Civic Copilot"**: Toggles the copilot drawer.
  - **"Graph View"**: Opens the interactive ReactFlow DAG modal.
- **"YOUR NEXT STEP" Card (Prominent Banner)**:
  - **Pulsing Indicator**: Immediate visual anchor.
  - **Step Title**: E.g. *Step 1: Entity Constitution & Commercial PAN Allocation*.
  - **Action Headline**: Tells the citizen what to prepare.
  - **"Why this matters" Callout**: Explains the statutory prerequisite reason.
  - **CTA Button (`[View Requirements ➔]`)**: Opens the Step Detail modal directly.
  - **Concurrent Parallel Opportunities**: E.g. *Step 4 (FSSAI) and Step 5 (GSTIN) can run in parallel*.
  - **Future Blockers Warning**: Warns if subsequent steps are waiting for prerequisites.
- **Filter Tabs**:
  - `All` (all steps), `To Do` (uncompleted, unblocked), `Completed` (finished steps), `Blocked` (locked steps), `Documents` (steps requiring paperwork).
- **Step Cards Stack**:
  - Each step is rendered with its status:
    - **`COMPLETED`**: Green circle with checkmark (`✓`), light emerald card.
    - **`CURRENT`**: Amber circle with active step number, gold focus ring.
    - **`BLOCKED`**: Slate circle with lock icon (`🔒`), muted background.
    - **`UPCOMING`**: Neutral circle with step number.
  - Plain-language explanation: *"What this means"*.
  - Statutory rationale: *"Why you need it"*.
  - Authority tag: E.g. *Brihanmumbai Municipal Corporation (BMC)*.
  - Document checklist preview: E.g. *Docs: 2 / 3 ready*.
  - **"Why am I seeing this?" Button**: Opens a transparency modal showing the trigger rule and legislation.
  - **"Ask DishaSaathi" Button**: Opens the Copilot focused on that exact step.

#### 4. Right Sidebar (`RightSidebar.tsx`)
- **Radial Circular Progress**: Displays live completion percentage with an animated SVG circle.
- **Segmented Progress Bar**: Visual ticks for each step.
- **"Latest Government Updates" Feed**:
  - Shows simulated gazette changes (e.g. *"New document requirement for FSSAI Registration"*).
  - Clicking any update opens the `ChangeDetectionModal` featuring a **Semantic Diff**.
- **Quick Action Buttons**:
  - **"Download Roadmap"**: Generates a formatted text file (`dishasaathi-roadmap.txt`) and triggers a download.
  - **"Share with Others"**: Copies the current URL to the clipboard and shows inline feedback (`Link Copied!`).
  - **"Print / Save PDF"**: Triggers `window.print()` formatted for clean printing.

---

## 4. Interactive Modals & Drawers in Detail

### 1. `StepDetailModal.tsx` (Deep Step Inspection)
Opened by clicking any step card or the *"View Requirements"* CTA.
- **Step Header**: Step number, title, and verification badge (`✓ Verified Source`).
- **"What is this?" & "Why is it required?"**: Plain-language legal grounding.
- **Key Metrics Grid**:
  - Statutory Fee (e.g. *₹0 (Free)* or *₹100/year*).
  - Processing Turnaround Time (e.g. *1 - 2 weeks*).
  - Application Mode (*Online* / *Offline* / *Hybrid*).
- **Document Intelligence Checklist**:
  - Grouped by category (`Identity Verification`, `Premises & Address Proof`, `Business Records`).
  - Checkboxes: Citizen can check off documents they already possess.
  - Progress bar dynamically recalculates document readiness.
- **"What happens next?" Preview**: Shows which step follows and who handles it.
- **Official Source Evidence Card**:
  - Official Title & Department.
  - Last Verified Date.
  - **"View Official Source ↗" Button**: Clickable link to verified government portals (`*.gov.in`).
  - Unavailable Source Notice: If a portal is temporarily down, displays: *"Official source currently unavailable. Verification remains grounded in gazetted guidelines."*
- **Action Buttons**:
  - **"Mark as Completed" / "Reopen Step"**: Marks the step finished (disabled if the step is blocked).
  - **"Ask DishaSaathi about this step"**: Directs the AI copilot to focus on this step.
  - **"Close"**: Dismisses modal.

### 2. `ReactFlowGraphModal.tsx` (Interactive Visual DAG Graph)
Opened by clicking *"Graph View"* or *"Open ReactFlow Graph"*.
- Renders the roadmap as a visual Directed Acyclic Graph (DAG).
- Nodes are color-coded by state:
  - Green = `Completed`
  - Amber = `Current Action`
  - Slate = `Blocked by Prerequisites`
  - Blue/Gray = `Upcoming`
- Smooth bezier curve edges indicate dependency flow.
- Features: Zoom in/out, pan, minimap, background dot grid, full-screen expansion.
- Clicking any node opens that step's detail modal.

### 3. `ChangeDetectionModal.tsx` (Semantic Regulatory Diff)
Opened by clicking an item under *"Latest Government Updates"*.
- **The Core Innovation**: Demonstrates how DishaSaathi tracks circular updates and reflects them in the citizen's active journey.
- **Semantic Diff ("What Changed?")**:
  - Side-by-side comparison:
    - *Previous Regulation*: E.g. Standard applicant identity proofs.
    - *New Circular Amendment*: Highlights in green the addition of the mandatory applicant photograph.
- **"Apply Update to My Roadmap" Button**: Automatically injects the new requirement into the active roadmap and document checklist in real time.

### 4. `AdminValidationModal.tsx` (Human-in-the-Loop Review Queue)
Opened by clicking *"Admin Review"* in the navigation bar.
- Simulates the municipal administrative backend where civic officers or reviewers audit automated crawler detections.
- Reviewers can click **"Approve & Publish"** or **"Reject Update"**.
- Includes a **"Reset Demo State"** button.

### 5. `CivicCopilot.tsx` (Context-Grounded AI Drawer)
Opened by clicking *"Civic Copilot"* anywhere in the app.
- **Active Context Strip**: Reminds the copilot of the user's active goal, location, and current step.
- **Quick Action Suggestion Chips**:
  - *What should I do next?*
  - *What documents am I missing?*
  - *What can I do in parallel?*
  - *Why is this required?*
  - *Where do I apply?*
  - *Explain this step*
- **Evidence Card Attached to Responses**: Every factual claim displays the underlying procedure name, authority, and official source link.
- **Anti-Hallucination Guardrail**:
  If asked an out-of-domain query (e.g. *"How do I build a spaceship?"*), the copilot returns `responseType: 'UNKNOWN'` and declares:
  > *"I don't have verified information about that in the current DishaSaathi knowledge base. Please check official authority portals before proceeding."*

---

## 5. Behind the Scenes: Core Algorithms & Data Flows

### A. Natural Language Goal Parsing (`server/src/services/civic/goalParser.ts`)
```text
User Input: "I want to start a small bakery in Mumbai."
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    Gemini API             Local Regex Parser
  (Primary Engine)        (100% Offline Fallback)
         │                       │
         └───────────┬───────────┘
                     ▼
             Structured Goal:
             {
               intent: 'START_BUSINESS',
               domain: 'FOOD_BUSINESS',
               activity: 'BAKERY',
               location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
               scale: 'Small / Home-based'
             }
```
- If `GEMINI_API_KEY` is not provided or the network times out, the local parser uses keyword dictionaries and regex patterns to extract `intent`, `activity`, and `location` deterministically.
- Ambiguous inputs (e.g. `"I want to start a business"`) set `clarificationNeeded: true` and prompt the user for their business category and city.

### B. Jurisdiction Engine & Procedure Filtering (`server/src/services/civic/procedureMapper.ts`)
```text
Goal: Bakery in Mumbai
  ├── Matches National Procedures:
  │     ├── Commercial PAN Allocation
  │     ├── MSME Udyam Registration
  │     ├── FSSAI Food Safety Registration (Food business only)
  │     └── GSTIN Registration
  ├── Matches State Procedures (Maharashtra):
  │     └── Maharashtra Gumasta (Shop & Establishment) Act 2017
  └── Matches Municipal Procedures (Mumbai):
        ├── BMC Health Trade License (MCGM Public Health Dept)
        └── Mumbai Fire Brigade Safety Clearance
```
- **Boundary Isolation**: If the location is `Bengaluru, Karnataka`:
  - BMC Health Trade License is **EXCLUDED**.
  - Maharashtra Gumasta is **EXCLUDED**.
  - Only National guidance + Karnataka-relevant tiers are returned.

### C. Dependency Graph Validation (`server/src/services/civic/roadmapValidator.ts`)
Before any roadmap is sent to the client, it passes through mathematical validation:
1. **Cycle Detection via DFS**:
   - Maintains a `visited` set and a `recursionStack` set.
   - If node $V$ points to node $W$ and $W$ is currently in `recursionStack`, a circular dependency ($A \to B \to C \to A$) is detected and rejected.
2. **Self-Dependency Check**: Rejects steps referencing themselves ($A \to A$).
3. **Orphan Document Cleanup**: Ensures every document references a valid step ID (`requiredFor`).
4. **Version Stamping**: Stamps the journey with `DATA_VERSION = 1` and `jurisdictionScope`.

### D. Adaptive Next-Action Engine (`server/src/services/civic/adaptiveEngine.ts`)
Evaluates the citizen's active progress on every document check or step completion:
$$\text{Blocked}(\text{Step}_i) = \exists \, p \in \text{Prerequisites}(\text{Step}_i) \text{ such that } \text{Status}(p) \neq \text{'Completed'}$$
- **Primary Blocker**: If Step 1 has missing mandatory documents, the engine flags: *"Assemble identity documents for Step 1"*.
- **Parallel Action Discovery**: Identifies independent steps whose prerequisites are satisfied, allowing the citizen to work on them simultaneously (e.g., FSSAI and GSTIN).

### E. Persistence & Safe Schema Versioning (`client/src/context/RoadmapContext.tsx`)
- All journey state, step statuses, and document checklists are persisted to browser `localStorage` under `dishasaathi_journey_state`.
- **Validation**: On application startup, `validateStoredJourney()` verifies that `dataVersion === 1` and all required properties exist. If the cached state is corrupted or from an older build, it resets safely without crashing React.

### F. Auxiliary Dashboard Components

#### 1. `FeatureCards.tsx` (Discovery & Helper Grid)
Located directly beneath the main journey pipeline, this 4-card responsive grid provides quick access to core platform utilities:
- **Card 1: DishaSaathi AI Assistant**:
  - Visual: Smartphone mockup device with speaker icon and `"New"` pill badge.
  - Subtext: *"Ask anything about government services, documents, fees and more."*
  - Action Button: **"Chat Now →"** (triggers `onOpenAiAssistant()`, opening the full Copilot drawer).
- **Card 2: Explore Services**:
  - Visual: Building icon in emerald circular badge.
  - Subtext: *"Browse all government services by department or category."*
  - Action Button: **"Explore →"** (triggers `onExploreServices()`, opening the interactive ReactFlow DAG modal).
- **Card 3: How It Works**:
  - Visual: Workflow network icon.
  - Subtext: *"See how DishaSaathi finds, verifies and connects information for you."*
  - Action Button: **"Learn more →"** (opens the procedural DAG modal to visualize the dependency graph).
- **Card 4: Why DishaSaathi**:
  - Visual: ShieldCheck security badge.
  - Subtext: *"Verified sources, no outdated blogs, and real-time regulatory tracking."*
  - Action Button: **"Discover →"** (opens the latest regulatory update modal showing source grounding).

#### 2. `CivicLandmarks.tsx` & Mumbai Heritage Artwork
DishaSaathi incorporates bespoke heritage styling celebrating Indian municipal governance:
- **Gateway of India Illustration**: Vector SVG rendition (`GatewayIllustration`) in sage green (`#2D634E`) capturing Mumbai's iconic sea-facing gateway, central grand archway, turrets, and harbor promenade.
- **BMC & CST Victorian Terminus Dome**: Rendered in the sidebar and hero background (`CivicDomeIllustration`) honoring Mumbai's Municipal Corporation headquarters (established 1888 under the Bombay Municipal Corporation Act).
- **Heritage Photo Integration**: `/monuments/gateway-day.jpg` and `/monuments/bmc-cst-heritage.jpg` blended with gradient overlays for a distinguished civic ambiance.

---

## 6. Canonical Procedure Knowledge Base (`server/src/services/civic/procedureKnowledgeBase.ts`)

DishaSaathi does **NOT** ask LLMs to invent procedures, statutory fees, or departmental URLs. All procedural intelligence is anchored in a verified, canonical knowledge base of statutory procedures:

| Procedure ID | Department / Authority | Level | Statutory Act / Gazette Basis | Fee | Turnaround |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pan-registration` | Income Tax Department | National | Income Tax Act 1961 | ₹0 (Free) | 1 - 2 weeks |
| `udyam-registration` | Ministry of MSME | National | MSMED Act 2006 | ₹0 (Free) | 2 - 3 days |
| `mh-gumasta-registration` | Maharashtra Labour Commissionerate | State | Maharashtra Shops & Establishments Act 2017 (Sec 6) | ₹0 (<10 employees) / ₹1,000+ | 1 - 3 days |
| `bmc-health-license` | Brihanmumbai Municipal Corporation (BMC) | Municipal | Mumbai Municipal Corporation (MMC) Act 1888 (Sec 394) | ₹3,000 - ₹5,000 | 2 - 4 weeks |
| `fssai-registration` | Food Safety & Standards Authority of India | National | FSSAI Act 2006 / Food Safety Regulations 2011 | ₹100 / year | 1 - 2 weeks |
| `gstin-registration` | Goods and Services Tax Network (GSTN) | National | Central Goods and Services Tax (CGST) Act 2017 | ₹0 (Free) | 3 - 7 days |
| `mumbai-fire-clearance` | Mumbai Fire Brigade (MCGM) | Municipal | Maharashtra Fire Prevention & Life Safety Act 2006 | Inspection-based | 1 - 2 weeks |
| `rto-new-vehicle-reg` | Ministry of Road Transport & Highways | National | Central Motor Vehicles Act 1988 | Based on vehicle class | 3 - 5 days |
| `hsrp-number-plate` | Society of Indian Automobile Manufacturers | National | MoRTH Gazette Order 2018 | ₹400 - ₹800 | 4 - 7 days |
| `autodcr-building-approval` | Municipal Town Planning / AutoDCR | Municipal | Maharashtra Unified DCPR 2020 | Area-based | 4 - 8 weeks |
| `iod-cc-commencement` | Municipal Building Proposal Department | Municipal | MMC Act 1888 (Sec 337-347) | Project-based | 3 - 6 weeks |

---

## 7. Complete REST API Specification

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check and version metadata |
| `GET` | `/api/journey/current` | Returns the currently active civic journey |
| `POST` | `/api/journey/interpret` | Interprets a goal query and generates a verified roadmap |
| `POST` | `/api/journey/steps/:stepId/status` | Updates step status (`Completed` / `In Progress`) with blocker enforcement |
| `POST` | `/api/journey/steps/:stepId/documents/:docId/status` | Toggles document readiness (`READY` / `NOT_READY`) |
| `GET` | `/api/updates` | Retrieves the list of simulated regulatory updates |
| `POST` | `/api/updates/:id/apply` | Applies a gazette update to the active roadmap |
| `POST` | `/api/updates/:id/review` | Admin review action (`Approve` / `Reject`) |
| `GET` | `/api/journey/adaptive-action` | Computes the next best action and parallel tasks |
| `POST` | `/api/copilot/message` | Context-aware Civic Copilot query endpoint |
| `POST` | `/api/journey/ask` | Modal AI query endpoint with step focus |
| `GET` | `/api/demo/scenarios` | Lists the 4 deterministic demo scenarios |
| `POST` | `/api/demo/load/:id` | Loads a specific scenario instantaneously |
| `POST` | `/api/journey/reset` | Resets active state to clean hackathon baseline |
| `POST` | `/api/journey/recheck` | Triggers a fresh dependency and regulatory audit |

---

## 8. End-to-End User Execution Trace

Here is the exact step-by-step lifecycle of a citizen's journey in DishaSaathi:

```text
1. Citizen lands on "/"
   └── Sees value proposition, animated 5-step preview, and 4 scenario cards.
   └── Clicks "Create My Roadmap" or an example card.

2. Browser navigates to "/create"
   └── Citizen types: "I want to start a small bakery in Mumbai"
   └── Selects State: "Maharashtra", City: "Mumbai"
   └── Clicks "Generate My Roadmap"

3. Backend API Execution: POST /api/journey/interpret
   ├── goalParser.ts parses intent ("START_BUSINESS", "BAKERY", "Mumbai")
   ├── procedureMapper.ts isolates Municipal (BMC), State (Maharashtra), and National (FSSAI/GST) procedures
   ├── roadmapValidator.ts runs DFS to verify acyclic dependencies (PAN -> Gumasta -> BMC -> FSSAI)
   ├── adaptiveEngine.ts evaluates blockers and discovers parallel opportunities (FSSAI & GSTIN)
   └── Returns validated CivicJourney JSON object

4. Client displays GenerationLoader.tsx (4 animated stages)
   └── Redirects to "/roadmap"

5. Active Roadmap Dashboard (/roadmap)
   ├── "YOUR NEXT STEP" highlights Step 1 (Commercial PAN Allocation)
   ├── Citizen clicks Step 1 card -> StepDetailModal opens
   ├── Citizen checks off documents: "Applicant PAN", "Aadhaar Card", "Address Proof"
   ├── Dynamic readiness bar updates to 100%
   ├── Citizen clicks "Mark as Completed" -> Step 1 becomes COMPLETED (green checkmark)
   ├── Step 2 (Maharashtra Gumasta) unlocks automatically!

6. Live Change Detection (Gazette Update)
   ├── Right sidebar shows "New document requirement for FSSAI Registration"
   ├── Citizen clicks update -> ChangeDetectionModal opens showing side-by-side semantic diff
   ├── Citizen clicks "Apply Update to My Roadmap" -> Checklist updates with mandatory photograph

7. Grounded Civic Copilot Interaction
   ├── Citizen clicks "Civic Copilot" drawer
   ├── Asks: "What should I prepare first?"
   ├── Copilot responds citing exact Maharashtra Shops & Establishments Act sections and links to aaplesarkar.mahaonline.gov.in
   ├── Citizen asks an out-of-domain query: "How do I launch a rocket?"
   └── Copilot triggers anti-hallucination guardrail and declines politely

8. Export & Offline Preservation
   ├── Citizen clicks "Download Roadmap" -> dishasaathi-bakery-setup.txt downloaded
   └── Citizen clicks "Share with Others" -> link copied to clipboard
```

---

## 9. How to Run & Verify the Project

### 1. Development Mode
Run both servers concurrently from the project root:
```bash
npm install
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 2. Run All Automated Verification Tests
```bash
npm test
```
Executes all 29 integration and reliability tests with 100% pass rate.

### 3. Production Build
```bash
npm run build
```
Compiles both `server/dist` and `client/dist` in under 3 seconds.
