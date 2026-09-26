import React, { useState } from 'react';
import {
  X,
  Sliders,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { RoadmapDiff } from '../types';

interface GoalRefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalRefinementModal: React.FC<GoalRefinementModalProps> = ({
  isOpen,
  onClose
}) => {
  const { intake, refineGoal } = useRoadmap();

  const [goalText, setGoalText] = useState(intake.goal || '');
  const [city, setCity] = useState(intake.city || 'Mumbai');
  const [state, setState] = useState(intake.state || 'Maharashtra');
  const [additionalContext, setAdditionalContext] = useState(intake.additionalContext || 'Small / home-based bakery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diffResult, setDiffResult] = useState<RoadmapDiff | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDiffResult(null);

    const result = await refineGoal({
      goal: goalText,
      city,
      state,
      additionalContext
    });

    setIsSubmitting(false);
    if (result.success && result.diff) {
      setDiffResult(result.diff);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2EAE5] bg-[#F4F8F6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#11261F] text-base">
                Refine Your Civic Goal
              </h3>
              <p className="text-xs text-[#4A5D54]">
                Adapt procedural clearances to your exact operational scale and location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-[#4A5D54] hover:text-[#11261F] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!diffResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                  Citizen Goal Description
                </label>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                  placeholder="e.g., I want to start a home-based cloud bakery in Mumbai."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                    City / Municipal Corporation
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                  Operating Scale & Premises Context
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Small / home-based bakery',
                    'Commercial kitchen with dine-in',
                    'Manufacturing unit & wholesale',
                    'Sole Proprietorship startup'
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setAdditionalContext(preset)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        additionalContext === preset
                          ? 'border-[#1B4D3E] bg-[#EAF2ED] text-[#1B4D3E] font-bold'
                          : 'border-[#E2EAE5] bg-white text-[#4A5D54] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8ECE9]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#4A5D54] hover:text-[#11261F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Re-evaluating Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Adapt Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Diff Result View (Section 25) */
            <div className="space-y-4">
              <div className="bg-[#EAF2ED] border border-[#BBD3C5] rounded-2xl p-4">
                <h4 className="font-extrabold text-[#11261F] text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1B4D3E]" />
                  Your Roadmap Adapted
                </h4>
                <p className="text-xs text-[#2D5A46] mt-1 leading-relaxed">
                  {diffResult.summary}
                </p>
                {diffResult.preservedProgressCount > 0 && (
                  <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{diffResult.preservedProgressCount} completed step(s) preserved without data loss</span>
                  </div>
                )}
              </div>

              {diffResult.addedSteps.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    Added Procedures ({diffResult.addedSteps.length})
                  </h5>
                  <div className="space-y-1">
                    {diffResult.addedSteps.map((s) => (
                      <div
                        key={s.id}
                        className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 font-medium"
                      >
                        Step {s.stepNumber}: <strong>{s.title}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diffResult.removedSteps.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    Removed Irrelevant Procedures ({diffResult.removedSteps.length})
                  </h5>
                  <div className="space-y-1">
                    {diffResult.removedSteps.map((s) => (
                      <div
                        key={s.id}
                        className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-950 line-through"
                      >
                        {s.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#E8ECE9] flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Continue with Adapted Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
