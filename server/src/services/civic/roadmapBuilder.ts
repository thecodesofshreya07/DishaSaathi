import { 
  CivicJourney, 
  ProcedureStep, 
  StructuredGoal, 
  StepStatus,
  CivicVerificationStatus,
  CivicDocument,
  CivicDocumentCategory,
  DATA_VERSION
} from '../../types.js';
import { BaseCivicProcedure } from './procedureKnowledgeBase.js';
import { 
  validateDependencyGraph, 
  validateRoadmapIntegrity, 
  sanitizeRoadmap 
} from './roadmapValidator.js';

/**
 * Infers document category from document title and description
 */
function inferDocumentCategory(name: string, description?: string): CivicDocumentCategory {
  const text = `${name} ${description || ''}`.toLowerCase();
  if (text.includes('photo') || text.includes('photograph')) return 'PHOTOGRAPH';
  if (text.includes('aadhaar') || text.includes('voter') || text.includes('pan card') || text.includes('passport') || text.includes('identity')) return 'IDENTITY';
  if (text.includes('electricity') || text.includes('utility') || text.includes('address proof')) return 'ADDRESS';
  if (text.includes('rent') || text.includes('lease') || text.includes('occupancy') || text.includes('ownership')) return 'OWNERSHIP';
  if (text.includes('bank') || text.includes('cheque') || text.includes('financial') || text.includes('tax receipt')) return 'FINANCIAL';
  if (text.includes('property') || text.includes('cts') || text.includes('7/12') || text.includes('survey map') || text.includes('drawings') || text.includes('blueprint')) return 'PROPERTY';
  if (text.includes('udyam') || text.includes('deed') || text.includes('incorporation') || text.includes('gumasta') || text.includes('catalogue') || text.includes('business')) return 'BUSINESS';
  return 'OTHER';
}

/**
 * Topologically sorts procedure candidates according to their dependency graph (dependsOn).
 * Ensures that all prerequisites appear strictly before dependent steps.
 */
function topologicalSortProcedures(procedures: BaseCivicProcedure[]): BaseCivicProcedure[] {
  const procMap = new Map<string, BaseCivicProcedure>();
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  for (const proc of procedures) {
    procMap.set(proc.id, proc);
    inDegree.set(proc.id, 0);
    adjList.set(proc.id, []);
  }

  // Build dependency edges
  for (const proc of procedures) {
    for (const depId of proc.dependsOn) {
      if (procMap.has(depId)) {
        adjList.get(depId)?.push(proc.id);
        inDegree.set(proc.id, (inDegree.get(proc.id) || 0) + 1);
      }
    }
  }

  // Kahn's algorithm queue
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) {
      queue.push(id);
    }
  }

  const sorted: BaseCivicProcedure[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const proc = procMap.get(currentId);
    if (proc) sorted.push(proc);

    const neighbors = adjList.get(currentId) || [];
    for (const n of neighbors) {
      const updatedDeg = (inDegree.get(n) || 1) - 1;
      inDegree.set(n, updatedDeg);
      if (updatedDeg === 0) {
        queue.push(n);
      }
    }
  }

  // If cycle or unvisited, append remaining to avoid dropping procedures
  for (const proc of procedures) {
    if (!sorted.some((p) => p.id === proc.id)) {
      sorted.push(proc);
    }
  }

  return sorted;
}

/**
 * Builds a dynamic, dependency-aware civic roadmap from a StructuredGoal and procedure candidates.
 */
