import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Compass,
  ShieldCheck,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { CivicJourney, ProcedureStep } from '../types';

interface AiAssistantModalProps {
  journey: CivicJourney;
  onClose: () => void;
  focusStepId?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sourceTitle?: string;
  sourceUrl?: string;
  department?: string;
  relatedStepNumber?: number;
  uncertaintyNotice?: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  journey,
  onClose,
  focusStepId
}) => {
  // Focus step if passed, else active step, else step 1
  const targetedStep = focusStepId
    ? journey.steps.find((s) => s.id === focusStepId)
    : journey.steps.find((s) => s.status === 'In Progress') || journey.steps[0];

  const [activeStep, setActiveStep] = useState<ProcedureStep | undefined>(targetedStep);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your DishaSaathi Civic Navigator. You are viewing "${journey.title}" in ${journey.location}.${
        activeStep
          ? ` Currently focused on Step ${activeStep.stepNumber}: "${activeStep.title.replace(/^\d+\.\s*/, '')}" (${activeStep.authority || activeStep.department}).`
          : ''
      } Ask any question about procedural prerequisites, document checklists, or official fees.`,
      sourceTitle: activeStep?.source?.title,
      sourceUrl: activeStep?.source?.url,
      department: activeStep?.authority || activeStep?.department,
      relatedStepNumber: activeStep?.stepNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  React.useEffect(() => {
    const current = focusStepId
      ? journey.steps.find((s) => s.id === focusStepId)
      : journey.steps.find((s) => s.status === 'In Progress') || journey.steps[0];
    setActiveStep(current);
    setMessages([
      {
        sender: 'assistant',
        text: `Hello! I am your DishaSaathi Civic Navigator. You are viewing "${journey.title}" in ${journey.location}.${
          current
            ? ` Currently focused on Step ${current.stepNumber}: "${current.title.replace(/^\d+\.\s*/, '')}" (${current.authority || current.department}).`
            : ''
        } Ask any question about procedural prerequisites, document checklists, or official fees.`,
        sourceTitle: current?.source?.title,
        sourceUrl: current?.source?.url,
        department: current?.authority || current?.department,
        relatedStepNumber: current?.stepNumber,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [journey.id, journey.title, focusStepId]);

  // Section 19: Quick Questions
  const suggestedQuestions = [
    'Why do I need this?',
    'What should I prepare first?',
    'What does this step mean?',
    'Which documents am I still missing?',
    'What comes after this?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsThinking(true);

    try {
      // 1. Call Backend Grounded Endpoint (/api/journey/ask)
      const res = await fetch('/api/journey/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          stepId: activeStep?.id,
          journey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer || "I've reviewed the procedural requirements for this step.",
            sourceTitle: data.officialSource?.title || activeStep?.source?.title,
            sourceUrl: data.officialSource?.url || activeStep?.source?.url,
            department: data.officialSource?.department || activeStep?.authority,
            relatedStepNumber: data.relatedStepNumber || activeStep?.stepNumber,
            uncertaintyNotice: data.uncertaintyNotice,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsThinking(false);
        return;
      }
    } catch (err) {
      console.warn('Network call to /api/journey/ask failed, falling back to local grounded reasoning:', err);
    }

    // 2. Client-side Grounded Procedural Fallback Engine (Section 20-25)
    const qLower = query.toLowerCase();
    let reply = `Step ${activeStep?.stepNumber || 1} is managed by ${activeStep?.authority || 'the local civic department'}.`;
    let uncertainty: string | undefined = undefined;

    const readyDocs = activeStep?.documents?.filter((d) => d.status === 'READY' || d.status === 'UPLOADED') || [];
    const missingDocs = activeStep?.documents?.filter((d) => d.status !== 'READY' && d.status !== 'UPLOADED') || [];

    // "What does this step mean?" / "Explain this step simply"
    if (qLower.includes('mean') || qLower.includes('explain') || qLower.includes('simple')) {
      reply = `In simple terms: ${activeStep?.plainLanguageSummary || activeStep?.description} This procedure is managed by ${activeStep?.authority}. Completing it officially establishes your legal compliance.`;
    }
    // "What am I missing?" / "Which documents am I still missing?"
    else if (qLower.includes('missing') || qLower.includes('still need') || qLower.includes('left') || qLower.includes('checklist')) {
      if (missingDocs.length === 0 && (activeStep?.documents?.length || 0) > 0) {
        reply = `All ${activeStep?.documents.length} required documents for Step ${activeStep?.stepNumber} are marked as ready! You can now proceed to open the official application portal.`;
      } else {
        const missingNames = missingDocs.map((d) => d.name).join(', ');
        const readyText = readyDocs.length > 0 ? `You have marked ${readyDocs.length} of ${activeStep?.documents.length} documents as ready. ` : '';
        reply = `${readyText}The remaining items on your checklist for Step ${activeStep?.stepNumber} are: ${missingNames}.`;
      }
    }
    // "Why do I need this?"
    else if (qLower.includes('why') || qLower.includes('reason') || qLower.includes('need this')) {
      reply = activeStep?.whyRequired
        ? `${activeStep.whyRequired} It formally satisfies the regulatory requirements of ${activeStep.authority || activeStep.department}.`
        : `This step establishes legal identity and authorization required under local government rules.`;
    }
    // "What happens if I skip this?"
    else if (qLower.includes('skip') || qLower.includes('without') || qLower.includes('penalty')) {
      const dependentSteps = journey.steps.filter((s) => s.dependsOn?.includes(activeStep?.id || ''));
      if (dependentSteps.length > 0) {
        const depTitles = dependentSteps.map((s) => `Step ${s.stepNumber} (${s.title.replace(/^\d+\.\s*/, '')})`).join(', ');
        reply = `Skipping this step will block ${depTitles}, because statutory application portals require the prior certificate number to submit subsequent filings.`;
      } else {
        reply = `Operating without this registration violates regulatory guidelines under ${activeStep?.authority || 'the municipal authority'} and may result in compliance notices.`;
      }
    }
    // "What comes after this?"
    else if (qLower.includes('after') || qLower.includes('next') || qLower.includes('following')) {
      const nextStep = journey.steps.find((s) => s.stepNumber === (activeStep?.stepNumber || 1) + 1);
      if (nextStep) {
        reply = `After completing Step ${activeStep?.stepNumber}, your next mandatory civic procedure is Step ${nextStep.stepNumber}: "${nextStep.title.replace(/^\d+\.\s*/, '')}" with ${nextStep.authority}.`;
      } else {
        reply = `Step ${activeStep?.stepNumber} is the final milestone in your roadmap! Completing it grants you full operational compliance.`;
      }
    }
    // "Can I do this before Step X?"
    else if (qLower.includes('before') || qLower.includes('can i do')) {
      const match = qLower.match(/step\s*(\d+)/);
      if (match && activeStep) {
        const targetNum = parseInt(match[1], 10);
        const targetStep = journey.steps.find((s) => s.stepNumber === targetNum);
        if (targetStep) {
          if (activeStep.dependsOn?.includes(targetStep.id)) {
            reply = `No, Step ${targetStep.stepNumber} (${targetStep.title.replace(/^\d+\.\s*/, '')}) is a mandatory prerequisite for Step ${activeStep.stepNumber}. You must complete Step ${targetStep.stepNumber} first.`;
          } else if (targetStep.dependsOn?.includes(activeStep.id)) {
            reply = `Yes! In fact, Step ${activeStep.stepNumber} must be completed before Step ${targetStep.stepNumber}, because Step ${targetStep.stepNumber} depends on it.`;
          } else if (activeStep.parallelWith?.includes(targetStep.id)) {
            reply = `Yes! Step ${activeStep.stepNumber} and Step ${targetStep.stepNumber} can be completed in parallel. You can work on both at the same time.`;
          }
        }
      }
    }
    // "Which document should I prepare first?"
    else if (qLower.includes('document') || qLower.includes('first') || qLower.includes('prepare')) {
      const docs = activeStep?.documents?.filter((d) => d.isMandatory).map((d) => d.name).join(', ');
      reply = docs
        ? `For Step ${activeStep?.stepNumber}, begin by assembling your mandatory identity and premise documents: ${docs}.`
        : `Prepare your primary identity proof (Aadhaar/PAN) and proof of commercial premises occupancy.`;
    }
    // Unknown or unsupported question
    else {
      reply = `I don't have enough verified information to answer that confidently. Here is what we know: Step ${activeStep?.stepNumber || 1} is governed by ${activeStep?.authority || 'the local authority'} with a statutory fee of ${activeStep?.fee?.amount || 'standard rate'}. What you should verify: Confirm any custom exemptions directly with the department helpdesk.`;
      uncertainty = 'Informational guidance only — confirm with official municipal gazette.';
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: reply,
        sourceTitle: activeStep?.source?.title,
        sourceUrl: activeStep?.source?.url,
        department: activeStep?.authority || activeStep?.department,
        relatedStepNumber: activeStep?.stepNumber,
        uncertaintyNotice: uncertainty,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsThinking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[min(620px,calc(100vh-1rem))] h-[620px] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1B4D3E] to-[#12382D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Ask DishaSaathi</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-[#12382D]">
                  Civic Grounded
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Procedural explanations backed by official government data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Tab Bar if multi-step journey */}
        <div className="bg-[#EAF2ED] border-b border-[#D5E3DB] px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="font-bold text-[#143B2F] flex-shrink-0 text-[11px] uppercase tracking-wider">
            Step Focus:
          </span>
          {journey.steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeStep?.id === s.id
                  ? 'bg-[#1B4D3E] text-white shadow-2xs'
                  : 'bg-white text-[#4A5D54] hover:bg-[#F2F8F5] border border-[#CDE3D7]'
              }`}
            >
              Step {s.stepNumber}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1B4D3E] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                }`}
              >
                {msg.sender === 'assistant' && msg.relatedStepNumber && (
                  <div className="flex items-center gap-1.5 font-bold text-[#1B4D3E] mb-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Regarding Step {msg.relatedStepNumber}</span>
                  </div>
                )}

                <p className="font-medium text-slate-800">{msg.text}</p>

                {/* Grounded Source Footer */}
                {msg.sender === 'assistant' && (msg.sourceTitle || msg.sourceUrl) && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{msg.department || msg.sourceTitle}</span>
                    </span>
                    {msg.sourceUrl && (
                      <a
                        href={msg.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-emerald-700 hover:underline font-bold"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}

                {msg.uncertaintyNotice && (
                  <div className="mt-2 text-[10px] text-amber-700 italic flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>{msg.uncertaintyNotice}</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-[#1B4D3E] p-3 rounded-2xl bg-white border border-[#D5E3DB] shadow-2xs w-fit">
              <Compass className="w-4 h-4 animate-spin text-amber-500" />
              <span className="font-semibold">Consulting official procedure rules...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Question Chips (Section 19) */}
        <div className="px-4 sm:px-5 py-2.5 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Prompts:
            </span>
            {suggestedQuestions.map((sq) => (
              <button
                key={sq}
                onClick={() => handleSend(sq)}
                className="px-3 py-1 rounded-full bg-[#EAF2ED] hover:bg-[#D5E3DB] text-[#1B4D3E] text-xs font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about Step ${activeStep?.stepNumber || 1} checklist, dependencies, or official fees...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-slate-50"
          />
          <button
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white flex items-center justify-center transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
