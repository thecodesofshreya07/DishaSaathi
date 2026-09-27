import React, { useState, useMemo } from 'react';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  RotateCcw,
  Scale,
  Building2,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  SlidersHorizontal,
  Home,
  Check
} from 'lucide-react';
import { CivicJourney, ProcedureStep } from '../types';

interface ProcedureSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: CivicJourney;
}

interface StatutoryRiskInfo {
  stepTitle: string;
  actName: string;
  section: string;
  penalty: string;
  consequence: string;
}

// Built-in Indian Municipal & Central Statutory Legal Penalties Database
const STATUTORY_RISKS: Record<string, StatutoryRiskInfo> = {
  fssai: {
    stepTitle: 'FSSAI Food Safety License / Registration',
    actName: 'Food Safety and Standards Act, 2006',
    section: 'Section 31',
    penalty: 'Fine up to ₹5,00,000 and closure notice',
    consequence: 'Operating a food business without FSSAI registration is a cognizable legal offense; municipal health authorities can order immediate cessation of sales.'
  },
  shop: {
    stepTitle: 'Shop & Establishment Registration',
    actName: 'State Shops & Establishments Act',
    section: 'Section 6 & 29',
    penalty: 'Fine up to ₹10,000 + daily recurring penalty',
    consequence: 'Failure to register within 30 days of opening prevents opening a commercial bank current account and invalidates local trade clearances.'
  },
  gst: {
    stepTitle: 'GST Registration Certificate',
    actName: 'Central Goods and Services Tax Act, 2017',
    section: 'Section 122(1)',
    penalty: '100% of tax amount or ₹10,000 (whichever is higher)',
    consequence: 'Supplying goods or services above the statutory threshold without registration results in confiscation of goods and loss of input tax credits.'
  },
  fire: {
    stepTitle: 'Fire Safety Clearance / NOC',
    actName: 'Fire Prevention & Life Safety Measures Act',
    section: 'Section 8',
    penalty: 'Premises closure + municipal utility disconnection',
    consequence: 'Operating without fire safety clearance leads to immediate suspension of trade and health licenses by municipal authorities.'
  },
  municipal: {
    stepTitle: 'Municipal Health / Trade License',
    actName: 'Municipal Corporation Act',
    section: 'Section 394',
    penalty: 'Fine of ₹5,000 to ₹25,000 + trade seizure',
    consequence: 'Ward health inspectors are empowered to issue stop-work orders for unauthorized commercial or trade activities.'
  }
};

