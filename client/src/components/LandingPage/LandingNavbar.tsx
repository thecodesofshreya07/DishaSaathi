import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const LANG_LABELS: Record<Language, string> = { en: 'En', hi: 'हि', mr: 'म' };
const LANG_NAMES: Record<Language, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F9FAF8]/95 backdrop-blur-md border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo (Official Logo + DishaSaathi + Tagline) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E0EBE4] p-1 flex items-center justify-center shadow-xs overflow-hidden">
              <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F2D25]">
                  DishaSaathi
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#5A6D64] font-medium leading-none tracking-tight">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#4A5D54]">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#1B4D3E] transition-colors cursor-pointer py-1"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#1B4D3E] transition-colors cursor-pointer py-1"
            >
              {t.navExploreServices}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#1B4D3E] transition-colors cursor-pointer py-1"
            >
              {t.navAbout || 'About'}
            </button>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D5DDD8] bg-white text-xs font-bold text-[#4A5D54] hover:bg-[#F3F7F5] transition-all cursor-pointer shadow-2xs"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#5A6D64]" />
                <span>{LANG_LABELS[language]}</span>
                <ChevronDown className={`w-3 h-3 text-[#7A8E85] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl border border-[#E0EBE4] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {(Object.keys(LANG_NAMES) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        language === lang
                          ? 'bg-[#EAF2ED] text-[#1B4D3E] font-bold'
                          : 'text-[#4A5D54] hover:bg-[#F3F7F5]'
                      }`}
                    >
                      {LANG_NAMES[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Link */}
            <button
              type="button"
              onClick={() => navigate('/login?mode=login')}
              className="px-3.5 py-2 text-xs font-bold text-[#4A5D54] hover:text-[#1B4D3E] transition-colors cursor-pointer"
            >
              {t.navSignIn}
            </button>

            {/* Primary Journey CTA Button */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/create');
                } else {
                  navigate('/signup?redirect=/create');
                }
              }}
              className="px-4 lg:px-5 py-2.5 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>{t.navStartJourney}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Right Controls (< 640px) */}
          <div className="flex sm:hidden items-center gap-1.5">
            {/* Quick Mobile Language Switcher Pills */}
            <div className="flex items-center bg-white border border-[#D5DDD8] rounded-full p-0.5 shadow-2xs">
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-[#1B4D3E] text-white shadow-xs'
                      : 'text-[#5A6D64] hover:text-[#1B4D3E]'
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#4A5D54] hover:bg-[#F3F7F5] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8ECE9] bg-white px-5 pt-4 pb-6 space-y-2 animate-in fade-in duration-200">
          {[
            { id: 'how-it-works', label: t.navHowItWorks },
            { id: 'features', label: t.navExploreServices },
            { id: 'faq', label: t.navAbout || 'About' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#4A5D54] hover:bg-[#F3F7F5] hover:text-[#1B4D3E]"
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-[#EDF2EE] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAuthenticated) {
                  navigate('/create');
                } else {
                  navigate('/signup?redirect=/create');
                }
              }}
              className="w-full py-3 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t.navStartJourney}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?mode=login');
                }}
                className="w-full py-2.5 rounded-xl border border-[#1B4D3E]/30 text-[#1B4D3E] text-xs font-bold text-center"
              >
                {t.navSignIn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?mode=signup');
                }}
                className="w-full py-2.5 rounded-xl bg-[#F0F5F2] text-[#1B4D3E] text-xs font-bold text-center"
              >
                {t.btnSignUp}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
