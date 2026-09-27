import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  GitBranch, 
  FileCheck2, 
  Scale, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface CivicOnboardingTourProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceShow?: boolean;
}

const TOUR_STORAGE_KEY = 'dishasaathi_onboarding_completed';

export const CivicOnboardingTour: React.FC<CivicOnboardingTourProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  forceShow = false
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      return;
    }

    if (propIsOpen !== undefined) {
      setIsVisible(propIsOpen);
      return;
    }

    try {
      const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!hasSeenTour) {
        setIsVisible(true);
      }
    } catch {
      // Ignore localStorage availability issues
    }
  }, [propIsOpen, forceShow]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
    setIsVisible(false);
    if (propOnClose) propOnClose();
  };

  const steps = [
    {
      id: 'search-and-goal',
      icon: Search,
      badge: 'Step 1 of 4 • Goal Definition',
      title: 'State Your Civic or Commercial Objective',
      description:
        'Describe what you want to accomplish in everyday language, such as opening a bakery, registering a property, or transferring a vehicle.',
      practicalTip:
        'DishaSaathi automatically determines applicable municipal rules, state regulations, and central government clearances for your specific city.'
    },
    {
      id: 'dependencies-and-flow',
      icon: GitBranch,
      badge: 'Step 2 of 4 • Sequence & Flow',
      title: 'Understand Statutory Order and Dependencies',
      description:
        'Government departments require prerequisite approvals before accepting subsequent applications. The flowchart shows the exact order of execution.',
      practicalTip:
        'Steps marked as Current Action can be started immediately. Blocked steps will indicate which prior clearances must be completed first.'
    },
    {
      id: 'documents-and-fees',
      icon: FileCheck2,
      badge: 'Step 3 of 4 • Documentation & Costs',
      title: 'Verify Mandatory Documents and Official Fees',
      description:
        'Each step specifies required identity proofs, NOCs, and property records along with government statutory application fees.',
      practicalTip:
        'Use the document readiness tracker to assemble certified paperwork in advance to prevent departmental rejections.'
    },
    {
      id: 'tools-and-escalation',
      icon: Scale,
      badge: 'Step 4 of 4 • Practical Assistance',
      title: 'Simulate Alternatives and Resolve Delays',
      description:
        'Compare different procedural routes side by side, inspect consequences before skipping steps, or generate formal legal letters if an application exceeds statutory timelines.',
      practicalTip:
        'All guidance is referenced against official gazettes, municipal acts, and state government portals.'
    }
  ];

  if (!isVisible) return null;

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#0D1C17] border border-[#D5E3DB] dark:border-[#1E3B30] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#EDF2EE] dark:border-[#1E3B30] flex items-center justify-between bg-[#F8FAF9] dark:bg-[#0A1612]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] dark:text-[#6EE7B7]">
                DishaSaathi Orientation
              </span>
              <h3 className="text-sm font-bold text-[#11261F] dark:text-white leading-none">
                How to Navigate Your Roadmap
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#5A6E63] hover:text-[#11261F] dark:text-[#9FB7AC] dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            title="Close tutorial"
          >
            <span>Skip Walkthrough</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 flex-1">
          {/* Badge & Step Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF5EF] text-[#1B4D3E] dark:bg-[#142D24] dark:text-[#6EE7B7] border border-[#D0E5D9] dark:border-[#1E3B30]">
              {currentStep.badge}
            </span>

            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-[#1B4D3E] dark:bg-[#34D399]'
                      : 'w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Main Visual Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F7F3] dark:bg-[#132A22] border border-[#D5E6DC] dark:border-[#1E3B30] flex items-center justify-center text-[#1B4D3E] dark:text-[#6EE7B7] shrink-0 mt-0.5">
              <StepIcon className="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <h2 id="tour-title" className="text-base sm:text-lg font-extrabold text-[#11261F] dark:text-white leading-snug">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D54] dark:text-[#9FB7AC] mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Practical Callout Box */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9F6] dark:bg-[#10241D] border border-[#DEEDE4] dark:border-[#1C3B2E] text-xs text-[#2A5C4B] dark:text-[#A7D7C5]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4D3E] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#11261F] dark:text-white">Guidance Note: </span>
                <span>{currentStep.practicalTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F8FAF9] dark:bg-[#0A1612] border-t border-[#EDF2EE] dark:border-[#1E3B30] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs font-semibold text-[#5A6E63] hover:text-[#11261F] dark:text-[#9FB7AC] dark:hover:text-white transition-colors cursor-pointer"
          >
            Don't show this again
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] bg-white dark:bg-[#12241E] border border-[#D0DDD5] dark:border-[#1E3B30] rounded-xl hover:bg-[#F2F7F4] dark:hover:bg-[#18332A] transition-all cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1B4D3E] hover:bg-[#153D31] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Get Started with Roadmap</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-[#1B4D3E] hover:bg-[#153D31] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicOnboardingTour;
