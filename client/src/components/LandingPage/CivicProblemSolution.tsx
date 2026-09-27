import React from 'react';
import {
  Globe,
  FileText,
  Building2,
  FileSpreadsheet,
  Bell,
  Layers,
  Search,
  BookOpen,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CivicProblemSolution: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ── LEFT COLUMN: PROBLEM EXPLANATION + 6 PILLS (4 COLS) ── */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold text-[#0D1F1A] tracking-tight leading-[1.18]">
              {t.problemTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#4A5D54] leading-relaxed">
              {t.problemSubtext}
            </p>

            {/* 6 Problem Badges Grid (1 col on mobile, 2 cols on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{t.badgePortals}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{t.badgeForms}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">{t.badgePdfs}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <Bell className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="truncate">{t.badgeNotifs}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="truncate">{t.badgeDepts}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF9] border border-[#E0EBE4] text-[11px] font-semibold text-[#2D3E35]">
                <Layers className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="truncate">{t.badgeTerms}</span>
              </div>
            </div>
          </div>

          {/* ── CENTER COLUMN: ARTWORK OF CITIZEN WITH LAPTOP & DIGITAL FORMS (4 COLS) ── */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-sm rounded-3xl overflow-hidden p-2">
              <img
                src="/images/citizen-laptop.jpg"
                alt="Citizen navigating government documents"
                className="w-full h-auto object-contain rounded-2xl drop-shadow-sm"
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN: "HOW DISHASAATHI SOLVES IT" 4-STEP CARD (4 COLS) ── */}
          <div className="lg:col-span-4 text-left">
            <div className="bg-[#F8FAF9] rounded-3xl border border-[#DCE4DF] p-5 sm:p-6 shadow-xs">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0D1F1A]">
                {t.solveTitle}
              </h3>
              <p className="text-xs text-[#5A6D64] mb-5 sm:mb-6">
                {t.solveSub}
              </p>

              {/* 4 Steps Flow */}
              <div className="space-y-3.5 sm:space-y-4">
                {/* Step 1: Search */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#CBD5E1] text-[#1B4D3E] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0D1F1A]">{t.step1Search}</div>
                    <div className="text-[11px] text-[#5A6D64]">{t.step1Desc}</div>
                  </div>
                </div>

                {/* Step 2: Understand */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#CBD5E1] text-[#1B4D3E] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0D1F1A]">{t.step2Und}</div>
                    <div className="text-[11px] text-[#5A6D64]">{t.step2Desc}</div>
                  </div>
                </div>

                {/* Step 3: Connect */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#CBD5E1] text-[#1B4D3E] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0D1F1A]">{t.step3Conn}</div>
                    <div className="text-[11px] text-[#5A6D64]">{t.step3Desc}</div>
                  </div>
                </div>

                {/* Step 4: Complete */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#1B4D3E]">{t.step4Comp}</div>
                    <div className="text-[11px] text-[#2D3E35]">{t.step4Desc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
