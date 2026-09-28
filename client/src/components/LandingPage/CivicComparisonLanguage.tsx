import React, { useState } from 'react';
import {
  X,
  Check,
  ArrowRight,
  Mic,
  Volume2,
  Globe,
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CivicComparisonLanguage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('English');
  const [explained, setExplained] = useState(true);

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── CARD 1: Without vs With DishaSaathi ── */}
          <div className="bg-[#F9FAF8] rounded-3xl p-6 sm:p-7 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="grid grid-cols-2 gap-4 relative">
                {/* Without */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-3">
                    Without DishaSaathi
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Search</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Government website</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Another department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Different forms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Confusion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5" />
                      </div>
                      <span>Missed requirement</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* With */}
                <div className="sm:pl-2">
                  <div className="text-xs font-bold text-[#1B4D3E] mb-3">
                    With DishaSaathi
                  </div>
                  <div className="space-y-2 text-xs text-[#0D1F1A]">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Tell us your goal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Personalized roadmap</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Required documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Official sources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Latest updates</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E0EBE4] text-[11px] text-[#5A6D64] font-medium">
              Eliminates confusion and bureaucratic ping-pong.
            </div>
          </div>

          {/* ── CARD 2: Government language isn't always citizen language ── */}
          <div className="bg-[#F9FAF8] rounded-3xl p-6 sm:p-7 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left">
            <div>
              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                Government language isn't always citizen language.
              </h3>
              <p className="text-xs text-[#5A6D64] mb-5">
                We simplify complex legalese into clear, actionable steps.
              </p>

              {/* Official wording box */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#E0EBE4] mb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Official wording
                </div>
                <p className="text-xs italic text-slate-600 leading-relaxed">
                  "Submit duly authenticated documentary evidence as prescribed under the applicable regulations."
                </p>
              </div>

              {/* In simple words box */}
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>In simple words</span>
                </div>
                <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                  "Upload the required documents. Some documents may need verification before submission."
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/roadmap', { state: { tab: 'home' } })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#133A2E] transition-all cursor-pointer shadow-xs"
              >
                <span>Explain simply</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ── CARD 3: Government services should be understandable to everyone ── */}
          <div className="bg-[#F9FAF8] rounded-3xl p-6 sm:p-7 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left">
            <div>
              <h3 className="text-base font-extrabold text-[#0D1F1A] mb-1">
                Government services should be understandable to everyone.
              </h3>
              <p className="text-xs text-[#5A6D64] mb-5">
                Explore in English, Hindi, Marathi, and Tamil with voice assistance.
              </p>

              {/* Language Pills Switcher */}
              <div className="flex items-center gap-1.5 flex-wrap mb-6">
                {['English', 'हिन्दी', 'मराठी', 'தமிழ்'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-[#1B4D3E] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-[#D8E2DC] hover:bg-slate-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Voice Input & Avatar Graphic */}
              <div className="p-4 bg-white rounded-2xl border border-[#E0EBE4] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D1F1A]">Voice & Natural Query</div>
                    <div className="text-[10px] text-[#5A6D64]">Speak in your local language</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  A
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E0EBE4] text-[11px] font-bold text-[#1B4D3E] flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Pan-India Jurisdiction Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
