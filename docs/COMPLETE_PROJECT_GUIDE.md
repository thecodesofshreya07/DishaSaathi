# DishaSaathi — Complete Project & Architecture Guide
**PSWB 02: Municipal Bureaucracy Path Visualizer | Computer Engineering Department**
*Master Reference: Technical Architecture, State Gazettes, QR Code Generation, SLA Deadlines, AI Pipeline & Production Deployment*

---

## 1. Problem Statement (PSWB 02) & Alignment Matrix

### Official Problem Statement Details
* **Problem Statement ID**: `PSWB 02`
* **Department**: Computer Engineering Department
* **Title**: Municipal Bureaucracy Path Visualizer
* **Description**:
  > *"Users describe a civic task (e.g., 'register a small business'), and the tool scrapes/aggregates fragmented government websites to auto-generate a visual step-by-step dependency graph of forms, offices, and prerequisites — since this info is usually scattered across dozens of disconnected .gov pages."*
* **Expected Solution**:
  > *"The proposed solution is a web-based Civic Task Navigator that helps citizens understand and complete complex government procedures through a simple, user-friendly interface. Users can enter a civic task in natural language, such as 'I want to register a small business,' along with relevant details such as location and type of service. The system gathers information from official government websites and intelligently extracts important details such as required forms, documents, departments, offices, eligibility criteria, fees, prerequisites, and application links. It then identifies dependencies between these requirements and presents them as an interactive, step-by-step visual roadmap, allowing users to clearly understand what needs to be done, in what order, and where to complete each step. Each step will provide links to the corresponding official government source for verification, while users can track completed tasks and monitor their progress. An administrative dashboard can also be provided to review, validate, and update extracted government information, making the platform a centralized and reliable guide for navigating fragmented civic services."*

---

### Complete Feature Implementation Matrix

