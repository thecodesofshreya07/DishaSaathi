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
Goal Understanding & Entity Parsing (Google Gemini AI + Canonical Mapping)
    │
    ▼
Jurisdiction Engine (Municipal / State / National Boundary Isolation)
    │
    ▼
Procedure Knowledge Base (18 Statutory Acts & Active Gazette Rules)
    │
    ▼
Roadmap Builder & Graph Validator (DFS Acyclic Validation & Document Binding)
    │
    ▼
Adaptive Next-Action Engine (Dynamic Blocker & Parallel Action Discovery)
    │
    ▼
Interactive UI & Civic Flowchart (Compact Step DAG + Full Pipeline + Citizen Hub)
    │
    ▼
Dual Mode & Localization (Light/Dark Themes + English/Hindi/Marathi Translation)
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
  - Tailwind CSS (`darkMode: 'class'` responsive tokens)
  - Lucide React (clean vector iconography)
  - ReactFlow (`reactflow` for interactive visual DAG rendering)
  - PDF Export (`jspdf` & `html2canvas` for vector citizen roadmap generation)
- **State & Context Architecture**:
  - `ThemeContext`: Persistent Light Mode / Dark Mode state with `.dark` root synchronization.
  - `LanguageContext`: Dynamic multilingual localization across English (`EN`), Hindi (`हि`), and Marathi (`म`).
  - `AuthContext`: Persistent citizen authentication, credentials management, and session state.
  - `RoadmapContext`: Active journey lifecycle, step/document status toggling, and gazette diff injection.
- **Backend**:
  - Node.js & Express
  - TypeScript (compiled via `tsc` to NodeNext)
  - CORS middleware
  - Built-in Static File Server (serves compiled `client/dist` in production with SPA fallback)
- **Database & Cloud Persistence**:
  - **Turso Serverless Cloud Database** (`@libsql/client`) with persistent `users` and `user_journeys` tables.
  - Zero-maintenance distributed cloud database ready for one-click deployment (Render, Vercel, Railway).
- **AI & Multi-Provider LLM Engine**:
  - **Priority 1: Groq Cloud** (`llama-3.3-70b-versatile` / `gpt-oss-120b` — 100% Free, high-speed reasoning)
  - **Priority 2: OpenRouter Gateway** (Free & multi-model failover)
  - **Priority 3: Google Gemini API** (`gemini-2.5-flash` via `@google/genai`)
  - **Priority 4: Canonical Statutory Knowledge Base** (100% deterministic fallback grounded in 18 Indian Acts & Official State Gazettes)

