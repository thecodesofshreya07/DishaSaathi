import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Clock,
  Building2,
  Copy,
  Check,
  Mail,
  ExternalLink,
  X,
  FileText,
  ShieldAlert,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ProcedureStep, CivicJourney } from '../types';
import { useAuth } from '../context/AuthContext';

interface SlaEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: ProcedureStep;
  journey?: CivicJourney;
}

interface GrievanceData {
  slaInfo: {
    stepId: string;
    stepTitle: string;
    department: string;
    actName: string;
    mandatedSlaDays: number;
    designatedOfficer: string;
    firstAppellateAuthority: string;
    grievancePortalUrl: string;
    portalName: string;
    penaltyClause?: string;
  };
  mandatedSlaDays: number;
  daysElapsed: number;
  overdueDays: number;
  isOverdue: boolean;
  grievanceLetterText: string;
  firstAppellateAuthority: string;
  designatedOfficer: string;
  officialGrievancePortal: string;
  statutoryLegalGrounds: string;
}

export const SlaEscalationModal: React.FC<SlaEscalationModalProps> = ({
  isOpen,
  onClose,
  step,
  journey
}) => {
  const { user } = useAuth();
  const [daysElapsed, setDaysElapsed] = useState<number>(22);
  const [applicationNumber, setApplicationNumber] = useState<string>(() => 'APP/' + Math.floor(100000 + Math.random() * 900000));
  const [citizenName, setCitizenName] = useState<string>(user?.name || 'Citizen Applicant');
  const [citizenEmail, setCitizenEmail] = useState<string>(user?.email || 'citizen@example.com');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [grievanceData, setGrievanceData] = useState<GrievanceData | null>(null);

  // Fetch or generate SLA data
  useEffect(() => {
    if (!isOpen || !step) return;

    const fetchSlaData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/civic/sla-escalation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            citizenName,
            stepTitle: step.title,
            department: step.authority || step.department,
            applicationNumber,
            daysElapsed,
            contactEmail: citizenEmail,
            location: journey?.location || 'Municipal Corporation / State Jurisdiction'
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setGrievanceData(data);
          }
        }
      } catch (err) {
        console.error('Failed to load SLA escalation data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlaData();
  }, [isOpen, step, daysElapsed, applicationNumber, citizenName, citizenEmail]);

  if (!isOpen || !step) return null;

  const handleCopyDraft = () => {
    if (!grievanceData?.grievanceLetterText) return;
    navigator.clipboard.writeText(grievanceData.grievanceLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailNotice = async () => {
    if (!citizenEmail || !grievanceData) return;
    setEmailing(true);
    setEmailSentStatus(null);
    try {
      const res = await fetch('/api/civic/send-escalation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: citizenEmail,
          citizenName,
          stepTitle: step.title,
          authority: step.authority || step.department || 'Designated Public Authority',
          mandatedSlaDays: grievanceData.mandatedSlaDays,
          daysElapsed: grievanceData.daysElapsed,
          applicationNumber,
          complaintDraft: grievanceData.grievanceLetterText,
          firstAppellateAuthority: grievanceData.firstAppellateAuthority,
          officialGrievancePortal: grievanceData.officialGrievancePortal
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setEmailSentStatus({
          success: true,
          message: result.simulated
            ? `Escalation notice dispatched! (Simulation mode: Ready for Brevo API Key)`
            : `Escalation notice successfully emailed to ${citizenEmail} via Brevo!`
        });
      } else {
        setEmailSentStatus({
          success: false,
          message: result.error || 'Failed to dispatch email'
        });
      }
    } catch (err: any) {
      setEmailSentStatus({
        success: false,
        message: err.message || 'Network error while dispatching email'
      });
    } finally {
      setEmailing(false);
    }
  };

  const mandatedDays = grievanceData?.mandatedSlaDays || 15;
  const overdueDays = Math.max(0, daysElapsed - mandatedDays);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/20">
                  Right to Public Services (RTS) Tracker
                </span>
                <span className="text-[10px] font-bold text-amber-300">
                  Application Delay Assistance
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Stuck? Here's What To Do & How To Complain
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs text-[#11261F] dark:text-[#E8F3EE]">
          
          {/* 1. SLA Violation Alarm Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Statutory Deadline Diagnosis</span>
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white">
                This should have taken <span className="underline font-black text-[#1B4D3E] dark:text-[#6EE7B7]">{mandatedDays} days</span>. It has been <span className="underline font-black text-rose-600">{daysElapsed} days</span> ({overdueDays} days overdue).
              </p>
              <p className="text-[11px] text-[#4A5D54] dark:text-[#A2B9AE]">
                You have the statutory legal right to file a First Appeal under the <em>Right to Public Services Act</em>.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-black text-xs shrink-0 shadow-2xs">
              +{overdueDays} Days Overdue
            </div>
          </div>

          {/* 2. Interactive Time & Application Details Adjustment */}
          <div className="p-4 rounded-2xl bg-[#F6FAF8] dark:bg-[#12241E] border border-[#DCEAE2] dark:border-[#1F3E33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider text-[11px]">
                Application Details for Grievance Draft
              </span>
              <span className="text-[10px] text-slate-500">Auto-calculated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Days Since Submission
                </label>
                <input
                  type="number"
                  min={mandatedDays + 1}
                  max={120}
                  value={daysElapsed}
                  onChange={(e) => setDaysElapsed(Number(e.target.value) || mandatedDays + 1)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-bold text-[#11261F] dark:text-white focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Acknowledgement / App No.
                </label>
                <input
                  type="text"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-bold text-[#11261F] dark:text-white focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Your Contact Email
                </label>
                <input
                  type="email"
                  value={citizenEmail}
                  onChange={(e) => setCitizenEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-bold text-[#11261F] dark:text-white focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>
            </div>
          </div>

          {/* 3. Designated Authority Contact Details */}
          {grievanceData && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span className="font-extrabold text-amber-900 dark:text-amber-300">
                  Where to send this complaint:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">First Appellate Authority:</span>
                  <strong className="text-[#11261F] dark:text-white">{grievanceData.firstAppellateAuthority}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Official Grievance Portal:</span>
                  <strong className="text-[#11261F] dark:text-white">{grievanceData.slaInfo.portalName}</strong>
                </div>
              </div>
            </div>
          )}

          {/* 4. Ready-Made Formal Grievance Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Ready-to-File Grievance Notice (No Writing Needed)</span>
              </span>
              <button
                onClick={handleCopyDraft}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] font-mono text-[11px] text-[#2C3E35] dark:text-[#A2B9AE] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
              {loading ? (
                <div className="py-6 text-center text-slate-400">
                  Generating statutory legal grievance draft...
                </div>
              ) : (
                grievanceData?.grievanceLetterText
              )}
            </div>
          </div>

          {/* Email dispatch feedback */}
          {emailSentStatus && (
            <div className={`p-3 rounded-xl text-xs font-bold ${
              emailSentStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {emailSentStatus.message}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F6FAF8] dark:bg-[#10271F] border-t border-[#DCE8E1] dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Brevo Email Action */}
            <button
              onClick={handleEmailNotice}
              disabled={emailing || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] hover:border-[#1B4D3E] text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              title="Dispatches this grievance draft directly to your email inbox via Brevo"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{emailing ? 'Sending via Brevo...' : 'Email Me This Draft'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {grievanceData?.officialGrievancePortal && (
              <a
                href={grievanceData.officialGrievancePortal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Open Grievance Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[#11261F] dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
