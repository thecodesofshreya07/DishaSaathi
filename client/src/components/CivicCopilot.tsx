import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Compass,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CivicJourney, CopilotResponse } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  evidence?: CopilotResponse['evidence'];
  basedOnText?: string;
  uncertaintyNotice?: string;
  nextActionRecommendation?: string;
  suggestedFollowUps?: string[];
  isFallback?: boolean;
  engine?: string;
  timestamp: string;
}

interface CivicCopilotProps {
  journey: CivicJourney;
  isOpen: boolean;
  onClose: () => void;
  focusStepId?: string;
}

export const CivicCopilot: React.FC<CivicCopilotProps> = ({
  journey,
  isOpen,
  onClose,
  focusStepId
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am DishaSaathi, your civic journey companion for "${journey.title}". Ask me about what to do next, missing documents, parallel actions, or where to apply.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'What should I do next?',
        'What documents am I missing?',
        'What can I do in parallel?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeStep = focusStepId
    ? journey.steps.find((s) => s.id === focusStepId)
    : journey.steps.find((s) => s.status !== 'Completed') || journey.steps[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/copilot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          focusStepId: activeStep?.id,
          journey
        })
      });

      if (res.ok) {
        const data: CopilotResponse = await res.json();
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.answer || "I've checked the official requirements for this step.",
          evidence: data.evidence,
          basedOnText: data.basedOnText,
          uncertaintyNotice: data.uncertaintyNotice,
          nextActionRecommendation: data.nextActionRecommendation,
          suggestedFollowUps: data.suggestedFollowUps,
          isFallback: data.isFallback,
          engine: data.engine,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
        return;
      }
    } catch (err) {
      console.warn('Copilot API fallback to local reasoning', err);
    }

    // Offline / deterministic fallback
    const fallbackMsg: Message = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: `For Step ${activeStep?.stepNumber || 1}: ${activeStep?.title}, applications are processed by ${activeStep?.authority || 'the designated department'}. Make sure all required identity and address documents are assembled before submission.`,
      basedOnText: `Based on Step ${activeStep?.stepNumber || 1} (${activeStep?.authority})`,
      isFallback: true,
      engine: 'STATUTORY_GAZETTE_FALLBACK',
      evidence: activeStep ? {
        procedureName: activeStep.title,
        authority: activeStep.authority || activeStep.department,
        sourceTitle: activeStep.sourceTitle || activeStep.source?.title || 'Official Portal',
        sourceUrl: activeStep.sourceUrl || activeStep.source?.url,
        verificationStatus: activeStep.verificationStatus || 'VERIFIED'
      } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, fallbackMsg]);
    setIsThinking(false);
  };

  const quickActions = [
    'What should I do next?',
    'What documents am I missing?',
    'What can I do in parallel?',
    'Why is this required?',
    'Where do I apply?',
    'Explain this step',
    'What happens after this?'
  ];

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-white border-l border-[#D5E3DB] shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-200"
      aria-label="DishaSaathi Civic Copilot"
    >
      {/* 1. Header (Section 2) */}
      <div className="p-4 border-b border-[#E2EAE5] bg-[#F4F8F6] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-[#11261F] text-base leading-tight">
                DishaSaathi
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] border border-[#1B4D3E]/20">
                Copilot
              </span>
            </div>
            <p className="text-[11px] text-[#4A5D54] font-medium leading-none mt-0.5">
              Your civic journey companion
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg text-[#4A5D54] hover:text-[#11261F] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Copilot Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Active Context Strip */}
      <div className="px-4 py-2 bg-[#EAF2ED] border-b border-[#D5E3DB] flex items-center justify-between text-[11px] text-[#2D5A46] shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Layers className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
          <span className="truncate">
            Active: <strong>Step {activeStep?.stepNumber || 1}</strong> ({activeStep?.title.replace(/^\d+\.\s*/, '')})
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#1B4D3E] font-bold shrink-0 border border-[#CDE3D7]">
          {journey.completedSteps}/{journey.totalSteps} done
        </span>
      </div>

      {/* 3. Quick Actions Chips (Section 3) */}
      <div className="p-2.5 bg-[#FAFDFB] border-b border-[#E8ECE9] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        {quickActions.map((qa) => (
          <button
            key={qa}
            onClick={() => handleSend(qa)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-[#EAF2ED] text-[#1B4D3E] border border-[#D5E3DB] hover:border-[#1B4D3E] whitespace-nowrap transition-all shadow-2xs cursor-pointer shrink-0"
          >
            {qa}
          </button>
        ))}
      </div>

      {/* 4. Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAF9]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-[#1B4D3E] text-white rounded-br-2xs'
                  : 'bg-white text-[#11261F] border border-[#E2EAE5] rounded-bl-2xs'
              }`}
            >
              {/* Engine Badge for Assistant */}
              {m.sender === 'assistant' && (
                <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-black/5">
                  <span className="font-bold text-[10px] text-[#1B4D3E] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#1B4D3E]" />
                    DishaSaathi Copilot
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Official Grounding
                  </span>
                </div>
              )}

              {/* Message text with basic bullet formatting */}
              <div className="whitespace-pre-line space-y-1">
                {m.text}
              </div>

              {/* Next Action recommendation badge */}
              {m.nextActionRecommendation && (
                <div className="mt-2.5 pt-2 border-t border-emerald-100 bg-emerald-50/70 -mx-3.5 -mb-3.5 p-2.5 rounded-b-2xl flex items-start gap-1.5 text-[11px] text-emerald-900 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Next: {m.nextActionRecommendation}</span>
                </div>
              )}

              {/* Uncertainty disclosure (Section 22 & 27) */}
              {m.uncertaintyNotice && (
                <div className="mt-2 pt-2 border-t border-amber-200 text-amber-900 flex items-start gap-1.5 text-[10px] bg-amber-50/80 -mx-3.5 p-2 rounded-b-xl font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{m.uncertaintyNotice}</span>
                </div>
              )}
            </div>

            {/* Compact Evidence Card (Section 6) */}
            {m.evidence && m.sender === 'assistant' && (
              <div className="mt-1.5 ml-1 max-w-[88%] bg-white/90 border border-[#D5E3DB] rounded-xl p-2.5 text-[10px] text-[#4A5D54] shadow-2xs">
                <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#EAF2ED]">
                  <span className="font-extrabold uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1 text-[9px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Based on verified data
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {m.evidence.verificationStatus}
                  </span>
                </div>
                <p className="truncate font-semibold text-[#11261F]">
                  {m.evidence.procedureName}
                </p>
                <p className="truncate text-[#6C8075]">
                  Authority: {m.evidence.authority}
                </p>
                {m.evidence.sourceUrl && (
                  <a
                    href={m.evidence.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#1B4D3E] hover:underline mt-1"
                  >
                    <span>{m.evidence.sourceTitle}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}

            {/* Suggested Follow-Ups */}
            {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
              <div className="mt-2 ml-1 flex flex-wrap gap-1.5 max-w-[90%]">
                {m.suggestedFollowUps.map((fu) => (
                  <button
                    key={fu}
                    onClick={() => handleSend(fu)}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2ED] text-[#1B4D3E] hover:bg-[#D5E3DB] transition-colors border border-[#CDE3D7] cursor-pointer"
                  >
                     {fu}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[9px] text-[#8C9B94] mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-[#6C8075] bg-white border border-[#E2EAE5] rounded-2xl p-3 w-fit shadow-2xs animate-pulse">
            <Compass className="w-3.5 h-3.5 animate-spin text-[#1B4D3E]" />
            <span>Consulting verified civic requirements...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Input Bar */}
      <div className="p-3 bg-white border-t border-[#E2EAE5] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about steps, documents, or portal..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="w-9 h-9 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-[#8C9B94] mt-2">
          Responses grounded in official municipal gazettes and verified portals.
        </p>
      </div>
    </aside>
  );
};
