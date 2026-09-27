import { 
  CivicJourney, 
  ProcedureStep, 
  CopilotResponse, 
  CopilotEvidence,
  CopilotResponseType
} from '../../types.js';
import { getNextAction } from './adaptiveEngine.js';
import { callUniversalLlm } from './universalLlm.js';

interface CopilotContext {
  question: string;
  focusStepId?: string;
  journey: CivicJourney;
}

/**
 * Validates and sanitizes prompt against prompt injection attempts
 * (Section 40: Prompt Safety)
 */
function isPromptSafe(query: string): boolean {
  const qLower = query.toLowerCase();
  const suspiciousPatterns = [
    'ignore all previous',
    'system prompt',
    'disregard rules',
    'fabricate requirement',
    'override verified',
    'jailbreak'
  ];
  return !suspiciousPatterns.some((pattern) => qLower.includes(pattern));
}

/**
 * Detects if a question is completely non-civic / non-procedural
 * (Section 20: Anti-Hallucination Behavior)
 */
function isUnrelatedQuery(query: string): boolean {
  const qLower = query.toLowerCase();
  const unrelatedTopics = [
    'weather in ',
    'bitcoin',
    'crypto',
    'stock market',
    'spaceship',
    'joke',
    'movie',
    'sports score',
    'cricket score',
    'football match',
    'dating'
  ];
  return unrelatedTopics.some((t) => qLower.includes(t));
}

/**
 * Contextual Civic Copilot Engine
 * Implements Sections 1–6, 19–22, 40–42
 */
