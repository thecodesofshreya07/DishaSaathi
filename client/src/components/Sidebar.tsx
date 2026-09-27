import React from 'react';
import {
  Home,
  Compass,
  Search,
  Bell,
  FileText,
  Calendar,
  Bookmark,
  Award,
  Settings,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  updatesCount?: number;
  deadlinesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  updatesCount = 0,
  deadlinesCount = 0
}) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Requirement 5: Without authentication show: home, explore, services, govt updates, settings
  // With authentication: show all tabs
  const menuItems = !isAuthenticated
    ? [
        { id: 'home', label: t.sidebarHome || 'Home', icon: Home },
        { id: 'explore', label: t.sidebarExplore || 'Explore', icon: Compass },
        { id: 'services', label: t.sidebarServices || 'Services', icon: Search },
        { id: 'updates', label: t.sidebarUpdates || 'Govt Updates', icon: Bell, badge: updatesCount },
        { id: 'settings', label: t.sidebarSettings || 'Settings', icon: Settings },
      ]
    : [
        { id: 'home', label: t.sidebarHome || 'Home', icon: Home },
        { id: 'journeys', label: t.sidebarJourneys || 'My Journeys', icon: Compass },
        { id: 'explore', label: t.sidebarExplore || 'Explore', icon: Layers },
        { id: 'services', label: t.sidebarServices || 'Services', icon: Search },
        { id: 'documents', label: t.sidebarDocuments || 'Documents', icon: FileText },
        { id: 'updates', label: t.sidebarUpdates || 'Govt Updates', icon: Bell, badge: updatesCount },
        { id: 'deadlines', label: t.sidebarDeadlines || 'Deadlines', icon: Calendar, badge: deadlinesCount },
        { id: 'saved', label: t.sidebarSaved || 'Saved', icon: Bookmark },
        { id: 'passport', label: t.sidebarPassport || 'Civic Passport', icon: Award },
        { id: 'settings', label: t.sidebarSettings || 'Settings', icon: Settings },
      ];

  return (
    <aside className="w-56 min-w-[215px] max-w-[220px] bg-white dark:bg-[#0D1A16] border-r border-[#E8ECE9] dark:border-[#1E3B32] h-[calc(100vh-65px)] sticky top-[65px] overflow-hidden flex flex-col justify-between p-3 hidden md:flex shrink-0 select-none transition-colors">
      {/* Navigation links - Compact & Non-scrollable */}
      <div className="space-y-0.5 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E6F0EB] text-[#1B4D3E] dark:bg-[#18392F] dark:text-[#6EE7B7] font-bold shadow-2xs'
                  : 'text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#F3F7F5] dark:hover:bg-[#142821] hover:text-[#11261F] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-[#1B4D3E] dark:text-[#6EE7B7]' : 'text-[#6C8075] dark:text-[#769385]'
                  }`}
                />
                <span className="text-[12px] font-semibold truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D9383A] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Inspiration Section with BMC/CST Heritage Monument Artwork - Full, Seamlessly Merged into Sidebar */}
      <div className="mt-auto pt-2 shrink-0">
        <div className="px-1 mb-1">
          <h4 className="text-[11px] font-extrabold text-[#11261F] dark:text-white leading-tight">
            {t.sidebarQuoteTitle || 'Less confusion. More action.'}
          </h4>
          <p className="text-[10px] text-[#63756E] dark:text-[#9FB7AC] mt-0.5 leading-snug font-normal line-clamp-2">
            {t.sidebarQuoteDesc || 'DishaSaathi simplifies government processes with verified steps.'}
          </p>
        </div>

        {/* Full Monument Watercolor Illustration, seamlessly merged into sidebar without box or cutoff */}
        <div className="relative -mx-3 -mb-3 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-[#0D1A16] dark:via-[#0D1A16]/80 dark:to-transparent z-10"></div>
          <img
            src="/monuments/bmc-cst-heritage.jpg"
            alt="CST & BMC Municipal Corporation Heritage Building"
            className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen opacity-95 dark:opacity-85 contrast-[1.03] dark:invert dark:hue-rotate-180"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
