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
  Settings
} from 'lucide-react';

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
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journeys', label: 'My Journeys', icon: Compass },
    { id: 'services', label: 'Explore Services', icon: Search },
    { id: 'updates', label: 'Government Updates', icon: Bell, badge: updatesCount },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar, badge: deadlinesCount },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'passport', label: 'Civic Passport', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 min-w-[230px] bg-white border-r border-[#E8ECE9] min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 hidden md:flex">
      {/* Navigation links */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#E6F0EB] text-[#1B4D3E] font-bold shadow-2xs'
                  : 'text-[#4A5D54] hover:bg-[#F3F7F5] hover:text-[#11261F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#1B4D3E]' : 'text-[#6C8075]'
                  }`}
                />
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D9383A] text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Inspiration Section with the exact BMC/CST Heritage Monument Artwork */}
      <div className="pt-2 border-t border-[#EDF2EE] mt-4">
        {/* CST / BMC Victoria Terminus Municipal Building Monument Artwork */}
        <div className="relative w-full h-24 overflow-hidden rounded-xl mb-2.5">
          <img
            src="/monuments/bmc-cst-heritage.jpg"
            alt="CST & BMC Municipal Corporation Heritage Building"
            className="w-full h-full object-cover object-center opacity-90 mix-blend-multiply filter contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="px-1">
          <h4 className="text-xs font-extrabold text-[#11261F] leading-tight">
            Less confusion.<br />More action.
          </h4>
          <p className="text-[11px] text-[#63756E] mt-1.5 leading-relaxed font-normal">
            DishaSaathi simplifies government processes with verified information, clear steps and real-time updates.
          </p>
        </div>
      </div>
    </aside>
  );
};
