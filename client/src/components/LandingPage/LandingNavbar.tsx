import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';

const LANG_LABELS: Record<Language, string> = { en: 'EN', hi: 'हि', mr: 'म' };
const LANG_NAMES: Record<Language, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Tricolor top bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-t border-b border-[#eee]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <nav className="sticky top-0 z-40 bg-white/96 backdrop-blur-md border-b border-[#E8ECE9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* Ashoka Chakra SVG */}
              <div className="w-11 h-11 rounded-full border-2 border-[#000080] flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-105">
                <svg viewBox="0 0 44 44" className="w-9 h-9" fill="none">
                  <circle cx="22" cy="22" r="18" fill="white" stroke="#000080" strokeWidth="2.5"/>
                  <circle cx="22" cy="22" r="4" fill="#000080"/>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 22 + 4.5 * Math.cos(rad);
                    const y1 = 22 + 4.5 * Math.sin(rad);
                    const x2 = 22 + 16 * Math.cos(rad);
                    const y2 = 22 + 16 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="1.2" strokeLinecap="round"/>;
                  })}
                  <circle cx="22" cy="22" r="16" fill="none" stroke="#000080" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-[#0D1F1A] tracking-tight">DishaSaathi</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#FF9933]/15 text-[#B85C00] border border-[#FF9933]/30">
                    Civic AI
                  </span>
                </div>
                <p className="text-[11px] text-[#6C8075] font-medium leading-none mt-0.5">
                  दिशासाथी • Civic Procedure Navigator
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#4A5D54]">
              {[
                { id: 'how-it-works', label: t.navHowItWorks },
                { id: 'features', label: t.navFeatures },
                { id: 'about', label: t.navAbout },
              ].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className="hover:text-[#138808] transition-colors cursor-pointer relative group">
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FF9933] group-hover:w-full transition-all duration-200 rounded-full"/>
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language toggle */}
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#DCE4DF] text-xs font-bold text-[#4A5D54] hover:bg-[#F3F7F5] transition-colors">
                  <Globe className="w-3.5 h-3.5 text-[#5A6D64]"/>
                  <span>{LANG_LABELS[language]}</span>
                  <ChevronDown className={`w-3 h-3 text-[#7A8E85] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}/>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-xl border border-[#E0EBE4] shadow-lg overflow-hidden z-50">
                    {(Object.keys(LANG_NAMES) as Language[]).map(lang => (
                      <button key={lang} onClick={() => { setLanguage(lang); setLangDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors
                          ${language === lang ? 'bg-[#EAF2ED] text-[#138808]' : 'text-[#4A5D54] hover:bg-[#F3F7F5]'}`}>
                        {LANG_NAMES[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/roadmap" className="px-4 py-2 rounded-full text-xs font-bold text-[#4A5D54] hover:bg-[#F3F7F5] border border-[#DCE4DF] transition-all">
                {t.navViewRoadmap}
              </Link>
              <button onClick={() => navigate('/create')}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white flex items-center gap-2 transition-all shadow-sm hover:shadow-md bg-[#1B4D3E] hover:bg-[#133A2E] active:scale-98">
                <span>{t.navCreateRoadmap}</span>
                <ArrowRight className="w-4 h-4"/>
              </button>
            </div>

            {/* Mobile */}
            <div className="flex sm:hidden items-center gap-2">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#DCE4DF] text-[11px] font-bold text-[#4A5D54]">
                  <Globe className="w-3.5 h-3.5"/><span>{LANG_LABELS[language]}</span>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-28 bg-white rounded-xl border border-[#E0EBE4] shadow-lg overflow-hidden z-50">
                    {(Object.keys(LANG_NAMES) as Language[]).map(lang => (
                      <button key={lang} onClick={() => { setLanguage(lang); setLangDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold
                          ${language === lang ? 'bg-[#EAF2ED] text-[#138808]' : 'text-[#4A5D54] hover:bg-[#F3F7F5]'}`}>
                        {LANG_NAMES[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#4A5D54] hover:bg-[#F3F7F5]">
                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E8ECE9] bg-white px-4 pt-3 pb-5 space-y-1">
            {[
              { id: 'how-it-works', label: t.navHowItWorks },
              { id: 'features', label: t.navFeatures },
              { id: 'about', label: t.navAbout },
            ].map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-[#4A5D54] hover:bg-[#F3F7F5] hover:text-[#138808]">
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-[#EDF2EE] flex flex-col gap-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/create'); }}
                className="w-full py-3 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm bg-[#1B4D3E] hover:bg-[#133A2E]">
                <span>{t.navCreateRoadmap}</span><ArrowRight className="w-4 h-4"/>
              </button>
              <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-full text-center text-xs font-bold text-[#4A5D54] bg-[#F3F7F5]">
                {t.navViewRoadmap}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