### Repository Directory Structure
```text
d:\DishaSaathi\
├── client/                     # Vite + React 19 Frontend
│   ├── public/
│   │   └── monuments/          # High-resolution civic heritage artwork
│   │       ├── gateway-day.jpg         # Gateway of India (Day Sage Palette)
│   │       ├── gateway-night.jpg       # Gateway of India (Atmospheric Night Palette)
│   │       └── bmc-cst-heritage.jpg    # CST & BMC Heritage Building Watercolor
│   ├── src/
│   │   ├── components/         # Reusable UI components & modals
│   │   │   ├── Navbar.tsx              # Global header with theme, language & auth
│   │   │   ├── Sidebar.tsx             # Role-based left nav with seamless monument art
│   │   │   ├── HeroBanner.tsx          # Day/Night reactive Gateway hero & search
│   │   │   ├── CitizenHomeDashboard.tsx# Core impact metrics & Quick Access hub
│   │   │   ├── RoadmapFlowchart.tsx    # Compact horizontal dependency flowchart
│   │   │   ├── CivicJourneyPipeline.tsx# Full interactive roadmap & Next Best Action
│   │   │   ├── SidebarPages.tsx        # Explore, Services, Docs, Updates, Deadlines, Settings
│   │   │   ├── OfflineDocModal.tsx     # Offline office guidance, timings & submission
│   │   │   ├── SourceExcerptModal.tsx  # AI-extracted statutory gazette excerpt modal
│   │   │   ├── StepDetailModal.tsx     # Deep step requirements & document checklist
│   │   │   ├── ReactFlowGraphModal.tsx # Fullscreen interactive DAG graph
│   │   │   ├── ChangeDetectionModal.tsx# "What Changed?" side-by-side semantic diff
│   │   │   ├── AdminValidationModal.tsx# Human-in-the-loop civic reviewer queue
│   │   │   ├── CivicCopilot.tsx        # Grounded AI assistant drawer
│   │   │   └── ErrorBoundary.tsx       # Fault-tolerant React error boundary
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx        # Light/Dark mode state & localStorage sync
│   │   │   ├── LanguageContext.tsx     # English / Hindi / Marathi dictionary & engine
│   │   │   ├── AuthContext.tsx         # Citizen registration & login state
│   │   │   └── RoadmapContext.tsx      # Global journey state & step updates
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx         # Public marketing landing page
│   │   │   ├── GoalIntakePage.tsx      # Step 1: Goal intake & state/city isolation
│   │   │   ├── RoadmapPage.tsx         # Step 2: Main active citizen workspace
│   │   │   └── AuthPage.tsx            # Citizen login & registration portal
│   │   ├── utils/
│   │   │   ├── documentSources.ts      # Online application URLs & offline office timings
│   │   │   └── pdfGenerator.ts         # Vector PDF roadmap exporter
│   │   ├── types.ts                    # Shared TypeScript interface definitions
│   │   ├── index.css                   # Custom scrollbars & dark mode theme tokens
│   │   ├── App.tsx                     # Top-level providers & route declarations
│   │   └── main.tsx                    # React 19 entrypoint
│   ├── tailwind.config.js              # darkMode: 'class' configuration
│   └── package.json
├── server/                     # Express + TypeScript Backend
│   ├── src/
│   │   ├── data/
│   │   │   ├── seedData.ts             # Initial regulatory circular updates
│   │   │   └── verifiedProcedures.ts   # 18 canonical statutory procedure definitions
│   │   ├── services/
│   │   │   ├── civic/
│   │   │   │   ├── goalParser.ts       # Gemini AI natural language intent parser
│   │   │   │   ├── procedureMapper.ts  # Jurisdiction isolation & boundary filter
│   │   │   │   ├── roadmapValidator.ts # DFS cycle detection & acyclic graph validation
│   │   │   │   ├── roadmapBuilder.ts   # Linear & parallel roadmap construction
│   │   │   │   ├── adaptiveEngine.ts   # Dynamic blocker resolution & parallel discovery
│   │   │   │   └── copilotService.ts   # Grounded RAG copilot responses
│   │   │   └── procedureEngine.ts      # Regulatory circular diff generator
│   │   ├── types.ts                    # Server-side TypeScript models
│   │   └── index.ts                    # REST API endpoints & static serving
│   └── package.json
├── docs/                       # Architecture guides & specifications
└── README.md                   # Repository overview
```

---

## 3. Global Navigation & Core Controls

### 1. Global Navigation Bar (`Navbar.tsx`)
Positioned stickily at the top across all dashboard views (`sticky top-0 z-40`):
- **Brand Logo & Title**: Displays the stylized organic leaf icon and brand name *DishaSaathi* with its tagline *"Your GPS for Government Services"*.
- **Center Natural-Language Search Bar**:
  - Citizens can type any civic procedure, license, or business goal directly from the header.
  - Automatically invokes the AI interpreter and navigates to the active journey view.
- **Light / Dark Mode Toggle Button**:
  - Instantly toggles between Light Mode (day sage aesthetic) and Dark Mode (nocturnal emerald aesthetic).
  - Uses `Sun` (amber) in dark mode and `Moon` (deep emerald) in light mode with smooth scale micro-animations.
  - Changes are persisted in `localStorage` under `dishasaathi_theme` and sync with the `.dark` HTML class.
- **Multi-Language Toggle Dropdown**:
  - Supports **English** (`EN`), **हिन्दी** (`हि`), and **मराठी** (`म`).
  - Seamlessly re-renders all labels, placeholders, buttons, and status badges in the chosen language.
- **Admin Review Console Button**:
  - Opens the `AdminValidationModal` allowing evaluators to simulate civic officer verification of regulatory circulars.
- **Notifications Bell**:
  - Displays real-time unread badges for pending gazette circulars.
- **Citizen Profile & Authentication**:
  - When authenticated: Displays the user's initial avatar, name, and a dropdown menu with user email and a **Sign Out** button.
  - When unauthenticated: Displays a bold **Sign In** button directing to `/login`.

