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
    <div className="mb-6 rounded-2xl bg-white border border-[#D5E3DB] p-5 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EDF2EE]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#11261F] flex items-center gap-2">
              <span>{t.flowchartTitle || 'Civic Procedure Flowchart'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E]">
                {t.flowchartBadge || 'Linear & Parallel Dependencies'}
              </span>
            </h4>
            <p className="text-[11px] text-[#6C8075]">
              {t.flowchartDesc || 'Interactive visual flowchart. Click any small step node to inspect statutory obligations.'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-[#4A5D54]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t.flowchartCompleted || 'Completed'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> {t.flowchartCurrent || 'Current'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> {t.flowchartUpcoming || 'Upcoming'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> {t.flowchartBlocked || 'Blocked'}
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Flowchart Track */}
      <div className="overflow-x-auto pb-3 pt-2">
        <div className="inline-flex items-center min-w-full gap-2 px-1">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'Completed';
            const isBlocked = isStepBlocked(step);
            const isInProgress = step.status === 'In Progress';
            const isSelected = selectedStepId === step.id;
            const isLast = idx === steps.length - 1;
            const cleanTitle = step.title.replace(/^\d+\.\s*/, '');

            let cardBorder = 'border-slate-200 hover:border-[#1B4D3E]';
            let cardBg = 'bg-[#F9FBFA]';
            let badgeBg = 'bg-slate-200 text-slate-700';
            let statusText = t.flowchartUpcoming || 'Upcoming';

            if (isCompleted) {
              cardBorder = 'border-emerald-500/80 hover:border-emerald-600';
              cardBg = 'bg-[#F0F8F4]';
              badgeBg = 'bg-emerald-600 text-white';
              statusText = t.flowchartCompleted || 'Completed';
            } else if (isInProgress) {
              cardBorder = 'border-amber-400 hover:border-amber-500 ring-2 ring-amber-300/60';
              cardBg = 'bg-[#FFFBF2]';
              badgeBg = 'bg-amber-500 text-white';
              statusText = t.flowchartCurrent || 'In Progress';
            } else if (isBlocked) {
              cardBorder = 'border-rose-200/90 bg-slate-50';
              cardBg = 'bg-slate-50';
              badgeBg = 'bg-rose-100 text-rose-700';
              statusText = t.flowchartBlocked || 'Blocked';
            }

            if (isSelected) {
              cardBorder += ' ring-2 ring-[#1B4D3E] border-[#1B4D3E]';
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
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : isBlocked
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Title */}
                  <h5 className="text-xs font-bold text-[#11261F] line-clamp-2 leading-snug group-hover:text-[#1B4D3E] transition-colors" title={cleanTitle}>
                    {step.stepNumber}. {cleanTitle}
                  </h5>

                  {/* Department & Documents */}
                  <div className="mt-2 pt-2 border-t border-[#E8ECE9] flex items-center justify-between text-[10px] text-[#5C7066]">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[110px]" title={step.authority || step.department}>
                      <Building2 className="w-3 h-3 text-[#7E9388] shrink-0" />
                      <span className="truncate">{step.authority || step.department}</span>
                    </span>

                    <span className="flex items-center gap-1 font-semibold text-[#11261F] shrink-0">
                      <FileText className="w-3 h-3 text-[#7E9388]" />
                      <span>{step.documents.length} docs</span>
                    </span>
                  </div>

                  {/* Fee & Time Pill */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-[#1B4D3E] bg-white/70 px-2 py-1 rounded-lg border border-[#E5EBE7]">
                    <span className="text-[#4A5D54] font-medium">{step.processingTime || '1-2 weeks'}</span>
                    <span>{step.fee?.amount || 'Free'}</span>
                  </div>

                  {/* Blocked dependency badge */}
                  {isBlocked && (
                    <div className="mt-1.5 text-[9px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                      <span>Requires prior approvals</span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex-shrink-0 flex items-center px-1 text-slate-300">
                    <div className="flex items-center">
                      <div className={`h-0.5 w-4 sm:w-6 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <ArrowRight className={`w-4 h-4 -ml-1 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapFlowchart;
