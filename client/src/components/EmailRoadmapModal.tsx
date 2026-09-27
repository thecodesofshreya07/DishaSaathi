import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CivicJourney } from '../types';
import { useAuth } from '../context/AuthContext';

interface EmailRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: CivicJourney;
}

export const EmailRoadmapModal: React.FC<EmailRoadmapModalProps> = ({
  isOpen,
  onClose,
  journey
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || 'Citizen');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string; simulated?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/civic/send-roadmap-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          journey
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          success: true,
          simulated: data.simulated,
          message: data.simulated
            ? `Roadmap email dispatched! (Simulation mode: Ready for your Brevo API key)`
            : `Roadmap digest successfully sent to ${email} via Brevo!`
        });
      } else {
        setStatus({
          success: false,
          message: data.error || 'Failed to send roadmap email'
        });
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || 'Network error while dispatching email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white inline-block mb-1">
                Brevo Email Integration
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Email My Civic Roadmap
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

        {/* Content */}
        <form onSubmit={handleSendEmail} className="p-5 sm:p-6 space-y-4 text-xs text-[#11261F] dark:text-[#E8F3EE]">
          <p className="text-[11px] text-[#5C7066] dark:text-[#A2B9AE] leading-relaxed">
            Receive your complete step-by-step roadmap for <strong>"{journey.title}"</strong>, including mandatory document checklists, legal acts, and official portal links directly in your inbox.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Citizen Name"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-bold text-[#11261F] dark:text-white focus:outline-none focus:border-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-bold text-[#11261F] dark:text-white focus:outline-none focus:border-[#1B4D3E]"
              />
            </div>
          </div>

          {/* Email Preview Features */}
          <div className="p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#12241E] border border-[#DCEAE2] dark:border-[#1F3E33] space-y-1.5 text-[11px]">
            <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7] block">
              What's included in this email:
            </span>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span>✓</span>
              <span>All {journey.steps ? journey.steps.length : journey.totalSteps} Topological Procedure Milestones</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span>✓</span>
              <span>Mandatory Document Checklists & Procurement Guides</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span>✓</span>
              <span>Statutory Legal Acts & Official Government Portals</span>
            </div>
          </div>

          {status && (
            <div className={`p-3.5 rounded-xl text-xs font-bold flex items-start gap-2 ${
              status.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {status.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[#11261F] dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email}
              className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send to Inbox</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