export const ProcedureSimulatorModal: React.FC<ProcedureSimulatorModalProps> = ({
  isOpen,
  onClose,
  journey
}) => {
  const { steps = [] } = journey;

  // Track skipped step IDs
  const [skippedStepIds, setSkippedStepIds] = useState<string[]>([]);
  const [activeScenario, setActiveScenario] = useState<string>('all_compliant');

  // Toggle step skip status
  const handleToggleStep = (stepId: string) => {
    setActiveScenario('custom');
    setSkippedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  // Reset sandbox
  const handleReset = () => {
    setSkippedStepIds([]);
    setActiveScenario('all_compliant');
  };

  // Preset Scenario Handlers
  const applyPresetScenario = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);

    if (scenarioKey === 'home_setup') {
      // Skips commercial premises, Shop Act, and Fire NOC for home/cloud setup
      const toSkip = steps
        .filter(
          (s) =>
            s.title.toLowerCase().includes('shop') ||
            s.title.toLowerCase().includes('fire') ||
            s.title.toLowerCase().includes('commercial') ||
            s.title.toLowerCase().includes('establishment')
        )
        .map((s) => s.id);
      setSkippedStepIds(toSkip.length > 0 ? toSkip : [steps[1]?.id].filter(Boolean));
    } else if (scenarioKey === 'micro_turnover') {
      // Skips full GST and State license (exempt under turnover threshold)
      const toSkip = steps
        .filter(
          (s) =>
            s.title.toLowerCase().includes('gst') ||
            s.title.toLowerCase().includes('state license')
        )
        .map((s) => s.id);
      setSkippedStepIds(toSkip.length > 0 ? toSkip : [steps[steps.length - 1]?.id].filter(Boolean));
    } else if (scenarioKey === 'skip_first') {
      // Skips only the first step to demonstrate prerequisite sequence
      setSkippedStepIds(steps.length > 0 ? [steps[0].id] : []);
    } else if (scenarioKey === 'all_compliant') {
      setSkippedStepIds([]);
    }
  };

  // Real-time Computation of Cascading Blockages
  const simulationResults = useMemo(() => {
    const blockedMap: Record<string, { blockedBy: string[]; reason: string }> = {};
    const effectivelyBlockedOrSkipped = new Set<string>(skippedStepIds);

    let changed = true;
    while (changed) {
      changed = false;
      for (const step of steps) {
        if (effectivelyBlockedOrSkipped.has(step.id)) continue;

        const directBlockingPrereqs = (step.prerequisites || []).filter((pId) =>
          effectivelyBlockedOrSkipped.has(pId)
        );

        if (directBlockingPrereqs.length > 0) {
          effectivelyBlockedOrSkipped.add(step.id);
          const blockingStepNames = directBlockingPrereqs
            .map((pId) => {
              const s = steps.find((stepItem) => stepItem.id === pId);
              return s ? `Step ${s.stepNumber} (${s.title.replace(/^\d+\.\s*/, '')})` : pId;
            })
            .join(', ');

          blockedMap[step.id] = {
            blockedBy: directBlockingPrereqs,
            reason: `Requires clearance from: ${blockingStepNames}`
          };
          changed = true;
        }
      }
    }

    // Determine legal risks for skipped steps
    const detectedRisks: StatutoryRiskInfo[] = [];
    for (const stepId of skippedStepIds) {
      const step = steps.find((s) => s.id === stepId);
      if (!step) continue;
      const lower = step.title.toLowerCase();

      if (lower.includes('food') || lower.includes('fssai')) {
        detectedRisks.push(STATUTORY_RISKS.fssai);
      } else if (lower.includes('shop') || lower.includes('establishment')) {
        detectedRisks.push(STATUTORY_RISKS.shop);
      } else if (lower.includes('gst')) {
        detectedRisks.push(STATUTORY_RISKS.gst);
      } else if (lower.includes('fire')) {
        detectedRisks.push(STATUTORY_RISKS.fire);
      } else if (lower.includes('municipal') || lower.includes('health') || lower.includes('trade')) {
        detectedRisks.push(STATUTORY_RISKS.municipal);
      } else {
        detectedRisks.push({
          stepTitle: step.title,
          actName: 'Statutory Administrative Rule',
          section: 'Section 4',
          penalty: 'Application rejection / Incomplete submission',
          consequence: `Skipping ${step.title.replace(/^\d+\.\s*/, '')} prevents subsequent approvals from being verified by the municipal portal.`
        });
      }
    }

    // Determine alternative legal pathways / exemptions
    const alternativePaths: Array<{ title: string; condition: string; description: string }> = [];
    if (skippedStepIds.some((id) => steps.find((s) => s.id === id)?.title.toLowerCase().includes('shop'))) {
      alternativePaths.push({
        title: 'Micro-Enterprise Home Exemption',
        condition: 'Home-based offices or single-person operations',
        description: 'Under revised state rules, home businesses may file a simple self-declaration intimation instead of obtaining a commercial premises inspection certificate.'
      });
    }

    if (skippedStepIds.some((id) => steps.find((s) => s.id === id)?.title.toLowerCase().includes('gst'))) {
      alternativePaths.push({
        title: 'Turnover Threshold Exemption',
        condition: 'Annual turnover below ₹40 Lakhs (Goods) / ₹20 Lakhs (Services)',
        description: 'Small businesses operating within state borders are legally exempt from GST registration until crossing statutory annual revenue thresholds.'
      });
    }

    if (alternativePaths.length === 0 && skippedStepIds.length > 0) {
      alternativePaths.push({
        title: 'Self-Declaration / Provisional Undertaking',
        condition: 'Low-risk administrative categories',
        description: 'You may submit a notarized affidavit or provisional undertaking to commence initial setup while standard certificates are in process.'
      });
    }

    const blockedCount = Object.keys(blockedMap).length;
    const safeCount = Math.max(0, steps.length - skippedStepIds.length - blockedCount);

    return {
      blockedMap,
      blockedCount,
      safeCount,
      detectedRisks,
      alternativePaths
    };
  }, [steps, skippedStepIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#0B1713] rounded-2xl border border-[#DCE4DF] dark:border-[#1E3B32] shadow-2xl flex flex-col overflow-hidden text-[#0D1F1A] dark:text-[#E8F3EE]">
        
        {/* ── 1. CLEAN CIVIC HEADER ── */}
        <div className="px-6 py-4 bg-[#F8FAF9] dark:bg-[#0E1E19] border-b border-[#E5EAE7] dark:border-[#1E3B32] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] dark:bg-[#22C55E] text-white dark:text-[#08120F] flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0D1F1A] dark:text-white tracking-tight">
                Check What Happens If You Skip a Step
              </h2>
              <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC]">
                Check why each step is required, official fines for skipping, and whether a legal waiver applies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {skippedStepIds.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD7D0] dark:border-[#1F3E33] bg-white dark:bg-[#12241E] text-xs font-semibold text-[#4A5D54] dark:text-[#D1E2D9] hover:bg-[#F3F7F5] transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. QUICK SCENARIO SELECTOR ── */}
        <div className="px-6 py-2.5 bg-white dark:bg-[#0B1713] border-b border-[#EDF2EE] dark:border-[#1A332B] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-semibold text-[#7A8E85] dark:text-[#7C978B] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Common Scenarios:
          </span>

          <button
            type="button"
            onClick={() => applyPresetScenario('all_compliant')}
            className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer text-xs ${
              activeScenario === 'all_compliant' && skippedStepIds.length === 0
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-[#F4F7F5] dark:bg-[#152721] border border-[#D5DDD8] dark:border-[#223E33] text-[#3B4D44] dark:text-[#A1B8AD] hover:border-[#1B4D3E]'
            }`}
          >
            Full Standard Sequence
          </button>

          <button
            type="button"
            onClick={() => applyPresetScenario('home_setup')}
            className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer text-xs ${
              activeScenario === 'home_setup'
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-[#F4F7F5] dark:bg-[#152721] border border-[#D5DDD8] dark:border-[#223E33] text-[#3B4D44] dark:text-[#A1B8AD] hover:border-[#1B4D3E]'
            }`}
          >
            Home-Based / Cloud Business
          </button>

          <button
            type="button"
            onClick={() => applyPresetScenario('skip_first')}
            className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer text-xs ${
              activeScenario === 'skip_first'
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-[#F4F7F5] dark:bg-[#152721] border border-[#D5DDD8] dark:border-[#223E33] text-[#3B4D44] dark:text-[#A1B8AD] hover:border-[#1B4D3E]'
            }`}
          >
            Skip Initial Step
          </button>

          <button
            type="button"
            onClick={() => applyPresetScenario('micro_turnover')}
            className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer text-xs ${
              activeScenario === 'micro_turnover'
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-[#F4F7F5] dark:bg-[#152721] border border-[#D5DDD8] dark:border-[#223E33] text-[#3B4D44] dark:text-[#A1B8AD] hover:border-[#1B4D3E]'
            }`}
          >
            Small Turnover Waiver (Under ₹12 Lakhs)
          </button>
        </div>

        {/* ── 3. 2-COLUMN CIVIC WORKSPACE ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT COLUMN: STEPS LIST ── */}
          <div className="lg:col-span-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D1F1A] dark:text-white">
                Procedure Steps ({steps.length})
              </h3>
              <span className="text-[11px] text-[#6C8075] dark:text-[#9FB7AC]">
                Click button to test skipping
              </span>
            </div>

            <div className="flex-1 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {steps.map((step) => {
                const isSkipped = skippedStepIds.includes(step.id);
                const isBlocked = !!simulationResults.blockedMap[step.id];

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-xl border transition-all text-left ${
                      isSkipped
                        ? 'border-[#E2D0D2] dark:border-[#3B2226] bg-[#FAF3F3] dark:bg-[#1A1113]'
                        : isBlocked
                        ? 'border-[#E8DFCD] dark:border-[#382E1E] bg-[#FAF7F0] dark:bg-[#181510]'
                        : 'border-[#E0EBE4] dark:border-[#1E3B32] bg-white dark:bg-[#0E1E19] hover:border-[#1B4D3E]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSkipped
                              ? 'bg-[#7C353B] text-white'
                              : isBlocked
                              ? 'bg-[#8C5819] text-white'
                              : 'bg-[#1B4D3E] dark:bg-[#22C55E] text-white dark:text-[#08120F]'
                          }`}
                        >
                          {isSkipped ? '—' : isBlocked ? '!' : step.stepNumber}
                        </span>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0D1F1A] dark:text-white leading-tight">
                            {step.title.replace(/^\d+\.\s*/, '')}
                          </h4>
                          <p className="text-[11px] text-[#6C8075] dark:text-[#9FB7AC] mt-0.5 truncate">
                            {step.authority || 'Competent Authority'}
                          </p>
                        </div>
                      </div>

                      {/* Clean Human Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                          isSkipped
                            ? 'bg-[#F2E4E6] hover:bg-[#EBD6D9] text-[#6E2A30] border border-[#DFC5C8]'
                            : isBlocked
                            ? 'bg-[#F0E8D5] text-[#6B4715] cursor-not-allowed border border-[#E0D4BB]'
                            : 'bg-white hover:bg-[#F2F6F4] text-[#1B4D3E] dark:bg-[#12241E] dark:text-[#6EE7B7] border border-[#D0DBD5] dark:border-[#224A3E]'
                        }`}
                      >
                        {isSkipped ? 'Omitted (Undo)' : isBlocked ? 'Locked' : 'Test Skipping'}
                      </button>
                    </div>

                    {/* Blocked indicator */}
                    {isBlocked && (
                      <div className="mt-2.5 pt-2 border-t border-[#E8DFCD] dark:border-[#382E1E] text-[11px] text-[#784D13] dark:text-amber-300 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 shrink-0 text-[#8C5819]" />
                        <span>Cannot proceed until earlier prerequisite step is completed</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: CLEAR CONSEQUENCES & ADVICE ── */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            
            {/* Status Card */}
            {skippedStepIds.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#F2F7F4] dark:bg-[#0E231B] border border-[#D2E4D9] dark:border-[#1E4334] text-left flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1B4D3E] dark:text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#11261F] dark:text-white">
                    All Required Clearances Maintained
                  </h4>
                  <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC] mt-0.5 leading-relaxed">
                    Your process follows the standard legal order. Click <strong>"Test Skipping"</strong> on any step to verify what problems occur or if you qualify for an official waiver.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FAF4F2] dark:bg-[#1A1213] border border-[#EADAD8] dark:border-[#382023] text-left flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#7C353B] dark:text-[#D99A9F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#5C2328] dark:text-[#E8A5AA]">
                    Impact Summary: {skippedStepIds.length} Step(s) Omitted, {simulationResults.blockedCount} Step(s) Blocked
                  </h4>
                  <p className="text-xs text-[#5C2328]/90 dark:text-[#E8A5AA]/90 mt-0.5 leading-relaxed">
                    Omitting prerequisite steps interrupts verification gates. Government portals will reject applications without prior clearance certificates.
                  </p>
                </div>
              </div>
            )}

            {/* Breakdown Panels */}
            <div className="flex-1 space-y-4 max-h-[440px] overflow-y-auto pr-1">
              
              {/* 1. Downstream Approvals Locked */}
              {simulationResults.blockedCount > 0 && (
                <div className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#181510] border border-[#E8DEC8] dark:border-[#332A18] text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#784D13] dark:text-amber-200 uppercase tracking-wide">
                    <Lock className="w-3.5 h-3.5 text-[#8C5819]" />
                    Approvals that will be delayed or denied:
                  </div>

                  <div className="space-y-2 pt-1">
                    {Object.entries(simulationResults.blockedMap).map(([blockedId, info]) => {
                      const step = steps.find((s) => s.id === blockedId);
                      return (
                        <div key={blockedId} className="p-2.5 rounded-lg bg-white dark:bg-[#122019] border border-[#E4D9BF] dark:border-[#2D2817] text-xs">
                          <div className="font-semibold text-[#11261F] dark:text-white">
                            Step {step?.stepNumber}: {step?.title.replace(/^\d+\.\s*/, '')}
                          </div>
                          <div className="text-[11px] text-[#784D13] dark:text-amber-300 mt-0.5">
                            {info.reason}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Official Government Rules & Penalties */}
              {simulationResults.detectedRisks.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#0E1E19] border border-[#E2E8E4] dark:border-[#1E3B32] text-left space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C2328] dark:text-[#E8A5AA] uppercase tracking-wide">
                    <Scale className="w-3.5 h-3.5 text-[#7C353B]" />
                    Official Government Rules & Penalties:
                  </div>

                  <div className="space-y-2.5">
                    {simulationResults.detectedRisks.map((risk, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#FAF6F6] dark:bg-[#181112] border border-[#EADBDE] dark:border-[#331B1E] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#3D1A1D] dark:text-[#E8F3EE]">{risk.stepTitle}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#EFE4E6] dark:bg-[#33191D] text-[#5C2328] dark:text-[#D99A9F] rounded">
                            {risk.section}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-[#5A6D64] dark:text-[#9FB7AC]">
                          {risk.actName}
                        </div>
                        <div className="text-[11px] text-[#11261F] dark:text-[#E8F3EE] pt-0.5">
                          <strong className="text-[#6E2A30] dark:text-[#E8A5AA]">Consequence / Fine:</strong> {risk.penalty}
                        </div>
                        <p className="text-[11px] text-[#5A6D64] dark:text-[#8EABA0] pt-1 leading-normal">
                          {risk.consequence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Legal Exemptions & Time-Saving Options */}
              {simulationResults.alternativePaths.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F2F7F4] dark:bg-[#0E231B] border border-[#D2E4D9] dark:border-[#1E4334] text-left space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                    Legal Exemptions & Time-Saving Options:
                  </div>

                  <div className="space-y-2">
                    {simulationResults.alternativePaths.map((alt, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white dark:bg-[#08120F] border border-[#D2E4D9] dark:border-[#1A3A2D] text-xs space-y-1">
                        <div className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">
                          {alt.title}
                        </div>
                        <div className="text-[11px] font-medium text-[#5A6D64] dark:text-[#9FB7AC]">
                          Applies to: {alt.condition}
                        </div>
                        <p className="text-[11px] text-[#2D3E35] dark:text-[#D1E2D9] leading-relaxed">
                          {alt.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── 4. FOOTER ── */}
        <div className="px-6 py-3.5 bg-[#F8FAF9] dark:bg-[#0E1E19] border-t border-[#E5EAE7] dark:border-[#1E3B32] flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] text-left flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#1B4D3E] dark:text-[#22C55E]" />
            <span>Educational guidance based on published municipal acts. Your live application is unchanged.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            Close Checker
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProcedureSimulatorModal;
