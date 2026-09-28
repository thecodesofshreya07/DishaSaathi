import React from 'react';
import {
  Check,
  Lock,
  Clock,
  ArrowRight,
  AlertTriangle,
  Building2,
  FileText,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { CivicJourney, ProcedureStep } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getEstimatedFeeForStep } from '../utils/costCalculator';

interface RoadmapFlowchartProps {
  journey: CivicJourney;
  onSelectStep: (step: ProcedureStep) => void;
  selectedStepId?: string;
}

export const RoadmapFlowchart: React.FC<RoadmapFlowchartProps> = ({
  journey,
  onSelectStep,
  selectedStepId
}) => {
  const { steps = [] } = journey;
  const { t } = useLanguage();

  if (!steps || steps.length === 0) return null;

  const isStepBlocked = (step: ProcedureStep) => {
    if (step.status === 'Completed') return false;
    const incompletePrereqs = (step.prerequisites || []).filter((pId) => {
      const p = steps.find((s) => s.id === pId);
      return p && p.status !== 'Completed';
    });
    return incompletePrereqs.length > 0;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0E1E19] border border-[#E2EAE5] dark:border-[#1F3E33] p-4 sm:p-5 shadow-2xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-3 border-b border-[#EDF2EE] dark:border-[#1F3E33]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2ED] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center justify-center font-bold shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white flex items-center gap-2">
              <span>{t.flowchartTitle || 'Civic Procedure Flowchart'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 dark:bg-[#22C55E]/10 text-[#1B4D3E] dark:text-[#6EE7B7]">
                {t.flowchartBadge || 'Linear & Parallel Dependencies'}
              </span>
            </h4>
            <p className="text-[11px] text-[#6C8075] dark:text-[#9FB7AC]">
              {t.flowchartDesc || 'Visual step sequence. Click any step node to inspect required documents and fees.'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-[#4A5D54] dark:text-[#9FB7AC]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t.flowchartCompleted || 'Completed'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> {t.flowchartCurrent || 'Current'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span> {t.flowchartUpcoming || 'Upcoming'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> {t.flowchartBlocked || 'Blocked'}
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Flowchart Track */}
      <div className="overflow-x-auto pb-3 pt-2">
        <div className="inline-flex items-center min-w-full gap-2 px-1">
          {(() => {
            const nextActionableStep = steps.find((s) => s.status !== 'Completed' && !isStepBlocked(s));

            return steps.map((step, idx) => {
              const isCompleted = step.status === 'Completed';
              const isBlocked = isStepBlocked(step);
              const isInProgress = step.status === 'In Progress';
              const isCurrentAction = !isCompleted && !isBlocked && (isInProgress || step.id === nextActionableStep?.id);
              const isSelected = selectedStepId === step.id;
              const isLast = idx === steps.length - 1;
              const cleanTitle = step.title.replace(/^\d+\.\s*/, '');

              let cardBorder = 'border-slate-200 dark:border-[#1F3E33] hover:border-[#1B4D3E] dark:hover:border-[#34D399]';
              let cardBg = 'bg-[#F9FBFA] dark:bg-[#12241E]';
              let badgeBg = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
              let statusText = t.flowchartUpcoming || 'Upcoming';

              if (isCompleted) {
                cardBorder = 'border-emerald-500/80 dark:border-emerald-600/80 hover:border-emerald-600';
                cardBg = 'bg-[#F0F8F4] dark:bg-[#122A21]';
                badgeBg = 'bg-emerald-600 text-white';
                statusText = t.flowchartCompleted || 'Completed';
              } else if (isCurrentAction) {
                cardBorder = 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-300/60 dark:ring-amber-500/30 hover:border-amber-500 shadow-xs';
                cardBg = 'bg-[#FFFDF5] dark:bg-[#1C170E]';
                badgeBg = 'bg-amber-500 text-white';
                statusText = isInProgress ? (t.flowchartCurrent || 'In Progress') : 'Next Action';
              } else if (isBlocked) {
                cardBorder = 'border-rose-200/90 dark:border-rose-800/60 bg-slate-50 dark:bg-[#201518]';
                cardBg = 'bg-slate-50 dark:bg-[#201518]';
                badgeBg = 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
                statusText = t.flowchartBlocked || 'Blocked';
              }

              if (isSelected) {
                cardBorder += ' ring-2 ring-[#1B4D3E] dark:ring-[#34D399] border-[#1B4D3E] dark:border-[#34D399]';
              }

              return (
                <React.Fragment key={step.id}>
                  {/* Small Step Node */}
                  <div
                    onClick={() => onSelectStep(step)}
                    className={`flex-shrink-0 w-52 sm:w-56 p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs hover:shadow-md relative group select-none ${cardBorder} ${cardBg}`}
                  >
                    {/* Step Number & Status Badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-2xs ${badgeBg}`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : isBlocked ? <Lock className="w-3 h-3" /> : step.stepNumber}
                      </span>

                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : isCurrentAction
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 animate-pulse'
                          : isBlocked
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-xs font-bold text-[#11261F] dark:text-white line-clamp-2 leading-snug group-hover:text-[#1B4D3E] dark:group-hover:text-[#6EE7B7] transition-colors" title={cleanTitle}>
                      {step.stepNumber}. {cleanTitle}
                    </h5>

                    {/* Department & Documents */}
                    <div className="mt-2 pt-2 border-t border-[#E8ECE9] dark:border-[#1F3E33] flex items-center justify-between text-[10px] text-[#5C7066] dark:text-[#9FB7AC]">
                      <span className="flex items-center gap-1 font-medium truncate max-w-[110px]" title={step.authority || step.department}>
                        <Building2 className="w-3 h-3 text-[#7E9388] shrink-0" />
                        <span className="truncate">{step.authority || step.department}</span>
                      </span>

                      <span className="flex items-center gap-1 font-semibold text-[#11261F] dark:text-white shrink-0">
                        <FileText className="w-3 h-3 text-[#7E9388]" />
                        <span>{step.documents.length} docs</span>
                      </span>
                    </div>

                    {/* Fee & Time Pill */}
                    <div className={`mt-1.5 flex items-center justify-between text-[10px] font-bold px-2 py-1 rounded-lg border ${
                      isCurrentAction 
                        ? 'text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                        : 'text-[#1B4D3E] dark:text-[#6EE7B7] bg-white/70 dark:bg-[#0D1A16]/70 border-[#E5EBE7] dark:border-[#1F3E33]'
                    }`}>
                      <span className="text-[#4A5D54] dark:text-[#9FB7AC] font-medium">{step.processingTime || '1-2 weeks'}</span>
                      <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">{getEstimatedFeeForStep(step)}</span>
                    </div>

                  {/* Blocked dependency badge */}
                  {isBlocked && (
                    <div className="mt-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                      <span>Requires prior approvals</span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex-shrink-0 flex items-center px-1 text-slate-300 dark:text-slate-600">
                    <div className="flex items-center">
                      <div className={`h-0.5 w-4 sm:w-6 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <ArrowRight className={`w-4 h-4 -ml-1 ${isCompleted ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          });
        })()}
        </div>
      </div>
    </div>
  );
};

export default RoadmapFlowchart;
