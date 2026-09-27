import React from 'react';
import { ArrowRight, ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const CivicRuleChanges: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="updates" className="py-12 sm:py-20 bg-white relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Explanation & CTA */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold text-[#0D1F1A] tracking-tight leading-[1.18]">
              {t.rulesTitle1}<br />
              {t.rulesTitle2}
            </h2>

            <p className="text-xs sm:text-sm text-[#4A5D54] leading-relaxed">
              {t.rulesSubtitle}
            </p>

            <div>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="px-5 py-2.5 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{t.btnHowItWorks}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Connected Cards (Before ➔ After ➔ Alert) */}
          <div className="lg:col-span-8 w-full">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2">
              
              {/* Card 1: Before */}
              <div className="flex-1 bg-[#F8FAF9] rounded-2xl p-4 border border-[#DCE4DF] shadow-xs text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-5 h-5 rounded-md bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center text-[10px] font-bold">🍃</span>
                    <span className="text-xs font-bold text-[#1B4D3E]">{t.before}</span>
                  </div>

                  <div className="text-[11px] font-bold text-[#0D1F1A] mb-2">
                    {t.reqDocs}
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#5A6D64]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docIdentity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docBusiness}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector 1 */}
              <div className="flex sm:hidden justify-center text-slate-300 py-0.5">
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex items-center justify-center text-slate-300 px-0.5 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Card 2: After */}
              <div className="flex-1 bg-[#F8FAF9] rounded-2xl p-4 border border-[#DCE4DF] shadow-xs text-left flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center text-[10px] font-bold">🍃</span>
                      <span className="text-xs font-bold text-[#1B4D3E]">{t.after}</span>
                    </div>
                    <span className="text-slate-400 text-xs">×</span>
                  </div>

                  <div className="text-[11px] font-bold text-[#0D1F1A] mb-2">
                    {t.reqDocs}
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#0D1F1A]">
                    <div className="flex items-center gap-1.5 text-[#5A6D64]">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docIdentity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#5A6D64]">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#5A6D64]">
                      <span className="text-slate-400">✓</span>
                      <span>{t.docBusiness}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#1B4D3E] bg-[#EAF2ED] px-1.5 py-0.5 rounded-md">
                      <span className="w-2.5 h-2.5 rounded-full border border-[#1B4D3E] inline-block shrink-0" />
                      <span className="truncate">{t.docPhoto}</span>
                      <span className="text-[8px] bg-[#1B4D3E] text-white px-1 rounded-sm ml-auto font-bold shrink-0">{t.newTag}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector 2 */}
              <div className="flex sm:hidden justify-center text-slate-300 py-0.5">
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex items-center justify-center text-slate-300 px-0.5 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Card 3: Alert Notification Box */}
              <div className="flex-1 bg-[#FFF9F2] rounded-2xl p-4 border border-[#FFE6CC] shadow-xs text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#B85C00] min-w-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                      <span className="truncate">{t.newReqAlert}</span>
                    </div>
                    <span className="text-[#B85C00]/60 text-xs">×</span>
                  </div>
                  <div className="text-[9px] text-[#8C5200]/80 font-semibold mb-2">24 Sep</div>

                  <p className="text-[10px] text-[#7A4B1A] leading-snug mb-3">
                    {t.photoRequired}
                  </p>

                  <div className="text-[9px] space-y-1 text-[#8C5200] border-t border-[#FFD9B3] pt-2 mb-3">
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="font-bold text-[#0D1F1A]">Official Gazette</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-emerald-800">Verified</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/create')}
                  className="w-full py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-[10px] font-bold text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{t.btnWhatChanged}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