---

### 2. Role-Based Dynamic Sidebar (`Sidebar.tsx`)
The left navigation bar dynamically adapts based on whether the citizen is authenticated:

#### For Unauthenticated Guests:
Exposes core public exploration features:
1. **Home**: Citizen Home Dashboard with metrics and search.
2. **Explore**: Civic categories (Commercial, Property, Transport, Vital Records).
3. **Services**: Directory of 18 statutory procedures with requirements and fees.
4. **Govt Updates**: Live gazette notifications and circular amendments.
5. **Settings**: Theme appearance selection and AI configuration.

#### For Authenticated Citizens:
Unlocks personalized, persistent civic journey tracking:
1. **Home**: Personalized dashboard with active status.
2. **My Journeys**: Interactive roadmap flowchart and detailed procedural pipeline.
3. **Explore**: Categories and administrative guides.
4. **Services**: Searchable catalog of 18 statutory procedures.
5. **Documents**: Document Vault with online application links and offline ward office guidance.
6. **Govt Updates**: Gazette feed with AI excerpt extraction.
7. **Deadlines**: Statutory compliance reminders calendar.
8. **Saved**: Bookmarked procedures and persistent journey progress.
9. **Civic Passport**: Verified compliance card with cryptographic verification hash.
10. **Settings**: Theme selector, cache reset, and engine settings.

#### Seamless Monument Artwork Integration:
- At the bottom of the sidebar, the iconic watercolor illustration of the **Chhatrapati Shivaji Terminus (CST) and BMC Municipal Headquarters** is rendered edge-to-edge (`-mx-3 -mb-3 w-full h-auto object-contain`).
- Features a soft top fade gradient (`bg-gradient-to-b from-white via-white/80 to-transparent dark:from-[#0D1A16] dark:via-[#0D1A16]/80 dark:to-transparent`), smoothly blending the illustration into the sidebar background without card borders or cropped frames.
- In Dark Mode, utilizes nocturnal screen blending (`dark:mix-blend-screen dark:invert dark:hue-rotate-180 dark:opacity-85`) so architectural outlines glow with emerald/golden tones against the dark sidebar.

---

## 4. Page-by-Page & Feature Breakdown

### Page 1: Public Landing Page (`LandingPage.tsx` — `/`)
- **Hero Header**: Value proposition explaining how DishaSaathi replaces fragmented department portals.
- **5-Stage Process Preview**: Visualizes the pipeline (`Goal` $\to$ `Documents` $\to$ `Application` $\to$ `Approval` $\to$ `Completion`).
- **Direct Entry Points**: "Start My Roadmap" CTA routing to `/create`.

---

### Page 2: Goal Intake & Location Mapping (`GoalIntakePage.tsx` — `/create`)
- **Natural Language Textarea**: Accepts freeform citizen queries (e.g. *"I want to open a small bakery in Mumbai"*).
- **Administrative Jurisdiction Pickers**:
  - State Selection (supports Maharashtra, Delhi, Karnataka, Tamil Nadu, Telangana, Gujarat, etc.).
  - City / Municipal Corporation (dynamically filters based on selected state).
- **Interactive Generation Screen (`GenerationLoader.tsx`)**:
  - Displays a 4-stage animated progression simulating entity extraction, boundary isolation, dependency evaluation, and roadmap assembly.

---

### Page 3: Active Citizen Workspace (`RoadmapPage.tsx` — `/roadmap`)

The active citizen workspace hosts multiple cohesive sub-views controlled via sidebar navigation:

#### Tab 1: Citizen Home Dashboard (`CitizenHomeDashboard.tsx`)
1. **Hero Banner (`HeroBanner.tsx`)**:
   - **Gateway of India Monument Artwork**:
     - **Light Mode**: Displays `/monuments/gateway-day.jpg` with day sage tones.
     - **Dark Mode**: Automatically displays `/monuments/gateway-night.jpg` (the illuminated Gateway of India night view with water reflections) backed by a midnight emerald gradient (`bg-gradient-to-r from-[#0C1A15] via-[#10241E] to-[#142C24] border-[#1E3B32]`).
   - **Personalized Welcome**: Displays *"WELCOME BACK, [NAME] ✌️"*.
   - **Natural Language Task Input**: Direct search field with quick suggestion tags (*Register a small business*, *Birth Certificate*, *Property Title Registration*, etc.).
