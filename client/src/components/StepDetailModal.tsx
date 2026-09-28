import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Lock,
  Building,
  FileText,
  HelpCircle,
  ArrowRight,
  Zap,
  Sparkles,
  Check,
  Eye,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ProcedureStep, CivicJourney, CivicDocument, CivicDocumentStatus, CivicDocumentCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getDocumentProcurementInfo, getDocumentApplicationUrl, OfflineOfficeDetails } from '../utils/documentSources';
import { SourceExcerptModal } from './SourceExcerptModal';
import { OfflineDocModal } from './OfflineDocModal';
import { SlaEscalationModal } from './SlaEscalationModal';
import { DigiLockerModal } from './DigiLockerModal';
import { isDigiLockerAvailable } from '../utils/digiLockerEligibility';
import { getAlternateDocuments } from '../utils/documentAlternatives';

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
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [digiLockerDoc, setDigiLockerDoc] = useState<{ name: string; docId: string } | null>(null);
  const [activeOfflineDoc, setActiveOfflineDoc] = useState<{
    name: string;
    details: OfflineOfficeDetails;
    stepId: string;
    docId: string;
  } | null>(null);
  const [showPrereqWarning, setShowPrereqWarning] = useState(false);
  const [showDocWarning, setShowDocWarning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!step) return null;

  // Find prerequisite steps (checking prerequisites & dependsOn)
  const allPrereqIds = Array.from(new Set([...(step.prerequisites || []), ...(step.dependsOn || [])]));
  const prereqSteps = allPrereqIds.map((pId) =>
    journey.steps.find((s) =>
      s.id === pId ||
      s.id === `step-${pId}` ||
      String(s.stepNumber) === String(pId) ||
      pId === `step-${s.stepNumber}`
    )
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
  const unreadyDocs = step.documents.filter((d) => d.status !== 'READY' && d.status !== 'UPLOADED');
  const hasUnreadyDocs = unreadyDocs.length > 0;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Centered Modal Dialog Card (Strictly within viewport, no overflow cutoff) */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0D1A16] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E3B32] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        {/* Fixed Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#10241E] border-b border-slate-200 dark:border-[#1E3B32] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-[#1B4D3E] dark:bg-[#22C55E] text-white dark:text-[#0D1A16] text-xs font-bold flex items-center justify-center shadow-xs">
                {step.stepNumber}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {step.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {cleanTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
              <span>Authority: <strong className="text-slate-900 dark:text-white">{step.authority || step.department}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowTransparency(!showTransparency)}
              className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-[#1E3B32] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Why am I seeing this?"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-[#1E3B32] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION 3: "Why Am I Seeing This?" In-Drawer Banner */}
        {showTransparency && (
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 p-4 text-xs text-amber-950 dark:text-amber-200 animate-in fade-in duration-150 shrink-0">
            <div className="flex items-start justify-between">
              <strong className="font-extrabold uppercase tracking-wide text-amber-900 dark:text-amber-300 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Why am I seeing this step?
              </strong>
              <button onClick={() => setShowTransparency(false)} className="text-amber-800 dark:text-amber-300 font-bold text-xs cursor-pointer">Dismiss</button>
            </div>
            <div className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <p>• <strong>Citizen Goal:</strong> "{journey.query}"</p>
              <p>• <strong>Location:</strong> {journey.location}</p>
              <p>• <strong>Reason:</strong> Under regulations governed by {step.authority || step.department}, this procedure is mandatory for {journey.category.toLowerCase()}.</p>
              <p>• <strong>Official Source:</strong> {step.source?.title} ({step.source?.domain || 'gov.in'})</p>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-[#0D1A16]">
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
                    const alternateDocs = getAlternateDocuments(doc, step);

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
                            {alternateDocs && alternateDocs.length > 0 && (
                              <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Alternate document{alternateDocs.length > 1 ? 's' : ''}
                                </span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {alternateDocs.join(' or ')}
                                </span>
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

                              {/* DigiLocker 1-Click Pull Button (Only for eligible personal government documents) */}
                              {isDigiLockerAvailable(doc.name) && (
                                <button
                                  type="button"
                                  onClick={() => setDigiLockerDoc({ name: doc.name, docId: doc.id })}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
                                  title="Fetch this verified document directly from Government DigiLocker / API Setu"
                                >
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Pull from DigiLocker</span>
                                </button>
                              )}

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
                <span>{t.sourceEvidenceTitle || 'Official Government Source'}</span>
              </h3>
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

              {/* SLA / Escalation Complaint Generator */}
              <button
                type="button"
                onClick={() => setIsSlaModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer"
                title="Application pending or delayed? Generate a legal grievance draft and find the appellate authority."
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Stuck? SLA & Escalation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prerequisite warning banner when clicked while blocked */}
        {showPrereqWarning && isBlocked && (
          <div className="mx-6 mb-2 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Prerequisite Statutory Steps Required</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              This procedure requires completing prior dependencies first: <strong>{incompletePrereqs.map((p) => p.title.replace(/^\d+\.\s*/, '')).join(', ')}</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  try {
                    for (const prereq of incompletePrereqs) {
                      await onUpdateStatus(prereq.id, 'Completed');
                    }
                    await onUpdateStatus(step.id, 'Completed');
                    setShowPrereqWarning(false);
                    onClose();
                  } catch (err) {
                    console.error('Error completing prerequisites:', err);
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Completing...' : 'Complete Prerequisites & Finish Step'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPrereqWarning(false)}
                className="px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-semibold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Document Readiness warning banner when clicked while documents are pending */}
        {showDocWarning && hasUnreadyDocs && (
          <div className="mx-6 mb-2 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Required Documents Incomplete</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              All documents in this step must be marked as Ready before completing this step. Pending document(s): <strong>{unreadyDocs.map((d) => d.name).join(', ')}</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  try {
                    if (onUpdateDocumentStatus) {
                      for (const doc of unreadyDocs) {
                        await onUpdateDocumentStatus(step.id, doc.id, 'READY');
                      }
                    }
                    await onUpdateStatus(step.id, 'Completed');
                    setShowDocWarning(false);
                    onClose();
                  } catch (err) {
                    console.error('Error readying documents:', err);
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Updating...' : 'Mark All Documents Ready & Complete Step'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDocWarning(false)}
                className="px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-semibold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer with Actions (Sticky & Fixed at bottom) */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#10241E] border-t border-slate-200 dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {onOpenAiAssistant && (
            <button
              onClick={() => {
                onClose();
                onOpenAiAssistant(step.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-[#EAF2ED] dark:hover:bg-[#18392F] border border-[#CDE3D7] dark:border-[#1E3B32] transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.askDishaSaathi || 'Ask DishaSaathi'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {step.status !== 'Completed' ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={async () => {
                  if (isBlocked) {
                    setShowPrereqWarning(true);
                    return;
                  }
                  if (hasUnreadyDocs) {
                    setShowDocWarning(true);
                    return;
                  }
                  setIsUpdating(true);
                  try {
                    await onUpdateStatus(step.id, 'Completed');
                    onClose();
                  } catch (err) {
                    console.error('Error marking completed:', err);
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isBlocked
                    ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.02]'
                    : 'bg-[#1B4D3E] hover:bg-[#143B2F] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-[#0D1A16] hover:scale-[1.02]'
                }`}
                title={isBlocked ? 'Prerequisites pending - click to resolve' : 'Mark this statutory step as completed'}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUpdating ? 'Updating...' : (t.markCompleted || 'Mark as Completed')}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  try {
                    await onUpdateStatus(step.id, 'In Progress');
                    onClose();
                  } catch (err) {
                    console.error('Error reopening step:', err);
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all border border-amber-300 dark:border-amber-800 cursor-pointer"
              >
                {isUpdating ? 'Updating...' : (t.reopenStep || 'Reopen Step')}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E3B32] transition-colors cursor-pointer"
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

      {/* SLA / Escalation Tracker & Grievance Letter Modal */}
      {isSlaModalOpen && (
        <SlaEscalationModal
          isOpen={isSlaModalOpen}
          onClose={() => setIsSlaModalOpen(false)}
          step={step}
          journey={journey}
        />
      )}

      {/* DigiLocker Direct Fetch & Verification Modal */}
      {digiLockerDoc && (
        <DigiLockerModal
          isOpen={!!digiLockerDoc}
          onClose={() => setDigiLockerDoc(null)}
          documentName={digiLockerDoc.name}
          stepId={step.id}
          docId={digiLockerDoc.docId}
          onDocumentVerified={async (sId, dId, st) => {
            if (onUpdateDocumentStatus) {
              await onUpdateDocumentStatus(sId, dId, st);
            }
            setDigiLockerDoc(null);
          }}
        />
      )}

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
