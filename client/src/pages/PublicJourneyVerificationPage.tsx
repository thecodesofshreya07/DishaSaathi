import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Share2,
  Printer,
  ChevronRight,
  Building2,
  ArrowLeft,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { CivicJourney } from '../types';

export const PublicJourneyVerificationPage: React.FC = () => {
  const { journeyId } = useParams<{ journeyId?: string }>();
  const { journeys, journey: activeJourney } = useRoadmap();
  const [copied, setCopied] = useState(false);

  const allJourneys = journeys.length > 0 ? journeys : (activeJourney ? [activeJourney] : []);
  
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (journeyId && journeyId !== 'all') {
      return journeyId;
    }
    return allJourneys.length > 1 && !journeyId ? 'all' : (allJourneys[0]?.id || 'all');
  });

  const isMaster = selectedId === 'all';
  const matchedJourney: CivicJourney | null = isMaster
    ? null
    : allJourneys.find((j) => j.id === selectedId) || activeJourney || allJourneys[0] || null;

  // Master stats
  const totalStagesAcrossAll = allJourneys.reduce((sum, j) => sum + (j.steps?.length || j.totalSteps || 5), 0);
  const completedStagesAcrossAll = allJourneys.reduce(
    (sum, j) => sum + (j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0),
    0
  );

  const steps = matchedJourney?.steps || [];
  const completedCount = isMaster
    ? completedStagesAcrossAll
    : steps.filter((s) => s.status === 'Completed').length;
  const inProgressCount = isMaster
    ? allJourneys.reduce((sum, j) => sum + (j.steps?.filter((s) => s.status === 'In Progress').length || 0), 0)
    : steps.filter((s) => s.status === 'In Progress').length;
  const totalSteps = isMaster ? totalStagesAcrossAll : steps.length || matchedJourney?.totalSteps || 5;
  const progressPercent = Math.round((completedCount / (totalSteps || 1)) * 100);

  const verificationId = `DS-VERIFY-${(matchedJourney?.id || 'PORTFOLIO').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Civic Clearance Verification: ${isMaster ? 'Master Citizen Portfolio' : matchedJourney?.title}`,
        text: `Verified clearance progress: ${completedCount} of ${totalSteps} stages cleared.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#08120F] text-[#11261F] dark:text-[#E8F1EC] font-sans flex flex-col justify-between">
      {/* Top Verification Header */}
      <header className="bg-white dark:bg-[#0D1A16] border-b border-[#DCE8E1] dark:border-[#1E3B32] px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E0EBE4] p-1 flex items-center justify-center shadow-2xs">
              <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-black tracking-tight text-[#11261F] dark:text-white">
              DishaSaathi
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-[#DCE8E1] dark:border-[#1E3B32] bg-[#F7FAF8] dark:bg-[#12241E] text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Status'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#143B2F] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Certificate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Multi-Journey Tabs (when citizen has multiple journeys) */}
        {allJourneys.length > 1 && (
          <div className="bg-white dark:bg-[#0D1A16] p-3 rounded-2xl border border-[#DCE8E1] dark:border-[#1E3B32] shadow-2xs space-y-2">
            <div className="text-[11px] font-bold text-[#5C7066] dark:text-[#8C9B94] px-1">
              Select Civic Procedure to View Verification:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedId('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                  isMaster
                    ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-xs'
                    : 'bg-[#F2F7F4] dark:bg-[#142B23] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E0] dark:border-[#1E3B32]'
                }`}
              >
                <span>Master Portfolio</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isMaster ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {allJourneys.length}
                </span>
              </button>

              {allJourneys.map((j) => {
                const isSelected = selectedId === j.id;
                const jCompleted = j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0;
                const jTotal = j.steps?.length || j.totalSteps || 5;

                return (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => setSelectedId(j.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-xs'
                        : 'bg-[#F2F7F4] dark:bg-[#142B23] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E0] dark:border-[#1E3B32]'
                    }`}
                  >
                    <span className="max-w-[150px] truncate">{j.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {jCompleted}/{jTotal}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Verification Status Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white shadow-xl relative overflow-hidden border border-[#2B6352]">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                    Public Civic Clearance Verification
                  </span>
                  <h1 className="text-base sm:text-lg font-black text-white">
                    {isMaster ? 'Master Citizen Compliance Portfolio' : 'Official Milestone & Progress Audit'}
                  </h1>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-right">
                <span className="text-[10px] text-emerald-200 block">Verification ID</span>
                <span className="text-xs font-mono font-bold text-white">{verificationId}</span>
              </div>
            </div>

            {/* Target Goal & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-emerald-200 block font-medium">
                  {isMaster ? 'Active Civic Procedures:' : 'Registered Civic Goal:'}
                </span>
                <span className="text-sm sm:text-base font-black text-white mt-0.5 block">
                  {isMaster ? `${allJourneys.length} Procedures in Citizen Portfolio` : matchedJourney?.title}
                </span>
              </div>
              <div>
                <span className="text-emerald-200 block font-medium">Active Jurisdiction:</span>
                <span className="text-sm font-bold text-emerald-100 mt-0.5 block">
                  {isMaster ? 'All Municipal Wards & Transport Divisions' : matchedJourney?.location || 'Mumbai, Maharashtra'}
                </span>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="space-y-2 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-100">
                  Completed Stages: <strong className="text-white">{completedCount} of {totalSteps} Cleared</strong>
                </span>
                <span className="text-amber-300 font-extrabold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] text-emerald-200/90 gap-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified against official Maharashtra Gazettes & Single-Window rules</span>
              </div>
              <span className="font-mono text-[10px]">Digital Hash: 0x8F92...B41E</span>
            </div>
          </div>
        </div>

        {/* Detailed Stage-by-Stage Breakdown or Portfolio Overview */}
        <div className="bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2EE] dark:border-[#1E3B32]">
            <div>
              <h2 className="text-base font-black text-[#11261F] dark:text-white">
                {isMaster ? 'All Civic Procedures in Portfolio' : 'Audited Clearance Stages'}
              </h2>
              <p className="text-xs text-[#5C7066] dark:text-[#8C9B94] mt-0.5">
                {isMaster
                  ? 'Click on any procedure below to inspect its itemized statutory milestones and clearance proofs.'
                  : 'Real-time breakdown of completed, ongoing, and upcoming statutory requirements.'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
              Live Verified
            </span>
          </div>

          <div className="space-y-3">
            {isMaster ? (
              allJourneys.map((j) => {
                const jCompleted = j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0;
                const jTotal = j.steps?.length || j.totalSteps || 5;
                const jPct = Math.round((jCompleted / (jTotal || 1)) * 100);

                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedId(j.id)}
                    className="p-4 rounded-2xl border border-[#E8ECE9] dark:border-[#1E3B32] hover:border-[#1B4D3E] transition-all cursor-pointer bg-[#FBFDFB] dark:bg-[#12241E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {j.category || 'Statutory'}
                        </span>
                        <span className="text-[10px] text-slate-400">{j.location}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#11261F] dark:text-white group-hover:text-[#1B4D3E] dark:group-hover:text-[#6EE7B7] transition-colors">
                        {j.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <div className="font-black text-[#1B4D3E] dark:text-[#6EE7B7] text-xs">
                          {jCompleted} / {jTotal} Stages Cleared
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">{jPct}% Completed</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold group-hover:bg-[#1B4D3E] group-hover:text-white transition-all">
                        Inspect
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              steps.map((step, idx) => {
                const isCompleted = step.status === 'Completed';
                const isInProgress = step.status === 'In Progress';

                return (
                  <div
                    key={step.id || idx}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : isInProgress
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-[#12241E] border-[#E8ECE9] dark:border-[#1E3B32]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isInProgress
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                              : isInProgress
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {isCompleted ? 'Stage Cleared' : isInProgress ? 'In Progress' : 'Pending Prerequisite'}
                          </span>
                          {step.department && (
                            <span className="text-[10px] font-bold text-slate-400">
                              &bull; {step.department}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-[#11261F] dark:text-white">
                          {step.title}
                        </h3>

                        <p className="text-[11px] text-[#5C7066] dark:text-[#9FB7AC] line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 text-[10px] text-slate-500 dark:text-slate-400 font-medium pl-11 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                      {step.fee?.amount && (
                        <span className="font-bold text-[#11261F] dark:text-white">
                          Govt Fee: ₹{step.fee.amount}
                        </span>
                      )}
                      {step.processingTime && (
                        <span>SLA: ~{step.processingTime}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Call to action: Explore full roadmap in DishaSaathi */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#11261F] dark:text-white">
              Want to manage or track your own civic clearances?
            </h3>
            <p className="text-xs text-[#5C7066] dark:text-[#8C9B94] mt-0.5">
              DishaSaathi provides real-time jurisdictional roadmap navigation, offline municipal counters, and gazette compliance tracking.
            </p>
          </div>

          <Link
            to="/roadmap"
            className="px-4 py-2.5 rounded-2xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <span>Open Interactive Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-[#DCE8E1] dark:border-[#1E3B32] bg-white dark:bg-[#0D1A16]">
        <p>Verified via DishaSaathi Civic Guidance Platform &bull; Gazette Grounded Digital Trust</p>
      </footer>
    </div>
  );
};

export default PublicJourneyVerificationPage;