2. **4 Core Impact Metrics with Explanations**:
   - **18 Procedures Mapped**: Civic procedures mapped across municipal, state & central ministries.
   - **18/18 Verified Sources (100%)**: 100% verified against active gazettes, statutory acts and official `.gov.in` portals.
   - **22+ Visits Saved**: Avoided redundant trips to municipal ward offices & departments.
   - **77+ Citizen Hours Saved**: Estimated citizen time saved navigating confusing queues and paperwork.
3. **Quick Access Hub**:
   - 4 shortcut cards directing citizens to My Active Journey, Document Locker, Explore Services, and Govt Updates.

---

#### Tab 2: My Active Journey (`RoadmapFlowchart.tsx` & `CivicJourneyPipeline.tsx`)
1. **Compact Dependency Flowchart (`RoadmapFlowchart.tsx`)**:
   - A horizontal scrollable flowchart displaying small step nodes.
   - Each node indicates the step number, title, department authority, fee, turnaround time, and status.
   - Status color-coding:
     - **Completed** (Green, checkmark icon)
     - **Current** (Amber, pulsing indicator)
     - **Upcoming** (Slate, step number)
     - **Blocked** (Rose, lock icon with *"Requires prior approvals"* badge)
   - Connected via dynamic directional arrows (`ArrowRight`) that turn green when preceding steps finish.
   - Clicking any step node instantly selects it for inspection.
2. **Interactive Civic Roadmap Pipeline (`CivicJourneyPipeline.tsx`)**:
   - **Dynamic Journey Header**: Displays registered goal title, municipal jurisdiction, steps progress gauge, and document readiness percentage.
   - **Adaptive Next Best Action Card**:
     - Highlights the exact single actionable step the citizen must execute right now.
     - Detects concurrent opportunities (e.g. *"Step 4 (FSSAI) and Step 5 (GSTIN) can run in parallel"*).
     - Outlines prerequisite reasons (*"Why this matters"*).
   - **Lightweight Filters**: Filter by `All`, `To Do`, `Completed`, `Blocked`, and `Documents`.
   - **Detailed Vertical Step Cards**: Includes plain-language summaries, statutory rationales (*"Why you need it"*), required documents checklist, and official source badges.

---

#### Tab 3: Explore Civic Categories (`ExploreView` in `SidebarPages.tsx`)
- Organizes civic procedures into 4 core administrative domains:
  1. *Commercial Enterprise & Food Businesses*
  2. *Land, Property & Building Permissions*
  3. *Transport, Driving & Vehicle Services*
  4. *Vital Records & Citizen Identity*
- Each category displays estimated turnaround times, governing tier badges, and 1-click roadmaps.

---

#### Tab 4: Explore Services Catalog (`ServicesView` in `SidebarPages.tsx`)
- Searchable catalog of 18 statutory municipal, state, and central procedures.
- Filter by category pills (*Commercial & Trade*, *Food & Hospitality*, *Safety & Municipal*, *Transport & RTO*, *Property & Land*, *Tax & Financial*).
- Displays required documents, competent ministry, processing fees, and *"Start Roadmap"* buttons.

---

#### Tab 5: Citizen Document Vault (`DocumentsView` in `SidebarPages.tsx`)
- Consolidates all required certificates and proofs across the citizen's active journey.
- Displays document readiness count and completion percentage.
- **Smart Procurement Handling**:
  - **Online Application**: 1-click button (`Apply Online ↗`) leading to the verified application portal (e.g. `foscos.fssai.gov.in`, `services.india.gov.in`, `parivahan.gov.in`).
  - **Offline Application**: "Where to Apply (Offline) 📍" button opens `OfflineDocModal`.

---

#### Tab 6: Government Gazette Updates (`UpdatesView` in `SidebarPages.tsx`)
- Displays real-time circular notifications and statutory amendments.
- **View Gazette Excerpt (AI)**: Clicking opens `SourceExcerptModal` showing the exact legal clause and official link rather than sending the user to a generic portal homepage.

---

