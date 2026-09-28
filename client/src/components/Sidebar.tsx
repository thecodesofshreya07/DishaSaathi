import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Bell,
  FileText,
  Calendar,
  Award,
  Settings,
  Layers,
  MapPin,
  History,
  QrCode,
  Scale,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
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
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Independent slide/collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = !isAuthenticated
    ? [
        { id: 'home', label: t.sidebarHome || 'Home', icon: Home },
        { id: 'explore', label: t.sidebarExplore || 'Explore', icon: Compass },
        { id: 'compare', label: 'Compare Options', icon: Scale },
        { id: 'ward-map', label: 'Ward Map', icon: MapPin },
        { id: 'evolution', label: 'Evolution Replay', icon: History },
        { id: 'services', label: t.sidebarServices || 'Services', icon: Search },
        { id: 'updates', label: t.sidebarUpdates || 'Govt Updates', icon: Bell, badge: updatesCount },
        { id: 'settings', label: t.sidebarSettings || 'Settings', icon: Settings },
      ]
    : [
        { id: 'home', label: t.sidebarHome || 'Home', icon: Home },
        { id: 'journeys', label: t.sidebarJourneys || 'My Journeys', icon: Compass },
        { id: 'explore', label: t.sidebarExplore || 'Explore', icon: Layers },
        { id: 'compare', label: 'Compare Options', icon: Scale },
        { id: 'ward-map', label: 'Ward Map', icon: MapPin },
        { id: 'evolution', label: 'Evolution Replay', icon: History },
        { id: 'services', label: t.sidebarServices || 'Services', icon: Search },
        { id: 'documents', label: t.sidebarDocuments || 'Documents', icon: FileText },
        { id: 'updates', label: t.sidebarUpdates || 'Govt Updates', icon: Bell, badge: updatesCount },
        { id: 'deadlines', label: t.sidebarDeadlines || 'Deadlines', icon: Calendar, badge: deadlinesCount },
        { id: 'passport', label: 'Verification QR', icon: QrCode },
        { id: 'settings', label: t.sidebarSettings || 'Settings', icon: Settings },
      ];

  const handleItemClick = (id: string) => {
    onTabChange(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderNavList = () => (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleItemClick(item.id)}
            title={item.label}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-1.5' : 'justify-between px-2.5'
            } py-2 rounded-xl text-xs font-medium transition-all cursor-pointer relative group ${
              isActive
                ? 'bg-[#E6F0EB] text-[#1B4D3E] dark:bg-[#18392F] dark:text-[#6EE7B7] font-bold shadow-2xs'
                : 'text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#F3F7F5] dark:hover:bg-[#142821] hover:text-[#11261F] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#1B4D3E] dark:text-[#6EE7B7]' : 'text-[#6C8075] dark:text-[#769385]'
                  }`}
                />
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D9383A] ring-2 ring-white dark:ring-[#0D1A16]" />
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[12px] font-semibold truncate text-left">{item.label}</span>
              )}
            </div>

            {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D9383A] text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-1">
                {item.badge}
              </span>
            )}

            {/* Floating tooltip when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.label}
                {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Floating Slide Drawer Trigger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-5 left-4 z-40 md:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1B4D3E] text-white shadow-xl hover:bg-[#153D31] active:scale-95 transition-all text-xs font-bold border border-white/20"
        title="Open navigation menu"
      >
        <Menu className="w-4 h-4" />
        <span>Menu</span>
      </button>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-white dark:bg-[#0D1A16] h-full shadow-2xl flex flex-col p-4 z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECE9] dark:border-[#1E3B32] shrink-0">
              <span className="text-xs font-black tracking-wider text-[#1B4D3E] dark:text-[#6EE7B7] uppercase">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 py-3 overflow-y-auto overscroll-contain pr-1 scrollbar-thin">
              {renderNavList()}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Slidable & Isolated Sidebar */}
      <aside
        className={`relative bg-white dark:bg-[#0D1A16] border-r border-[#E8ECE9] dark:border-[#1E3B32] h-[calc(100vh-65px)] sticky top-[65px] flex flex-col p-3 hidden md:flex shrink-0 select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[68px] min-w-[68px] max-w-[68px]' : 'w-56 min-w-[215px] max-w-[220px]'
        }`}
      >
        {/* Floating Slide Toggle Pill on Outer Border */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-4.5 z-30 w-7 h-7 rounded-full bg-white dark:bg-[#10231C] border border-[#CAD8CE] dark:border-[#234A3E] shadow-md flex items-center justify-center text-[#1B4D3E] dark:text-[#6EE7B7] hover:scale-115 active:scale-95 transition-all cursor-pointer hover:bg-[#F2F8F5] dark:hover:bg-[#163328]"
          title={isCollapsed ? "Slide expand sidebar" : "Slide collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Top Header Row with quick slide toggle */}
        <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#F0F4F2] dark:border-[#1A332B] min-h-[26px] shrink-0">
          {!isCollapsed ? (
            <>
              <span className="text-[10px] font-black tracking-widest text-[#7C9086] dark:text-[#8C9B94] uppercase px-1">
                CIVIC MENU
              </span>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded-md text-[#7C9086] hover:text-[#1B4D3E] dark:hover:text-[#6EE7B7] hover:bg-[#EBF2EE] dark:hover:bg-[#163026] transition-colors cursor-pointer"
                title="Slide collapse"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="p-1 rounded-md text-[#7C9086] hover:text-[#1B4D3E] dark:hover:text-[#6EE7B7] hover:bg-[#EBF2EE] dark:hover:bg-[#163026] transition-colors cursor-pointer"
                title="Slide expand"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Isolated Scrollable Container - scrolls all the way to the very end */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-thin flex flex-col justify-between pb-1">
          <div>
            {renderNavList()}
          </div>

          {/* Bottom Section - Heritage Artwork & Quote */}
          <div className="pt-3 mt-auto shrink-0">
            {!isCollapsed ? (
              <>
                <div className="px-1 mb-1 border-t border-[#F0F4F2] dark:border-[#1A332B] pt-2">
                  <h4 className="text-[11px] font-extrabold text-[#11261F] dark:text-white leading-tight">
                    {t.sidebarQuoteTitle || 'Less confusion. More action.'}
                  </h4>
                  <p className="text-[10px] text-[#63756E] dark:text-[#9FB7AC] mt-0.5 leading-snug font-normal line-clamp-2">
                    {t.sidebarQuoteDesc || 'DishaSaathi simplifies government processes with verified steps.'}
                  </p>
                </div>

                {/* Monument Illustration */}
                <div className="relative -mx-2 -mb-2 overflow-hidden pointer-events-none select-none rounded-b-lg">
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-[#0D1A16] dark:via-[#0D1A16]/80 dark:to-transparent z-10"></div>
                  <img
                    src="/monuments/bmc-cst-heritage.jpg"
                    alt="CST & BMC Municipal Corporation Heritage Building"
                    className="w-full h-24 object-cover object-top mix-blend-multiply dark:mix-blend-screen opacity-95 dark:opacity-85 contrast-[1.03] dark:invert dark:hue-rotate-180"
                  />
                </div>
              </>
            ) : (
              <div className="flex justify-center py-2" title="DishaSaathi Civic DPI">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#1B4D3E] dark:text-[#6EE7B7] text-[10px] font-black">
                  DS
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