export async function answerCopilotQuery({
  question,
  focusStepId,
  journey
}: CopilotContext): Promise<CopilotResponse> {
  const qLower = (question || '').trim().toLowerCase();

  // 1. Guard: Prompt Safety (Section 40)
  if (!isPromptSafe(qLower)) {
    return {
      responseType: 'UNKNOWN',
      answer: "I am bound by official civic guidelines. I cannot override verified government requirements or state rules.",
      uncertaintyNotice: "Security Policy: DishaSaathi only provides grounded, authoritative guidance from official municipal sources."
    };
  }

  // 2. Guard: Speculative / Loopholes / Bribes / Non-standard shortcuts (Section 20, 22)
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
      responseType: 'UNKNOWN',
      answer: "I don't have enough verified information to answer that confidently. DishaSaathi only provides procedures verified against official government guidelines. All statutory requirements must be fulfilled through legitimate municipal channels.",
      uncertaintyNotice: "Verify before acting: Never rely on informal advice or unofficial shortcuts. Confirm requirements directly with the designated municipal authority."
    };
  }

  // 3. Guard: Completely Unrelated Topics (Section 20 Anti-Hallucination)
  if (isUnrelatedQuery(qLower)) {
    return {
      responseType: 'UNKNOWN',
      answer: "I don't have verified information about that in the current DishaSaathi knowledge base. DishaSaathi provides verified procedural roadmaps for municipal and statutory procedures (such as business permits, vehicle registration, and certificates) based on official government gazettes.",
      suggestedFollowUps: [
        'What should I do next?',
        'What documents am I missing?',
        'What can I do in parallel?'
      ]
    };
  }

  const steps = journey.steps || [];
  const actionRec = getNextAction(journey);

  // Identify current focused step, or the primary action step, or the first incomplete step
  let activeStep: ProcedureStep | undefined;
  if (focusStepId) {
    activeStep = steps.find((s) => s.id === focusStepId);
  }
  if (!activeStep) {
    activeStep = steps.find((s) => s.id === actionRec.primaryAction.stepId) || steps[0];
  }

  const verStatus = activeStep?.verificationStatus || 'VERIFIED';
  const evidence: CopilotEvidence | undefined = activeStep
    ? {
        procedureName: activeStep.title,
        authority: activeStep.authority || activeStep.department,
        sourceTitle: activeStep.sourceTitle || activeStep.source?.title || 'Official Government Portal',
        sourceUrl: activeStep.sourceUrl || activeStep.source?.url,
        sourceType: activeStep.sourceType || 'OFFICIAL_GOVERNMENT',
        verificationStatus: verStatus,
        lastVerified: activeStep.lastVerified || activeStep.source?.lastChecked || '2026-09-25',
        isAvailable: activeStep.isSourceAvailable !== false
      }
    : undefined;

  const basedOnText = activeStep
    ? `Based on ${activeStep.title} (${activeStep.authority || activeStep.department}).`
    : `Based on your ${journey.title} roadmap.`;

  // 4. Multi-Provider LLM Call via Universal LLM Client (Groq / Gemini / OpenRouter)
  const stepsSummary = steps.map((s) => 
    `Step ${s.stepNumber}: ${s.title} (${s.authority || s.department}) | Status: ${s.status} | Mode: ${s.applicationMode} | Fee: ${s.fee.amount} | Time: ${s.processingTime} | Docs: [${s.documents.map(d => d.name + (d.status === 'READY' ? ' [Ready]' : ' [Missing]')).join(', ')}] | Prerequisites: [${s.prerequisites.join(', ')}]`
  ).join('\n');

  const prompt = `You are DishaSaathi, India's premier AI Civic Journey Companion and Government Service Navigator.
A citizen is asking a question in real-time while viewing their personalized civic roadmap:

CURRENT ROADMAP DETAILS:
- Registered Goal: "${journey.title}"
- Location / City: ${journey.location || 'India'}
- Category: ${journey.category || 'Civic Procedure'}
- Active Step (in focus): Step ${activeStep?.stepNumber || 1}: "${activeStep?.title || 'Initial Milestone'}" (${activeStep?.authority || 'Government Authority'})
- Active Step Purpose: "${activeStep?.whyRequired || 'Statutory legal compliance'}"
- Active Step Summary: "${activeStep?.plainLanguageSummary || activeStep?.description || ''}"
- Official Application Portal: ${activeStep?.applicationUrl || 'https://india.gov.in'}
- Completed: ${journey.completedSteps} of ${journey.totalSteps} Steps

ALL STEPS IN ROADMAP:
${stepsSummary}

CITIZEN QUESTION: "${question}"

GUIDELINES & INSTRUCTIONS:
1. If the user asks general or greeting questions like "who are you", "what are you", "what is DishaSaathi", or "how can you help me", introduce yourself clearly as DishaSaathi, explain that you are an AI civic assistant for statutory and municipal processes in India, and explain how you can help with their active roadmap "${journey.title}".
2. If the user asks about specific steps, missing documents, fees, dependencies, parallel filings, or portals, give specific, actionable, and verified advice tailored to ${journey.location || 'India'}.
3. Format your response cleanly using markdown (bold headings, bullet points).
4. Always provide 2-3 relevant follow-up questions for the citizen.

Return ONLY a valid JSON object matching this schema:
{
  "answer": "Your direct, helpful, formatted response in markdown",
  "responseType": "ANSWER" | "NEXT_ACTION" | "DOCUMENT_GUIDANCE" | "SOURCE_REQUIRED",
  "uncertaintyNotice": "Optional note if external municipal verification is advised, otherwise leave empty string",
  "nextActionRecommendation": "Crisp one-sentence next step recommendation",
  "suggestedFollowUps": ["Question 1", "Question 2", "Question 3"]
}`;

  try {
    const llmResult = await callUniversalLlm({
      prompt,
      systemPrompt: 'You are DishaSaathi Civic Copilot, India\'s AI Civic Companion and Government Bureaucracy Navigator. Always output a valid JSON object matching the requested schema.',
      jsonMode: true,
      temperature: 0.2
    });

    if (llmResult && llmResult.text) {
      let cleaned = llmResult.text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      }
      const parsed = JSON.parse(cleaned);
      if (parsed.answer) {
        // Clean double-escaped newlines if returned by the LLM
        const cleanAnswer = typeof parsed.answer === 'string' 
          ? parsed.answer.replace(/\\n/g, '\n').trim()
          : String(parsed.answer);

        return {
          answer: cleanAnswer,
          responseType: parsed.responseType || 'ANSWER',
          evidence,
          basedOnText,
          uncertaintyNotice: parsed.uncertaintyNotice || undefined,
          nextActionRecommendation: parsed.nextActionRecommendation || undefined,
          suggestedFollowUps: parsed.suggestedFollowUps || [
            'What should I do next?',
            'What documents am I missing?',
            'What can I do in parallel?'
          ],
          isFallback: false,
          engine: `${llmResult.provider} (${llmResult.model})`
        };
      }
    }
  } catch (llmErr) {
    console.warn('[DishaSaathi Copilot] LLM processing error, falling back to deterministic civic reasoning:', llmErr);
  }

  // 5. DETERMINISTIC REASONING FALLBACK (When AI is rate-limited or offline)
  // Conversational questions: "who are you", "what can you do", "help me"
  if (
    qLower.includes('who are you') ||
    qLower.includes('what are you') ||
    qLower.includes('who r u') ||
    qLower.includes('your name') ||
    qLower.includes('hello') ||
    qLower.includes('hi') ||
    qLower.includes('hey') ||
    qLower.includes('what can you do') ||
    qLower.includes('help me')
  ) {
    return {
      responseType: 'ANSWER',
      answer: `Hello! I am **DishaSaathi**, your AI Civic Journey Companion.\n\nI help citizens navigate complex Indian municipal, state, and central government procedures. For your active roadmap (**${journey.title}** in ${journey.location || 'India'}), I can:\n\n• **Recommend your next best action** and detect prerequisite blockers.\n• **Audit your documents checklist** to identify missing certificates.\n• **Highlight parallel steps** you can execute simultaneously.\n• **Provide official portal links** and statutory gazette citations.\n\nHow can I assist you with your roadmap today?`,
      evidence,
      basedOnText,
      suggestedFollowUps: [
        'What should I do next?',
        'What documents am I missing?',
        'What can I do in parallel?'
      ]
    };
  }

  // 5. DETERMINISTIC REASONING FALLBACK (When AI is rate-limited or offline)
  // "What should I do next?" / "What is my next step?" (NEXT_ACTION)
  if (
    qLower.includes('next') ||
    qLower.includes('what should i do') ||
    qLower.includes('first') ||
    qLower.includes('start with') ||
    qLower.includes('what next')
  ) {
    const pAction = actionRec.primaryAction;
    let nextAnswer = `Your next best action is **Step ${pAction.stepNumber}: ${pAction.title}** with ${pAction.department}. ${pAction.description}`;

    if (actionRec.parallelActions.length > 0) {
      const parallelTitles = actionRec.parallelActions
        .map((pa) => `Step ${pa.stepNumber} (${pa.title})`)
        .join(', ');
      nextAnswer += ` Additionally, you can work on ${parallelTitles} in parallel.`;
    }

    return {
      responseType: 'NEXT_ACTION',
      answer: nextAnswer,
      evidence,
      basedOnText,
      nextActionRecommendation: pAction.description,
      suggestedFollowUps: [
        'What documents am I missing?',
        'What can I do in parallel?',
        'Why is this required?'
      ]
    };
  }

  // 5. "What can I do in parallel?" / "Can anything be done together?"
  if (
    qLower.includes('parallel') ||
    qLower.includes('at the same time') ||
    qLower.includes('concurrent') ||
    qLower.includes('simultaneously')
  ) {
    if (actionRec.parallelActions.length > 0) {
      const pList = actionRec.parallelActions
        .map((p) => `• **Step ${p.stepNumber} (${p.title})**: ${p.description}`)
        .join('\n');
      return {
        responseType: 'NEXT_ACTION',
        answer: `You have ${actionRec.parallelActions.length} independent action(s) you can work on in parallel right now:\n\n${pList}`,
        evidence,
        basedOnText,
        suggestedFollowUps: ['What should I do next?', 'What documents am I missing?']
      };
    } else if (activeStep && activeStep.parallelWith && activeStep.parallelWith.length > 0) {
      const pTitles = activeStep.parallelWith
        .map((id) => {
          const s = steps.find((step) => step.id === id);
          return s ? `Step ${s.stepNumber} (${s.title})` : id;
        })
        .join(', ');
      return {
        responseType: 'ANSWER',
        answer: `Step ${activeStep.stepNumber} has no mutual dependency conflicts with ${pTitles}. You can complete them concurrently.`,
        evidence,
        basedOnText
      };
    } else {
      return {
        responseType: 'ANSWER',
        answer: `At this stage, your roadmap follows a sequential prerequisite chain. Focus on completing Step ${actionRec.primaryAction.stepNumber} to unlock subsequent filings.`,
        evidence,
        basedOnText
      };
    }
  }

  // 6. "What documents am I missing?" / "Which documents do I still need?" (DOCUMENT_GUIDANCE)
  if (
    qLower.includes('missing') ||
    qLower.includes('document') ||
    qLower.includes('checklist') ||
    qLower.includes('papers')
  ) {
    if (!activeStep) {
      return {
        responseType: 'DOCUMENT_GUIDANCE',
        answer: 'Please select a roadmap step to inspect its required documents.',
        basedOnText
      };
    }

    const readyDocs = activeStep.documents.filter((d) => d.status === 'READY' || d.status === 'UPLOADED');
    const missingDocs = activeStep.documents.filter((d) => d.status !== 'READY' && d.status !== 'UPLOADED');

    if (missingDocs.length === 0 && activeStep.documents.length > 0) {
      return {
        responseType: 'DOCUMENT_GUIDANCE',
        answer: `All ${activeStep.documents.length} required documents for Step ${activeStep.stepNumber} are marked as ready! You can now proceed directly to open the official application portal.`,
        evidence,
        basedOnText,
        nextActionRecommendation: 'Open official portal and submit filing.',
        suggestedFollowUps: ['Where do I apply?', 'What comes after this?']
      };
    }

    const missingNames = missingDocs.map((d) => `• **${d.name}** (${d.category || 'General'})`).join('\n');
    const readyText = readyDocs.length > 0
      ? `You have marked ${readyDocs.length} of ${activeStep.documents.length} documents as ready.\n\n`
      : '';

    return {
      responseType: 'DOCUMENT_GUIDANCE',
      answer: `${readyText}The remaining missing documents on your checklist for Step ${activeStep.stepNumber} (${activeStep.title}) are:\n\n${missingNames}`,
      evidence,
      basedOnText,
      suggestedFollowUps: ['Where do I apply?', 'Why is this required?', 'Explain this step']
    };
  }

  // 7. "Where do I apply?" / "What is the application portal?" (SOURCE_REQUIRED)
  if (
    qLower.includes('where do i apply') ||
    qLower.includes('where to apply') ||
    qLower.includes('portal') ||
    qLower.includes('website') ||
    qLower.includes('link') ||
    qLower.includes('url')
  ) {
    if (!activeStep) {
      return { 
        responseType: 'SOURCE_REQUIRED',
        answer: 'Select a step to view its verified application link.', 
        basedOnText 
      };
    }

    return {
      responseType: 'SOURCE_REQUIRED',
      answer: `You can file for **Step ${activeStep.stepNumber}: ${activeStep.title}** through the official portal: ${activeStep.applicationUrl}. This service is operated by ${activeStep.authority || activeStep.department}.`,
      evidence,
      basedOnText,
      suggestedFollowUps: ['What documents am I missing?', 'Why is this required?']
    };
  }

  // 8. "Why is this required?" / "Why do I need this?" (ANSWER)
  if (
    qLower.includes('why') ||
    qLower.includes('reason') ||
    qLower.includes('mandatory') ||
    qLower.includes('compulsory')
  ) {
    if (!activeStep) {
      return { 
        responseType: 'ANSWER',
        answer: 'Select a step to inspect why it is required by law.', 
        basedOnText 
      };
    }

    return {
      responseType: 'ANSWER',
      answer: `**Step ${activeStep.stepNumber}: ${activeStep.title}** is required because:\n\n${activeStep.whyRequired}`,
      evidence,
      basedOnText,
      suggestedFollowUps: ['What documents am I missing?', 'Where do I apply?', 'What happens after this?']
    };
  }

  // 9. "Explain this step" / "Explain this step simply" (ANSWER)
  if (
    qLower.includes('explain') ||
    qLower.includes('simple') ||
    qLower.includes('mean') ||
    qLower.includes('summary')
  ) {
    if (!activeStep) {
      return { 
        responseType: 'ANSWER',
        answer: 'Select any step to see a simplified explanation.', 
        basedOnText 
      };
    }

    return {
      responseType: 'ANSWER',
      answer: `In plain terms: ${activeStep.plainLanguageSummary || activeStep.description} This procedure is managed by ${activeStep.authority || activeStep.department}. Processing takes approximately ${activeStep.processingTime} with a statutory fee of ${activeStep.fee.amount}.`,
      evidence,
      basedOnText,
      suggestedFollowUps: ['Why is this required?', 'What documents am I missing?', 'Where do I apply?']
    };
  }

  // 10. "What happens after this?" / "What comes after this?" (ANSWER)
  if (
    qLower.includes('after') ||
    qLower.includes('following') ||
    qLower.includes('subsequent')
  ) {
    if (!activeStep) {
      return { 
        responseType: 'ANSWER',
        answer: 'Select a step to inspect its downstream dependencies.', 
        basedOnText 
      };
    }

    const nextStep = steps.find((s) => s.stepNumber === activeStep!.stepNumber + 1);
    if (nextStep) {
      return {
        responseType: 'ANSWER',
        answer: `After completing Step ${activeStep.stepNumber}, your next statutory milestone is **Step ${nextStep.stepNumber}: ${nextStep.title}** with ${nextStep.authority || nextStep.department}.`,
        evidence,
        basedOnText,
        nextActionRecommendation: `Prepare for Step ${nextStep.stepNumber}.`,
        suggestedFollowUps: ['What should I do next?', 'Can I do anything in parallel?']
      };
    } else {
      return {
        responseType: 'ANSWER',
        answer: `Step ${activeStep.stepNumber} is the final milestone in your roadmap! Completing it grants you full operational compliance.`,
        evidence,
        basedOnText
      };
    }
  }

  // 11. General Grounded Default (ANSWER)
  return {
    responseType: 'ANSWER',
    answer: activeStep
      ? `Step ${activeStep.stepNumber}: ${activeStep.title} is managed by ${activeStep.authority || activeStep.department}. ${activeStep.plainLanguageSummary} Let me know if you would like me to check documents, portal links, or dependencies.`
      : `DishaSaathi is tracking ${journey.totalSteps} steps for "${journey.title}" in ${journey.location}. Ask any question about next steps, documents, or portal links.`,
    evidence,
    basedOnText,
    isFallback: true,
    engine: 'STATUTORY_GAZETTE_FALLBACK',
    suggestedFollowUps: [
      'What should I do next?',
      'What documents am I missing?',
      'What can I do in parallel?'
    ]
  };
}