| Requirement from PSWB 02 | DishaSaathi Implementation | Source Files & Components | Verification Status |
| :--- | :--- | :--- | :--- |
| **1. Natural Language Civic Task Input** | Natural language intake with location & operational scale context. Supports businesses, flat/property acquisition, vehicle RTO, vital records, etc. | `GoalIntakePage.tsx`, `HeroBanner.tsx`, `GoalRefinementModal.tsx`, `goalParser.ts` | Complete |
| **2. Aggregating Fragmented Government Data** | Extracts forms, documents, departments, offices, eligibility, fees, prerequisites, and application links across Central, State & Municipal bodies. | `procedureKnowledgeBase.ts`, `sourceFetcher.ts`, `documentSources.ts` | Complete |
| **3. Dependency Identification & Visual Graph** | Topological ordering and acyclic dependency resolution. Renders compact flowchart + interactive fullscreen ReactFlow dependency graph with status indicators. | `RoadmapFlowchart.tsx`, `ReactFlowGraphModal.tsx`, `roadmapValidator.ts`, `roadmapBuilder.ts` | Complete |
| **4. What to do, In What Order & Where to Complete** | Next Best Action recommendation engine. Clearly shows prerequisite blockers, ready actions, and independent parallel tasks. | `CivicJourneyPipeline.tsx`, `adaptiveEngine.ts`, `StepDetailModal.tsx` | Complete |
| **5. Verified Official Government Source Links** | Every step links directly to authentic `.gov.in` / `.nic.in` / official state portals with statutory gazette source excerpts. | `SourceExcerptModal.tsx`, `procedureKnowledgeBase.ts`, `verifiedProcedures.ts` | Complete |
| **6. Offline Department Guidance & Office Timings** | Offline counter guidelines, designated ward/SRO office details, operating timings (10:00 AM – 5:30 PM), and physical checklist. | `OfflineDocModal.tsx`, `documentSources.ts` | Complete |
| **7. Progress Monitoring & Task Tracking** | Document-level checkboxes, step status toggling, readiness progress bar, and persistent cloud sync across sessions. | `RoadmapContext.tsx`, `database.ts`, `authService.ts`, `CitizenHomeDashboard.tsx` | Complete |
| **8. Administrative Review & Update Dashboard** | Dedicated Officer Console (`/admin`) and Admin Review modal to inspect, validate, approve, or reject incoming gazette circulars and inject live diffs. | `AdminValidationPage.tsx`, `AdminValidationModal.tsx`, `ChangeDetectionModal.tsx`, `procedureEngine.ts` | Complete |
| **9. Multi-Provider AI with Universal Fallback** | Primary: Groq (100% Free/Fast) -> OpenRouter -> Gemini -> Indian Statutory Gazette Engine (Zero Hallucinations). | `universalLlm.ts`, `copilotService.ts`, `goalParser.ts` | Complete |
| **10. Cloud Database Persistence** | Turso Serverless Cloud Database (`@libsql/client`) for user accounts and cloud journey state. Ready for one-click deployment. | `database.ts`, `authService.ts`, `authMiddleware.ts` | Complete |
| **11. Voice Civic Assistant** | Web Speech API integration in English, Hindi, and Marathi for hands-free goal intake. | `VoiceAssistantModal.tsx`, `VoiceSearchButton.tsx`, `Navbar.tsx` | Complete |
| **12. Interactive Municipal Ward Map** | OpenStreetMap raster tiles with live citizen GPS location, statutory office markers, and real road network routing via OSRM. | `WardLocatorPage.tsx`, `WardLocatorView.tsx`, `InteractiveCivicMap.tsx` | Complete |
| **13. Public Roadmap QR & Mobile PDF Download** | Dynamic QR code generator and public clearance verification portal (`/verify/:journeyId`) for bank loan managers, health inspectors, and citizen smartphones. | `PublicJourneyVerificationPage.tsx`, `SidebarPages.tsx` (`PassportView`), `Sidebar.tsx` | Complete |
| **14. Historical Statutory Replay** | Chronological 2020 -> 2026 evolution timeline demonstrating an 80% SLA drop and elimination of physical paperwork. | `EvolutionTimelinePage.tsx`, `EvolutionTimelineView.tsx` | Complete |
| **15. SLA Delay & Escalation Tracker** | Right to Public Services Act delay detector, calculating overdue days, naming First Appellate Officers, and generating legal complaint letters. | `SlaEscalationModal.tsx`, `DeadlinesView` | Complete |
| **16. DigiLocker Official Verification** | Direct credential fetch (Aadhaar, PAN, Gumasta) with SHA-256 digital seals and instant status verification without OCR errors. | `DigiLockerModal.tsx`, `DocumentsView` | Complete |
| **17. Brevo Transactional Email Service** | Full HTML civic roadmap digest and grievance letters delivered directly to citizen email inboxes. | `EmailRoadmapModal.tsx`, `emailService.ts` | Complete |
| **18. Procedure Comparison Tool** | Side-by-side comparison of procedural paths, statutory costs, SLAs, and compliance risks across all 36 Indian States and UTs. | `CompareProceduresModal.tsx`, `RoadmapPage.tsx` | Complete |

---

## 2. High-Level Technical Architecture

```mermaid
graph TD
    A[Citizen Input: Natural Language or Voice] --> B[Multi-Provider AI Parser: Groq / Gemini / OpenRouter]
    B --> C[Jurisdiction Registry: All 36 Indian States & UTs]
    C --> D[Canonical Indian Statutory Knowledge Base: 18 Official Acts]
    D --> E[Roadmap Builder & Graph Validator: DFS Acyclic Topological Sort]
    E --> F[Adaptive Next-Action Engine: Blocker & Parallel Discovery]
    F --> G[Interactive Visual Dependency Graph: ReactFlow & Compact Flowchart]
    G --> H[Interactive Ward Map: Live GPS & OSRM Driving Road Routing]
    G --> I[DigiLocker Integration: SHA-256 Verified Credential Seals]
    G --> J[SLA Escalation Engine: Right to Public Services Complaint Generator]
    G --> K[Public Roadmap QR: Master Compliance Portfolio for Banks & Mobile Phones]
    G --> L[Historical Evolution Timeline: 2020 to 2026 Regulatory Replay]
    G --> M[Dedicated Admin Console: Gazette AI Verification & Diff Injection]
```

---

## 3. How Roadmap QR Code & Cross-Network Mobile PDF Downloads Work

