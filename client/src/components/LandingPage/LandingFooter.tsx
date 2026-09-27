import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim() || t.ctaPlaceholder;
    navigate('/create', { state: { initialQuery: query } });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white overflow-hidden">
      {/* ── CALL TO ACTION BANNER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-gradient-to-b from-[#F2F7F4] via-[#F8FAF9] to-[#FFFFFF] rounded-3xl border border-[#DCE4DF] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-xs text-center">
          
          {/* Floating Handwritten Annotation Note */}
          <div className="hidden lg:block absolute right-12 top-8 text-right pointer-events-none rotate-2">
            <span className="text-sm font-serif italic text-[#1B4D3E] leading-tight block">
              {t.ctaHandwritten.split('.').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </span>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0D1F1A] tracking-tight">
              {t.ctaTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#4A5D54]">
              {t.ctaSubtitle}
            </p>

            {/* Integrated Search Console Capsule */}
            <div className="pt-2 max-w-lg mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="p-1.5 bg-white rounded-full border border-[#CBD7D0] shadow-sm focus-within:border-[#1B4D3E] focus-within:ring-2 focus-within:ring-[#1B4D3E]/10 transition-all flex items-center justify-between gap-2"
              >
                <div className="flex-1 flex items-center pl-3 sm:pl-4 gap-2 sm:gap-3 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.ctaPlaceholder}
                    className="w-full text-xs sm:text-sm text-[#0D1F1A] placeholder:text-slate-400 focus:outline-hidden bg-transparent font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white flex items-center justify-center cursor-pointer shrink-0 transition-transform active:scale-95 shadow-xs"
                  aria-label="Submit search"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#5A6D64] pt-1">
              {t.ctaNoForms}
            </p>
          </div>

          {/* Monuments Watercolor Panorama along CTA Banner Bottom */}
          <div className="mt-8 -mx-6 sm:-mx-10 lg:-mx-14 -mb-6 sm:-mb-10 lg:-mb-14 relative h-24 sm:h-36 overflow-hidden border-t border-[#E8ECE9]">
            <img
              src="/images/hero-monuments.jpg"
              alt="Indian Architecture"
              className="w-full h-full object-cover object-bottom opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#F2F7F4]/15 to-[#F2F7F4]/80" />
          </div>
        </div>
      </div>

      {/* ── FOOTER NAVIGATION BAR ── */}
      <div className="bg-[#0B231D] text-white/70 py-8 sm:py-10 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden">
                <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="text-base font-extrabold text-white tracking-tight">DishaSaathi</span>
                <p className="text-[9px] text-white/50 leading-none">{t.brandTagline}</p>
              </div>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center font-medium text-white/80 text-[11px] sm:text-xs">
              <button type="button" onClick={() => scrollTo('features')} className="hover:text-white transition-colors cursor-pointer">
                {t.navExploreServices}
              </button>
              <button type="button" onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                {t.navHowItWorks}
              </button>
              <button type="button" onClick={() => scrollTo('updates')} className="hover:text-white transition-colors cursor-pointer">
                {t.navGovUpdates}
              </button>
              <button type="button" onClick={() => scrollTo('faq')} className="hover:text-white transition-colors cursor-pointer">
                {t.navAbout}
              </button>
              <span className="hover:text-white cursor-pointer">{t.footerAccessibility}</span>
              <span className="hover:text-white cursor-pointer">{t.footerPrivacy}</span>
              <span className="hover:text-white cursor-pointer">{t.footerTerms}</span>
            </div>

            {/* Social / Direct Channels */}
            <div className="flex items-center gap-4 text-white/60 text-xs">
              <span className="hover:text-white cursor-pointer font-semibold text-xs">LinkedIn</span>
              <span className="hover:text-white cursor-pointer font-semibold text-xs">X</span>
              <span className="hover:text-white cursor-pointer font-semibold text-xs">YouTube</span>
              <Globe className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Legal Disclaimer matching image */}
          <div className="pt-6 text-center text-[10px] sm:text-[11px] text-white/50 max-w-4xl mx-auto leading-relaxed">
            {t.footerDisclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};