#### Tab 7: Compliance Deadlines (`DeadlinesView` in `SidebarPages.tsx`)
- Calendar reminders for recurring statutory obligations (e.g. GSTR-3B monthly return, FSSAI annual compliance, property tax early rebate deadlines).

---

#### Tab 8: Civic Verification Passport (`PassportView` in `SidebarPages.tsx`)
- A digital credential card certifying completed procedural stages with official authority stamps and a cryptographic verification hash.

---

#### Tab 9: Saved Roadmaps (`SavedView` in `SidebarPages.tsx`)
- Displays bookmarked procedures and progress stored securely in the citizen's account.

---

#### Tab 10: Settings & Preferences (`SettingsView` in `SidebarPages.tsx`)
- **Display Appearance & Theme**: Interactive Light Mode vs Dark Mode selector cards.
- **AI Engine Configuration**: Displays active Google Gemini API integration status.
- **Reset Active Roadmap**: Clears local cached progress back to baseline.

---

### Page 4: Citizen Authentication Portal (`AuthPage.tsx` — `/login` & `/signup`)
- Split-screen layout featuring verified citizen access benefits on the left and form inputs on the right.
- Supports **Sign In** (email & password) and **Sign Up** (full name, email, phone, city, password).
- Validates password length and email format.
- Syncs seamlessly with `AuthContext` and saves session under `dishasaathi_user`.

---

## 5. Interactive Modals & Drawers

### 1. `OfflineDocModal.tsx` (Physical Office Guidance)
Opened when a citizen needs an offline document (such as a BMC Ward Sanitary Inspection, AutoDCR architectural blueprint, or property mutation card):
- **Competent Ward Office & Address**: E.g. *BMC Ward Health Office (Ward A/B/C/D), Municipal Building, Mumbai*.
- **Office Working Hours**: E.g. *Monday to Friday: 10:00 AM - 4:30 PM (Token counter closes at 2:00 PM)*.
- **Statutory Application Fee**: Clearly stated government fee.
- **Required Paperwork Checklist**: Specific documents required for physical submission.
- **"Mark as Submitted" Action**: Closes the modal and marks the document as ready/submitted in the active roadmap.

---

### 2. `SourceExcerptModal.tsx` (AI Statutory Excerpt Inspection)
Opened by clicking *"View Gazette Excerpt (AI)"* on any regulatory update:
- Highlights the specific statutory paragraph, amendment clause, or gazette order.
- Provides direct page link and date of statutory effect.

---

### 3. `StepDetailModal.tsx` (Deep Step Requirements)
- Complete breakdown of prerequisites, statutory fee, turnaround time, and grouped document checklist.
- Checkboxes allow citizens to track document possession in real time.
- Direct links to official `.gov.in` sources.

---

### 4. `ReactFlowGraphModal.tsx` (Interactive Visual DAG)
- Interactive Directed Acyclic Graph (DAG) visualizing procedure dependencies.
- Color-coded nodes (Green for completed, Amber for current, Slate for blocked).
- Supports zooming, panning, and minimap navigation.

---

### 5. `ChangeDetectionModal.tsx` (Semantic Regulatory Diff)
- Side-by-side comparison of prior regulations vs newly amended circulars.
- *"Apply Update to My Roadmap"* button injects new requirements directly into the active checklist.

---

### 6. `AdminValidationModal.tsx` (Human-in-the-Loop Review Queue)
- Allows reviewers to inspect, approve, or reject crawler-detected statutory changes before publishing to citizens.

---

### 7. `CivicCopilot.tsx` (Context-Grounded AI Drawer)
- Conversational AI drawer anchored in the citizen's active journey, city, and step.
- Answers questions using canonical acts and attaches official source evidence cards.
- Equipped with anti-hallucination guardrails that refuse unverified out-of-domain queries.

---

## 6. Core Algorithms & Behind-the-Scenes Architecture

### A. Theme Architecture (`ThemeContext.tsx` & `index.css`)
- Detects initial preference via `localStorage.getItem('dishasaathi_theme')` or system `prefers-color-scheme`.
- Dynamically attaches the `.dark` class to `document.documentElement` and sets `style.colorScheme = 'dark' | 'light'`.
- Tailored palette:
  - Dark background: `#08120F` / `#0D1A16`
  - Dark cards: `#0E1E19` / `#11231D`
  - Dark borders: `#1F3E33`
  - Dark text: Primary `#FFFFFF`, Secondary `#9FB7AC`
  - Accents: Emerald `#34D399`, Amber `#F59E0B`

