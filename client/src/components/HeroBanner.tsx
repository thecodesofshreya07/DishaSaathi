import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  userName?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch, isLoading = false, userName }) => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const popularSearches = [
    { key: 'business', label: t.heroPopBusiness || 'Register a small business', query: 'Register a small business' },
    { key: 'birth', label: t.heroPopBirth || 'Birth Certificate', query: 'Birth Certificate' },
    { key: 'property', label: t.heroPopProperty || 'Property Title Registration', query: 'Property Title Registration' },
    { key: 'water', label: t.heroPopWater || 'New Water Connection', query: 'New Water Connection' },
    { key: 'trade', label: t.heroPopTrade || 'Municipal Trade License', query: 'Municipal Trade License' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePillClick = (itemQuery: string) => {
    setQuery(itemQuery);
    onSearch(itemQuery);
  };

  const displayName = userName?.trim() ? userName.toUpperCase() : 'SHREYA MISHRA';
  const monumentSrc = isDarkMode ? '/monuments/gateway-night.jpg' : '/monuments/gateway-day.jpg';

  return (
    <div
      className={`relative rounded-3xl p-6 md:p-8 shadow-2xs overflow-hidden mb-6 min-h-[260px] flex items-center justify-between border transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-[#0C1A15] via-[#10241E] to-[#142C24] border-[#1E3B32]'
          : 'bg-[#EAF2ED] border-[#D5E3DB]'
      }`}
    >
      {/* Right side: Gateway of India Monument Illustration (Day/Night reactive) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none select-none overflow-hidden z-0">
        {/* Soft edge fade so monument integrates into background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            isDarkMode ? 'from-[#0C1A15]' : 'from-[#EAF2ED]'
          } via-transparent to-transparent z-10 w-28`}
        ></div>
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? 'from-[#0C1A15]' : 'from-[#EAF2ED]'
          } via-transparent to-transparent z-10 h-10 bottom-0 top-auto`}
        ></div>
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDarkMode ? 'from-[#0C1A15]' : 'from-[#EAF2ED]'
          } via-transparent to-transparent z-10 h-6 top-0`}
        ></div>

        {/* Tilted cursive badge positioned above monument */}
        <div
          className={`absolute left-8 top-5 z-20 transform -rotate-6 font-serif italic text-xs tracking-wider font-medium leading-tight drop-shadow-xs ${
            isDarkMode ? 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-[#2D5A46]'
          }`}
        >
          <span>{t.heroTaglinePossibilities || 'Simpler Steps. Greater Possibilities.'}</span>
        </div>

        {/* The Gateway of India Monument Image (Night mode uses gateway-night.jpg) */}
        <img
          src={monumentSrc}
          alt="Gateway of India Mumbai Monument"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isDarkMode ? 'object-center opacity-90' : 'object-left-bottom opacity-95 mix-blend-multiply'
          }`}
        />
      </div>

      {/* Left side: Main text and search */}
      <div className="relative z-10 max-w-xl">
        {/* Welcome greeting */}
        <div
          className={`inline-block text-[11px] font-extrabold uppercase tracking-widest mb-2 font-sans ${
            isDarkMode ? 'text-amber-400' : 'text-[#7C6534]'
          }`}
        >
          {t.heroWelcomeBack || 'WELCOME BACK'}, {displayName}
        </div>

        {/* Core USP Headline */}
        <h2
          className={`text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight leading-[1.2] font-sans ${
            isDarkMode ? 'text-white' : 'text-[#11261F]'
          }`}
        >
          What do you want to accomplish?
        </h2>

        {/* Supporting message */}
        <p
          className={`text-xs sm:text-sm mt-2 leading-relaxed font-normal max-w-lg ${
            isDarkMode ? 'text-[#A2B9AE]' : 'text-[#4A5D54]'
          }`}
        >
          You can describe your goal in your own words. No need to know department names, license codes, or government legal terminology.
        </p>

        {/* Natural Language Task Input Box */}
        <form onSubmit={handleSubmit} className="mt-4 relative max-w-lg">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <label className={`text-[11px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-[#1B4D3E]'}`}>
              YOUR CIVIC OR COMMERCIAL GOAL *
            </label>
            <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-[#7A988B]' : 'text-[#6C8075]'}`}>
              Natural language
            </span>
          </div>

          <div
            className={`relative flex items-center shadow-xs rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#152721] border-[#254237] focus-within:border-[#388E3C] focus-within:ring-2 focus-within:ring-emerald-500/20'
                : 'bg-white border-[#D0DDD5] focus-within:border-[#1B4D3E] focus-within:ring-2 focus-within:ring-[#1B4D3E]/15'
            }`}
          >
            {/* Sparkle icon */}
            <div className={`pl-4 flex items-center justify-center ${isDarkMode ? 'text-emerald-400' : 'text-[#1B4D3E]'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I want to buy a new flat in Mumbai or open a bakery"
              className={`w-full pl-3 pr-14 py-3.5 bg-transparent text-xs sm:text-sm font-medium focus:outline-none ${
                isDarkMode ? 'text-white placeholder-[#6E857B]' : 'text-[#11261F] placeholder-[#8C9B94]'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Submit search query"
              className="absolute right-2 w-9 h-9 rounded-xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

        {/* Quick popular search tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-bold ${isDarkMode ? 'text-[#8AA497]' : 'text-[#6C8075]'}`}>
            {t.heroPopularSearches || 'Popular searches:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'flat', label: 'Buy a New Flat in Mumbai', query: 'I want to buy a new flat in Mumbai' },
              { key: 'business', label: 'Register a small business', query: 'Register a small business' },
              { key: 'license', label: 'Driving License', query: 'I want a driving license' },
              { key: 'birth', label: 'Birth Certificate', query: 'Birth Certificate' },
              { key: 'vehicle', label: 'New Vehicle Registration', query: 'New Vehicle Registration' }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handlePillClick(item.query)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all border cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#152822] text-[#C5D7CE] border-[#243F35] hover:bg-[#1D362E] hover:text-white'
                    : 'bg-white/80 hover:bg-white text-[#2C4A3E] border-[#D0DDD5] hover:border-[#1B4D3E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
