import React from 'react';
import {
  Compass,
  Clock,
  FileText,
  Building2,
  ShieldCheck,
  Layers,
  Search
} from 'lucide-react';
import { CivicJourney, GovernmentUpdate, ProcedureStep } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HeroBanner } from './HeroBanner';

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
  onGoToJourney,
  onGoToTab,
  onSearch,
  isLoading = false
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Hero Banner with Gateway of India, Welcome Back, Search and Popular searches */}
      <HeroBanner
        onSearch={onSearch}
        isLoading={isLoading}
        userName={user?.name || 'Citizen'}
      />

      {/* 2. Core Impact Metrics with small descriptions (Item 4 & 6) */}
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

      {/* 3. Quick Access Hub */}
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
              Explore Services
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
              Govt Updates
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
