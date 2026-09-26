# DishaSaathi — Data Model Specification

## Core Entities

### 1. `CivicJourney`
```typescript
interface CivicJourney {
  id: string;
  title: string;
  query: string;
  location: string;
  category: string;
  totalSteps: number;
  completedSteps: number;
  pendingDocuments: number;
  lastUpdated: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  steps: ProcedureStep[];
}
```

### 2. `ProcedureStep`
```typescript
interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  department: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked';
  whyRequired: string;
  documents: CivicDocument[];
  prerequisites: string[]; // Step IDs
  fee: {
    amount: string;
    description?: string;
  };
  processingTime: string;
  applicationMode: 'Online' | 'Offline' | 'Hybrid';
  applicationUrl: string;
  source: SourceEvidence;
  hasUpdate?: boolean;
  updateDetails?: {
    date: string;
    summary: string;
    addedRequirement?: string;
  };
  position?: { x: number; y: number };
}
```

### 3. `GovernmentUpdate`
```typescript
interface GovernmentUpdate {
  id: string;
  type: 'Important Update' | 'Fee Update' | 'New Service';
  date: string;
  title: string;
  description: string;
  serviceId?: string;
  sourceUrl?: string;
  previousValue?: string;
  newValue?: string;
  reviewStatus: 'Approved' | 'Pending Review' | 'Rejected';
}
```
