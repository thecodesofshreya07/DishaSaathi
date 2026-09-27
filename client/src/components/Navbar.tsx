import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Globe, ChevronDown, ShieldCheck, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LANG_LABELS: Record<Language, string> = { en: 'EN', hi: 'हि', mr: 'म' };
const LANG_NAMES: Record<Language, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

interface NavbarProps {
  onSearch: (query: string) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  unreadCount = 3,
  onOpenNotifications,
  onOpenAdmin
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0D1A16] border-b border-[#E8ECE9] dark:border-[#1E3B32] px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6 shadow-2xs transition-colors">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 min-w-[220px]">
        {/* Stylized organic leaf icon */}
        <div className="w-9 h-9 flex items-center justify-center text-[#1E3E37]">
          <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
            <path
              d="M8 28C8 18 16 8 28 8C28 18 20 28 8 28Z"
              fill={isDarkMode ? '#22C55E' : '#1B4D3E'}
            />
            <path
              d="M10 26C15 22 22 17 26 10"
              stroke={isDarkMode ? '#0D1A16' : '#A8D5C2'}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M14 28C14 23 18 19 22 17"
              stroke={isDarkMode ? '#0D1A16' : '#A8D5C2'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#11261F] dark:text-white font-sans leading-none">
            {t.brandName || 'DishaSaathi'}
          </h1>
          <p className="text-[11px] text-[#63756E] dark:text-[#9FB7AC] font-medium mt-1 leading-none">
            {t.brandTagline || 'Your GPS for Government Services'}
          </p>
        </div>
      </Link>

      {/* Center Search Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8C9B94] dark:text-[#6E857B] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-14 py-2.5 bg-white dark:bg-[#12241E] text-sm text-[#11261F] dark:text-white placeholder-[#8C9B94] dark:placeholder-[#6E857B] rounded-full border border-[#DCE4DF] dark:border-[#1F3E33] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 dark:focus:ring-emerald-500/20 focus:border-[#1B4D3E] dark:focus:border-[#2E6B56] transition-all shadow-2xs font-normal"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1.5 w-8 h-8 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <span className="text-sm font-bold">→</span>
          </button>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCE4DF] dark:border-[#1F3E33] bg-white dark:bg-[#12241E] text-[#2D3F37] dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#183028] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#1B4D3E]" />
              <span className="text-xs font-bold text-[#1B4D3E] hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Admin Console trigger */}
        <button
          onClick={onOpenAdmin}
          title="Open Human-in-the-Loop Admin Validation"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FAF3E8] dark:bg-[#252014] text-[#8C6422] dark:text-[#E8BA64] border border-[#EED9B3] dark:border-[#4E3E20] hover:bg-[#F5EAD4] dark:hover:bg-[#322B1B] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C6422] dark:text-[#E8BA64]" />
          <span>{t.adminReview || 'Admin Review'}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          aria-label="Government updates notification"
          className="relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#152822] text-[#4A5D54] dark:text-[#A1B8AD] transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#D9383A] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0D1A16]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Language selector — functional toggle */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2D3F37] dark:text-[#D1E2D9] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#152822] cursor-pointer border border-[#DCE4DF] dark:border-[#1F3E33]"
            aria-label="Select language"
          >
            <Globe className="w-3.5 h-3.5 text-[#5A6D64] dark:text-[#7C978B]" />
            <span>{LANG_LABELS[language]}</span>
            <ChevronDown className={`w-3 h-3 text-[#7A8E85] dark:text-[#7C978B] transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-[#11231D] rounded-xl border border-[#E0EBE4] dark:border-[#1E3B32] shadow-lg overflow-hidden z-50">
              {(Object.keys(LANG_NAMES) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors
                    ${language === lang
                      ? 'bg-[#EAF2ED] text-[#1B4D3E] dark:bg-[#18392F] dark:text-[#6EE7B7]'
                      : 'text-[#4A5D54] dark:text-[#A1B8AD] hover:bg-[#F3F7F5] dark:hover:bg-[#162D24] hover:text-[#1B4D3E] dark:hover:text-[#6EE7B7]'}`}
                >
                  {LANG_NAMES[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User profile / Authentication button (Item 10) */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8E4] dark:border-[#1F3E33] cursor-pointer hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-600/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[#11261F] dark:text-white max-w-[100px] truncate">{user.name}</div>
                <div className="text-[10px] text-[#7A8E85] dark:text-[#8EABA0] font-medium leading-none mt-0.5">Citizen</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A8E85] dark:text-[#8EABA0] hidden lg:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#11231D] rounded-2xl border border-[#DCE6E0] dark:border-[#1E3B32] shadow-xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#EDF2EE] dark:border-[#1F3E33]">
                  <p className="text-xs font-bold text-[#11261F] dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-[#6C8075] dark:text-[#9FB7AC] truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pl-3 border-l border-[#E2E8E4] dark:border-[#1F3E33]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