### B. Multi-Language Localization Engine (`LanguageContext.tsx`)
- Supported languages: English (`en`), Hindi (`hi`), Marathi (`mr`).
- Dictionary stores statutory terms, UI labels, impact descriptions, and button text across all three languages.
- Instant reactive switching without page reloads.

### C. Natural Language Goal Parsing (`server/src/services/civic/goalParser.ts`)
- Calls Google Gemini API with strict structured schema constraints (`intent`, `domain`, `activity`, `location`, `scale`).
- If ambiguity is detected, prompts the user for clarification.

### D. Jurisdiction Engine & Procedure Filtering (`server/src/services/civic/procedureMapper.ts`)
- Isolates procedures by administrative level:
  - **National**: Applies universally across India (PAN, MSME Udyam, FSSAI, GSTIN, MoRTH).
  - **State**: Filtered strictly by state boundary (e.g. Maharashtra Shops & Establishments Act).
  - **Municipal**: Filtered strictly by Urban Local Body (e.g. BMC Mumbai Health Trade License, Mumbai Fire Safety NOC).

### E. Mathematical Graph Validation (`server/src/services/civic/roadmapValidator.ts`)
- **Depth-First Search (DFS) Cycle Detection**: Verifies that the procedural dependency graph is strictly acyclic ($A \not\to \dots \to A$).
- **Prerequisite Validation**: Ensures every prerequisite ID corresponds to a valid existing step.
- **Document Binding**: Validates that all document proofs reference valid procedure stages.

### F. Adaptive Next-Action Engine (`server/src/services/civic/adaptiveEngine.ts`)
- Recomputes state dynamically on every step or document status change:
  $$\text{Blocked}(\text{Step}_i) = \exists \, p \in \text{Prerequisites}(\text{Step}_i) \text{ such that } \text{Status}(p) \neq \text{'Completed'}$$
- Discovers independent parallel steps that can proceed concurrently.

### G. Client-Side Vector PDF Export (`client/src/utils/pdfGenerator.ts`)
- Generates a branded, multi-page vector PDF roadmap containing journey metadata, step breakdown, fee schedule, and document requirements.

---

## 7. Canonical Procedure Knowledge Base

All procedures are grounded in statutory acts and gazette notifications:

| Procedure ID | Department / Authority | Level | Statutory Basis | Fee | Turnaround |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pan-registration` | Income Tax Department | National | Income Tax Act 1961 | ₹0 (Free) | 1 - 2 weeks |
| `udyam-registration` | Ministry of MSME | National | MSMED Act 2006 | ₹0 (Free) | 2 - 3 days |
| `mh-gumasta-registration` | Maharashtra Labour Commission | State | Maharashtra Shops Act 2017 | ₹0 (<10 workers) / ₹1,200 | 1 - 3 days |
| `bmc-health-license` | Brihanmumbai Municipal Corp (BMC) | Municipal | MMC Act 1888 (Sec 394) | ₹3,000 - ₹5,000 | 2 - 4 weeks |
| `fssai-registration` | Food Safety Authority of India | National | FSSAI Act 2006 | ₹100 / year | 1 - 2 weeks |
| `gstin-registration` | Goods and Services Tax Network | National | CGST Act 2017 | ₹0 (Free) | 3 - 7 days |
| `mumbai-fire-clearance` | Mumbai Fire Brigade (MCGM) | Municipal | Maharashtra Fire Safety Act | Inspection-based | 1 - 2 weeks |
| `rto-new-vehicle-reg` | Ministry of Road Transport (MoRTH) | National | Central Motor Vehicles Act | Based on class | 3 - 5 days |
| `hsrp-number-plate` | Society of Indian Auto Mfrs | National | MoRTH Gazette Order 2018 | ₹400 - ₹800 | 4 - 7 days |
| `autodcr-building-approval` | Municipal Town Planning / AutoDCR | Municipal | Maharashtra Unified DCPR | Area-based | 4 - 8 weeks |
| `iod-cc-commencement` | Municipal Building Proposal Dept | Municipal | MMC Act 1888 (Sec 337-347) | Project-based | 3 - 6 weeks |

---

## 8. Complete REST API Specification

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and metadata |
| `GET` | `/api/journey/current` | Returns currently active civic journey |
| `POST` | `/api/journey/interpret` | Interprets goal query and generates verified roadmap |
| `POST` | `/api/journey/steps/:stepId/status` | Updates step status with prerequisite blocker enforcement |
| `POST` | `/api/journey/steps/:stepId/documents/:docId/status` | Toggles document readiness status |
| `GET` | `/api/updates` | Retrieves active regulatory gazette circulars |
| `POST` | `/api/updates/:id/apply` | Injects circular changes into active roadmap |
| `POST` | `/api/updates/:id/review` | Admin review approval or rejection |
| `GET` | `/api/journey/adaptive-action` | Calculates next actionable step and parallel tasks |
| `POST` | `/api/copilot/message` | Context-grounded conversational AI query |
| `POST` | `/api/journey/ask` | Step-specific AI clarification query |
| `POST` | `/api/journey/reset` | Resets journey state to clean baseline |
| `POST` | `/api/journey/recheck` | Audits roadmap against active knowledge base |

---

## 9. End-to-End Citizen Execution Trace

```text
1. Citizen visits DishaSaathi (Theme: Auto-detected Light / Dark)
   └── Chooses preferred language (English, Hindi, or Marathi)
   └── Clicks "Sign In" or starts directly as a guest

