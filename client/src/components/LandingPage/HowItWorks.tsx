import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Bell, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-14 sm:py-24 bg-[#F9FAF8] relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0D1F1A] tracking-tight">
            {t.expTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-lg text-[#5A6D64]">
            {t.expSubtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1: Tell us what you need */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs mb-4">
                1
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.card1Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-6">
                {t.card1Desc}
              </p>
            </div>

            {/* Input Visual Box */}
            <div className="p-3 bg-[#F9FAF8] rounded-2xl border border-[#E0EBE4] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#0D1F1A] font-medium truncate">
                {t.card1Query}
              </span>
              <div className="w-6 h-6 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 2: DishaSaathi understands */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs mb-4">
                2
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.card2Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-4">
                {t.card2Desc}
              </p>
            </div>

            {/* Intent Key-Value Box */}
            <div className="p-3 bg-[#F9FAF8] rounded-2xl border border-[#E0EBE4] space-y-2 text-[11px]">
              <div className="p-1.5 rounded-lg bg-[#EAF2ED] border border-[#D1E2D8] text-[10px] font-bold text-[#1B4D3E] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#1B4D3E]" />
                <span className="truncate">{t.card2Req}</span>
              </div>
              <div className="flex items-start justify-between gap-2 text-[11px]">
                <span className="text-[#6C8075] font-semibold">{t.card2Loc.split(':')[0]}:</span>
                <span className="font-bold text-[#0D1F1A] text-right">{t.card2Loc.split(':')[1]?.trim() || 'Mumbai'}</span>
              </div>
              <div className="flex items-start justify-between gap-2 text-[11px] pt-1 border-t border-slate-200">
                <span className="text-[#6C8075] font-semibold">Goal:</span>
                <span className="font-bold text-[#1B4D3E] text-right text-[10px] leading-tight">
                  {t.card2Goal}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Your journey is created */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs mb-4">
                3
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.card3Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-3">
                {t.card3Desc}
              </p>
            </div>

            {/* Roadmap Checklist Box */}
            <div className="p-3 bg-[#F9FAF8] rounded-2xl border border-[#E0EBE4] space-y-1.5 text-[11px] text-[#2D3E35]">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                <span className="truncate">{t.stepEligibility}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                <span className="truncate">{t.stepReg}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#1B4D3E] bg-[#EAF2ED] px-1.5 py-0.5 rounded-md">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center text-[8px]">✓</div>
                <span className="truncate">{t.card3Shop}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                <span className="truncate">Food License</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                <span className="truncate">Municipal NOC</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                <span className="truncate">GST</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                <span className="truncate">{t.stepComp}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Stay updated */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE4DF] shadow-xs flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs mb-4">
                4
              </div>

              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                {t.card4Title}
              </h3>
              <p className="text-xs text-[#5A6D64] leading-relaxed mb-3">
                {t.card4Desc}
              </p>
            </div>

            {/* Alert Visual Box */}
            <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#FFE6CC] space-y-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#B85C00] min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#FF9933] text-white flex items-center justify-center shrink-0">
                    <Bell className="w-3 h-3 text-white" />
                  </span>
                  <span className="truncate">{t.card4Alert}</span>
                </div>
                <span className="text-[9px] text-[#B85C00]/70 font-semibold shrink-0">24 Sep</span>
              </div>

              <p className="text-[10px] text-[#7A4B1A] leading-tight font-medium">
                {t.card4AlertDesc}
              </p>

              <div className="pt-2 border-t border-[#FFD9B3] space-y-1.5">
                <div
                  onClick={() => navigate('/create')}
                  className="text-[10px] font-bold text-[#8C5200] hover:underline cursor-pointer"
                >
                  {t.btnWhatChanged}
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/create')}
                  className="w-full py-1.5 rounded-xl bg-[#1B4D3E] text-white text-[10px] font-bold text-center cursor-pointer hover:bg-[#133A2E] transition-colors"
                >
                  {t.card4Btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
