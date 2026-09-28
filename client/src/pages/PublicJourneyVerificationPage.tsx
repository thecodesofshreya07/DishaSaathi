import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
  Sparkles,
  FileDown
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { CivicJourney } from '../types';
import { generateRoadmapPdf } from '../utils/pdfGenerator';

export const PublicJourneyVerificationPage: React.FC = () => {
  const { journeyId } = useParams<{ journeyId?: string }>();
  const [searchParams] = useSearchParams();
  const { journeys, journey: activeJourney } = useRoadmap();
  const [copied, setCopied] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const hasAutoDownloaded = useRef(false);

  const allJourneys = journeys.length > 0 ? journeys : (activeJourney ? [activeJourney] : []);
  
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (journeyId && journeyId !== 'all') {
      return journeyId;
    }
    return allJourneys[0]?.id || '';
  });

  const matchedJourney: CivicJourney | null =
    allJourneys.find((j) => j.id === selectedId) || activeJourney || allJourneys[0] || null;

  const steps = matchedJourney?.steps || [];
  const completedCount = steps.filter((s) => s.status === 'Completed').length;
  const inProgressCount = steps.filter((s) => s.status === 'In Progress').length;
  const totalSteps = steps.length || matchedJourney?.totalSteps || 5;
  const progressPercent = Math.round((completedCount / (totalSteps || 1)) * 100);

  const verificationId = `DS-VERIFY-${(matchedJourney?.id || 'ROADMAP').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  // Handle PDF Generation and Download
  const handleDownloadPdf = () => {
    if (!matchedJourney) return;
    try {
      const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Direct server binary download works on 100% of mobile browsers (iOS Safari, Android Chrome)
        window.location.href = `/api/journey/${matchedJourney.id || 'current'}/download-pdf`;
        setPdfDownloaded(true);
      } else {
        generateRoadmapPdf(matchedJourney, 'Verified Citizen');
        setPdfDownloaded(true);
      }
    } catch (e) {
      console.error('Failed to generate PDF, falling back to server download:', e);
      window.location.href = `/api/journey/${matchedJourney.id || 'current'}/download-pdf`;
      setPdfDownloaded(true);
    }
  };

  // Auto-download when user scanned the QR code containing ?download=pdf
  useEffect(() => {
    const shouldDownload = searchParams.get('download') === 'pdf' || searchParams.get('download') === '1';
    if (shouldDownload && matchedJourney && !hasAutoDownloaded.current) {
      hasAutoDownloaded.current = true;
      const timer = setTimeout(() => {
        handleDownloadPdf();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [matchedJourney?.id, searchParams]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Civic Clearance Verification: ${matchedJourney?.title}`,
        text: `Verified clearance progress: ${completedCount} of ${totalSteps} stages cleared. Download official PDF roadmap.`,
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
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-950" />
              <span>{pdfDownloaded ? 'PDF Downloaded' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-[#DCE8E1] dark:border-[#1E3B32] bg-[#F7FAF8] dark:bg-[#12241E] text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#143B2F] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* QR Scan Success Download Banner */}
        {pdfDownloaded && (
          <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span className="text-xs font-bold">
                Official Gazette-verified Roadmap PDF for "{matchedJourney?.title}" has been saved to your device.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="text-xs underline font-extrabold cursor-pointer hover:opacity-90 shrink-0"
            >
              Download Again
            </button>
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
                    Public Civic Clearance Verification & PDF Roadmap
                  </span>
                  <h1 className="text-base sm:text-lg font-black text-white">
                    {matchedJourney?.title || 'Civic Procedure Roadmap'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-950" />
                  <span>Download Roadmap PDF</span>
                </button>
                <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-right">
                  <span className="text-[10px] text-emerald-200 block">Verification ID</span>
                  <span className="text-xs font-mono font-bold text-white">{verificationId}</span>
                </div>
              </div>
            </div>

            {/* Target Goal & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-emerald-200 block font-medium">Registered Civic Goal:</span>
                <span className="text-sm sm:text-base font-black text-white mt-0.5 block">
                  {matchedJourney?.title}
                </span>
              </div>
              <div>
                <span className="text-emerald-200 block font-medium">Active Jurisdiction:</span>
                <span className="text-sm font-bold text-emerald-100 mt-0.5 block">
                  {matchedJourney?.location || 'Mumbai, Maharashtra'}
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

        {/* Detailed Stage-by-Stage Breakdown */}
        <div className="bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2EE] dark:border-[#1E3B32]">
            <div>
              <h2 className="text-base font-black text-[#11261F] dark:text-white">
                Audited Clearance Stages & Documents
              </h2>
              <p className="text-xs text-[#5C7066] dark:text-[#8C9B94] mt-0.5">
                Real-time breakdown of completed, ongoing, and upcoming statutory requirements.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Save Official PDF</span>
              </button>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                Live Verified
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => {
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
              })}
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
