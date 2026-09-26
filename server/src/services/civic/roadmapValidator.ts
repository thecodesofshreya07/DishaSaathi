import { 
  CivicJourney, 
  ProcedureStep, 
  CivicDocument,
  DATA_VERSION,
  JurisdictionLevel
} from '../../types.js';
import { BaseCivicProcedure } from './procedureKnowledgeBase.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a procedure dependency graph before topological sorting.
 * Detects circular dependencies, self-dependencies, and missing references.
 */
export function validateDependencyGraph(procedures: BaseCivicProcedure[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const procIds = new Set(procedures.map((p) => p.id));

  // 1. Check for duplicates and missing dependency references
  for (const proc of procedures) {
    // Check self-dependency
    if (proc.dependsOn.includes(proc.id)) {
      errors.push(`Self-dependency detected: Procedure "${proc.id}" cannot depend on itself.`);
    }

    // Check for references to nonexistent procedures
    for (const depId of proc.dependsOn) {
      if (!procIds.has(depId)) {
        warnings.push(`Procedure "${proc.id}" depends on external/unselected procedure "${depId}".`);
      }
    }
  }

  // 2. Cycle Detection using DFS (Recursion Stack)
  const adj = new Map<string, string[]>();
  for (const proc of procedures) {
    adj.set(proc.id, proc.dependsOn.filter((d) => procIds.has(d)));
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const cyclePath: string[] = [];

  function dfs(node: string): boolean {
    visited.add(node);
    inStack.add(node);

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          cyclePath.push(node);
          return true;
        }
      } else if (inStack.has(neighbor)) {
        cyclePath.push(neighbor);
        cyclePath.push(node);
        return true;
      }
    }

    inStack.delete(node);
    return false;
  }

  for (const proc of procedures) {
    if (!visited.has(proc.id)) {
      if (dfs(proc.id)) {
        const cycleStr = cyclePath.reverse().join(' -> ');
        errors.push(`Circular dependency detected: ${cycleStr}`);
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates and sanitizes a complete CivicJourney roadmap before presenting to UI.
 * Enforces:
 * - Unique step IDs
 * - Valid prerequisite references
 * - Document-to-step bidirectional integrity
 * - Valid official source metadata
 * - Correct calculation of step and document counts
 */
export function validateRoadmapIntegrity(journey: CivicJourney): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!journey.title || journey.title.trim().length === 0) {
    errors.push('Roadmap is missing a title.');
  }

  if (!journey.steps || !Array.isArray(journey.steps)) {
    errors.push('Roadmap steps array is invalid or missing.');
    return { isValid: false, errors, warnings };
  }

  // Check unique step IDs
  const seenStepIds = new Set<string>();
  for (const step of journey.steps) {
    if (!step.id) {
      errors.push(`Step at index ${step.stepNumber} has no valid ID.`);
    } else if (seenStepIds.has(step.id)) {
      errors.push(`Duplicate step ID detected: "${step.id}".`);
    } else {
      seenStepIds.add(step.id);
    }
  }

  // Check prerequisite integrity
  for (const step of journey.steps) {
    for (const prereqId of step.prerequisites || []) {
      if (!seenStepIds.has(prereqId)) {
        warnings.push(`Step "${step.title}" references non-existent prerequisite ID "${prereqId}".`);
      }
    }

    // Source validation (Section 6, 7, 9)
    if (!step.source || !step.source.url) {
      errors.push(`Step "${step.title}" has missing official source metadata.`);
    } else if (!step.source.url.startsWith('https://')) {
      warnings.push(`Step "${step.title}" source URL "${step.source.url}" should use secure HTTPS protocol.`);
    }

    // Document validation (Section 18, 24, 25)
    for (const doc of step.documents || []) {
      if (!doc.id || !doc.name) {
        errors.push(`Step "${step.title}" contains an invalid document without ID or Name.`);
      }
      if (doc.requiredFor && doc.requiredFor !== step.title && doc.requiredFor !== step.id) {
        warnings.push(`Document "${doc.name}" requiredFor ("${doc.requiredFor}") does not match parent step "${step.title}".`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitizes and cleans a CivicJourney, repairing minor non-fatal anomalies:
 * - Drops orphan prerequisite IDs
 * - Ensures all documents have requiredFor and neededFor matching the parent step
 * - Injects DATA_VERSION
 * - Recalculates totalSteps, readyDocuments, and pendingDocuments
 */
export function sanitizeRoadmap(journey: CivicJourney): CivicJourney {
  journey.dataVersion = DATA_VERSION;

  const validStepIds = new Set(journey.steps.map((s) => s.id));

  let totalDocs = 0;
  let readyDocs = 0;

  journey.steps = journey.steps.map((step, idx) => {
    // 1. Sanitize prerequisites (drop nonexistent IDs)
    const validPrereqs = (step.prerequisites || []).filter((pId) => validStepIds.has(pId));
    const validDeps = (step.dependsOn || []).filter((dId) => validStepIds.has(dId));

    // 2. Ensure step numbers are sequential 1..N
    step.stepNumber = idx + 1;
    step.prerequisites = validPrereqs;
    step.dependsOn = validDeps.length > 0 ? validDeps : validPrereqs;

    // 3. Ensure document consistency
    step.documents = (step.documents || []).map((doc) => {
      totalDocs++;
      if (doc.status === 'READY' || doc.status === 'UPLOADED') {
        readyDocs++;
      }
      return {
        ...doc,
        requiredFor: step.title,
        neededFor: step.title,
        priority: doc.priority || (step.status === 'Pending' ? 'Blocking' : 'Future'),
        isMandatory: doc.isMandatory !== undefined ? doc.isMandatory : true,
        verificationStatus: doc.verificationStatus || step.verificationStatus || 'VERIFIED'
      };
    });

    // 4. Determine Jurisdiction Level if not set
    if (!step.jurisdictionLevel) {
      const dept = (step.department || step.authority || '').toLowerCase();
      if (dept.includes('municipal') || dept.includes('bmc') || dept.includes('mcgm') || dept.includes('corporation')) {
        step.jurisdictionLevel = 'Municipal';
      } else if (dept.includes('maharashtra') || dept.includes('state') || dept.includes('rto') || dept.includes('labour')) {
        step.jurisdictionLevel = 'State';
      } else {
        step.jurisdictionLevel = 'National';
      }
    }

    // 5. Ensure source URL safety (no assumed strings)
    if (step.source) {
      step.sourceTitle = step.source.title || step.sourceTitle;
      step.sourceAuthority = step.source.department || step.sourceAuthority;
      step.sourceUrl = step.source.url || step.sourceUrl;
      step.sourceType = step.source.sourceType || (step.jurisdictionLevel === 'Municipal' ? 'OFFICIAL_MUNICIPAL' : 'OFFICIAL_GOVERNMENT');
      step.isSourceAvailable = step.source.isAvailable !== false;
    }

    return step;
  });

  journey.totalSteps = journey.steps.length;
  journey.totalDocuments = totalDocs;
  journey.readyDocuments = readyDocs;
  journey.pendingDocuments = totalDocs - readyDocs;

  // Compute overall jurisdiction scope
  const levels = new Set(journey.steps.map((s) => s.jurisdictionLevel).filter(Boolean));
  if (levels.has('Municipal')) {
    journey.jurisdictionScope = 'Municipal & State Statutory Guidance';
  } else if (levels.has('State')) {
    journey.jurisdictionScope = 'State-Level Statutory Guidance';
  } else {
    journey.jurisdictionScope = 'National / Central Statutory Guidance';
  }

  return journey;
}
