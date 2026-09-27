import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Check,
  Lock,
  Network,
  FileText,
  Building2,
  ChevronRight,
  Search,
  Sparkles,
  HelpCircle,
  Zap,
  ShieldCheck,
  Eye,
  Sliders,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { CivicJourney, ProcedureStep, StepStatus } from '../types';
import { useRoadmap } from '../context/RoadmapContext';
import { useLanguage } from '../context/LanguageContext';
import { GoalRefinementModal } from './GoalRefinementModal';
import { SourcesPanelModal } from './SourcesPanelModal';
import { calculateTotalJourneyCost } from '../utils/costCalculator';

interface CivicJourneyPipelineProps {
  journey: CivicJourney;
  onSelectStep: (step: ProcedureStep) => void;
  onOpenGraphView: () => void;
  onOpenAiAssistant?: (stepId?: string) => void;
  onUpdateStatus?: (stepId: string, status: StepStatus) => void;
  selectedStepId?: string;
  onQuickSearch?: (query: string) => void;
}

type FilterType = 'All' | 'To Do' | 'Completed' | 'Blocked' | 'Documents';

export const CivicJourneyPipeline: React.FC<CivicJourneyPipelineProps> = ({
  journey,
  onSelectStep,
  onOpenGraphView,
  onOpenAiAssistant,
  onUpdateStatus,
  selectedStepId,
  onQuickSearch
}) => {
  const { t } = useLanguage();
  const { 
    adaptiveRecommendation, 
    recheckRoadmap, 
    isCopilotOpen, 
    setIsCopilotOpen 
  } = useRoadmap();

  const { steps = [] } = journey;
  const [clarificationInput, setClarificationInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [transparencyStep, setTransparencyStep] = useState<ProcedureStep | null>(null);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);
  const [recheckMessage, setRecheckMessage] = useState<string | null>(null);

  const isStepBlocked = (step: ProcedureStep) => {
    if (step.status === 'Completed') return false;
    const incompletePrereqs = (step.prerequisites || []).filter((pId) => {
      const p = steps.find((s) => s.id === pId);
      return p && p.status !== 'Completed';
    });
    return incompletePrereqs.length > 0;
  };

  const getPrerequisiteNames = (step: ProcedureStep): string => {
    const prereqList = (step.prerequisites || [])
      .map((pId) => {
        const found = steps.find((s) => s.id === pId);
        return found ? `Step ${found.stepNumber} (${found.title})` : undefined;
      })
      .filter(Boolean);
    return prereqList.join(', ');
  };

  const getParallelStepNames = (step: ProcedureStep): string => {
    if (!step.parallelWith || step.parallelWith.length === 0) return '';
    const parallelList = step.parallelWith
      .map((pId) => {
        const found = steps.find((s) => s.id === pId);
        return found ? `Step ${found.stepNumber} (${found.title.replace(/^\d+\.\s*/, '')})` : undefined;
      })
      .filter(Boolean);
    return parallelList.join(', ');
  };

  // 1. CLARIFICATION VIEW: If user input was ambiguous ("Hello", "I need help with something", missing location)
  if (journey.clarification?.needed) {
    return (
      <div className="mb-6 rounded-2xl bg-white border border-amber-200 p-6 md:p-8 shadow-xs animate-in fade-in duration-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-2">
            Clarification Requested
          </span>

          <h3 className="text-xl font-extrabold text-[#11261F] mt-1">
            We need a bit more detail to chart your civic roadmap
          </h3>

          <p className="text-sm text-[#4A5D54] mt-2 leading-relaxed">
            {journey.clarification.question}
          </p>

          {/* Quick interactive suggestion pills */}
          {journey.clarification.suggestions && journey.clarification.suggestions.length > 0 && (
            <div className="mt-6">
              <span className="text-xs font-bold text-[#6C8075] uppercase tracking-wider block mb-2">
                Click a sample scenario to generate instantly:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {journey.clarification.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onQuickSearch && onQuickSearch(suggestion)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F3F7F5] hover:bg-[#E6F0EB] text-[#1B4D3E] border border-[#CDE3D7] transition-all hover:scale-[1.02] shadow-2xs text-left"
                  >
                     {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom refinement input */}
          <div className="mt-6 max-w-lg mx-auto flex items-center gap-2">
            <input
              type="text"
              value={clarificationInput}
              onChange={(e) => setClarificationInput(e.target.value)}
              placeholder="e.g., I want to start a small bakery in Mumbai"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#D5E3DB] text-sm text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-white shadow-2xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && clarificationInput.trim() && onQuickSearch) {
                  onQuickSearch(clarificationInput.trim());
                }
              }}
            />
            <button
              onClick={() => {
                if (clarificationInput.trim() && onQuickSearch) {
                  onQuickSearch(clarificationInput.trim());
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE: If no journey or steps yet
  if (!journey.title || steps.length === 0) {
    return (
      <div className="mb-6 rounded-2xl bg-white border border-[#E2EAE5] p-8 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-[#11261F]">
          Ready to Navigate Your Civic Procedure
        </h3>
        <p className="text-xs text-[#6C8075] max-w-md mx-auto mt-1 leading-relaxed">
          Type any government procedure or commercial goal in natural language to generate a verified, dependency-aware step-by-step roadmap.
        </p>
      </div>
    );
  }

  // 3. METRICS & DYNAMIC NEXT STEP (Section 14 & 15)
  const completedCount = steps.filter((s) => s.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Document metrics
  let totalDocs = 0;
  let readyDocs = 0;
  steps.forEach((s) => {
    s.documents.forEach((d) => {
      totalDocs++;
      if (d.status === 'READY' || d.status === 'UPLOADED') readyDocs++;
    });
  });
  const docPercent = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;
  const costSummary = calculateTotalJourneyCost(steps);

  // Determine the dynamic "Your Next Step"
  // The first uncompleted step whose prerequisites are completely satisfied
  const nextActionableStep = steps.find((s) => s.status !== 'Completed' && !isStepBlocked(s)) || steps[0];

  // Filtering steps (Section 17)
  let filteredSteps = steps;
  switch (activeFilter) {
    case 'To Do':
      filteredSteps = steps.filter((s) => s.status !== 'Completed' && !isStepBlocked(s));
      break;
    case 'Completed':
      filteredSteps = steps.filter((s) => s.status === 'Completed');
      break;
    case 'Blocked':
      filteredSteps = steps.filter((s) => isStepBlocked(s));
      break;
    case 'Documents':
      filteredSteps = steps.filter((s) => s.documents.length > 0);
      break;
    case 'All':
    default:
      filteredSteps = steps;
      break;
  }


  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[#1B4D3E]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#11261F] dark:text-[#E2ECE7] tracking-tight">
              Interactive Civic Roadmap
            </h3>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 text-[11px] font-bold shadow-2xs"
            >
              <span>Gazette Grounded</span>
            </span>
          </div>
          <p className="text-xs text-[#6C8075] dark:text-[#90A79C] mt-0.5 font-normal">
            Understand first. Act second. Grounded in official statutory regulations.
          </p>
        </div>

        {/* Phase 5 Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setIsRefineModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F2F8F5] text-[#1B4D3E] text-xs font-bold border border-[#CDE3D7] transition-all shadow-2xs cursor-pointer"
            title="Refine activity, premises scale, or municipality"
          >
            <Sliders className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span>Refine Goal</span>
          </button>

          <button
            onClick={() => setIsSourcesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F2F8F5] text-[#1B4D3E] text-xs font-bold border border-[#CDE3D7] transition-all shadow-2xs cursor-pointer"
            title="View verified official source documents and authorities"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span>View Sources</span>
          </button>

          <button
            onClick={async () => {
              setIsRechecking(true);
              const res = await recheckRoadmap();
              setIsRechecking(false);
              setRecheckMessage(res.message);
              setTimeout(() => setRecheckMessage(null), 4000);
            }}
            disabled={isRechecking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F2F8F5] text-[#1B4D3E] text-xs font-bold border border-[#CDE3D7] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Re-check roadmap against current DishaSaathi knowledge base"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#1B4D3E] ${isRechecking ? 'animate-spin' : ''}`} />
            <span>{isRechecking ? 'Re-checking...' : 'Re-check Roadmap'}</span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>Civic Copilot</span>
          </button>

          <button
            onClick={onOpenGraphView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4EF] hover:bg-[#DDEEE4] text-[#1B4D3E] text-xs font-bold border border-[#CDE3D7] transition-colors shadow-2xs cursor-pointer"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph View</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback for Re-check */}
      {recheckMessage && (
        <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{recheckMessage}</span>
          </div>
          <button onClick={() => setRecheckMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
            
          </button>
        </div>
      )}

      {/* Main Roadmap Container Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0E1E19] border border-[#E2EAE5] dark:border-[#1F3E33] p-5 md:p-6 shadow-2xs transition-colors">
        {/* Dynamic Journey Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[#EDF2EE] dark:border-[#1F3E33]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF2ED] dark:bg-[#18392F] border border-[#D5E3DB] dark:border-[#1F3E33] flex items-center justify-center text-[#1B4D3E] dark:text-[#6EE7B7]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white">
                  {journey.title}
                </h4>
                {/* Journey Health Status Badge (Section 17) */}
                {adaptiveRecommendation && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adaptiveRecommendation.journeyHealth === 'ON_TRACK'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : adaptiveRecommendation.journeyHealth === 'BLOCKER_NEEDS_ATTENTION'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>
                      {adaptiveRecommendation.journeyHealth === 'ON_TRACK'
                        ? 'Journey On Track'
                        : adaptiveRecommendation.journeyHealth === 'BLOCKER_NEEDS_ATTENTION'
                        ? 'Blocker Needs Attention'
                        : 'Waiting for Verification'}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#6C8075] dark:text-[#9FB7AC] font-medium mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C9B94] dark:text-[#6C8075]" />
                  <span>{journey.location || 'India'}</span>
                </span>
                <span>•</span>
                <span>{journey.category}</span>
              </div>
            </div>
          </div>

          {/* Progress Summary (Section 15 & 16) */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Steps Progress
              </span>
              <span className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">
                {completedCount} / {steps.length} completed ({progressPercent}%)
              </span>
              <div className="w-28 sm:w-36 h-1.5 bg-[#EDF3EF] dark:bg-[#1A3329] rounded-full overflow-hidden border border-[#DCE6E1] dark:border-[#234538] mt-1">
                <div
                  className="h-full bg-[#1B4D3E] dark:bg-[#34D399] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 dark:border-[#1F3E33] pl-4">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Document Readiness
              </span>
              <span className="text-xs font-bold text-[#2A5C4B] dark:text-[#A7D7C5]">
                {readyDocs} / {totalDocs} ready ({docPercent}%)
              </span>
              <div className="w-28 sm:w-36 h-1.5 bg-[#EDF3EF] dark:bg-[#1A3329] rounded-full overflow-hidden border border-[#DCE6E1] dark:border-[#234538] mt-1">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${docPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 dark:border-[#1F3E33] pl-4">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Total Govt Fees
              </span>
              <span className="text-xs font-black text-[#1B4D3E] dark:text-[#6EE7B7] block">
                {costSummary.label}
              </span>
              <span className="text-[10px] text-[#6C8075] dark:text-[#9FB7AC]">
                Statutory Total
              </span>
            </div>
          </div>
        </div>


        {/* SECTION 17: LIGHTWEIGHT ROADMAP FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EDF2EE]">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {([
              { key: 'All', label: t.filterAll || 'All' },
              { key: 'To Do', label: t.filterToDo || 'To Do' },
              { key: 'Completed', label: t.filterCompleted || 'Completed' },
              { key: 'Blocked', label: t.filterBlocked || 'Blocked' },
              { key: 'Documents', label: t.filterDocuments || 'Documents' }
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as FilterType)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === key
                    ? 'bg-[#1B4D3E] text-white shadow-2xs'
                    : 'bg-[#F3F6F4] text-[#4A5D54] hover:bg-[#EAEFEA]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#6C8075] font-medium">
            {t.showingSteps || 'Showing'} {filteredSteps.length} of {steps.length} {t.impactProcedures || 'steps'}
          </span>
        </div>

        {/* Step-by-Step Vertical Narrative Stack */}
        <div className="space-y-4">
          {filteredSteps.map((step) => {
            const isCompleted = step.status === 'Completed';
            const isBlocked = isStepBlocked(step);
            const isCurrent = !isCompleted && !isBlocked && (step.status === 'In Progress' || step.id === nextActionableStep?.id);
            const isUpcoming = !isCompleted && !isBlocked && !isCurrent;
            const isSelected = selectedStepId === step.id;
            const parallelNames = getParallelStepNames(step);
            const cleanTitle = step.title.replace(/^\d+\.\s*/, '');

            // Document readiness on step card
            const stepTotalDocs = step.documents.length;
            const stepReadyDocs = step.documents.filter((d) => d.status === 'READY' || d.status === 'UPLOADED').length;

            let cardBg = 'bg-white dark:bg-[#0E1E19] border-[#E2ECE7] dark:border-[#1F3E33] hover:border-[#1B4D3E]/50 dark:hover:border-[#34D399]/50';
            if (isCompleted) {
              cardBg = 'bg-[#F2F8F5] dark:bg-[#122A21] border-[#C2DFD0] dark:border-[#245241]';
            } else if (isCurrent) {
              cardBg = 'bg-[#FEF9EE] dark:bg-[#232014] border-[#F5DC9E] dark:border-[#524424] ring-2 ring-[#E8BD65]/80 shadow-xs';
            } else if (isBlocked) {
              cardBg = 'bg-slate-50/80 dark:bg-[#1A181C] border-slate-200 dark:border-[#2C2630] text-slate-500 dark:text-slate-400';
            }

            if (isSelected) {
              cardBg += ' ring-2 ring-[#1B4D3E] dark:ring-[#34D399] border-[#1B4D3E] dark:border-[#34D399]';
            }

            return (
              <div
                key={step.id}
                onClick={() => onSelectStep(step)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs relative ${cardBg}`}
              >
                {/* Header row of card */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Status circle: Completed (), Current (●), Blocked (), Upcoming (○) */}
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shadow-2xs" title="Completed">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-[#E58A00] text-white flex items-center justify-center text-xs font-black shadow-xs ring-2 ring-[#E58A00]/30" title="Current Action">
                        {step.stepNumber}
                      </div>
                    ) : isBlocked ? (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center" title="Blocked by prerequisites">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#EDF3EF] dark:bg-[#1A3329] text-[#6C8075] dark:text-[#9FB7AC] flex items-center justify-center text-xs font-bold" title="Upcoming">
                        {step.stepNumber}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Clear State Badge: COMPLETED | CURRENT | UPCOMING | BLOCKED */}
                        {isCompleted && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            {t.stepCompleted || 'COMPLETED'}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-700 animate-pulse">
                            {t.stepCurrent || 'CURRENT'}
                          </span>
                        )}
                        {isBlocked && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                            {t.stepBlocked || 'BLOCKED'}
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {t.stepUpcoming || 'UPCOMING'}
                          </span>
                        )}

                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C8075] dark:text-[#9FB7AC]">
                          Step {step.stepNumber} • {step.category}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white leading-snug mt-0.5">
                        {cleanTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAF2ED] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] border border-[#D5E3DB] dark:border-[#1F3E33]">
                      {step.processingTime || '1 - 2 weeks'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#8C9B94]" />
                  </div>
                </div>

                {/* Plain-Language Explanation: What this means */}
                <div className="mt-2 text-xs sm:text-[13px] text-[#3A4D45] dark:text-[#A1B8AD] leading-relaxed">
                  <strong className="font-semibold text-[#11261F] dark:text-white">{t.whatThisMeans || 'What this means:'} </strong>
                  {step.plainLanguageSummary || step.description}
                </div>

                {/* Why You Need It Callout */}
                {step.whyRequired && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#EAF4EF]/70 dark:bg-[#142C23] border border-[#D4E8DC] dark:border-[#1F4536] text-xs text-[#2A5C4B] dark:text-[#A7D7C5]">
                    <div className="flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-[#143B2F] dark:text-white">{t.whyYouNeedIt || 'Why you need it:'} </strong>
                        <span>{step.whyRequired}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Authority, Documents Readiness & Badges */}
                <div className="mt-3 pt-3 border-t border-[#EDF2EE] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4A5D54] bg-[#F3F6F4] px-2.5 py-1 rounded-lg border border-[#E2E6E4]">
                      <Building2 className="w-3 h-3 text-[#6C8075]" />
                      <span>{step.authority || step.department}</span>
                    </span>

                    {/* Document Readiness Pill */}
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                      stepReadyDocs === stepTotalDocs && stepTotalDocs > 0
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-[#F3F6F4] text-[#4A5D54] border-[#E2E6E4]'
                    }`}>
                      <FileText className="w-3 h-3" />
                      <span>Docs: {stepReadyDocs} / {stepTotalDocs} {t.docsReady || 'ready'}</span>
                    </span>

                    {/* Parallel execution indicator */}
                    {parallelNames && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>Can complete in parallel with {parallelNames}</span>
                      </span>
                    )}

                    {/* Blocked dependency note */}
                    {isBlocked && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Available after completing {getPrerequisiteNames(step) || 'prior steps'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* SECTION 3: "Why am I seeing this?" Transparency Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTransparencyStep(step);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C8075] hover:text-[#11261F] hover:underline cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{t.whyAmISeeingThis || 'Why am I seeing this?'}</span>
                    </button>

                    {/* Contextual Ask DishaSaathi link */}
                    {onOpenAiAssistant && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAiAssistant(step.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:text-[#143B2F] hover:underline cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{t.askDishaSaathi || 'Ask DishaSaathi'}</span>
                      </button>
                    )}

                    {/* Direct 1-Click Mark as Completed Button */}
                    {onUpdateStatus && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isBlocked) {
                            onSelectStep(step);
                          } else {
                            onUpdateStatus(step.id, isCompleted ? 'In Progress' : 'Completed');
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 hover:bg-amber-100 hover:text-amber-900'
                            : isBlocked
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-100 hover:text-amber-800 border border-slate-200'
                            : 'bg-[#1B4D3E] hover:bg-[#143B2F] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-[#0D1A16] hover:scale-[1.02]'
                        }`}
                        title={isBlocked ? 'Prerequisites pending - click to inspect' : isCompleted ? 'Click to reopen' : 'Mark this statutory step as completed'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {isCompleted
                            ? (t.stepCompleted || 'Completed')
                            : (t.markCompleted || 'Mark as Completed')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 27: Verify Before You Act Banner */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-bold">Verify before you act: </strong>
            <span>
              Official municipal rules, application fees, and turnaround times are grounded in official department portals. Always confirm statutory filing deadlines with your jurisdictional officer before executing commercial contracts.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: "Why Am I Seeing This?" Transparency Modal */}
      {transparencyStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1B4D3E]" />
                <h4 className="text-sm font-bold text-slate-900">Why am I seeing this step?</h4>
              </div>
              <button
                onClick={() => setTransparencyStep(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                This step was programmatically mapped into your roadmap based on your goal input and regulatory requirements:
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block">Your Goal:</span>
                  <span>"{journey.query}"</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Activity & Location:</span>
                  <span>{journey.category} in {journey.location}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Responsible Procedure:</span>
                  <span>{transparencyStep.title}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Official Source:</span>
                  <span>{transparencyStep.source?.department || transparencyStep.authority} ({transparencyStep.source?.domain || 'gov.in'})</span>
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setTransparencyStep(null)}
                className="px-4 py-2 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#143B2F] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Refinement Modal (Section 24, 25, 26) */}
      <GoalRefinementModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
      />

      {/* Sources Transparency Panel Modal (Section 7, 8) */}
      <SourcesPanelModal
        journey={journey}
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />
    </div>
  );
};
