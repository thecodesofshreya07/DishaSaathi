import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  userName?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch, isLoading = false, userName }) => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

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

  const displayName = userName?.trim() ? userName.toUpperCase() : 'BHUMIKA';

  return (
    <div className="relative rounded-3xl bg-[#EAF2ED] border border-[#D5E3DB] p-6 md:p-8 shadow-2xs overflow-hidden mb-6 min-h-[260px] flex items-center justify-between">
      {/* Right side: Detailed Gateway of India Monument Illustration with Cursive Note */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[46%] pointer-events-none select-none overflow-hidden z-0">
        {/* Soft edge fade so monument integrates into the sage background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EAF2ED] via-transparent to-transparent z-10 w-24"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#EAF2ED] via-transparent to-transparent z-10 h-10 bottom-0 top-auto"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF2ED] via-transparent to-transparent z-10 h-6 top-0"></div>

        {/* Tilted cursive badge positioned above monument */}
        <div className="absolute left-8 top-5 z-20 transform -rotate-6 font-serif italic text-xs tracking-wider text-[#2D5A46] font-medium leading-tight drop-shadow-xs">
          <span>{t.heroTaglinePossibilities || 'Simpler Steps. Greater Possibilities.'}</span>
        </div>

        {/* The Gateway of India Monument Image */}
        <img
          src="/monuments/gateway-day.jpg"
          alt="Gateway of India Mumbai Monument"
          className="w-full h-full object-cover object-left-bottom opacity-95 mix-blend-multiply"
        />
      </div>

      {/* Left side: Main text and search */}
      <div className="relative z-10 max-w-xl">
        {/* Welcome greeting */}
        <div className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#7C6534] mb-2 font-sans">
          {t.heroWelcomeBack || 'WELCOME BACK'}, {displayName} ✌️
        </div>

        {/* Core USP Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#11261F] tracking-tight leading-[1.18] font-sans">
          {t.heroMazeTitle1 || 'Government processes'}<br />
          {t.heroMazeTitle2 || "shouldn't feel like a maze."}
        </h2>

        {/* Supporting message */}
        <p className="text-xs sm:text-sm text-[#4A5D54] mt-2.5 leading-relaxed font-normal max-w-lg">
          {t.heroMazeSubtitle || "Tell us what you're trying to do. DishaSaathi turns fragmented government information into one clear, verified roadmap."}
        </p>

        {/* Natural Language Task Input Box */}
        <form onSubmit={handleSubmit} className="mt-5 relative max-w-lg">
          <div className="relative flex items-center shadow-xs rounded-full bg-white border border-[#D0DDD5] focus-within:border-[#1B4D3E] focus-within:ring-2 focus-within:ring-[#1B4D3E]/15 transition-all">
            {/* Sparkle icon */}
            <div className="pl-4 text-[#1B4D3E] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.heroInputPlaceholder || "What are you trying to accomplish?"}
              className="w-full pl-3 pr-14 py-3 bg-transparent rounded-full text-xs sm:text-sm font-medium text-[#11261F] placeholder-[#8C9B94] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Submit search query"
              className="absolute right-1.5 w-8 h-8 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 font-bold" />
              )}
            </button>
          </div>
        </form>

        {/* Popular searches pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
          <span className="text-[#6C8075] font-medium">{t.heroPopularSearches || 'Popular searches:'}</span>
          {popularSearches.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handlePillClick(item.query)}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F7F5] text-[#2C3F36] font-medium border border-[#D5E3DB] shadow-2xs hover:border-[#1B4D3E] transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