export function buildRoadmap(
  goal: StructuredGoal,
  procedures: BaseCivicProcedure[]
): CivicJourney {
  // Check if clarification is needed or intent is unknown
  if (goal.intent === 'UNKNOWN' || goal.clarificationNeeded || procedures.length === 0) {
    return {
      id: `journey-${Date.now()}`,
      title: goal.activity !== 'UNSPECIFIED' ? `${goal.activity} Roadmap` : 'Civic Procedure Request',
      query: goal.rawGoal,
      location: `${goal.location.city || 'India'}, ${goal.location.state || ''}`.replace(/,\s*$/, ''),
      category: goal.domain || 'General Civic Services',
      structuredGoal: goal,
      totalSteps: 0,
      completedSteps: 0,
      pendingDocuments: 0,
      totalDocuments: 0,
      readyDocuments: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Pending',
      steps: [],
      clarification: {
        needed: true,
        question: goal.clarificationQuestion || 'Could you provide more details about the specific civic task you want to complete?',
        suggestions: goal.clarificationSuggestions && goal.clarificationSuggestions.length > 0
          ? goal.clarificationSuggestions
          : [
              'I want to start a small bakery in Mumbai.',
              'I want to register my new bike in Mumbai.',
              'I want to build a house on my land in Mumbai.'
            ]
      }
    };
  }

  // 1. Topologically order the procedures
  const sortedProcs = topologicalSortProcedures(procedures);

  // 2. Identify parallel steps
  const parallelMap = new Map<string, Set<string>>();
  for (const p of sortedProcs) {
    parallelMap.set(p.id, new Set<string>());
    if (p.canRunInParallelWith) {
      for (const otherId of p.canRunInParallelWith) {
        if (sortedProcs.some((sp) => sp.id === otherId)) {
          parallelMap.get(p.id)?.add(otherId);
        }
      }
    }
  }

  // Cross-link parallel relationships
  for (let i = 0; i < sortedProcs.length; i++) {
    for (let j = i + 1; j < sortedProcs.length; j++) {
      const p1 = sortedProcs[i];
      const p2 = sortedProcs[j];
      const p1Deps = new Set(p1.dependsOn);
      const p2Deps = new Set(p2.dependsOn);

      const sharePrereqs = p1.dependsOn.length > 0 &&
        p1.dependsOn.length === p2.dependsOn.length &&
        p1.dependsOn.every((dep) => p2Deps.has(dep));

      const noMutualDep = !p1Deps.has(p2.id) && !p2Deps.has(p1.id);

      if (sharePrereqs && noMutualDep && (p1.canRunInParallelWith?.includes(p2.id) || p2.canRunInParallelWith?.includes(p1.id))) {
        parallelMap.get(p1.id)?.add(p2.id);
        parallelMap.get(p2.id)?.add(p1.id);
      }
    }
  }

  // 3. Map to ProcedureStep with Structured Document Intelligence & Source Grounding
  let mandatoryDocCount = 0;
  let totalDocCount = 0;

  const steps: ProcedureStep[] = sortedProcs.map((proc, index) => {
    // Enrich each document with structured categories, readiness status, and verification
    const enrichedDocuments: CivicDocument[] = proc.documents.map((doc) => {
      totalDocCount++;
      if (doc.isMandatory) mandatoryDocCount++;
      return {
        id: doc.id,
        name: doc.name,
        description: doc.description,
        requiredFor: proc.title,
        category: doc.category || inferDocumentCategory(doc.name, doc.description),
        status: doc.status || 'NOT_READY',
        isMandatory: doc.isMandatory,
        sourceUrl: doc.sourceUrl || proc.source.url,
        verificationStatus: doc.verificationStatus || proc.verificationStatus
      };
    });

    // Initial status: Step 1 is in progress; subsequent steps are pending
    const status: StepStatus = index === 0 ? 'In Progress' : 'Pending';

    // Map parallel with ids
    const parallelList = Array.from(parallelMap.get(proc.id) || []);

    return {
      id: proc.id,
      stepNumber: index + 1,
      title: proc.title,
      category: proc.category,
      department: proc.authority,
      authority: proc.authority,
      description: proc.plainLanguageSummary,
      plainLanguageSummary: proc.plainLanguageSummary,
      whyRequired: proc.whyRequired,
      status,
      documents: enrichedDocuments,
      prerequisites: proc.dependsOn,
      dependsOn: proc.dependsOn,
      parallelWith: parallelList.length > 0 ? parallelList : undefined,
      fee: proc.fee,
      processingTime: proc.estimatedTime,
      applicationMode: proc.applicationMode,
      applicationUrl: proc.applicationUrl,
      source: proc.source,
      sourceTitle: proc.source.title,
      sourceAuthority: proc.source.department,
      sourceUrl: proc.source.url,
      lastVerified: proc.source.lastChecked,
      verificationStatus: proc.verificationStatus,
      whyAmISeeingThis: {
        goal: goal.rawGoal,
        activity: goal.activity.replace(/_/g, ' '),
        location: `${goal.location.city}, ${goal.location.state}`,
        relevantProcedure: proc.title,
        source: `${proc.source.department} (${proc.source.domain})`,
        verificationStatus: proc.verificationStatus
      },
      position: {
        x: index * 260 + 50,
        y: 180 + (index % 2 === 1 ? 50 : -30)
      }
    };
  });

  // Generate dynamic human-friendly title
  let journeyTitle = `${goal.activity.replace(/_/g, ' ')} Pathway`;
  if (goal.intent === 'START_BUSINESS') {
    journeyTitle = `${goal.entities.businessType ? goal.entities.businessType.toUpperCase() : 'Business'} Setup Roadmap — ${goal.location.city}`;
  } else if (goal.intent === 'REGISTER_VEHICLE') {
    journeyTitle = `New ${goal.entities.vehicleType || 'Vehicle'} Registration Roadmap — ${goal.location.city}`;
  } else if (goal.intent === 'BUILD_PROPERTY') {
    journeyTitle = `Residential Property Construction Sanction Roadmap — ${goal.location.city}`;
  } else if (goal.intent === 'GET_CERTIFICATE') {
    journeyTitle = `Official ${goal.activity.replace(/_/g, ' ')} Issuance Pathway — ${goal.location.city}`;
  }

  const rawJourney: CivicJourney = {
    id: `journey-${Date.now()}`,
    title: journeyTitle,
    query: goal.rawGoal,
    location: `${goal.location.city}, ${goal.location.state}`,
    category: goal.domain.replace(/_/g, ' '),
    dataVersion: DATA_VERSION,
    structuredGoal: goal,
    totalSteps: steps.length,
    completedSteps: 0,
    pendingDocuments: mandatoryDocCount,
    totalDocuments: totalDocCount,
    readyDocuments: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    status: 'In Progress',
    steps
  };

  // Run roadmap sanitization and integrity validation (Section 17, 18)
  const sanitizedJourney = sanitizeRoadmap(rawJourney);
  const integrityCheck = validateRoadmapIntegrity(sanitizedJourney);
  if (!integrityCheck.isValid) {
    console.warn('Roadmap integrity warnings:', integrityCheck.errors);
  }

  return sanitizedJourney;
}

