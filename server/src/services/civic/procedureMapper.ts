import { StructuredGoal, MatchConfidence } from '../../types.js';
import { BaseCivicProcedure, procedureKnowledgeBase } from './procedureKnowledgeBase.js';

export interface ProcedureMatchResult {
  procedures: BaseCivicProcedure[];
  confidence: MatchConfidence;
  jurisdictionExplanation: string;
}

/**
 * Searches and filters procedures based on the StructuredGoal:
 * - Intent & activity-aware matching (prevents food licenses on tech businesses, etc.)
 * - Strict jurisdiction alignment: City (Municipal) -> State -> National
 * - Clear jurisdiction fallback with explicit attribution
 */
export function matchProceduresForGoal(goal: StructuredGoal): ProcedureMatchResult {
  // If goal is UNKNOWN or needs clarification, return empty list
  if (goal.intent === 'UNKNOWN' || goal.clarificationNeeded) {
    return {
      procedures: [],
      confidence: 'REQUIRES_CLARIFICATION',
      jurisdictionExplanation: 'Clarification required before procedure mapping.'
    };
  }

  const { intent, domain, activity, location, entities } = goal;
  const targetCity = (location.city || '').toLowerCase().trim();
  const targetState = (location.state || '').toLowerCase().trim();
  const isMumbai = targetCity.includes('mumbai');
  const isMaharashtra = isMumbai || targetState.includes('maharashtra');

  const businessType = (entities.businessType || activity || '').toLowerCase();
  const isFoodBusiness = 
    businessType.includes('bakery') ||
    businessType.includes('food') ||
    businessType.includes('restaurant') ||
    businessType.includes('cafe') ||
    businessType.includes('sweet') ||
    domain === 'FOOD_BUSINESS';

  // 1. Domain & Intent Filter with activity precision
  let candidates = procedureKnowledgeBase.filter((proc) => {
    switch (intent) {
      case 'START_BUSINESS':
        if (isFoodBusiness) {
          // Food businesses require food-specific safety & health compliance plus commercial establishment registration
          return (
            proc.domain === 'FOOD_BUSINESS' ||
            proc.id === 'proc-pan-entity' ||
            proc.id === 'proc-udyam-msme' ||
            proc.id === 'proc-gumasta-shop' ||
            proc.id === 'proc-gst-registration'
          );
        } else {
          // General non-food business: legal identity, MSME, shop establishment, and GST
          return (
            proc.id === 'proc-pan-entity' ||
            proc.id === 'proc-udyam-msme' ||
            proc.id === 'proc-gumasta-shop' ||
            proc.id === 'proc-gst-registration'
          );
        }

      case 'PROPERTY_RENTAL':
        return proc.domain === 'PROPERTY_RENTAL';

      case 'REGISTER_VEHICLE':
      case 'APPLY_FOR_LICENSE': {
        if (isFoodBusiness) {
          return proc.domain === 'FOOD_BUSINESS';
        }
        const rawQ = (goal.rawGoal || '').toLowerCase();
        const isDL =
          activity === 'DRIVING_LICENSE' ||
          rawQ.includes('license') ||
          rawQ.includes('licence') ||
          rawQ.includes('liscence') ||
          rawQ.includes('lisence') ||
          rawQ.includes('dl') ||
          rawQ.includes('learner') ||
          rawQ.includes('parwana') ||
          rawQ.includes('perwana') ||
          rawQ.includes('लायसन्स') ||
          rawQ.includes('परवाना') ||
          rawQ.includes('चालक');

        if (isDL) {
          return proc.id.startsWith('proc-dl-');
        }
        return proc.id.startsWith('proc-rto-');
      }

      case 'BUILD_PROPERTY':
        if (
          domain === 'PROPERTY_RENTAL' ||
          activity === 'RENTAL_AGREEMENT' ||
          businessType.includes('rent') ||
          businessType.includes('lease') ||
          businessType.includes('tenant')
        ) {
          return proc.domain === 'PROPERTY_RENTAL';
        }
        if (
          domain === 'PROPERTY_ACQUISITION' ||
          activity === 'FLAT_PURCHASE' ||
          businessType.includes('flat') ||
          businessType.includes('apartment') ||
          businessType.includes('buy') ||
          businessType.includes('purchase')
        ) {
          return proc.domain === 'PROPERTY_ACQUISITION';
        }
        return proc.domain === 'URBAN_DEVELOPMENT';

      case 'GET_CERTIFICATE':
        return proc.domain === 'VITAL_RECORDS';

      default:
        return false;
    }
  });

  // 2. Strict Jurisdiction Filter (Section 10, 11, 43)
  let cityMatched = false;
  let stateMatched = false;

  candidates = candidates.filter((proc) => {
    const procState = (proc.jurisdiction.state || '').toLowerCase().trim();
    const procCity = (proc.jurisdiction.city || '').toLowerCase().trim();

    // A. National-level procedures (e.g. PAN, MSME Udyam, FSSAI, GST, Parivahan) apply across all of India
    if (!procState && !procCity) {
      return true;
    }

    // B. State-level procedures (e.g. Maharashtra Gumasta under State Act)
    if (procState && !procCity) {
      if (isMaharashtra && procState === 'maharashtra') {
        stateMatched = true;
        return true;
      }
      return false; // Exclude Maharashtra-specific laws for other states
    }

    // C. Municipal-level procedures (e.g. BMC Mumbai Health License, AutoDCR Building Proposal)
    if (procCity) {
      if (isMumbai && procCity === 'mumbai') {
        cityMatched = true;
        return true;
      }
      // If user selected another city or general location, adapt baseline municipal procedure
      cityMatched = true;
      return true;
    }

    return true;
  });

  // If strict filtering returned empty, retrieve all domain candidates as statutory baseline
  if (candidates.length === 0) {
    if (intent === 'PROPERTY_RENTAL' || domain === 'PROPERTY_RENTAL') {
      candidates = procedureKnowledgeBase.filter((p) => p.domain === 'PROPERTY_RENTAL');
    } else if (intent === 'BUILD_PROPERTY') {
      candidates = procedureKnowledgeBase.filter((p) => p.domain === 'URBAN_DEVELOPMENT' || p.domain === 'PROPERTY_ACQUISITION' || p.domain === 'PROPERTY_RENTAL');
    } else if (intent === 'REGISTER_VEHICLE') {
      candidates = procedureKnowledgeBase.filter((p) => p.domain === 'TRANSPORT');
    } else if (intent === 'START_BUSINESS') {
      candidates = procedureKnowledgeBase.filter((p) => p.domain === 'FOOD_BUSINESS' || p.id === 'proc-pan-entity' || p.id === 'proc-udyam-msme' || p.id === 'proc-gumasta-shop' || p.id === 'proc-gst-registration');
    } else if (intent === 'GET_CERTIFICATE') {
      candidates = procedureKnowledgeBase.filter((p) => p.domain === 'VITAL_RECORDS');
    }
  }

  // 3. Ensure Dependency Closure (respecting jurisdiction boundary)
  const candidateIds = new Set(candidates.map((p) => p.id));
  const missingPrerequisites: BaseCivicProcedure[] = [];

  for (const candidate of candidates) {
    for (const depId of candidate.dependsOn) {
      if (!candidateIds.has(depId)) {
        const prereq = procedureKnowledgeBase.find((p) => p.id === depId);
        if (prereq) {
          missingPrerequisites.push(prereq);
          candidateIds.add(depId);
        }
      }
    }
  }

  const finalProcedures = [...candidates, ...missingPrerequisites];

  // 4. Determine Jurisdiction attribution and confidence (Section 11 & 13)
  let jurisdictionExplanation: string;
  let confidence: MatchConfidence;

  if (cityMatched && isMumbai) {
    confidence = 'DIRECT_MATCH';
    jurisdictionExplanation = 'Direct match: Municipal Corporation of Greater Mumbai (BMC) and Maharashtra statutory regulations.';
  } else if (stateMatched && isMaharashtra) {
    confidence = 'RELEVANT';
    jurisdictionExplanation = `Maharashtra state-level guidance. City-specific municipal bylaws for "${location.city}" fall back to state statutory procedures.`;
  } else if (!isMaharashtra && location.city && location.city.trim().length > 0) {
    confidence = 'RELEVANT';
    jurisdictionExplanation = `National statutory guidance (India-level). Municipal procedures specific to "${location.city}" are not yet indexed in the verified knowledge base.`;
  } else {
    confidence = 'DIRECT_MATCH';
    jurisdictionExplanation = 'National central government statutory procedures.';
  }

  return {
    procedures: finalProcedures,
    confidence,
    jurisdictionExplanation
  };
}

/**
 * Backward compatibility wrapper
 */
export function findRelevantProcedures(goal: StructuredGoal): BaseCivicProcedure[] {
  return matchProceduresForGoal(goal).procedures;
}
