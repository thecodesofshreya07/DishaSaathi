import React from 'react';
import { Check, Loader2, Sparkles, MapPin, Compass } from 'lucide-react';
import { GenerationStage } from '../types';

interface GenerationLoaderProps {
  goal: string;
  city: string;
  state: string;
  stages: GenerationStage[];
}

export const GenerationLoader: React.FC<GenerationLoaderProps> = ({
  goal,
  city,
  state,
  stages
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#11261F]/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#D5E3DB] p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Soft decorative background tint */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#EAF2ED] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#E6F0EB] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Official Logo / Pulsing Container */}
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#CDE3D7] p-2 flex items-center justify-center mx-auto mb-4 shadow-sm relative overflow-hidden">
            <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain animate-pulse" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3 h-3 text-[#E8BD65]" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#11261F] tracking-tight">
            Building your roadmap...
          </h3>

          <p className="text-xs sm:text-sm text-[#4A5D54] mt-1.5 leading-relaxed max-w-sm mx-auto">
            We're breaking your goal into the procedures, documents and approvals you'll need.
          </p>

          {/* Goal pill summary */}
          <div className="mt-4 p-3 rounded-xl bg-[#F4F8F6] border border-[#E0EBE4] inline-flex items-center gap-2 text-xs font-semibold text-[#1B4D3E] text-left max-w-md w-full justify-between">
            <span className="line-clamp-1 flex-1 font-bold">"{goal}"</span>
            <span className="flex items-center gap-1 text-[11px] text-[#6C8075] flex-shrink-0 bg-white px-2 py-0.5 rounded-full border border-[#D0DDD5]">
              <MapPin className="w-3 h-3 text-[#1B4D3E]" />
              <span>{city}, {state}</span>
            </span>
          </div>

          {/* Progressive 4 Stages Checklist */}
          <div className="mt-6 space-y-3 text-left">
            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in_progress';
              const isPending = stage.status === 'pending';

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#F2F8F5] border-[#C2DFD0] text-[#11261F]'
                      : isInProgress
                      ? 'bg-[#FEF9EE] border-[#F5DC9E] ring-1 ring-[#E8BD65]/40 text-[#11261F] shadow-xs'
                      : 'bg-white border-[#E8ECE9] text-[#8C9B94] opacity-60'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-6 h-6 rounded-full bg-[#E58A00] text-white flex items-center justify-center shadow-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#EDF2EE] text-[#8C9B94] flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Stage Label */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-bold">
                      {stage.label}
                    </span>
                  </div>

                  {/* Right Status Badge */}
                  <div className="flex-shrink-0 text-[11px] font-bold">
                    {isCompleted && (
                      <span className="text-[#1B4D3E] bg-[#E8F5EE] px-2 py-0.5 rounded-full border border-[#CDE3D7]">
                        Verified
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[#B86E00] bg-[#FDF3DE] px-2 py-0.5 rounded-full border border-[#F5DC9E] animate-pulse">
                        Mapping...
                      </span>
                    )}
                    {isPending && (
                      <span className="text-[#8C9B94]">
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Honest civic intelligence note */}
          <div className="mt-6 pt-4 border-t border-[#EDF2EE] text-[11px] text-[#6C8075] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E]"></span>
            <span>Grounded in official municipal bylaws and state single-window portals</span>
          </div>
        </div>
      </div>
    </div>
  );
};