2. Citizen enters Goal on "/create" or through the Dashboard Hero:
   └── Query: "I want to start a small bakery in Mumbai"
   └── Jurisdiction: Mumbai, Maharashtra

3. Backend API Execution: POST /api/journey/interpret
   ├── Gemini AI interprets intent and scale
   ├── procedureMapper.ts isolates Municipal (BMC), State (Maharashtra), and National (FSSAI/GST) procedures
   ├── roadmapValidator.ts validates acyclic dependency flow via DFS
   ├── adaptiveEngine.ts evaluates initial blockers and parallel opportunities
   └── Returns validated CivicJourney JSON object

4. Interactive Citizen Dashboard (/roadmap):
   ├── Compact Dependency Flowchart displays small step nodes (Steps 1 to 6)
   ├── "YOUR NEXT STEP" highlights Step 1 (Entity PAN Allocation)
   ├── Citizen clicks Step 1 node -> StepDetailModal opens
   ├── Citizen checks off required proofs -> readiness reaches 100%
   ├── Citizen clicks "Mark as Completed" -> Step 1 turns Green (COMPLETED)
   ├── Flowchart automatically unlocks Step 2 (Maharashtra Gumasta) with an animated connector

5. Handling Missing Documents (Document Vault):
   ├── Citizen visits "Documents" tab
   ├── For FSSAI license: Clicks "Apply Online ↗" -> Opens official FosCos portal directly
   ├── For Ward Health Inspection: Clicks "Where to Apply (Offline) 📍" -> Opens OfflineDocModal
   ├── Reviews ward office address, working hours (10 AM - 4:30 PM), and physical checklist
   ├── Submits at ward office, clicks "Mark as Submitted" -> Document marks ready and modal auto-closes

6. Regulatory Circular Change Detection:
   ├── Gazette feed shows circular regarding photo requirements for food businesses
   ├── Citizen clicks "View Gazette Excerpt (AI)" -> SourceExcerptModal displays exact legal clause
   ├── Citizen clicks "Apply Update" -> Active checklist dynamically updates

7. Theme & Export:
   ├── Citizen clicks the Moon/Sun toggle in the navbar to switch between Light & Dark mode
   ├── In Dark Mode, Gateway of India smoothly transitions to Gateway Night illumination
   ├── Citizen clicks "Download Roadmap (PDF)" -> Vector PDF generated and downloaded
```

---

## 10. How to Run & Verify the Project

### 1. Development Mode
Run both servers concurrently from the project root:
```bash
npm install
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 2. Run Automated Verification Tests
```bash
npm test
```
Executes all integration and reliability tests verifying API health, step blocker enforcement, and cycle detection.

### 3. Production Build
```bash
npm run build
```
Compiles both `server/dist` and `client/dist` cleanly with zero TypeScript errors.
