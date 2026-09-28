import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2
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
  const { journey, refineGoal } = useRoadmap();

  const [goalText, setGoalText] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diffResult, setDiffResult] = useState<RoadmapDiff | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize modal fields with the current active journey whenever modal opens
  useEffect(() => {
    if (isOpen && journey) {
      const locationParts = (journey.location || '').split(',').map((s) => s.trim());
      setGoalText(journey.query || journey.title || '');
      setCity(locationParts[0] || 'Mumbai');
      setState(locationParts[1] || 'Maharashtra');
      setAdditionalContext(
        journey.structuredGoal?.context?.additionalNotes ||
        journey.structuredGoal?.context?.type ||
        ''
      );
      setDiffResult(null);
      setErrorMessage(null);
    }
  }, [isOpen, journey?.id, journey?.title]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDiffResult(null);
    setErrorMessage(null);

    const result = await refineGoal({
      goal: goalText,
      city,
      state,
      additionalContext,
      journey: journey || undefined
    });

    setIsSubmitting(false);
    if (result.success && result.diff) {
      setDiffResult(result.diff);
    } else {
      setErrorMessage(result.message || 'Could not adapt roadmap. Please verify details and try again.');
    }
  };

  // Dynamic presets based on active journey domain and keywords
  const getContextPresets = () => {
    const q = `${goalText} ${journey?.title || ''}`.toLowerCase();
    
    // Property / Flat purchase
    if (q.includes('flat') || q.includes('apartment') || q.includes('buy') || q.includes('property') || q.includes('rera') || q.includes('house')) {
      return [
        'Ready-to-move resale apartment / flat (Society Resale)',
        'Under-construction MahaRERA developer project',
        'Direct builder primary booking with home loan',
        'Co-op housing society flat share transfer'
      ];
    }

    // Driving Licence / Parivahan RTO
    if (q.includes('license') || q.includes('licence') || q.includes('liscence') || q.includes('dl') || q.includes('learner') || q.includes('parwana') || q.includes('driving')) {
      return [
        'First-time Learner Licence (LL) applicant (online Aadhaar test)',
        'Permanent Driving Licence (DL) test with personal 4-wheeler (LMV)',
        'Two-wheeler motorcycle with gear (MCWG) licence',
        'Driving licence renewal / biometric endorsement'
      ];
    }

    // Rent / Tenancy
    if (q.includes('rent') || q.includes('lease') || q.includes('tenant') || q.includes('bhade') || q.includes('leave and license')) {
      return [
        '11-month residential registered leave and license agreement',
        'Commercial office space lease with police verification',
        'PG / Co-living rental accommodation with student ID',
        'Sub-letting residential flat with society NOC'
      ];
    }

    // School / Education
    if (q.includes('school') || q.includes('college') || q.includes('academy') || q.includes('education') || q.includes('coaching')) {
      return [
        'K-10 / K-12 Formal Recognized School (RTE Act & Trust)',
        'Preschool / Daycare / Early Childhood Center',
        'Private Coaching Academy / Skill Training Institute',
        'Secondary Education Board Affiliation (State Board / CBSE)'
      ];
    }

    // Vehicle Registration (Car/Bike)
    if (q.includes('vehicle') || q.includes('bike') || q.includes('car') || q.includes('rto') || q.includes('transport') || q.includes('scooter')) {
      return [
        'Brand new personal two-wheeler (Scooter / Bike)',
        'New four-wheeler passenger vehicle / EV',
        'Commercial transport / taxi / cargo registration',
        'Pre-owned vehicle ownership transfer'
      ];
    }

    // Food business
    if (q.includes('bakery') || q.includes('food') || q.includes('cafe') || q.includes('restaurant') || q.includes('sweet') || q.includes('kitchen')) {
      return [
        'Small / home-based cloud bakery (< ₹12L turnover)',
        'Commercial dine-in restaurant / cafe with seating',
        'Large food processing & wholesale factory',
        'Mobile food truck / street kiosk'
      ];
    }

    return [
      'Micro / home-based sole proprietorship',
      'Small commercial retail store / office',
      'Private Limited startup / LLP venture',
      'Large commercial or industrial enterprise'
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0D1A16] rounded-3xl max-w-xl w-full border border-[#D5E3DB] dark:border-[#1E3B32] shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2EAE5] dark:border-[#1E3B32] bg-[#F4F8F6] dark:bg-[#12241E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#11261F] dark:text-white text-base">
                Refine Your Civic Goal
              </h3>
              <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC]">
                Adapt procedural clearances to your exact operational scale and location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-[#4A5D54] dark:text-[#9FB7AC] hover:text-[#11261F] dark:hover:text-white hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!diffResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#11261F] dark:text-white mb-1.5">
                  Citizen Goal Description
                </label>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] dark:border-[#1E3B32] text-xs text-[#11261F] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9] dark:bg-[#152B24]"
                  placeholder="e.g., I want to buy a 2BHK flat in Mumbai."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#11261F] dark:text-white mb-1.5">
                    City / Municipal Corporation
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] dark:border-[#1E3B32] text-xs text-[#11261F] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9] dark:bg-[#152B24]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#11261F] dark:text-white mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] dark:border-[#1E3B32] text-xs text-[#11261F] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9] dark:bg-[#152B24]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11261F] dark:text-white mb-1.5">
                  Operating Scale & Premises Context
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2.5">
                  {getContextPresets().map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setAdditionalContext(preset)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        additionalContext === preset
                          ? 'border-[#1B4D3E] bg-[#EAF2ED] dark:bg-[#1E4336] text-[#1B4D3E] dark:text-[#6EE7B7] font-bold shadow-2xs'
                          : 'border-[#E2EAE5] dark:border-[#1E3B32] bg-white dark:bg-[#12241E] text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#F8FAF9] dark:hover:bg-[#18392F]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="block text-[11px] font-semibold text-[#556960] dark:text-[#9FB7AC] mb-1">
                    Or type your custom operational scale / situation:
                  </label>
                  <input
                    type="text"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5E3DB] dark:border-[#1E3B32] text-xs text-[#11261F] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9] dark:bg-[#152B24]"
                    placeholder="e.g. Resale flat in cooperative housing society with home loan"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8ECE9] dark:border-[#1E3B32]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#4A5D54] dark:text-[#9FB7AC] hover:text-[#11261F] dark:hover:text-white cursor-pointer"
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
              <div className="bg-[#EAF2ED] dark:bg-[#153127] border border-[#BBD3C5] dark:border-[#1E4336] rounded-2xl p-4">
                <h4 className="font-extrabold text-[#11261F] dark:text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                  Your Roadmap Adapted
                </h4>
                <p className="text-xs text-[#2D5A46] dark:text-[#A7E4CB] mt-1 leading-relaxed">
                  {diffResult.summary}
                </p>
                {diffResult.preservedProgressCount > 0 && (
                  <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-black/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{diffResult.preservedProgressCount} completed step(s) preserved without data loss</span>
                  </div>
                )}
              </div>

              {diffResult.addedSteps.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    Added Procedures ({diffResult.addedSteps.length})
                  </h5>
                  <div className="space-y-1">
                    {diffResult.addedSteps.map((s) => (
                      <div
                        key={s.id}
                        className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2.5 text-xs text-emerald-950 dark:text-emerald-200 font-medium"
                      >
                        Step {s.stepNumber}: <strong>{s.title}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diffResult.removedSteps.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    Removed Irrelevant Procedures ({diffResult.removedSteps.length})
                  </h5>
                  <div className="space-y-1">
                    {diffResult.removedSteps.map((s) => (
                      <div
                        key={s.id}
                        className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-2.5 text-xs text-rose-950 dark:text-rose-200 line-through"
                      >
                        {s.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diffResult.addedSteps.length === 0 && diffResult.removedSteps.length === 0 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 font-medium">
                  All current procedure milestones and documents remain active and verified for this refined operational scale.
                </div>
              )}

              <div className="pt-3 border-t border-[#E8ECE9] dark:border-[#1E3B32] flex justify-end">
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
