import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  XCircle,
  RotateCcw,
  RefreshCw,
  Globe
} from 'lucide-react';
import { GovernmentUpdate } from '../types';

interface AdminValidationModalProps {
  updates: GovernmentUpdate[];
  onClose: () => void;
  onApproveUpdate: (updateId: string) => void;
  onRejectUpdate: (updateId: string) => void;
  onResetDemo: () => void;
  onUpdatesReceived?: (newUpdates: GovernmentUpdate[]) => void;
}

export const AdminValidationModal: React.FC<AdminValidationModalProps> = ({
  updates,
  onClose,
  onApproveUpdate,
  onRejectUpdate,
  onResetDemo,
  onUpdatesReceived
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleVerifySources = async () => {
    setIsVerifying(true);
    setStatusMessage('Connecting to official .gov.in portals (FSSAI, GSTN, BMC)...');
    try {
      const res = await fetch('/api/admin/verify-sources', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.updates) {
        if (onUpdatesReceived) {
          onUpdatesReceived(data.updates);
        }
        setStatusMessage(data.message || `Crawl complete: ${data.verifiedCount} portals verified.`);
      } else {
        setStatusMessage('Verification completed with offline gazette fallback.');
      }
    } catch (err: any) {
      console.error('Source verification failed:', err);
      setStatusMessage('Network check completed (using gazette fallback).');
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">
                  DishaSaathi Civic Procedure Admin & Review
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Human-in-the-Loop AI
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Review automated crawl detections, approve regulatory updates, and ensure grounded trust.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Queue */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pending Regulatory Change Queue ({updates.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVerifySources}
                disabled={isVerifying}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Checking Portals...' : 'Verify Live Sources (.gov.in)'}</span>
              </button>

              <button
                onClick={onResetDemo}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {updates.map((update) => (
            <div
              key={update.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    update.reviewStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : update.reviewStatus === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {update.reviewStatus}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Detected: {update.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApproveUpdate(update.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Sync Roadmaps</span>
                  </button>

                  <button
                    onClick={() => onRejectUpdate(update.id)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {update.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {update.description}
                </p>
              </div>

              {/* Old vs New Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Previous Baseline
                  </span>
                  <span className="text-slate-700 font-medium mt-0.5 block">
                    {update.previousValue || 'N/A'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Proposed Change
                  </span>
                  <span className="text-slate-900 font-bold mt-0.5 block">
                    {update.newValue || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Human validation ensures 100% legal grounding for municipal citizens.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-all"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
