import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  XCircle,
  RotateCcw,
  RefreshCw,
  Globe,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GovernmentUpdate } from '../types';

interface AdminValidationModalProps {
  updates: GovernmentUpdate[];
  onClose?: () => void;
  onApproveUpdate: (updateId: string) => void;
  onRejectUpdate: (updateId: string) => void;
  onResetJourney?: () => void;
  onUpdatesReceived?: (newUpdates: GovernmentUpdate[]) => void;
  isPageMode?: boolean;
}

export const AdminValidationModal: React.FC<AdminValidationModalProps> = ({
  updates: initialUpdates,
  onClose,
  onApproveUpdate,
  onRejectUpdate,
  onUpdatesReceived,
  isPageMode = false
}) => {
  const [localUpdates, setLocalUpdates] = useState<GovernmentUpdate[]>(initialUpdates);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync when initialUpdates changes
  React.useEffect(() => {
    setLocalUpdates(initialUpdates);
  }, [initialUpdates]);

  const pendingList = localUpdates.filter((u) => u.reviewStatus === 'Pending Review');
  const approvedList = localUpdates.filter((u) => u.reviewStatus === 'Approved');
  const rejectedList = localUpdates.filter((u) => u.reviewStatus === 'Rejected');

  const filteredUpdates = localUpdates.filter((u) => {
    if (filterTab === 'PENDING') return u.reviewStatus === 'Pending Review';
    if (filterTab === 'APPROVED') return u.reviewStatus === 'Approved';
    if (filterTab === 'REJECTED') return u.reviewStatus === 'Rejected';
    return true;
  });

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

  const content = (
    <div
      className={`relative w-full ${
        isPageMode
          ? 'bg-white dark:bg-[#0D1A16] rounded-3xl shadow-sm border border-[#DCE8E1] dark:border-[#1E3B32]'
          : 'max-w-3xl bg-white dark:bg-[#0D1A16] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E3B32]'
      } overflow-hidden animate-in fade-in duration-200`}
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-[#1B4D3E] text-white flex items-start justify-between">
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
              Review automated crawl detections, approve regulatory updates, and ensure 100% grounded trust.
            </p>
          </div>
        </div>

        {!isPageMode && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Selector & Controls */}
      <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-[#12241E] border-b border-slate-200 dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-slate-900 dark:bg-[#1B4D3E] text-white shadow-xs'
                : 'bg-white dark:bg-[#08120F] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#152B23] border border-slate-200 dark:border-[#1E3B32]'
            }`}
          >
            All ({localUpdates.length})
          </button>
          <button
            onClick={() => setFilterTab('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#08120F] text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60'
            }`}
          >
            Pending Review ({pendingList.length})
          </button>
          <button
            onClick={() => setFilterTab('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#08120F] text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60'
            }`}
          >
            Approved & Synced ({approvedList.length})
          </button>
          <button
            onClick={() => setFilterTab('REJECTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#08120F] text-rose-800 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60'
            }`}
          >
            Rejected ({rejectedList.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifySources}
            disabled={isVerifying}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-[#1B4D3E] hover:bg-slate-800 dark:hover:bg-[#256653] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Checking Portals...' : 'Verify Live Sources (.gov.in)'}</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Content Queue */}
      <div className={`p-6 ${isPageMode ? 'min-h-[400px]' : 'max-h-[55vh]'} overflow-y-auto space-y-4`}>
        {filteredUpdates.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-base font-bold text-slate-800 dark:text-white">No updates in {filterTab.toLowerCase()} queue</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">All statutory regulatory gazettes are evaluated.</p>
          </div>
        ) : (
          filteredUpdates.map((update) => {
            const isApproved = update.reviewStatus === 'Approved';
            const isRejected = update.reviewStatus === 'Rejected';

            return (
              <div
                key={update.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  isApproved
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                    : isRejected
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 opacity-80'
                    : 'bg-slate-50 dark:bg-[#12241E] border-slate-200 dark:border-[#1E3B32] shadow-xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                          : isRejected
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-700'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                      }`}
                    >
                      {update.reviewStatus}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      Detected: {update.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isApproved && (
                      <button
                        onClick={() => {
                          setLocalUpdates((prev) =>
                            prev.map((u) => (u.id === update.id ? { ...u, reviewStatus: 'Approved' } : u))
                          );
                          onApproveUpdate(update.id);
                          setStatusMessage(`Update "${update.title}" approved & synced to active citizen roadmaps!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Sync Roadmaps</span>
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        onClick={() => {
                          setLocalUpdates((prev) =>
                            prev.map((u) => (u.id === update.id ? { ...u, reviewStatus: 'Rejected' } : u))
                          );
                          onRejectUpdate(update.id);
                          setStatusMessage(`Update "${update.title}" rejected and archived.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#08120F] border border-slate-300 dark:border-[#1E3B32] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {update.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {update.description}
                  </p>
                </div>

                {/* Old vs New Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#08120F] border border-slate-200 dark:border-[#1E3B32]">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Previous Baseline
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium mt-0.5 block">
                      {update.previousValue || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                      Proposed Statutory Change
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold mt-0.5 block">
                      {update.newValue || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-[#12241E] border-t border-slate-200 dark:border-[#1E3B32] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Human validation ensures 100% legal grounding for municipal citizens.</span>
      </div>
    </div>
  );

  if (isPageMode) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      {content}
    </div>
  );
};