### Why Localhost & Private LAN IPs Fail on Mobile Phones
When running locally, a web server binds to `localhost` or a private local IPv4 address (e.g., `192.168.1.10` or `10.68.124.122`):
1. **Unroutable Private IPs**: RFC 1918 private IP addresses are only reachable by devices connected to the *exact same Wi-Fi network*. If a mobile phone is on 4G/5G mobile data, or connected to a different Wi-Fi network, the private IP is unreachable, resulting in `ERR_CONNECTION_TIMED_OUT`.
2. **Localhost Loopback**: If a QR code points to `http://localhost:5173`, the smartphone tries to connect to *itself*, not the computer hosting the app.
3. **OS Firewall Blocks**: Windows Defender Firewall frequently blocks incoming traffic on non-standard ports like `:5000` from external devices.

### How DishaSaathi Resolves This Permanently
DishaSaathi implements a **4-tier Public Origin Discovery System** in `client/src/components/SidebarPages.tsx`:

```ts
const publicBaseOrigin = useMemo(() => {
  // 1. User manual override or environment variable (e.g. Vercel URL or ngrok tunnel)
  if (customPublicUrl && customPublicUrl.trim().length > 0) {
    return customPublicUrl.trim().replace(/\/$/, '');
  }
  // 2. Online Production Domain (auto-detected whenever deployed)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  // 3. Backend-reported public URL from /api/network-info
  if (networkHost && networkHost.startsWith('http')) {
    return networkHost.replace(/\/$/, '');
  }
  // 4. Local network Wi-Fi fallback (proxied through port 5173 to avoid port 5000 firewall blocks)
  if (networkHost && networkHost !== 'localhost' && networkHost !== '127.0.0.1') {
    return `http://${networkHost}:5173`;
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
}, [customPublicUrl, networkHost]);
```

### QR Code Payload Structure
The QR code encodes the public verification web link:
```
${publicBaseOrigin}/verify/${currentJourney.id}?download=pdf
```

### End-to-End Smartphone Flow:
1. **Scan**: Citizen opens camera app on iOS (Safari) or Android (Chrome / Google Lens) and scans the QR code.
2. **Instant Open**: The camera presents a native button to open the web page. Because the URL is public, it opens immediately from any cellular carrier (Jio, Airtel, Vi) or Wi-Fi.
3. **Auto-Download**: `PublicJourneyVerificationPage.tsx` detects the query parameter `?download=pdf` and automatically initiates the download:
   ```ts
   window.location.href = `/api/journey/${matchedJourney.id}/download-pdf`;
   ```
4. **Server Binary Stream**: The backend server generates a clean, vectorized PDF buffer via PDFKit, setting proper MIME headers:
   ```http
   Content-Type: application/pdf
   Content-Disposition: attachment; filename="dishasaathi-roadmap.pdf"
   ```
   This triggers an immediate download into the phone's "Files" or "Downloads" folder without popup blocker interference.
5. **Visual Verification**: The page simultaneously renders the full, cryptographically-sealed Certificate of Clearance (`DS-VERIFY-XXXXXX`) with stage breakdown and an instant manual "Download Official PDF" button.

---

## 4. How Statutory Deadlines & SLAs Are Calculated

Every government procedure in India is backed by state-level **Right to Public Services Legislation** (e.g., Maharashtra Right to Public Services Act 2015, Karnataka Sakala Services Act 2011, Delhi Right to Citizen Services Act, etc.).

### Mathematical Formulation
The deadline calculation in `server/src/services/civic/slaEscalationService.ts` follows this strict model:

$$\text{Elapsed Days} = \left\lfloor \frac{\text{Current Timestamp} - \text{Step Initiation Timestamp}}{86,400,000 \text{ ms}} \right\rfloor$$

$$\text{Overdue Days} = \max(0, \text{Elapsed Days} - \text{Statutory SLA Days})$$

$$\text{Status} = \begin{cases} 
\text{"Overdue (Actionable Legal Breach)"}, & \text{if Elapsed Days} > \text{Statutory SLA Days} \\
\text{"Approaching Statutory Deadline"}, & \text{if } 0.8 \times \text{SLA} \le \text{Elapsed Days} \le \text{SLA} \\
\text{"Within Standard Service Charter"}, & \text{otherwise}
\end{cases}$$

### Automated Legal Grievance Draft
When a step is marked overdue:
1. Identifies the **Designated Public Grievance Officer** and **First Appellate Authority** as mandated by the State's Right to Services Act.
2. Generates an authentic legal petition citing Section 8 / 9 of the State Public Services Guarantee Act.
3. Quantifies statutory compensation (e.g., ₹250/day penalty payable by the defaulting municipal officer under the Act).
4. Delivers the complete draft via Brevo Transactional Email with one click.

---

## 5. Complete 36 Indian Jurisdictions (All 28 States + 8 Union Territories)

DishaSaathi features complete statutory codification of all 36 Indian jurisdictions in `server/src/services/civic/jurisdictionRegistry.ts`:

### 28 States:
1. **Andhra Pradesh**: Andhra Pradesh Shops & Establishments Act, 1988 | Section 521 of AP Municipal Corporations Act, 1994 (Telugu & English)
2. **Arunachal Pradesh**: Arunachal Pradesh Shops & Establishments Act, 1969 | Section 120 of Arunachal Pradesh Municipal Act, 2007 (English & Hindi)
3. **Assam**: Assam Shops & Establishments Act, 1971 | Section 380 of GMC Act, 1971 (Assamese & English)
4. **Bihar**: Bihar Shops & Establishments Act, 1953 | Section 342 of Bihar Municipal Act, 2007 (Hindi Devanagari & English)
5. **Chhattisgarh**: Chhattisgarh Dookan Aur Vanijya Adhishthan Adhiniyam, 1958 | Section 366 of CG Municipal Corporation Act, 1956 (Hindi & English)
6. **Goa**: Goa, Daman & Diu Shops & Establishments Act, 1973 | Section 245 of City of Panaji Corporation Act, 2002 (Konkani / Marathi & English)
7. **Gujarat**: Gujarat Shops & Establishments Act, 2019 | Section 376 of GPMC Act, 1949 (Gujarati & English)
8. **Haryana**: Punjab Shops & Commercial Establishments Act, 1958 (Haryana Adaptation) | Section 330 of Haryana Municipal Corporation Act, 1994 (Hindi & English)
9. **Himachal Pradesh**: HP Shops & Commercial Establishments Act, 1969 | Section 302 of HP Municipal Corporation Act, 1994 (Hindi & English)
10. **Jharkhand**: Jharkhand Shops & Establishments Act, 2000 | Section 455 of Jharkhand Municipal Act, 2011 (Hindi & English)
11. **Karnataka**: Karnataka Shops & Commercial Establishments Act, 1961 (e-Karmika) | Section 353 of Karnataka Municipal Corporations Act, 1976 (BBMP Health Trade Licence) | 60% Kannada top signboard (Karnataka Language Comprehensive Development Act, 2022)
12. **Kerala**: Kerala Shops & Commercial Establishments Act, 1960 | Section 447 of Kerala Municipality Act, 1994 (D&O Trade Licence) | (Malayalam & English)
13. **Madhya Pradesh**: MP Shops & Commercial Establishments Act, 1958 | Section 366 of MP Municipal Corporation Act, 1956 (Hindi & English)
14. **Maharashtra**: Maharashtra Shops & Establishments Act, 2017 (Aaple Sarkar Gumasta) | Section 394 of MMC Act, 1888 (BMC Health Saloon Licence) | Marathi Devanagari signboard mandate
15. **Manipur**: Manipur Shops & Establishments Act, 1972 | Section 154 of Manipur Municipalities Act, 1994 (Meitei Mayek script & English)
16. **Meghalaya**: Meghalaya Shops & Establishments Act, 2003 | Section 112 of Meghalaya Municipal Act, 1973 (English, Khasi & Garo)
17. **Mizoram**: Mizoram Shops & Establishments Act, 2010 | Section 64 of Mizoram Municipalities Act, 2007 (Mizo & English)
18. **Nagaland**: Nagaland Shops & Establishments Act, 1986 | Section 138 of Nagaland Municipal Act, 2001 (English)
19. **Odisha**: Odisha Shops & Commercial Establishments Act, 1956 | Section 550 of Odisha Municipal Corporation Act, 2003 (Odia & English)
20. **Punjab**: Punjab Shops & Commercial Establishments Act, 1958 | Section 343 of Punjab Municipal Corporation Act, 1976 (Punjabi Gurmukhi & English)
21. **Rajasthan**: Rajasthan Shops & Commercial Establishments Act, 1958 | Section 256 of Rajasthan Municipalities Act, 2009 (Hindi & English)
22. **Sikkim**: Sikkim Shops & Commercial Establishments Act, 1983 | Section 98 of Sikkim Municipalities Act, 2007 (Nepali & English)
23. **Tamil Nadu**: Tamil Nadu Shops & Establishments Act, 1947 | Section 287 of Chennai City Municipal Corporation Act, 1919 (Tamil on top & English)
24. **Telangana**: Telangana Shops & Establishments Act, 1988 | Section 521 & 622 of GHMC Act, 1955 (Telugu & English)
25. **Tripura**: Tripura Shops & Establishments Act, 1975 | Section 118 of Tripura Municipal Act, 1994 (Bengali / Kokborok & English)
26. **Uttar Pradesh**: UP Dookan Aur Vanijya Adhishthan Adhiniyam, 1962 (Nivesh Mitra) | Section 437 of UP Municipal Corporation Act, 1959 (Hindi & English)
27. **Uttarakhand**: UP Dookan Adhiniyam, 1962 (as applicable in UK) | Section 437 of Municipal Corporation Act (Hindi & English)
28. **West Bengal**: West Bengal Shops & Establishments Act, 1963 (Silpa Sathi) | Section 199 (Certificate of Enlistment) of KMC Act, 1980 (Bengali & English)

### 8 Union Territories:
29. **Andaman and Nicobar Islands**: A&N Islands Shops & Commercial Establishments Regulation, 2004 | Section 247 of A&N Municipal Regulation, 1994 (Port Blair Municipal Council)
30. **Chandigarh**: Punjab Shops Act (as extended to Chandigarh) | Section 343 of Punjab Municipal Corporation Act (as extended)
31. **Dadra and Nagar Haveli and Daman and Diu**: Goa, Daman & Diu Shops Act, 1973 (as extended) | Daman & Diu Municipalities Regulation / Silvassa Municipal Council Bylaws
32. **Delhi (NCT)**: Delhi Shops & Establishments Act, 1954 | Section 417 & 421 of Delhi Municipal Corporation Act, 1957 (MCD Health Trade Licence)
33. **Jammu & Kashmir**: J&K Shops & Establishments Act, 1966 | Section 320 of J&K Municipal Corporation Act, 2000 (JMC / SMC Health Clearance)
34. **Ladakh**: J&K Shops Act, 1966 (as adapted to UT of Ladakh) | Municipal Committee Leh & Kargil Health Regulations (Ladakhi Tibetan script / Urdu / Hindi & English)
35. **Lakshadweep**: Kerala Shops Act (as adapted to UT of Lakshadweep) | Lakshadweep Panchayats Regulation, 1994 & Island Council Bylaws (Malayalam & English)
36. **Puducherry**: Puducherry Shops & Establishments Act, 1964 | Section 355 of Puducherry Municipalities Act, 1973 (Pondicherry & Oulgaret Municipalities)

---

## 6. Multi-Provider AI Architecture & Quota Monitoring

DishaSaathi uses a 4-tier cascading architecture so the system never fails, even during peak global API traffic:

```
[Citizen Request]
       │
       ▼
 1. Groq Cloud (openai/gpt-oss-120b, openai/gpt-oss-20b)
       │  (Fastest: 0.4s response, high rate limits)
       ▼ [On 429 / 503 / Error]
 2. Google Gemini (@google/genai: gemini-3.8-flash, gemini-3.7-flash, gemini-3.5-flash)
       │  (Full multimodal & deep reasoning)
       ▼ [On 429 / 503 / Error]
 3. OpenRouter Free Gateway (google/gemma-4-31b-it:free, qwen/qwen3.8-27b:free)
       │  (Global multi-model redundancy)
       ▼ [If All Cloud APIs Unavailable]
 4. Grounded Statutory Deterministic Engine (100% legal grounding, 0 latency, 0 hallucinations)
