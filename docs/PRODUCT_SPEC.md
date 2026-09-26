# DishaSaathi — Product Specification

## 1. Product Identity

**Product Name:** DishaSaathi

**Tagline:**
**From fragmented information to one clear journey.**

**One-line description:**
DishaSaathi is an AI-powered civic procedure navigator that converts fragmented government information into a personalized, source-verified, dependency-aware roadmap.

### Core principle

> Government information changes. Your roadmap should change with it.

DishaSaathi should not behave like a generic chatbot or a government-service search engine.

The primary product is the **verified visual roadmap**.

The AI is the mechanism used to understand the citizen's goal, retrieve relevant information, explain it, and construct the roadmap.

---

# 2. Problem

Government procedures are fragmented across:

* Multiple government websites
* Departments
* Forms
* PDFs
* Notifications
* Circulars
* Application portals
* Eligibility rules
* Document requirements
* Office information

A citizen often has to discover these pieces independently and figure out:

* What do I need?
* Which department handles it?
* Which documents are required?
* What has to happen first?
* What can happen simultaneously?
* Where do I apply?
* What is blocking me?
* Which information is current?
* What changed recently?

DishaSaathi solves this by connecting these fragmented pieces into one understandable journey.

---

# 3. Primary User Flow

The main experience must be:

User describes what they want to accomplish.

Example:

> "I want to start a small bakery in Mumbai."

DishaSaathi:

1. Understands the user's intent.
2. Extracts relevant context such as location and task category.
3. Asks only necessary clarification questions.
4. Retrieves relevant government information.
5. Identifies requirements, documents, departments, portals and prerequisites.
6. Builds a dependency-aware roadmap.
7. Shows official sources for important information.
8. Shows verification/freshness status.
9. Allows the user to track progress.
10. Allows the user to save the journey.

---

# 4. MVP — MUST BUILD

Do NOT attempt to build every feature in the original product blueprint.

The MVP must focus on one spectacular end-to-end workflow.

## Feature 1 — Natural Language Task Input

Homepage should begin with:

"What are you trying to accomplish?"

Large input box.

Example:

> I want to start a small bakery in Mumbai.

Button:

**Build My Roadmap →**

The user should not have to select department → service → form before describing their goal.

---

# 5. Feature 2 — AI Task Understanding

The system should convert natural language into structured information.

Example:

Input:

"I want to start a small bakery in Mumbai."

Structured result:

```json
{
  "task": "Start a food business",
  "location": "Mumbai, Maharashtra",
  "category": "Food Business",
  "intent": "Business Setup"
}
```

The system may ask clarification questions if required.

Do not ask unnecessary questions.

---

# 6. Feature 3 — Procedure Roadmap

After understanding the task, generate a visual roadmap.

Example:

START
↓
Eligibility
↓
Business Registration
↓
Shop & Establishment
↓
FSSAI Registration
↓
Municipal Permission
↓
Fire/Safety Requirements
↓
GST / Applicable Registration
↓
Final Compliance
↓
DONE

IMPORTANT:

This is only an illustrative demo workflow.

Do NOT present fictional requirements, fees, deadlines or official claims as verified facts.

The actual displayed requirements must come from the application's indexed source dataset or clearly marked demo data.

---

# 7. Feature 4 — Interactive Dependency Graph

The roadmap is the visual centerpiece.

Use React Flow.

The graph must support:

* Nodes
* Connections
* Zoom
* Pan
* Minimap
* Clickable nodes
* Dependency highlighting
* Completed state
* Blocked state
* Warning/change state

Example:

Business Information
↓
Business Registration
↓
┌────┴────┐
↓         ↓
Shop       FSSAI
↓         ↓
└────┬────┘
↓
Compliance

When a user clicks a node, open a detail panel.

---

# 8. Feature 5 — Step Detail Panel

Each procedure node should show:

## Example

FSSAI Registration

Status:
✓ Verified

Why is this needed?

Short plain-language explanation.

Documents:

* Identity proof
* Address proof
* Business details

Prerequisites:

* Business information

Responsible authority:

Relevant department/authority

Application mode:

Online / Offline

Official source:

[Open Official Source]

Last verified:

Date

Source status:

✓ Verified from official source

Buttons:

[Mark Complete]

[Open Official Source]

IMPORTANT:

Do not invent official facts.

If the application does not have verified information, explicitly display:

"Demo information — source verification pending."

---

# 9. Feature 6 — Source Evidence

Trust is one of DishaSaathi's core differentiators.

Every important factual requirement should have source metadata.

Each source record should contain:

* Source title
* Official URL
* Department
* Domain
* Last checked
* Verification status

Use these states:

### Verified

