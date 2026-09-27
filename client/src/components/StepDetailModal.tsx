import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Lock,
  Clock,
  Building,
  FileText,
  HelpCircle,
  ArrowRight,
  Zap,
  Sparkles,
  Info,
  Check,
  Eye,
  Scale
} from 'lucide-react';
import { ProcedureStep, CivicJourney, CivicVerificationStatus, CivicDocument, CivicDocumentStatus, CivicDocumentCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getDocumentProcurementInfo, getDocumentApplicationUrl, OfflineOfficeDetails } from '../utils/documentSources';
import { SourceExcerptModal } from './SourceExcerptModal';
import { OfflineDocModal } from './OfflineDocModal';

interface StepDetailModalProps {
  step: ProcedureStep | null;
  journey: CivicJourney;
  onClose: () => void;
  onUpdateStatus: (stepId: string, status: 'Completed' | 'In Progress' | 'Pending') => void;
  onUpdateDocumentStatus?: (stepId: string, docId: string, status: CivicDocumentStatus) => void;
  onNavigateToStep?: (stepId: string) => void;
  onOpenAiAssistant?: (stepId?: string) => void;
}

export const StepDetailModal: React.FC<StepDetailModalProps> = ({
  step,
  journey,
  onClose,
  onUpdateStatus,
  onUpdateDocumentStatus,
  onNavigateToStep,
  onOpenAiAssistant
}) => {
  const { t } = useLanguage();
  const [showTransparency, setShowTransparency] = useState(false);
  const [isExcerptModalOpen, setIsExcerptModalOpen] = useState(false);
  const [activeOfflineDoc, setActiveOfflineDoc] = useState<{
    name: string;
    details: OfflineOfficeDetails;
    stepId: string;
    docId: string;
  } | null>(null);

  if (!step) return null;

  // Find prerequisite steps
  const prereqSteps = (step.prerequisites || []).map((pId) =>
    journey.steps.find((s) => s.id === pId)
  ).filter(Boolean) as ProcedureStep[];

  const incompletePrereqs = prereqSteps.filter((s) => s.status !== 'Completed');
  const isBlocked = incompletePrereqs.length > 0 && step.status !== 'Completed';

  // Find parallel steps
  const parallelSteps = (step.parallelWith || []).map((pId) =>
    journey.steps.find((s) => s.id === pId)
  ).filter(Boolean) as ProcedureStep[];

  // Find next step in roadmap
  const nextStep = journey.steps.find((s) => s.stepNumber === step.stepNumber + 1);

  // Document readiness calculation
  const totalDocs = step.documents.length;
  const readyDocs = step.documents.filter((d) => d.status === 'READY' || d.status === 'UPLOADED').length;
  const docReadinessPercent = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 100;

  // Group documents by category (Section 8)
  const groupedDocs: Record<string, CivicDocument[]> = {};
  step.documents.forEach((doc) => {
    const cat = doc.category || 'OTHER';
    if (!groupedDocs[cat]) groupedDocs[cat] = [];
    groupedDocs[cat].push(doc);
  });

  const categoryLabels: Record<CivicDocumentCategory | 'OTHER', string> = {
    IDENTITY: 'Identity Verification',
    ADDRESS: 'Address & Locality Proof',
    OWNERSHIP: 'Premises & Ownership Records',
    BUSINESS: 'Business & Enterprise Proof',
    FINANCIAL: 'Banking & Financial Documentation',
    PROPERTY: 'Land & Building Proposal Records',
    PHOTOGRAPH: 'Photographs & Physical Signboards',
    OTHER: 'Statutory Certificates & Technical Reports'
  };

  const cleanTitle = step.title.replace(/^\d+\.\s*/, '');

  const renderVerificationBadge = (status?: CivicVerificationStatus) => {
    if (status === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span> Verified Source</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span> Needs Verification</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/70 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center">
                {step.stepNumber}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {step.category}
              </span>
              {renderVerificationBadge(step.verificationStatus)}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {cleanTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-[#1B4D3E]" />
              <span>Authority: <strong className="text-slate-900">{step.authority || step.department}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTransparency(!showTransparency)}
              className="p-2 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors"
              title="Why am I seeing this?"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION 3: "Why Am I Seeing This?" In-Drawer Banner */}
        {showTransparency && (
          <div className="bg-amber-50/80 border-b border-amber-200 p-4 text-xs text-amber-950 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <strong className="font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Why am I seeing this step?
              </strong>
              <button onClick={() => setShowTransparency(false)} className="text-amber-800 font-bold"></button>
            </div>
            <div className="mt-2 space-y-1 text-slate-700">
              <p>• <strong>Citizen Goal:</strong> "{journey.query}"</p>
              <p>• <strong>Location:</strong> {journey.location}</p>
              <p>• <strong>Reason:</strong> Under regulations governed by {step.authority || step.department}, this procedure is mandatory for {journey.category.toLowerCase()}.</p>
              <p>• <strong>Official Source:</strong> {step.source?.title} ({step.source?.domain || 'gov.in'})</p>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Blocked Warning Banner if prerequisite missing */}
          {isBlocked && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <Lock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">
                  Step Blocked — Prerequisite Incomplete
                </h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  This step becomes available after completing the prior prerequisite steps. Government officers cannot validate this procedure without previous approvals.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {incompletePrereqs.map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => onNavigateToStep && onNavigateToStep(pr.id)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-900 text-xs font-bold hover:bg-rose-100/60 flex items-center gap-1 shadow-2xs"
                    >
                      <span>Complete Step {pr.stepNumber} ({pr.title.replace(/^\d+\.\s*/, '')}) first</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parallel Execution Notice */}
          {parallelSteps.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong className="font-bold">Parallel Execution Opportunity: </strong>
                <span>
                  You do not need to wait for this step to complete before initiating{' '}
                  {parallelSteps.map((p) => `Step ${p.stepNumber} (${p.title.replace(/^\d+\.\s*/, '')})`).join(' and ')}.
                  Both procedures can be processed simultaneously!
                </span>
              </div>
            </div>
          )}

          {/* 1. What is this? (Plain-Language Explanation) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#1B4D3E]" />
              <span>What is this?</span>
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              {step.plainLanguageSummary || step.description}
            </p>
          </div>

          {/* 2. Why do I need it? (Prerequisite Rationale) */}
          {step.whyRequired && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Why do I need it?</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {step.whyRequired}
              </p>
            </div>
          )}

          {/* 3. Key Metadata: Fee, Processing Time, Mode */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Official Fee
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {step.fee?.amount || 'Statutory Fee'}
              </span>
              {step.fee?.description && (
                <span className="text-[10px] text-slate-500 line-clamp-1">
                  {step.fee.description}
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Processing Time
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {step.processingTime || '1 - 2 weeks'}
              </span>
              <span className="text-[10px] text-slate-500">Government turnaround</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Application Mode
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {step.applicationMode || 'Online'}
              </span>
              <span className="text-[10px] text-slate-500">Digital submission</span>
            </div>
          </div>

          {/* 4. SECTION 5, 6, 7, 8: DOCUMENT INTELLIGENCE CHECKLIST */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#1B4D3E]" />
                <span>Documents You May Need ({totalDocs})</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B4D3E]">
                  {readyDocs} / {totalDocs} ready ({docReadinessPercent}%)
                </span>
              </div>
            </div>

            {/* Document readiness progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-3.5">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${docReadinessPercent}%` }}
              ></div>
            </div>

            {/* Grouped Checklist */}
            <div className="space-y-4">
              {Object.entries(groupedDocs).map(([catKey, docList]) => (
                <div key={catKey} className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                    {categoryLabels[catKey as CivicDocumentCategory] || catKey}
                  </span>

                  {docList.map((doc) => {
                    const isReady = doc.status === 'READY' || doc.status === 'UPLOADED';

                    return (
                      <div
                        key={doc.id}
                        className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                          isReady
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 pr-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateDocumentStatus) {
                                onUpdateDocumentStatus(
                                  step.id,
                                  doc.id,
                                  isReady ? 'NOT_READY' : 'READY'
                                );
                              }
                            }}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                              isReady
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'border-2 border-slate-300 hover:border-[#1B4D3E] bg-white'
                            }`}
                            title={isReady ? 'Document marked as ready' : 'Click to mark as ready'}
                          >
                            {isReady && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div>
                            <div className={`text-xs font-bold ${isReady ? 'text-emerald-950 line-through/20' : 'text-slate-900'}`}>
                              {doc.name}
                            </div>
                            {doc.description && (
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                          {isReady ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                               {t.docsReady || 'Ready'}
                            </span>
                          ) : (
                            <>
                              {(() => {
                                const proc = getDocumentProcurementInfo(doc.name, doc.sourceUrl);
                                if (proc.mode === 'ONLINE') {
                                  return (
                                    <a
                                      href={proc.url || getDocumentApplicationUrl(doc.name, doc.sourceUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF2ED] hover:bg-[#D4E8DC] text-[#1B4D3E] text-[11px] font-bold border border-[#CDE3D7] transition-colors shadow-2xs cursor-pointer"
                                      title={`Open official portal to apply for ${doc.name}`}
                                    >
                                      <span>{t.applyForDoc || 'Apply Online ↗'}</span>
                                      <ExternalLink className="w-3 h-3 text-[#1B4D3E]" />
                                    </a>
                                  );
                                } else {
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveOfflineDoc({
                                          name: doc.name,
                                          details: proc.offlineDetails!,
                                          stepId: step.id,
                                          docId: doc.id
                                        });
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                                      title="Open card showing where to apply and office timings"
                                    >
                                      <Building className="w-3 h-3 text-amber-700" />
                                      <span>Where to Apply (Offline)</span>
                                    </button>
                                  );
                                }
                              })()}

                              <button
                                type="button"
                                onClick={() => {
                                  if (onUpdateDocumentStatus) {
                                    onUpdateDocumentStatus(step.id, doc.id, 'READY');
                                  }
                                }}
                                className="px-2 py-1 rounded-lg border border-transparent hover:border-[#D5E3DB] text-[11px] font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                              >
                                {t.haveDoc || 'I have this document'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 5. What happens next? (Next Step Preview) */}
          {nextStep && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="text-slate-900 font-bold block mb-1">What happens next?</strong>
              <p className="text-slate-600 leading-relaxed">
                After completing Step {step.stepNumber}, your next mandatory civic procedure will be{' '}
                <strong className="text-slate-800">Step {nextStep.stepNumber}: {nextStep.title.replace(/^\d+\.\s*/, '')}</strong> with {nextStep.authority || nextStep.department}.
              </p>
            </div>
          )}

          {/* 6. Official Source Evidence Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D5E3DB]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t.sourceEvidenceTitle || 'Source & Evidence Grounding'}</span>
              </h3>
              <span className="text-[10px] text-[#6C8075] font-medium">
                Last verified: {step.source?.lastVerified || step.source?.lastChecked || 'Recent'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div>
                <div className="text-xs font-bold text-[#11261F]">
                  {step.source?.title || 'State Government / Municipal Portal'}
                </div>
                <div className="text-[11px] text-[#4A5D54] mt-0.5">
                  Authority: <strong>{step.source?.authority || step.authority || step.department}</strong>
                </div>
              </div>
              <div>
                {renderVerificationBadge(step.verificationStatus)}
              </div>
            </div>

            {/* Official Source Link & AI Excerpt Trigger */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {(() => {
                const officialUrl = step.source?.url || (
                  (step.authority || step.department || '').toLowerCase().includes('mca') || (step.title || '').toLowerCase().includes('company') ? 'https://www.mca.gov.in' :
                  (step.authority || step.department || '').toLowerCase().includes('fssai') || (step.title || '').toLowerCase().includes('food') ? 'https://foscos.fssai.gov.in' :
                  (step.authority || step.department || '').toLowerCase().includes('bmc') || (step.authority || step.department || '').toLowerCase().includes('mcgm') || (step.authority || step.department || '').toLowerCase().includes('municipal') ? 'https://portal.mcgm.gov.in' :
                  (step.authority || step.department || '').toLowerCase().includes('rto') || (step.title || '').toLowerCase().includes('license') ? 'https://parivahan.gov.in' :
                  (step.authority || step.department || '').toLowerCase().includes('gst') ? 'https://www.gst.gov.in' :
                  (step.authority || step.department || '').toLowerCase().includes('labor') || (step.authority || step.department || '').toLowerCase().includes('gumasta') ? 'https://lms.mahaonline.gov.in' :
                  'https://aaplesarkar.mahaonline.gov.in'
                );

                return (
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B4D3E] text-white hover:bg-[#143B2F] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    title="Open the official department / government website in a new tab"
                  >
                    <span>Open Official Website ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                );
              })()}

              <button
                type="button"
                onClick={() => setIsExcerptModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAF2ED] text-[#1B4D3E] hover:bg-[#D4E8DC] border border-[#CDE3D7] text-xs font-bold transition-all cursor-pointer"
                title="View specific applicable text and statutory gazette rule"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.viewOfficialSource || 'View Gazette Excerpt & Rule'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions (Section 10) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {onOpenAiAssistant && (
            <button
              onClick={() => {
                onClose();
                onOpenAiAssistant(step.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1B4D3E] hover:bg-[#EAF2ED] border border-[#CDE3D7] transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.askDishaSaathi || 'Ask DishaSaathi about this step'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {step.status !== 'Completed' ? (
              <div className="flex items-center gap-2">
                <button
                  disabled={isBlocked}
                  onClick={() => {
                    onUpdateStatus(step.id, 'In Progress');
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EAF2ED] text-[#1B4D3E] hover:bg-[#D4E8DC] border border-[#CDE3D7] transition-all cursor-pointer"
                  title="Mark your application as submitted on the official portal"
                >
                  {t.markSubmitted || 'Mark as Submitted'}
                </button>
                <button
                  disabled={isBlocked}
                  onClick={() => {
                    onUpdateStatus(step.id, 'Completed');
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                    isBlocked
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#1B4D3E] hover:bg-[#143B2F] text-white hover:scale-[1.02]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.markCompleted || 'Mark as Completed'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onUpdateStatus(step.id, 'In Progress');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all border border-amber-300 cursor-pointer"
              >
                {t.reopenStep || 'Reopen Step'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {t.closeCard || 'Close'}
            </button>
          </div>
        </div>
      </div>

      {/* AI-Powered Specific Gazette Excerpt Modal (Item 7) */}
      <SourceExcerptModal
        isOpen={isExcerptModalOpen}
        onClose={() => setIsExcerptModalOpen(false)}
        title={step.source?.title || step.title}
        authority={step.source?.authority || step.authority || step.department}
        sourceUrl={step.source?.url}
        stepTitle={step.title}
        query={journey.query}
      />

      {/* Offline Document Details Modal (Item 3 & 4) */}
      {activeOfflineDoc && (
        <OfflineDocModal
          isOpen={!!activeOfflineDoc}
          onClose={() => setActiveOfflineDoc(null)}
          docName={activeOfflineDoc.name}
          details={activeOfflineDoc.details}
          onMarkSubmitted={() => {
            if (onUpdateDocumentStatus) {
              onUpdateDocumentStatus(activeOfflineDoc.stepId, activeOfflineDoc.docId, 'READY');
            }
            setActiveOfflineDoc(null);
          }}
        />
      )}
    </div>
  );
};