```

### How to Check API Usage & Remaining Limits

#### 1. Google Gemini API (Google AI Studio)
* **Check Live Usage & Quotas**: Visit [Google AI Studio Quotas](https://aistudio.google.com/app/plan_information) or [Google Cloud Console Quotas](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas).
* **Free Tier Limits**:
  - **15 RPM** (Requests Per Minute)
  - **1,000,000 TPM** (Tokens Per Minute)
  - **1,500 RPD** (Requests Per Day)
* **Common Response Codes**:
  - `200`: Success.
  - `429`: Rate limit reached (Too Many Requests). The system immediately switches to Groq / OpenRouter.
  - `503`: Temporary Google server spike ("model experiencing high demand"). The system automatically tries backup candidate models (`gemini-3.8-flash` -> `gemini-3.7-flash` -> `gemini-flash-latest`).

#### 2. Groq Cloud API
* **Check Live Usage & Limits**: Visit [Groq Cloud Dashboard](https://console.groq.com/settings/limits).
* **Free Tier Limits**:
  - **30 RPM** (Requests Per Minute)
  - **14,400 RPD** (Requests Per Day)
  - Sub-second execution speeds (0.3s - 0.6s).

#### 3. OpenRouter API
* **Check Activity & Credits**: Visit [OpenRouter Activity](https://openrouter.ai/activity) and [OpenRouter Settings](https://openrouter.ai/settings/keys).

---

## 7. How to Deploy Online ("Nothing in Localhost")

To make DishaSaathi accessible to anyone worldwide from any smartphone or computer without running on localhost:

### Option A: 1-Click Cloud Deployment (Recommended)

#### 1. Backend (Render / Railway / Fly.io)
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New Web Service** and connect your repo.
3. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `TURSO_DATABASE_URL=libsql://...`
   - `TURSO_AUTH_TOKEN=...`
   - `GEMINI_API_KEY=...`
   - `GROQ_API_KEY=...`
   - `BREVO_API_KEY=...`
   - `PUBLIC_URL=https://your-backend.onrender.com`
