import { 
  CivicJourney, 
  ProcedureStep, 
  CivicDocument, 
  ActionRecommendation, 
  RoadmapDiff,
  DocumentPriority 
} from '../../types.js';

/**
 * Evaluates and computes document priority levels:
 * - 'Blocking': mandatory documents on the current actionable step(s)
 * - 'Recommended': non-mandatory/supporting documents on the current actionable step(s)
 * - 'Future': documents for downstream steps whose prerequisites are not yet completed
 */
export function computeDocumentPriorities(journey: CivicJourney): CivicJourney {
  if (!journey.steps || journey.steps.length === 0) return journey;

  const completedStepIds = new Set(
    journey.steps.filter((s) => s.status === 'Completed').map((s) => s.id)
  );

  const updatedSteps = journey.steps.map((step) => {
    const isStepCompleted = step.status === 'Completed';
    const prereqsSatisfied = (step.prerequisites || []).every((pId) => completedStepIds.has(pId));
    const isActionable = !isStepCompleted && prereqsSatisfied;

    const updatedDocs: CivicDocument[] = step.documents.map((doc) => {
      let priority: DocumentPriority = 'Future';
      if (isStepCompleted) {
        priority = 'Recommended';
      } else if (isActionable) {
        priority = doc.isMandatory ? 'Blocking' : 'Recommended';
      } else {
        priority = 'Future';
      }

      return {
        ...doc,
        priority,
        neededFor: step.title,
        blockingSteps: isActionable && doc.isMandatory && doc.status !== 'READY' && doc.status !== 'UPLOADED'
          ? [step.id]
          : []
      };
    });

    return {
      ...step,
      documents: updatedDocs
    };
  });

  return {
    ...journey,
    steps: updatedSteps
  };
}

/**
 * Determines the next best action, parallel actions, blockers, and journey health.
 * Section 10 & 11:
 * If Step 1 & 2 complete, Step 3 blocked by missing document, and Step 4 is independent:
 * Surfaces: "You can work on Step 4 while you prepare the missing document for Step 3."
 */
