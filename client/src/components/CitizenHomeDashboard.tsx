import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  ArrowRight,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { CivicJourney, GovernmentUpdate, ProcedureStep } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HeroBanner } from './HeroBanner';
import { RoadmapFlowchart } from './RoadmapFlowchart';

interface CitizenHomeDashboardProps {
  journey: CivicJourney;
  updates: GovernmentUpdate[];
  onGoToJourney: () => void;
  onGoToTab: (tab: string) => void;
  onDownloadPdf: () => void;
  onOpenAiCopilot: () => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  onSelectStep: (step: ProcedureStep) => void;
  selectedStepId?: string;
}

export const CitizenHomeDashboard: React.FC<CitizenHomeDashboardProps> = ({
  journey,
  updates,
  onGoToJourney,
  onGoToTab,
  onDownloadPdf,
  onOpenAiCopilot,
  onSearch,
  isLoading = false,
  onSelectStep,
  selectedStepId
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const completedSteps = journey.steps.filter((s) => s.status === 'Completed').length;
  const totalSteps = journey.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  let totalDocs = 0;
  let readyDocs = 0;
  journey.steps.forEach((s) => {
    s.documents.forEach((d) => {
      totalDocs++;
      if (d.status === 'READY' || d.status === 'UPLOADED') readyDocs++;
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Exactly as in the Screenshot: Hero Banner with Gateway of India, Welcome Back, Search and Popular searches */}
      <HeroBanner
        onSearch={onSearch}
        isLoading={isLoading}
        userName={user?.name || 'BHUMIKA'}
      />

      {/* 2. Exactly as in the Screenshot: Civic Procedure Flowchart right beneath the banner */}
      <RoadmapFlowchart
        journey={journey}
        onSelectStep={onSelectStep}
        selectedStepId={selectedStepId}
      />

      {/* 3. Core Impact Metrics with small descriptions (Item 4 & 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              National
            </span>
          </div>
          <div className="text-2xl font-black text-[#11261F] tracking-tight">
            18
          </div>
          <div className="text-xs font-bold text-[#1B4D3E] mt-0.5">
            {t.impactProcedures || 'Procedures Mapped'}
          </div>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
            {t.impactProceduresDesc || 'Civic procedures mapped across municipal, state & central ministries.'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              100%
            </span>
          </div>
          <div className="text-2xl font-black text-[#11261F] tracking-tight">
            18/18
          </div>
          <div className="text-xs font-bold text-[#1B4D3E] mt-0.5">
            {t.impactVerified || 'Verified Sources'}
          </div>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
            {t.impactVerifiedDesc || '100% verified against active gazettes, statutory acts and official .gov.in portals.'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              ⚡
            </span>
          </div>
          <div className="text-2xl font-black text-[#11261F] tracking-tight">
            22+
          </div>
          <div className="text-xs font-bold text-[#1B4D3E] mt-0.5">
            {t.impactVisits || 'Visits Saved'}
          </div>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
            {t.impactVisitsDesc || 'Avoided redundant trips to municipal ward offices & departments.'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              🕒
            </span>
          </div>
          <div className="text-2xl font-black text-[#11261F] tracking-tight">
            77+ Hours
          </div>
          <div className="text-xs font-bold text-[#1B4D3E] mt-0.5">
            {t.impactHours || 'Citizen Hours Saved'}
          </div>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
            {t.impactHoursDesc || 'Estimated citizen time saved navigating confusing queues and paperwork.'}
          </p>
        </div>
      </div>

      {/* 4. Active Journey Summary Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#D5E3DB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#EDF2EE]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E]">
                {t.pipelineGoal || 'Active Civic Goal'}
              </span>
              <span className="text-xs text-[#6C8075] font-semibold">
                • {journey.location || 'Mumbai, Maharashtra'}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#11261F]">
              {journey.title}
            </h3>
            <p className="text-xs text-[#5C7066] mt-0.5">
              Category: {journey.category} | Status: <strong className="text-[#1B4D3E]">{journey.status}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToJourney}
              className="px-4 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.viewRequirements || 'View Full Step Details ➔'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onDownloadPdf}
              className="px-3.5 py-2.5 rounded-xl bg-white text-[#1B4D3E] hover:bg-[#F2F8F5] border border-[#CDE3D7] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Download official roadmap in PDF format"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Progress Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE5]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#4A5D54]">{t.stepsProgress || 'Step Clearance Progress'}</span>
              <span className="text-[#1B4D3E]">{completedSteps} / {totalSteps} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#E1ECE5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4D3E] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE5]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#4A5D54]">{t.documentReadiness || 'Document Locker Readiness'}</span>
              <span className="text-emerald-800">{readyDocs} / {totalDocs} {t.docsReady || 'ready'} ({totalDocs > 0 ? Math.round((readyDocs/totalDocs)*100) : 0}%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#E1ECE5] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${totalDocs > 0 ? (readyDocs/totalDocs)*100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>


      {/* 5. Quick Access Hub */}
      <div>
        <h4 className="text-sm font-extrabold text-[#11261F] uppercase tracking-wider mb-3">
          Quick Access & Services Hub
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            onClick={onGoToJourney}
            className="p-4 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-extrabold text-[#11261F] group-hover:text-[#1B4D3E]">
              My Active Journey
            </h5>
            <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
              Open the interactive step-by-step flowchart with dependency rules.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onGoToTab('documents')}
            className="p-4 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-extrabold text-[#11261F] group-hover:text-[#1B4D3E]">
              Document Locker
            </h5>
            <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
              View required documents with 1-click links to apply on official portals.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onGoToTab('services')}
            className="p-4 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-extrabold text-[#11261F] group-hover:text-[#1B4D3E]">
              Explore 18 Services
            </h5>
            <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
              Browse food permits, trade licenses, driving, factory, and property taxes.
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onGoToTab('updates')}
            className="p-4 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-extrabold text-[#11261F] group-hover:text-[#1B4D3E]">
              Gazette Updates
            </h5>
            <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed">
              Check real-time statutory amendments and AI-extracted legal excerpts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