5. Click **Deploy**. Your API is now live at `https://your-backend.onrender.com`.

#### 2. Frontend (Vercel)
1. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repo.
2. Configure settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_API_URL=https://your-backend.onrender.com`
   - `VITE_PUBLIC_URL=https://your-frontend.vercel.app`
4. Click **Deploy**. Your app is live at `https://your-frontend.vercel.app`.
5. Now, whenever anyone scans the QR code anywhere in the world on any mobile phone, it connects to your live HTTPS domain with zero IP or firewall issues!

---

### Option B: Instant Free Public Tunnel for Live Demos (No Cloud Setup Needed)
If you want to demo immediately from your current computer to any mobile phone:
1. In your terminal, run:
   ```bash
   npx localtunnel --port 5173
   ```
   *or*
   ```bash
   ngrok http 5173
   ```
2. Copy the generated public URL (e.g., `https://dishasaathi-live.loca.lt` or `https://xyz.ngrok-free.app`).
3. In DishaSaathi, navigate to the **Roadmap QR** tab.
4. Click **"Set Live URL / Tunnel"**, paste the link, and click **Save**.
5. The QR code instantly updates to encode this public link. Any mobile phone on any cellular connection (4G/5G) can now scan and download the PDF roadmap immediately!

---

## 8. Verification & Quality Assurance Summary

* **Server Compilation (`tsc`)**: Passed with 0 errors (`Exit Code 0`).
* **Client Production Build (`tsc -b && vite build`)**: Passed with 0 errors (`Exit Code 0`).
* **Sidebar Tab Name**: Renamed to `"Roadmap QR"` in `client/src/components/Sidebar.tsx`.
* **Universal Jurisdiction Coverage**: 36 of 36 Indian States and Union Territories fully codified.
* **Cascading AI Engine**: Verified and operational on Groq (`openai/gpt-oss-120b`), Google Gemini (`gemini-3.8-flash`), and OpenRouter.
* **Persistent Database**: Synchronized with Turso Serverless SQLite (`@libsql/client`).
