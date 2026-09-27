import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  GitFork,
  Bell,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFeatures: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="features" className="py-14 sm:py-24 bg-[#F9FAF8] relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0D1F1A] tracking-tight">
            {t.featTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-lg text-[#5A6D64]">
            {t.featSubtitle}
          </p>
        </div>

        {/* 4 Feature Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1: Clear Roadmaps */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold text-xs mb-3">
                <GitFork className="w-4 h-4" />
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.f1Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-4">
                {t.f1Desc}
              </p>

              {/* Visual Flowchart Mockup */}
              <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-[#E0EBE4] mb-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#2D3E35] relative">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                    <span className="text-[8px] text-slate-500 mt-0.5">Start</span>
                  </div>
                  <div className="h-[1px] bg-[#1B4D3E] flex-1 mx-1" />
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                    <span className="text-[8px] text-slate-500 mt-0.5">Eligibility</span>
                  </div>
                  <div className="h-[1px] bg-[#1B4D3E] flex-1 mx-1" />
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                    <span className="text-[8px] text-slate-500 mt-0.5">Docs</span>
                  </div>
                  <div className="h-[1px] bg-slate-300 flex-1 mx-1" />
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                    <span className="text-[8px] text-slate-400 mt-0.5">Approval</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
              >
                <span>{t.learnMore}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Verified Information */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold text-xs mb-3">
                <Building2 className="w-4 h-4" />
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.f2Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-4">
                {t.f2Desc}
              </p>

              {/* Visual Official Source Card Mockup */}
              <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-[#E0EBE4] mb-4 space-y-1 text-[10px]">
                <div className="font-bold text-[#0D1F1A]">Food License</div>
                <div className="text-[9px] text-[#5A6D64] truncate">Ministry of Health & Family Welfare</div>
                <div className="text-[8px] text-slate-400">Official Portal: FoSCoS</div>
                <div className="text-[9px] font-bold text-[#1B4D3E] pt-1 flex items-center gap-0.5 cursor-pointer">
                  <span>Verified Source</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
              >
                <span>{t.learnMore}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Stay Updated */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold text-xs mb-3">
                <Bell className="w-4 h-4" />
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.f3Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-4">
                {t.f3Desc}
              </p>

              {/* Visual Alert Mockup */}
              <div className="bg-[#FFF9F2] rounded-2xl p-3 border border-[#FFE6CC] mb-4 space-y-1 text-[10px]">
                <div className="font-bold text-[#B85C00] flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-[#B85C00]" />
                  <span>Fee Update Notice</span>
                </div>
                <div className="text-[9px] text-[#7A4B1A] leading-tight">
                  Application fee structure updated for current financial year.
                </div>
                <div className="text-[8px] text-[#B85C00]/80 pt-0.5">Central Gazette Notification</div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
              >
                <span>{t.learnMore}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Your Civic Journey */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold text-xs mb-3">
                <FileText className="w-4 h-4" />
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.f4Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-4">
                {t.f4Desc}
              </p>

              {/* Visual Step Dots Mockup */}
              <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-[#E0EBE4] mb-4">
                <div className="flex items-center justify-between text-[8px] text-slate-600 font-semibold">
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[7px]">✓</div>
                    <span className="mt-0.5">Eligibility</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[7px]">✓</div>
                    <span className="mt-0.5">Docs</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[7px]">✓</div>
                    <span className="mt-0.5">App</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[7px]">▷</div>
                    <span className="mt-0.5">Approval</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    <span className="mt-0.5">Done</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
              >
                <span>{t.learnMore}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