export function getNextAction(rawJourney: CivicJourney): ActionRecommendation {
  const journey = computeDocumentPriorities(rawJourney);
  const steps = journey.steps || [];

  if (steps.length === 0) {
    return {
      primaryAction: {
        stepId: 'empty',
        stepNumber: 0,
        title: 'Define your civic goal',
        department: 'DishaSaathi Navigator',
        actionType: 'COMPLETE_STEP',
        description: 'Enter your municipal or regulatory goal to generate a customized roadmap.',
        reason: 'A specific goal is required to chart statutory prerequisites.',
        ctaText: 'Enter civic goal'
      },
      parallelActions: [],
      blockedActions: [],
      journeyHealth: 'ON_TRACK',
      healthMessage: 'Awaiting your goal input'
    };
  }

  const completedStepIds = new Set(steps.filter((s) => s.status === 'Completed').map((s) => s.id));

  // Determine unblocked incomplete steps
  const unblockedSteps: ProcedureStep[] = [];
  const blockedActions: ActionRecommendation['blockedActions'] = [];

  for (const step of steps) {
    if (step.status === 'Completed') continue;

    const uncompletedPrereqIds = (step.prerequisites || []).filter((pId) => !completedStepIds.has(pId));
    if (uncompletedPrereqIds.length === 0) {
      unblockedSteps.push(step);
    } else {
      const blockingPrereqTitles = uncompletedPrereqIds.map((pId) => {
        const found = steps.find((s) => s.id === pId);
        return found ? `Step ${found.stepNumber} (${found.title})` : pId;
      });

      const missingDocs = step.documents
        .filter((d) => d.isMandatory && d.status !== 'READY' && d.status !== 'UPLOADED')
        .map((d) => d.name);

      blockedActions.push({
        stepId: step.id,
        stepNumber: step.stepNumber,
        title: step.title,
        reason: `Waiting for ${blockingPrereqTitles.join(', ')} to be completed first`,
        blockingPrerequisites: blockingPrereqTitles,
        blockingDocuments: missingDocs
      });
    }
  }

  // If all steps completed!
  if (unblockedSteps.length === 0 && blockedActions.length === 0) {
    const lastStep = steps[steps.length - 1];
    return {
      primaryAction: {
        stepId: lastStep.id,
        stepNumber: lastStep.stepNumber,
        title: 'All milestones completed',
        department: 'All Regulatory Authorities',
        actionType: 'COMPLETE_STEP',
        description: 'All procedural clearances, registrations, and permits have been completed.',
        reason: 'Your enterprise or civic application is fully compliant.',
        ctaText: 'View Summary'
      },
      parallelActions: [],
      blockedActions: [],
      journeyHealth: 'ON_TRACK',
      healthMessage: 'Journey 100% complete! All regulatory requirements satisfied.'
    };
  }

  // Inspect unblocked steps to find primary vs parallel
  // Check which unblocked steps have all mandatory documents ready
  const unblockedWithDocsReady = unblockedSteps.filter((s) => {
    const missingMandatory = s.documents.filter(
      (d) => d.isMandatory && d.status !== 'READY' && d.status !== 'UPLOADED'
    );
    return missingMandatory.length === 0;
  });

  const unblockedMissingDocs = unblockedSteps.filter((s) => {
    const missingMandatory = s.documents.filter(
      (d) => d.isMandatory && d.status !== 'READY' && d.status !== 'UPLOADED'
    );
    return missingMandatory.length > 0;
  });

  let primaryStep: ProcedureStep = unblockedSteps[0];
  let isParallelAlternative = false;
  let customReason = '';

  // Smart Adaptive Scheduling (Section 11):
  // If the first unblocked step is missing documents, but another independent unblocked step has documents ready:
  if (
    unblockedMissingDocs.length > 0 &&
    unblockedWithDocsReady.length > 0 &&
    unblockedMissingDocs[0].stepNumber < unblockedWithDocsReady[0].stepNumber
  ) {
    const blockedByDocStep = unblockedMissingDocs[0];
    const readyParallelStep = unblockedWithDocsReady[0];
    primaryStep = readyParallelStep;
    isParallelAlternative = true;
    customReason = `You can work on Step ${readyParallelStep.stepNumber} (${readyParallelStep.title}) while you prepare the missing documents for Step ${blockedByDocStep.stepNumber}.`;
  } else if (unblockedWithDocsReady.length > 0) {
    primaryStep = unblockedWithDocsReady[0];
  } else {
    primaryStep = unblockedSteps[0];
  }

  // Construct Primary Action details
  const missingDocsForPrimary = primaryStep.documents.filter(
    (d) => d.isMandatory && d.status !== 'READY' && d.status !== 'UPLOADED'
  );

  let actionType: ActionRecommendation['primaryAction']['actionType'] = 'APPLY_ONLINE';
  let description = '';
  let ctaText = 'Open official portal';

  if (missingDocsForPrimary.length > 0) {
    actionType = 'PREPARE_DOCUMENTS';
    ctaText = 'View required documents';
    const docNames = missingDocsForPrimary.map((d) => d.name).join(', ');
    description = `Prepare the ${missingDocsForPrimary.length} required document${missingDocsForPrimary.length > 1 ? 's' : ''} for Step ${primaryStep.stepNumber}: ${docNames}.`;
  } else {
    actionType = 'APPLY_ONLINE';
    ctaText = primaryStep.sourceUrl ? 'Open official portal' : 'Mark as complete';
    description = `All mandatory documents for Step ${primaryStep.stepNumber} (${primaryStep.title}) are prepared. Proceed to submit your application on the ${primaryStep.authority || primaryStep.department} portal.`;
  }

  const primaryAction = {
    stepId: primaryStep.id,
    stepNumber: primaryStep.stepNumber,
    title: primaryStep.title,
    department: primaryStep.authority || primaryStep.department,
    authority: primaryStep.authority,
    actionType,
    description,
    reason: customReason || (missingDocsForPrimary.length > 0
      ? `Mandatory compliance documents must be assembled before opening the ${primaryStep.authority} portal.`
      : `Prerequisites completed. Ready for official filing.`),
    ctaText,
    isParallelAlternative
  };

  // Construct Parallel Actions (other unblocked steps)
  const otherUnblockedSteps = unblockedSteps.filter((s) => s.id !== primaryStep.id);
  const parallelActions = otherUnblockedSteps.map((s) => {
    const missing = s.documents.filter(
      (d) => d.isMandatory && d.status !== 'READY' && d.status !== 'UPLOADED'
    );
    const pActionType = missing.length > 0 ? 'PREPARE_DOCUMENTS' : 'APPLY_ONLINE';
    const pCta = missing.length > 0 ? 'Prepare docs' : 'Open portal';
    return {
      stepId: s.id,
      stepNumber: s.stepNumber,
      title: s.title,
      department: s.authority || s.department,
      actionType: pActionType,
      description: missing.length > 0
        ? `Assemble ${missing.length} supporting document${missing.length > 1 ? 's' : ''} concurrently.`
        : `Ready to submit in parallel with Step ${primaryStep.stepNumber}.`,
      ctaText: pCta
    };
  });

  // Calculate Journey Health
  let journeyHealth: ActionRecommendation['journeyHealth'] = 'ON_TRACK';
  let healthMessage = `On track — Step ${primaryStep.stepNumber} is ready for your action`;

  const needsVerificationCount = steps.filter((s) => s.verificationStatus === 'NEEDS_VERIFICATION').length;
  if (unblockedSteps.length === 0 && blockedActions.length > 0) {
    journeyHealth = 'BLOCKER_NEEDS_ATTENTION';
    healthMessage = `${blockedActions.length} blocker${blockedActions.length > 1 ? 's' : ''} need attention — prerequisite steps incomplete`;
  } else if (needsVerificationCount > 0) {
    journeyHealth = 'WAITING_FOR_VERIFICATION';
    healthMessage = `${needsVerificationCount} procedure${needsVerificationCount > 1 ? 's' : ''} awaiting municipal verification`;
  } else if (missingDocsForPrimary.length > 0) {
    healthMessage = `Step ${primaryStep.stepNumber} needs ${missingDocsForPrimary.length} document${missingDocsForPrimary.length > 1 ? 's' : ''} prepared`;
  }

  return {
    primaryAction,
    parallelActions,
    blockedActions,
    journeyHealth,
    healthMessage
  };
}

