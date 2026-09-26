# DishaSaathi — System Architecture

## 1. End-to-End Pipeline

DishaSaathi organizes complex civic bureaucracy into a coherent, source-grounded, dependency-aware pipeline:

```text
Citizen / User
    │
    ▼
Frontend (React 19, TypeScript, Tailwind CSS, Lucide, ReactFlow)
    │
    ▼
Goal Intake (Natural-language query, location, context)
    │
    ▼
Goal Parser (LLM extraction with deterministic fallback parser)
    │  [intent, category, location, activity, scale]
    ▼
Jurisdiction Engine & Procedure Matcher
    │  [Municipal (City) → State → National fallback]
    │  [Boundary check: isolates out-of-jurisdiction ULB rules]
    ▼
Roadmap Builder & Graph Validator
    │  [DFS cycle detection, self-dependency rejection]
    │  [Prerequisite closure & document-step binding]
    ▼
Roadmap State & Adaptive Engine
    │  [DATA_VERSION = 1 validation & safe localStorage sync]
    │  [Primary blocker detection & available parallel actions]
    ▼
Grounded Civic Copilot
    │  [Structured response types: ANSWER | DOCUMENT_GUIDANCE | NEXT_ACTION | UNKNOWN]
    │  [Source-cited answers, strict anti-hallucination guardrail]
    ▼
Change Detection & Human-in-the-Loop Admin Layer
       [Semantic Regulatory Diff, Gazette update queue]
```

---

## 2. Core Architectural Layers

### A. Goal Intake & Parser Layer
- **Input**: Natural-language query (e.g. *"I want to open a small bakery in Mumbai"*).
- **Processing**: Extracts structured intent (`START_BUSINESS`), activity (`FOOD_BUSINESS`), and location (`Mumbai, Maharashtra`).
- **Resilience**: If the AI model times out or encounters network limits, the built-in regex-based **Fallback Parser** extracts entities locally without failing the user request.

### B. Jurisdiction Engine & Procedure Matcher
- **Boundary Isolation**: Evaluates whether municipal rules apply. BMC Mumbai procedures are strictly isolated from non-Mumbai cities.
- **Scope Transparency**: Automatically assigns `jurisdictionScope` (`Mumbai Municipal Guidance`, `Maharashtra State Guidance`, or `National Guidance`) so citizens are informed of the administrative tier.
- **Clarification Trigger**: If a goal is too ambiguous (`"I want to start a business"`), the engine sets confidence to `REQUIRES_CLARIFICATION` and returns a targeted question rather than guessing.

### C. Dependency Graph & Roadmap Builder
- **Cycle Detection**: The `RoadmapValidator` runs a Depth-First Search with recursion stacks to mathematically prevent circular dependencies ($A \to B \to C \to A$) and self-references ($A \to A$).
- **Document-Step Binding**: Steps directly provide their required documents. Orphan documents are eliminated.
- **Version Stamping**: Roadmaps are stamped with `DATA_VERSION = 1`.

### D. Source Layer & Evidence Grounding
- **Strict Verification**: Every procedure links to an official authority (`OFFICIAL_GOVERNMENT`, `OFFICIAL_DEPARTMENT`, or `OFFICIAL_MUNICIPAL`) with a verified HTTPS portal link.
- **Graceful Source Failure**: If a government portal becomes temporarily unreachable, the system displays *"Official source currently unavailable"* without corrupting the roadmap.

### E. Document Layer
- Bidirectional linkage: `Document -> requiredFor -> Step` and `Step -> requiredDocuments -> Document[]`.
- Document status updates dynamically re-evaluate step blockers in the Adaptive Engine.

### F. Persistence & Storage Validation
- Persistent storage: `localStorage` stores the active journey, step completion, and document readiness.
- **Version Control**: If cached state has an obsolete schema or corrupted JSON, `validateStoredJourney` cleanly discards the stale cache and restores the default state without throwing runtime exceptions.

### G. Civic Copilot & Anti-Hallucination Guardrails
- **Structured Response Types**: Every response is categorized into `ANSWER`, `DOCUMENT_GUIDANCE`, `NEXT_ACTION`, `SOURCE_REQUIRED`, `CLARIFICATION`, or `UNKNOWN`.
- **Anti-Hallucination**: Queries outside the verified administrative knowledge base trigger an explicit declaration: *"I don't have verified information about that in the current DishaSaathi knowledge base."*