/**
 * Contextual AI Assistant ("Ask DishaSaathi")
 * Answers questions grounded strictly in the active roadmap and step data.
 */
export async function answerContextualQuestion(
  question: string,
  stepId: string | undefined,
  journey: CivicJourney
): Promise<{
  answer: string;
  relatedStepNumber?: number;
  officialSource?: {
    title: string;
    url: string;
    department: string;
    verificationStatus: CivicVerificationStatus;
  };
  uncertaintyNotice?: string;
}> {
  const currentStep = stepId ? journey.steps.find((s) => s.id === stepId) : journey.steps[0];
  const qLower = question.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. If Gemini API key is available, run grounded contextual generation
  if (apiKey && currentStep) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const readyDocs = currentStep.documents.filter((d) => d.status === 'READY').map((d) => d.name);
      const missingDocs = currentStep.documents.filter((d) => d.status !== 'READY').map((d) => d.name);

      const prompt = `You are DishaSaathi, an empathetic, highly accurate AI Civic Navigator for Indian government services.
A citizen is viewing their personalized roadmap for: "${journey.title}" in ${journey.location}.
Current active step: Step ${currentStep.stepNumber}: "${currentStep.title}"
Authority: "${currentStep.authority}"
What this means: "${currentStep.plainLanguageSummary}"
Why it is needed: "${currentStep.whyRequired}"
Dependencies: ${JSON.stringify(currentStep.dependsOn || [])}
Parallel steps: ${JSON.stringify(currentStep.parallelWith || [])}
All Documents: ${currentStep.documents.map((d) => d.name).join(', ')}
Ready Documents: ${readyDocs.join(', ') || 'None marked ready yet'}
Missing Documents: ${missingDocs.join(', ') || 'All marked ready'}
Official Portal / Source: ${currentStep.source.title} (${currentStep.source.url})
Verification Status: ${currentStep.verificationStatus}

The citizen asks: "${question}"

GUIDELINES:
- Provide a concise (2-4 sentences), respectful, crystal-clear explanation.
- DO NOT invent government laws, fake fees, or unverified penalties.
- If asking "What does this step mean?" or "Explain this step simply", explain in simple everyday language.
- If asking "What am I missing?" or "Which documents am I still missing?", inspect the Ready Documents vs Missing Documents strictly.
- If asking "Why do I need this?", ground your answer strictly in whyRequired and its prerequisite role.
- If asking "What happens if I skip this?", explain which subsequent steps will be blocked.
- If asking "Can I do this before Step X?", evaluate if Step X is a prerequisite or parallel.
- If asking "What comes after this?", describe the next step in the roadmap.
- If the requirement is marked as DEMO, include: "Demo information — verify with the relevant authority."
- If uncertain or asked something not covered in the data, state: "I don't have enough verified information to answer that confidently. Here is what we know: ... What you should verify: ..."`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response && response.text) {
        return {
          answer: response.text.trim(),
          relatedStepNumber: currentStep.stepNumber,
          officialSource: currentStep.source ? {
            title: currentStep.source.title,
            url: currentStep.source.url,
            department: currentStep.source.department,
            verificationStatus: currentStep.verificationStatus || 'VERIFIED'
          } : undefined
        };
      }
    } catch (err) {
      console.warn('AI Q&A fallback to deterministic answer engine:', err);
    }
  }

  // Section 22: Unknown / speculative questions or loopholes
  if (
    qLower.includes('loophole') ||
    qLower.includes('secret') ||
    qLower.includes('bribe') ||
    qLower.includes('cheat') ||
    qLower.includes('bypass') ||
    qLower.includes('undocumented') ||
    qLower.includes('unofficial')
  ) {
    return {
      answer: "I don't have enough verified information to answer that confidently. DishaSaathi only provides procedures verified against official government guidelines. All statutory requirements must be fulfilled through legitimate municipal channels.",
      relatedStepNumber: currentStep?.stepNumber,
      uncertaintyNotice: "Verify before acting: Never rely on unverified advice or informal shortcuts. Confirm requirements with the designated municipal authority.",
      officialSource: currentStep ? {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: 'VERIFIED'
      } : undefined
    };
  }

  // 2. Deterministic Grounded Fallback Answer Engine
  if (!currentStep) {
    return {
      answer: `DishaSaathi is tracking ${journey.totalSteps} steps for your goal in ${journey.location}. Each step is mapped to its verified regulatory authority. Select any step to view required documents and dependencies.`,
      uncertaintyNotice: 'Select a specific step card for tailored procedural answers.'
    };
  }

  const verStatus = currentStep.verificationStatus || 'VERIFIED';
  const readyDocs = currentStep.documents.filter((d) => d.status === 'READY');
  const missingDocs = currentStep.documents.filter((d) => d.status !== 'READY');

  // Question pattern: "What does this step mean?" / "Explain this step simply"
  if (qLower.includes('mean') || qLower.includes('explain') || qLower.includes('simple')) {
    return {
      answer: `In simple terms: ${currentStep.plainLanguageSummary} This is managed by ${currentStep.authority}. Once completed, you will receive an official registration certificate.`,
      relatedStepNumber: currentStep.stepNumber,
      officialSource: {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: verStatus
      }
    };
  }

  // Question pattern: "What am I missing?" / "Which documents am I still missing?"
  if (qLower.includes('missing') || qLower.includes('still need') || qLower.includes('left')) {
    if (missingDocs.length === 0) {
      return {
        answer: `Great job! You have marked all ${currentStep.documents.length} required documents as ready for Step ${currentStep.stepNumber}. You are ready to open the official application portal.`,
        relatedStepNumber: currentStep.stepNumber,
        officialSource: {
          title: currentStep.source.title,
          url: currentStep.source.url,
          department: currentStep.source.department,
          verificationStatus: verStatus
        }
      };
    }
    const missingNames = missingDocs.map((d) => d.name).join(', ');
    const readyText = readyDocs.length > 0 ? `You have marked ${readyDocs.length} of ${currentStep.documents.length} documents as ready. ` : '';
    return {
      answer: `${readyText}The remaining documents you still need to prepare for Step ${currentStep.stepNumber} are: ${missingNames}.`,
      relatedStepNumber: currentStep.stepNumber,
      officialSource: {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: verStatus
      }
    };
  }

  // Question pattern: "Why do I need this?"
  if (qLower.includes('why') || qLower.includes('reason') || qLower.includes('need this')) {
    return {
      answer: `${currentStep.whyRequired} It formally satisfies the regulatory requirement of ${currentStep.authority}.`,
      relatedStepNumber: currentStep.stepNumber,
      officialSource: {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: verStatus
      }
    };
  }

  // Question pattern: "What happens if I skip this?"
  if (qLower.includes('skip') || qLower.includes('without') || qLower.includes('penalty')) {
    const dependentSteps = journey.steps.filter((s) => s.dependsOn?.includes(currentStep.id));
    const depNames = dependentSteps.map((s) => `Step ${s.stepNumber} (${s.title})`).join(', ');

    const depMsg = dependentSteps.length > 0
      ? `Skipping this will block ${depNames}, as government officers cannot approve subsequent clearances without this prerequisite certificate.`
      : `Operating without this registration violates regulatory compliance under ${currentStep.authority} and may lead to inspection notices or closure.`;

    return {
      answer: depMsg,
      relatedStepNumber: currentStep.stepNumber,
      officialSource: {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: verStatus
      }
    };
  }

  // Question pattern: "What comes after this?"
  if (qLower.includes('after') || qLower.includes('next') || qLower.includes('following')) {
    const nextStep = journey.steps.find((s) => s.stepNumber === currentStep.stepNumber + 1);
    if (nextStep) {
      return {
        answer: `After completing Step ${currentStep.stepNumber}, your next action will be Step ${nextStep.stepNumber}: "${nextStep.title}" handled by ${nextStep.authority}.`,
        relatedStepNumber: nextStep.stepNumber,
        officialSource: {
          title: nextStep.source.title,
          url: nextStep.source.url,
          department: nextStep.source.department,
          verificationStatus: nextStep.verificationStatus || 'VERIFIED'
        }
      };
    }
    return {
      answer: `Step ${currentStep.stepNumber} is the final milestone in your roadmap! Completing it grants you full operational compliance.`,
      relatedStepNumber: currentStep.stepNumber
    };
  }

  // Question pattern: "Can I do this before Step X?"
  if (qLower.includes('before') || qLower.includes('can i do')) {
    // Check if step mentions a number
    const match = qLower.match(/step\s*(\d+)/);
    if (match) {
      const targetNum = parseInt(match[1], 10);
      const targetStep = journey.steps.find((s) => s.stepNumber === targetNum);
      if (targetStep) {
        if (currentStep.dependsOn?.includes(targetStep.id)) {
          return {
            answer: `No, Step ${targetStep.stepNumber} (${targetStep.title}) is a mandatory prerequisite for Step ${currentStep.stepNumber}. You must complete Step ${targetStep.stepNumber} first.`,
            relatedStepNumber: targetStep.stepNumber
          };
        }
        if (targetStep.dependsOn?.includes(currentStep.id)) {
          return {
            answer: `Yes! In fact, Step ${currentStep.stepNumber} must be completed before Step ${targetStep.stepNumber}, because Step ${targetStep.stepNumber} depends on it.`,
            relatedStepNumber: currentStep.stepNumber
          };
        }
        if (currentStep.parallelWith?.includes(targetStep.id)) {
          return {
            answer: `Yes! Step ${currentStep.stepNumber} and Step ${targetStep.stepNumber} can be completed in parallel. You can work on both at the same time.`,
            relatedStepNumber: currentStep.stepNumber
          };
        }
      }
    }
  }

  // Question pattern: "Which document should I prepare first?" / "What should I prepare first?"
  if (qLower.includes('document') || qLower.includes('first') || qLower.includes('prepare')) {
    const mandatoryDocs = currentStep.documents.filter((d) => d.isMandatory);
    const docNames = mandatoryDocs.map((d) => d.name).join(', ');

    return {
      answer: `For Step ${currentStep.stepNumber}, start with your primary identity & premise proofs: ${docNames}. Make sure digital scans are self-attested and clearly legible before uploading to ${currentStep.source.domain}.`,
      relatedStepNumber: currentStep.stepNumber,
      officialSource: {
        title: currentStep.source.title,
        url: currentStep.source.url,
        department: currentStep.source.department,
        verificationStatus: verStatus
      }
    };
  }

  // Default helpful grounded response with uncertainty disclosure if needed
  return {
    answer: `Step ${currentStep.stepNumber} is managed by ${currentStep.authority}. ${currentStep.plainLanguageSummary} Processing typically takes ${currentStep.processingTime} with a statutory fee of ${currentStep.fee.amount}.`,
    relatedStepNumber: currentStep.stepNumber,
    officialSource: {
      title: currentStep.source.title,
      url: currentStep.source.url,
      department: currentStep.source.department,
      verificationStatus: verStatus
    }
  };
}