/**
 * Returns structured document summary: ready, missing, and future counts
 */
export function getDocumentSummary(journey: CivicJourney) {
  const enrichedJourney = computeDocumentPriorities(journey);
  let ready = 0;
  let missing = 0;
  let future = 0;

  for (const step of enrichedJourney.steps) {
    for (const doc of step.documents) {
      if (doc.status === 'READY' || doc.status === 'UPLOADED') {
        ready++;
      } else if (doc.priority === 'Blocking') {
        missing++;
      } else {
        future++;
      }
    }
  }

  return {
    ready,
    missing,
    future,
    total: ready + missing + future,
    text: `${ready} ready · ${missing} missing · ${future} needed later`
  };
}

/**
 * Compares old and new roadmaps to detect added, removed, and changed steps,
 * preserving user progress for steps that remain relevant.
 */
export function computeRoadmapDiff(oldJourney: CivicJourney, newJourney: CivicJourney): {
  diff: RoadmapDiff;
  adaptedJourney: CivicJourney;
} {
  const oldSteps = oldJourney.steps || [];
  const newSteps = newJourney.steps || [];

  const oldStepMap = new Map<string, ProcedureStep>();
  for (const s of oldSteps) {
    oldStepMap.set(s.id, s);
    // Also index by normalized title
    oldStepMap.set(s.title.toLowerCase().trim(), s);
  }

  const addedSteps: RoadmapDiff['addedSteps'] = [];
  const changedSteps: RoadmapDiff['changedSteps'] = [];
  let preservedProgressCount = 0;

  // Adapt new steps by copying over progress from matching old steps
  const adaptedSteps: ProcedureStep[] = newSteps.map((newStep) => {
    const matchingOld = oldStepMap.get(newStep.id) || oldStepMap.get(newStep.title.toLowerCase().trim());
    if (!matchingOld) {
      addedSteps.push({
        id: newStep.id,
        stepNumber: newStep.stepNumber,
        title: newStep.title
      });
      return newStep;
    }

    // Check changes
    const changes: string[] = [];
    if (matchingOld.department !== newStep.department) {
      changes.push(`Department updated from ${matchingOld.department} to ${newStep.department}`);
    }
    if (matchingOld.fee.amount !== newStep.fee.amount) {
      changes.push(`Fee updated from ${matchingOld.fee.amount} to ${newStep.fee.amount}`);
    }
    if (changes.length > 0) {
      changedSteps.push({
        id: newStep.id,
        title: newStep.title,
        changes
      });
    }

    // Preserve completion status
    const preservedStatus = matchingOld.status;
    if (preservedStatus === 'Completed') {
      preservedProgressCount++;
    }

    // Preserve matching documents status
    const oldDocMap = new Map(matchingOld.documents.map((d) => [d.name.toLowerCase(), d.status]));
    const adaptedDocs = newStep.documents.map((d) => {
      const existingStatus = oldDocMap.get(d.name.toLowerCase());
      return existingStatus ? { ...d, status: existingStatus } : d;
    });

    return {
      ...newStep,
      status: preservedStatus,
      documents: adaptedDocs
    };
  });

  // Find removed steps
  const newIdSet = new Set(newSteps.map((s) => s.id));
  const newTitleSet = new Set(newSteps.map((s) => s.title.toLowerCase().trim()));
  const removedSteps: RoadmapDiff['removedSteps'] = [];

  for (const oldStep of oldSteps) {
    if (!newIdSet.has(oldStep.id) && !newTitleSet.has(oldStep.title.toLowerCase().trim())) {
      removedSteps.push({
        id: oldStep.id,
        title: oldStep.title
      });
    }
  }

  const hasChanges = addedSteps.length > 0 || removedSteps.length > 0 || changedSteps.length > 0;
  const parts: string[] = [];
  if (addedSteps.length > 0) parts.push(`${addedSteps.length} added`);
  if (removedSteps.length > 0) parts.push(`${removedSteps.length} removed`);
  if (changedSteps.length > 0) parts.push(`${changedSteps.length} modified`);
  if (preservedProgressCount > 0) parts.push(`${preservedProgressCount} completed steps preserved`);

  const summary = hasChanges
    ? `Your roadmap adapted to your updated goal: ${parts.join(', ')}.`
    : 'No procedural changes detected for this goal refinement.';

  const adaptedJourney: CivicJourney = {
    ...newJourney,
    steps: adaptedSteps,
    completedSteps: adaptedSteps.filter((s) => s.status === 'Completed').length,
    totalSteps: adaptedSteps.length
  };

  return {
    diff: {
      hasChanges,
      addedSteps,
      removedSteps,
      changedSteps,
      preservedProgressCount,
      summary
    },
    adaptedJourney: computeDocumentPriorities(adaptedJourney)
  };
}
