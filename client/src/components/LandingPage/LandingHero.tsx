import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  FileText,
  Building2,
  FileSpreadsheet,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Volume2,
  UserCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#F9FAF8] pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── TOP HERO SPLIT: LEFT TEXT + RIGHT CONNECTED SOURCES CARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-16">
          {/* Left Column: Heading, Subtitle, Direct CTA */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF2ED] text-[#1B4D3E] text-xs font-bold border border-[#D1E2D8]">
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-[#0D1F1A] tracking-tight leading-[1.12]">
              {t.heroHeadline1}<br />
              {t.heroHeadline2}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#4A5D54] leading-relaxed max-w-xl font-normal">
              {t.heroSubtext}
            </p>

            {/* Direct Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="px-6 py-3.5 rounded-2xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t.heroCTA || 'Start Your Journey'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Converging Graph Diagram Card */}
          <div className="lg:col-span-6 relative w-full overflow-hidden">
            <div className="relative bg-gradient-to-b from-[#F2F7F4] via-[#F8FAF9] to-[#FFFFFF] rounded-3xl border border-[#DCE4DF] p-4 sm:p-7 shadow-xs overflow-hidden">
              
              {/* Converging Diagram with Precise Curved Connecting Lines */}
              <div className="relative z-10 min-h-[280px] sm:min-h-[310px]">
                {/* SVG Connecting Bezier Paths */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block stroke-[#7DA294]/60 fill-none"
                  viewBox="0 0 520 300"
                  preserveAspectRatio="none"
                >
                  {/* 6 Left Paths converging to center (260, 145) */}
                  <path d="M 180 34 C 220 34, 230 145, 240 145" strokeWidth="1.4" />
                  <path d="M 180 76 C 220 76, 235 145, 240 145" strokeWidth="1.4" />
                  <path d="M 180 118 C 215 118, 235 145, 240 145" strokeWidth="1.4" />
                  <path d="M 180 160 C 215 160, 235 145, 240 145" strokeWidth="1.4" />
                  <path d="M 180 202 C 220 202, 235 145, 240 145" strokeWidth="1.4" />
                  <path d="M 180 244 C 220 244, 230 145, 240 145" strokeWidth="1.4" />

                  {/* 5 Right Paths diverging from center (280, 145) to right checklist */}
                  <path d="M 280 145 C 300 145, 310 40, 345 40" strokeWidth="1.4" />
                  <path d="M 280 145 C 300 145, 315 88, 345 88" strokeWidth="1.4" />
                  <path d="M 280 145 C 310 145, 325 136, 345 136" strokeWidth="1.4" />
                  <path d="M 280 145 C 300 145, 315 184, 345 184" strokeWidth="1.4" />
                  <path d="M 280 145 C 300 145, 310 232, 345 232" strokeWidth="1.4" strokeDasharray="3,3" />
                </svg>

                <div className="grid grid-cols-12 gap-1.5 sm:gap-2 items-center relative z-20">
                  {/* Left Column: 6 Source Pills */}
                  <div className="col-span-5 space-y-1.5 sm:space-y-2 text-left">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#5A6D64] mb-1 sm:mb-2 truncate">
                      {t.fromManySources}
                    </div>
                    {[
                      { icon: Globe, label: t.srcPortal, sub: t.srcPortalSub, color: 'text-emerald-700' },
                      { icon: FileText, label: t.srcPdf, sub: t.srcPdfSub, color: 'text-rose-600' },
                      { icon: Building2, label: t.srcDept, sub: t.srcDeptSub, color: 'text-teal-700' },
                      { icon: FileSpreadsheet, label: t.srcApp, sub: t.srcAppSub, color: 'text-emerald-800' },
                      { icon: MapPin, label: t.srcMuni, sub: t.srcMuniSub, color: 'text-emerald-700' },
                      { icon: AlertTriangle, label: t.srcCirc, sub: t.srcCircSub, color: 'text-amber-600' },
                    ].map((src, idx) => {
                      const Icon = src.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-white border border-[#E0EBE4] shadow-2xs text-left transition-transform hover:scale-[1.02]"
                        >
                          <Icon className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${src.color} shrink-0`} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[9px] sm:text-[11px] font-bold text-[#2D3E35] leading-tight truncate">{src.label}</div>
                            <div className="text-[8px] sm:text-[9px] text-[#7A8E85] leading-none mt-0.5 truncate hidden sm:block">{src.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Column: Hub Logo Badge */}
                  <div className="col-span-2 flex flex-col items-center justify-center relative my-auto">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white p-1.5 sm:p-2 flex items-center justify-center shadow-lg relative z-30 border-2 border-[#1B4D3E]/20 ring-2 sm:ring-4 ring-[#1B4D3E]/10">
                      <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#1B4D3E] mt-1 tracking-tight text-center">
                      DishaSaathi
                    </span>
                  </div>

                  {/* Right Column: 5 Milestone Checklist Items */}
                  <div className="col-span-5 space-y-2 sm:space-y-3.5 text-left pl-1 sm:pl-4 relative">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#1B4D3E] mb-1 sm:mb-2 truncate">
                      {t.toClearJourney}
                    </div>

                    {[
                      { label: t.stepEligibility, done: true },
                      { label: t.stepDocs, done: true },
                      { label: t.stepReg, done: true },
                      { label: t.stepAppr, done: true },
                      { label: t.stepComp, done: false },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs font-semibold text-[#2D3E35]">
                        {step.done ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white shrink-0" />
                        )}
                        <span className={`truncate ${step.done ? 'text-[#0D1F1A] font-bold' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}

                    {/* Floating Hand-drawn Note: "Same goal. Less confusion." */}
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 translate-x-2 text-right pointer-events-none">
                      <span className="text-[11px] italic font-serif text-[#1B4D3E]/80 whitespace-nowrap block">
                        {t.sameGoalNote}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indian Monuments Illustrated Skyline Banner across Card Bottom */}
              <div className="mt-4 -mx-4 sm:-mx-7 -mb-4 sm:-mb-7 relative h-24 sm:h-32 overflow-hidden border-t border-[#E8ECE9]">
                <img
                  src="/images/hero-monuments.jpg"
                  alt="Indian Heritage Architecture"
                  className="w-full h-full object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#F2F7F4]/15 to-[#F2F7F4]/80" />
              </div>
            </div>
          </div>
        </div>

        {/* ── TRUST PILLARS RIBBON: "Built around official information" ── */}
        <div className="pt-6 sm:pt-8 border-t border-[#E5EAE7]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
            <div className="md:col-span-3 text-left">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0D1F1A] leading-tight">
                {t.trustTitle}
              </h3>
            </div>

            <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-left">
              {/* Pillar 1 */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0D1F1A]">
                  <FileText className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                  <span className="truncate">{t.trustP1Title}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#5A6D64] leading-tight">
                  {t.trustP1Desc}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0D1F1A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                  <span className="truncate">{t.trustP2Title}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#5A6D64] leading-tight">
                  {t.trustP2Desc}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0D1F1A]">
                  <Calendar className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                  <span className="truncate">{t.trustP3Title}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#5A6D64] leading-tight">
                  {t.trustP3Desc}
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0D1F1A]">
                  <Volume2 className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                  <span className="truncate">{t.trustP4Title}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#5A6D64] leading-tight">
                  {t.trustP4Desc}
                </p>
              </div>

              {/* Pillar 5 */}
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0D1F1A]">
                  <UserCheck className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                  <span className="truncate">{t.trustP5Title}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#5A6D64] leading-tight">
                  {t.trustP5Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
