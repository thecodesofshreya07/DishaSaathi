import React, { useState } from 'react';
import {
  Download,
  Share2,
  FileText,
  Calendar,
  ChevronRight,
  Check
} from 'lucide-react';
import { GovernmentUpdate } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RightSidebarProps {
  completedSteps: number;
  totalSteps: number;
  updates: GovernmentUpdate[];
  onSelectUpdate: (update: GovernmentUpdate) => void;
  onViewAllUpdates: () => void;
  onDownloadRoadmap: () => void;
  onExploreServices: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  completedSteps = 3,
  totalSteps = 8,
  updates,
  onSelectUpdate,
  onViewAllUpdates,
  onDownloadRoadmap,
  onExploreServices
}) => {
  const { t } = useLanguage();
  const total = totalSteps > 0 ? totalSteps : 5;
  const completed = Math.min(completedSteps || 0, total);
  const percentage = Math.round((completed / total) * 100);

  // SVG Circular progress values
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <aside className="w-80 min-w-[300px] bg-white border-l border-[#E8ECE9] min-h-[calc(100vh-65px)] p-5 hidden xl:flex flex-col gap-5">
      {/* 1. My Journey Progress */}
      <div className="bg-[#FAFDFB] border border-[#E2EAE5] rounded-2xl p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-[#11261F] mb-3">{t.stepsProgress || 'My Journey Progress'}</h3>
        <div className="flex items-center gap-4">
          {/* Radial Circular Progress */}
          <div className="relative w-18 h-18 flex-shrink-0 flex items-center justify-center">
            <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#E2ECE6]"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#1B4D3E] transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-[#11261F]">
              {percentage}%
            </span>
          </div>

          {/* Text and segmented bar */}
          <div className="flex-1">
            <div className="text-xs font-bold text-[#11261F]">
              {completed} of {total} steps completed
            </div>
            {/* Segmented bar */}
            <div className="flex gap-1.5 mt-2">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < completed
                      ? 'bg-[#1B4D3E]'
                      : 'bg-[#E2ECE6]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Latest Government Updates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#11261F]">Latest Government Updates</h3>
          <button
            onClick={onViewAllUpdates}
            className="text-[11px] font-semibold text-[#6C8075] hover:text-[#1B4D3E] flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {updates.map((update) => {
            let badgeBg = 'bg-[#FDF0ED] text-[#C53929] border-[#F7D2CC]';
            let iconSymbol = '!';
            let iconBg = 'bg-[#D9383A] text-white';

            if (update.type === 'Fee Update') {
              badgeBg = 'bg-[#EBF3FB] text-[#2563EB] border-[#D0E2F9]';
              iconSymbol = 'ℹ';
              iconBg = 'bg-[#2563EB] text-white';
            } else if (update.type === 'New Service') {
              badgeBg = 'bg-[#E8F5EE] text-[#1B4D3E] border-[#CDE3D7]';
              iconSymbol = '';
              iconBg = 'bg-[#1B4D3E] text-white';
            }

            return (
              <div
                key={update.id}
                onClick={() => onSelectUpdate(update)}
                className="group p-3 rounded-2xl border border-[#E2EAE5] hover:border-[#1B4D3E]/40 hover:bg-[#F9FAF9] transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${iconBg}`}>
                      {iconSymbol}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                      {update.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[#8C9B94]">
                    {update.date}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#11261F] group-hover:text-[#1B4D3E] transition-colors leading-snug">
                    {update.title}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9B94] group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-0.5" />
                </div>

                <p className="text-[11px] text-[#6C8075] line-clamp-2 mt-1 leading-normal font-normal">
                  {update.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div>
        <h3 className="text-xs font-bold text-[#11261F] mb-2.5">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={onDownloadRoadmap}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E2EAE5] hover:bg-[#F7F9F8] transition-colors text-center group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F0F4F2] text-[#4A5D54] flex items-center justify-center mb-1">
              <Download className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-medium text-[#2C3F36] leading-tight">
              Download<br />Roadmap
            </span>
          </button>

          <button
            onClick={handleShare}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-colors text-center group cursor-pointer ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'border-[#E2EAE5] hover:bg-[#F7F9F8] text-[#2C3F36]'
            }`}
            title="Copy link to this roadmap"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${
              copied ? 'bg-emerald-200 text-emerald-800' : 'bg-[#F0F4F2] text-[#4A5D54]'
            }`}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <Share2 className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[9px] font-medium leading-tight">
              {copied ? 'Link<br />Copied!' : 'Share with<br />Others'}
            </span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E2EAE5] hover:bg-[#F7F9F8] transition-colors text-center group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F0F4F2] text-[#4A5D54] flex items-center justify-center mb-1">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-medium text-[#2C3F36] leading-tight">
              Print / Save<br />PDF
            </span>
          </button>

          <button
            onClick={() => {
              // Non-blocking action
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E2EAE5] hover:bg-[#F7F9F8] transition-colors text-center group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F0F4F2] text-[#4A5D54] flex items-center justify-center mb-1">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-medium text-[#2C3F36] leading-tight">
              Set<br />Reminder
            </span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Dark Card with Gateway of India Monument Artwork */}
      <div className="mt-auto">
        <div className="relative rounded-2xl bg-[#132E25] text-white p-4 overflow-hidden shadow-sm min-h-[145px] flex flex-col justify-between">
          {/* Authentic Gateway of India Night Silhouette Artwork */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none select-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#132E25] via-[#132E25]/50 to-transparent z-10 w-16"></div>
            <img
              src="/monuments/gateway-night.jpg"
              alt="Gateway of India Night Artwork"
              className="w-full h-full object-cover object-center opacity-80"
            />
          </div>

          <div className="relative z-10 max-w-[155px]">
            <h4 className="text-xs font-extrabold text-white leading-tight">
              Your government<br />journey, simplified.
            </h4>
            <p className="text-[11px] text-[#A8D5C2] mt-1 font-normal">
              Less confusion. More action.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={onExploreServices}
              className="px-3.5 py-1.5 rounded-full bg-white text-[#132E25] font-bold text-[11px] hover:bg-[#EAF2ED] transition-all flex items-center gap-1 shadow-xs"
            >
              <span>Explore Services</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
