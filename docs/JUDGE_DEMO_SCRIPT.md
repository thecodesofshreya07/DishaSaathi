# DishaSaathi — Judge Presentation Script (2.5 Minutes)

> **Theme**: Municipal Bureaucracy Path Visualizer (PSWB02)  
> **Target Audience**: Hackathon Evaluation Jury  
> **Total Duration**: 2 minutes 40 seconds  

---

### [0:00 – 0:20] 1. The Core Problem
*(Open the Landing Page at `http://localhost:5173`)*

**Presenter**:
> "Good evening, judges. If an entrepreneur in India decides to open a small bakery, what happens? They face a bureaucratic maze: five different portals, hidden prerequisites, and conflicting department rules. If they ask a generic AI chatbot, they get hallucinated advice or regulations from the wrong state.
> 
> We built **DishaSaathi** to solve this. Disha means direction, Saathi means companion. DishaSaathi converts a citizen’s natural-language goal into a verified, jurisdiction-aware, dependency-ordered roadmap."

---

### [0:20 – 0:45] 2. Goal Intake & Jurisdiction Mapping
*(Click **"Create My Roadmap"**)*

**Presenter**:
> "Here, a citizen simply describes what they want to do: *'I want to start a small bakery in Mumbai.'* They don’t need to know municipal legal codes or department names. 
> 
> DishaSaathi detects the intent: **Food Business**, activity: **Bakery**, and jurisdiction: **Mumbai, Maharashtra**.
> 
> Let’s generate the roadmap."
*(Click **"Generate My Roadmap"**)*

---

### [0:45 – 1:15] 3. The Generated Roadmap & "Your Next Step"
*(Arrive at `/roadmap`)*

**Presenter**:
> "Within seconds, the citizen gets a clear, 6-step administrative journey.
> 
> Notice right away at the top: **'YOUR NEXT STEP'**. It tells the citizen exactly what to do first—assemble PAN and business identity documents—and explains *why this matters*: because without them, subsequent state and central registrations are blocked.
> 
> Each step card displays its current state: **CURRENT**, **UPCOMING**, or **BLOCKED**."

---

### [1:15 – 1:40] 4. Dependencies & Document Intelligence
*(Click on **Step 3 (Maharashtra Gumasta)** or **Step 6 (BMC Health Trade License)**)*

**Presenter**:
> "Let’s look at Step 6: BMC Health License. Notice that it is clearly marked **BLOCKED**. DishaSaathi prevents the citizen from applying prematurely, explaining that Step 3 (Gumasta) and Step 4 (FSSAI) are mandatory prerequisites under Section 394 of the Mumbai Municipal Corporation Act.
> 
> In the step modal, every document is categorized—identity, premises, ownership. As the citizen marks documents ready, the readiness tracker updates live, recalculating blockers in real time."

---

### [1:40 – 2:00] 5. Grounded Civic Copilot
*(Open **Civic Copilot** from the top bar)*

**Presenter**:
> "DishaSaathi includes a grounded Civic Copilot that knows the user's active roadmap.
> Let’s ask: *'What can I do in parallel?'*
> 
> The copilot identifies that while waiting for municipal health license scheduling, the citizen can concurrently complete FSSAI registration and GSTIN application.
> 
> And if we ask something completely out of scope, like *'How do I build a rocket?'*, it refuses to hallucinate and tells the citizen honestly that it only provides verified civic guidelines."

---

### [2:00 – 2:20] 6. Trust & Official Evidence
*(Open **"View Sources"**)*

**Presenter**:
> "Every single step is grounded in official evidence. You can inspect the statutory authority, municipal department, and click through to live, verified `.gov.in` portals—like FoSCoS, Aaple Sarkar, and MCGM.
> 
> We label each source clearly: Verified, Needs Verification, or Demo."

---

### [2:20 – 2:40] 7. Closing: Why DishaSaathi is Different
*(Navigate back to the main roadmap overview)*

**Presenter**:
> "DishaSaathi is not just another chatbot that outputs text paragraphs. It is an end-to-end procedural intelligence system:
> - **Jurisdiction-Aware**: Excludes Mumbai BMC rules if you are in Bengaluru.
> - **Dependency-Aware**: Enforces prerequisite graph ordering.
> - **Source-Grounded**: Backed by official legislation.
> 
> DishaSaathi gives every citizen a clear, evidence-backed path through government bureaucracy. Thank you."
