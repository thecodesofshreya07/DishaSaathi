export type VerificationStatus = 'Verified' | 'Needs Review' | 'Potentially Outdated' | 'Informational';
export type CivicVerificationStatus = 'VERIFIED' | 'DEMO' | 'NEEDS_VERIFICATION';
export type StepStatus = 'Completed' | 'In Progress' | 'Pending' | 'Blocked';
export type JurisdictionLevel = 'National' | 'State' | 'Municipal';
export type SourceType = 'OFFICIAL_GOVERNMENT' | 'OFFICIAL_DEPARTMENT' | 'OFFICIAL_MUNICIPAL' | 'DEMO';
export type MatchConfidence = 'DIRECT_MATCH' | 'RELEVANT' | 'REQUIRES_CLARIFICATION';

export const DATA_VERSION = 1;

export type CivicIntent = 
  | 'START_BUSINESS'
  | 'BUILD_PROPERTY'
  | 'REGISTER_VEHICLE'
  | 'GET_CERTIFICATE'
  | 'APPLY_FOR_LICENSE'
  | 'UNKNOWN';

export interface StructuredGoal {
  rawGoal: string;
  intent: CivicIntent;
  domain: string;
  activity: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  context: {
    scale?: string;
    type?: string;
    additionalNotes?: string;
  };
  entities: {
    businessType?: string;
    vehicleType?: string;
    propertyType?: string;
    certificateType?: string;
    scale?: string;
  };
  confidence: number;
  matchConfidence?: MatchConfidence;
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
  clarificationSuggestions?: string[];
}

export type CivicDocumentCategory = 
  | 'IDENTITY'
  | 'ADDRESS'
  | 'OWNERSHIP'
  | 'BUSINESS'
  | 'FINANCIAL'
  | 'PROPERTY'
  | 'PHOTOGRAPH'
  | 'OTHER';

export type CivicDocumentStatus = 'NOT_READY' | 'READY' | 'UPLOADED';

export interface SourceEvidence {
  id: string;
  title: string;
  url: string;
  department: string;
  domain: string;
  lastChecked: string;
  verificationStatus: VerificationStatus;
  confidenceScore?: number;
  sourceTitle?: string;
  sourceAuthority?: string;
  sourceUrl?: string;
  sourceType?: SourceType;
  lastVerified?: string;
  isAvailable?: boolean;
  authority?: string;
}

export type DocumentPriority = 'Blocking' | 'Recommended' | 'Future';

export interface CivicDocument {
  id: string;
  name: string;
  description?: string;
  requiredFor?: string;
  category?: CivicDocumentCategory;
  status?: CivicDocumentStatus;
  isMandatory: boolean;
  required?: boolean;
  priority?: DocumentPriority;
  neededFor?: string;
  blockingSteps?: string[];
  sourceUrl?: string;
  verificationStatus?: CivicVerificationStatus;
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  department: string;
  authority?: string;
  description: string;
  plainLanguageSummary?: string; // What this means
  whyRequired: string; // Why you need it
  status: StepStatus;
  documents: CivicDocument[];
  prerequisites: string[];
  dependsOn?: string[];
  parallelWith?: string[];
  fee: {
    amount: string;
    description?: string;
  };
  processingTime: string;
  applicationMode: 'Online' | 'Offline' | 'Hybrid';
  applicationUrl: string;
  source: SourceEvidence;
  sourceTitle?: string;
  sourceAuthority?: string;
  sourceUrl?: string;
  sourceType?: SourceType;
  lastVerified?: string;
  isSourceAvailable?: boolean;
  verificationStatus?: CivicVerificationStatus;
  jurisdictionLevel?: JurisdictionLevel;
  procedureId?: string;
  version?: string;
  effectiveFrom?: string;
  hasUpdate?: boolean;
  updateDetails?: {
    date: string;
    summary: string;
    addedRequirement?: string;
  };
  whyAmISeeingThis?: {
    goal: string;
    activity: string;
    location: string;
    relevantProcedure: string;
    source: string;
    verificationStatus: CivicVerificationStatus;
  };
  position?: { x: number; y: number };
}

export interface ActionRecommendation {
  primaryAction: {
    stepId: string;
    stepNumber: number;
    title: string;
    department: string;
    authority?: string;
    actionType: 'PREPARE_DOCUMENTS' | 'APPLY_ONLINE' | 'AWAIT_APPROVAL' | 'COMPLETE_STEP';
    description: string;
    reason: string;
    ctaText: string;
    isParallelAlternative?: boolean;
  };
  parallelActions: Array<{
    stepId: string;
    stepNumber: number;
    title: string;
    department: string;
    actionType: string;
    description: string;
    ctaText: string;
  }>;
  blockedActions: Array<{
    stepId: string;
    stepNumber: number;
    title: string;
    reason: string;
    blockingPrerequisites: string[];
    blockingDocuments: string[];
  }>;
  journeyHealth: 'ON_TRACK' | 'BLOCKER_NEEDS_ATTENTION' | 'WAITING_FOR_VERIFICATION';
  healthMessage: string;
}

export interface RoadmapDiff {
  hasChanges: boolean;
  addedSteps: Array<{ id: string; stepNumber: number; title: string }>;
  removedSteps: Array<{ id: string; title: string }>;
  changedSteps: Array<{ id: string; title: string; changes: string[] }>;
  preservedProgressCount: number;
  summary: string;
}

export interface CopilotEvidence {
  procedureName: string;
  authority: string;
  sourceTitle: string;
  sourceUrl?: string;
  sourceType?: SourceType;
  verificationStatus: CivicVerificationStatus;
  lastVerified?: string;
  isAvailable?: boolean;
}

export type CopilotResponseType = 
  | 'ANSWER' 
  | 'CLARIFICATION' 
  | 'UNKNOWN' 
  | 'SOURCE_REQUIRED' 
  | 'NEXT_ACTION' 
  | 'DOCUMENT_GUIDANCE';

export interface CopilotResponse {
  answer: string;
  responseType?: CopilotResponseType;
  evidence?: CopilotEvidence;
  basedOnText?: string;
  uncertaintyNotice?: string;
  nextActionRecommendation?: string;
  suggestedFollowUps?: string[];
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  goal: string;
  city: string;
  state: string;
  additionalContext: string;
  iconName: string;
  estimatedMilestones: number;
}

export interface CivicJourney {
  id: string;
  title: string;
  query: string;
  location: string;
  category: string;
  dataVersion?: number;
  jurisdictionScope?: string;
  structuredGoal?: StructuredGoal;
  totalSteps: number;
  completedSteps: number;
  pendingDocuments: number;
  totalDocuments?: number;
  readyDocuments?: number;
  lastUpdated: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  steps: ProcedureStep[];
  clarification?: {
    needed: boolean;
    question: string;
    suggestions: string[];
  };
}

export interface GovernmentUpdate {
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

export interface GoalIntake {
  goal: string;
  state: string;
  city: string;
  additionalContext?: string;
}

export type GenerationStageId = 'understanding' | 'requirements' | 'dependencies' | 'preparing';

export interface GenerationStage {
  id: GenerationStageId;
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
}