Directly confirmed from an official source.

### Needs Review

Information has been extracted but has not yet been validated.

### Potentially Outdated

The source changed or could not be recently verified.

### Informational

General explanation rather than an official requirement.

Do not display meaningless AI confidence percentages to citizens.

---

# 10. Feature 7 — "Why do I need this?"

Every important step should have a simple explanation.

Example:

WHY DO I NEED THIS?

"Fire-safety clearance may be required to verify that applicable safety requirements are met before a business operates."

Then:

Official basis:
[View Source]

The explanation must be grounded in the available source information.

---

# 11. Feature 8 — Blocked Step Detection

If a user attempts a step before its prerequisite is complete:

Show:

🔒 STEP BLOCKED

You need to complete:

✓ Business Information

✕ Required prerequisite

Complete this first:

[Business Registration]

Do not simply show a generic error.

---

# 12. Feature 9 — Progress Tracking

Users should be able to mark steps complete.

Example:

MY JOURNEY

████████░░ 80%

✓ Eligibility
✓ Documents
✓ Business Registration
● FSSAI
○ Municipal Permission

The next available step should be visually emphasized.

---

# 13. Feature 10 — Government Information Change Detection

This is the major differentiating feature.

DishaSaathi should conceptually support:

Official Source
↓
Previous Version
↓
New Version
↓
Change Detection
↓
Change Classification
↓
Affected Procedure
↓
Roadmap Update

For the hackathon MVP, this may use a controlled/demo dataset rather than a production crawler.

Example:

BEFORE

Required documents:

* Identity proof
* Address proof
* Business details

AFTER

Required documents:

* Identity proof
* Address proof
* Business details
* Photograph

Show:

⚠ REQUIREMENT UPDATED

New requirement:

* Photograph

[What Changed?]

[View Source]

The UI must clearly distinguish a simulated/demo change from a live verified government update.

---

# 14. Feature 11 — "What Changed?"

Create a dedicated comparison view.

Example:

FSSAI Registration

Previous version:
3 requirements

Current version:
4 requirements

ADDED

* Photograph

Source:
Official government source

This should visually highlight the difference.

---

# 15. Feature 12 — Admin Validation

Create a lightweight admin interface.

Admin dashboard should show:

Sources
Changes
Pending Reviews
Procedures

Example:

NEW CHANGE DETECTED

Source:
Official Government Portal

Change:
Required document

Previous:
Address Proof

Current:
Address Proof + Photograph

Actions:

[Approve]

[Reject]

[Compare]

The purpose is human-in-the-loop verification.

---

# 16. The Core Architecture

Use:

Frontend:

* React
* Vite
* Tailwind CSS
* React Flow
* Lucide React
* Framer Motion where useful

Backend:

* Node.js
* Express

Database:

* PostgreSQL / Supabase

AI:

* LLM API
* Structured JSON output
* RAG/source-grounded responses

Search/retrieval:

* PostgreSQL + pgvector if practical

Do not introduce unnecessary infrastructure unless required.

Do not use Neo4j, Elasticsearch, multiple microservices, Kubernetes, etc. for the initial MVP.

Keep the architecture understandable and deployable.

---

# 17. AI Architecture

Never use:

User → LLM → Answer

Use:

User
↓
Intent Detection
↓
Retrieve relevant source information
↓
Retrieve structured procedure data
↓
Dependency Engine
↓
LLM explanation/generation
↓
Source validation
↓
Roadmap

The AI must NOT invent government requirements.

The system should prioritize retrieved source evidence.

Important factual statements should reference their source.

---

# 18. Dependency Engine

Represent procedures as structured entities.

Example:

```text
Service
Requirement
Document
Department
Authority
Application
Source
```

Relationships:

```text
REQUIRES
DEPENDS_ON
HANDLED_BY
SUBMITTED_TO
APPLIES_TO
SOURCE
UPDATED_BY
```

The dependency engine determines:

* prerequisite relationships
* available parallel steps
* blocked steps
* applicable steps
* next available step

The visual graph is generated from these relationships.

---

# 19. Suggested Database Entities

Start with:

### services

* id
* name
* description
* department
* jurisdiction
* status

### requirements

* id
* service_id
* name
* description
* mandatory
* source_id

### dependencies

* id
* from_service_id
* to_service_id
* relationship_type

### sources

* id
* title
* url
* domain
* department
* last_checked
* verification_status

### changes

* id
* source_id
* change_type
* previous_value
* current_value
* detected_at
* review_status

### workflows

* id
* task
* location
* created_at
* status

### workflow_steps

* id
* workflow_id
* service_id
* status
* order

---

# 20. Demo Dataset

For the hackathon, use a small curated dataset.

