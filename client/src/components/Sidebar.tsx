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
  updatesCount = 3,
  deadlinesCount = 1
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
    <aside className="w-56 min-w-[215px] max-w-[220px] bg-white border-r border-[#E8ECE9] h-[calc(100vh-65px)] sticky top-[65px] overflow-hidden flex flex-col justify-between p-3 hidden md:flex shrink-0 select-none">
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
                  ? 'bg-[#E6F0EB] text-[#1B4D3E] font-bold shadow-2xs'
                  : 'text-[#4A5D54] hover:bg-[#F3F7F5] hover:text-[#11261F]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-[#1B4D3E]' : 'text-[#6C8075]'
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

      {/* Bottom Inspiration Section with BMC/CST Heritage Monument Artwork - 100% visible, no scrolling */}
      <div className="pt-2 border-t border-[#EDF2EE] mt-1 shrink-0">
        <div className="relative w-full h-[68px] overflow-hidden rounded-lg mb-1.5 shadow-2xs bg-slate-100">
          <img
            src="/monuments/bmc-cst-heritage.jpg"
            alt="CST & BMC Municipal Corporation Heritage Building"
            className="w-full h-full object-cover object-center opacity-90 mix-blend-multiply filter contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
        </div>

        <div className="px-0.5">
          <h4 className="text-[11px] font-extrabold text-[#11261F] leading-tight">
            {t.sidebarQuoteTitle || 'Less confusion. More action.'}
          </h4>
          <p className="text-[10px] text-[#63756E] mt-0.5 leading-snug font-normal line-clamp-2">
            {t.sidebarQuoteDesc || 'DishaSaathi simplifies government processes with verified steps.'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