Do NOT pretend to have indexed the entire Indian government.

Start with a limited number of procedures relevant to the demonstration.

Each dataset entry must include:

* procedure
* requirements
* dependencies
* department
* official source
* verification status

Clearly label any simulated data.

---

# 21. Main Demo Scenario

The primary hackathon demo should be:

> "I want to start a small bakery in Mumbai."

Demo sequence:

### Scene 1

User enters the request.

### Scene 2

DishaSaathi understands the task and asks minimal questions.

### Scene 3

DishaSaathi generates a personalized roadmap.

### Scene 4

The dependency graph appears.

### Scene 5

Judge clicks a procedure.

Show:

* Why
* Documents
* Prerequisites
* Authority
* Official source
* Verification status
* Last verified

### Scene 6

Show a blocked step.

DishaSaathi explains what prerequisite is missing.

### Scene 7

Trigger a controlled demo source change.

Example:

3 documents → 4 documents

### Scene 8

DishaSaathi detects the change.

### Scene 9

The affected roadmap node displays a warning.

### Scene 10

Open "What Changed?"

Show the exact difference.

### Scene 11

Admin reviews and approves the change.

### Scene 12

The user journey updates.

This is the primary story.

---

# 22. What NOT to Build Initially

Do NOT spend the first development phase on:

* Full authentication
* Payments
* WhatsApp integration
* Native mobile app
* Massive government database
* Actual government application submission
* Training a custom LLM
* Complex microservices
* Full document storage/security infrastructure
* 30 different workflows
* Unnecessary dashboards
* Fake government APIs
* Fake real-time government data

The goal is one extremely polished end-to-end experience.

---

# 23. UI / UX Direction

DishaSaathi should NOT look like a generic AI website.

Avoid:

* Purple AI gradients everywhere
* Glowing AI orb
* Generic chatbot landing page
* Excessive glassmorphism
* Huge "AI POWERED" text

Design direction:

* Premium civic-tech
* Clean
* Trustworthy
* White space
* Strong typography
* Deep navy
* Blue
* Green for verified/completed
* Amber for warnings
* Clear cards
* Subtle animations

The dependency graph should be the visual hero.

---

# 24. Homepage

Hero heading:

# Government processes shouldn't feel like a maze.

Subheading:

Tell DishaSaathi what you're trying to accomplish. We'll turn fragmented government information into one clear, source-verified journey.

Input:

"What are you trying to accomplish?"

Example:

"I want to start a small bakery in Mumbai."

Button:

**Build My Roadmap →**

Below the input:

Popular journeys

* Start a Food Business
* Birth Certificate
* Trade License
* Water Connection
* Property Service

---

# 25. Product Differentiation

If a judge asks:

"Why not just use ChatGPT?"

Answer:

> Chatbots answer questions. DishaSaathi maintains the procedure.

Chatbot:

Question
↓
Answer

DishaSaathi:

Goal
↓
Jurisdiction
↓
Official sources
↓
Requirements
↓
Dependencies
↓
Visual roadmap
↓
Source tracking
↓
Change detection
↓
Updated roadmap

The product is not merely an AI chatbot.

The product is a **procedure intelligence and dependency layer over fragmented government information**.

---

# 26. If a judge asks "What is innovative?"

Answer:

> "We don't just search government websites. DishaSaathi connects information from fragmented official sources, understands the dependencies between procedures, verifies the evidence behind each step, and keeps the citizen's roadmap aware of changes."

---

# 27. Success Criteria

The MVP is successful when a judge can understand the entire value proposition within approximately 60 seconds.

They should see:

1. A real-world civic problem.
2. Natural-language input.
3. AI understanding.
4. A personalized roadmap.
5. An interactive dependency graph.
6. Source-backed information.
7. A blocked-step explanation.
8. A simulated government information change.
9. Automatic roadmap impact.
10. Human/admin validation.

The interface should feel like a real product, not a collection of hackathon screens.

---

# 28. Development Principle

Build in this order:

PHASE 1
Foundation
↓
PHASE 2
Landing page
↓
PHASE 3
Task understanding
↓
PHASE 4
Roadmap generation
↓
PHASE 5
Interactive dependency graph
↓
PHASE 6
Source/evidence panel
↓
PHASE 7
Progress + blocked steps
↓
PHASE 8
Change detection demo
↓
PHASE 9
Admin validation
↓
PHASE 10
Polish + animations + demo preparation

Do not move to the next phase until the previous phase works.

---

# 29. Most Important Rule

Build fewer features, but make the core experience exceptional.

The centerpiece is:

**Natural language → verified information → dependency graph → actionable journey → change-aware roadmap.**

Everything else is secondary.
