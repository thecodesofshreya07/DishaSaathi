
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  ArrowRight,
  Search,
  Trash2,
  Briefcase,
  Home,
  Car,
  Layers
} from 'lucide-react';
import { CivicJourney } from '../types';
import { useRoadmap } from '../context/RoadmapContext';

interface JourneyCardsViewProps {
  journeys: CivicJourney[];
  onSelectJourney: (journeyId: string) => void;
  onCreateNewJourney: (goal: string) => void;
  onDeleteJourney?: (journeyId: string) => void;
  isLoading?: boolean;
}

export const JourneyCardsView: React.FC<JourneyCardsViewProps> = ({
  journeys,
  onSelectJourney,
  onDeleteJourney,
  isLoading: _isLoading = false
}) => {
  const navigate = useNavigate();
  const { updateIntakeField } = useRoadmap();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Filter journeys by search & status
  const filteredJourneys = journeys.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.category && j.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (j.location && j.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const isCompleted = j.completedSteps === j.totalSteps && j.totalSteps > 0;
    if (filterStatus === 'COMPLETED') return matchesSearch && isCompleted;
    if (filterStatus === 'IN_PROGRESS') return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  const getCategoryIcon = (category: string = '', title: string = '') => {
    const lower = (category + ' ' + title).toLowerCase();
    if (lower.includes('business') || lower.includes('bakery') || lower.includes('shop') || lower.includes('enterprise')) {
      return Briefcase;
    }
    if (lower.includes('property') || lower.includes('flat') || lower.includes('house') || lower.includes('rera')) {
      return Home;
    }
    if (lower.includes('license') || lower.includes('vehicle') || lower.includes('driving') || lower.includes('rto')) {
      return Car;
    }
    return Layers;
  };

  const handleStartNewJourney = () => {
    updateIntakeField('goal', '');
    navigate('/create');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#173F33] via-[#153B2E] to-[#123126] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Right side monument illustration cleanly grounded at the bottom right */}
        <div className="hidden sm:flex absolute right-0 bottom-0 top-0 w-1/2 md:w-5/12 lg:w-4/12 pointer-events-none select-none z-0 overflow-hidden items-end justify-end">
          <img
            src="/monuments/heritage-monument-right.png"
            alt="Heritage Monument"
            className="h-full max-h-[190px] w-auto object-contain object-bottom opacity-80"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/10">
              <Compass className="w-3.5 h-3.5" />
              <span>Multi-Procedure Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Civic Journeys
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Track and manage all your ongoing municipal filings, state statutory compliance, and civic roadmaps in one connected dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartNewJourney}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8B931] hover:bg-[#D4A72C] text-[#11261F] font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Journey</span>
            </button>
          </div>
        </div>

        {/* Stats summary strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Total Journeys</div>
            <div className="text-xl font-bold text-white mt-0.5">{journeys.length}</div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">In Progress</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">
              {journeys.filter((j) => j.completedSteps < j.totalSteps).length}
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Completed Milestones</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {journeys.reduce((acc, j) => acc + (j.completedSteps || 0), 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Documents Prepared</div>
            <div className="text-xl font-bold text-[#E8B931] mt-0.5">
              {journeys.reduce((acc, j) => acc + (j.readyDocuments || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search your journeys by title, city, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0D1A16] border border-[#E8ECE9] dark:border-[#1E3B32] rounded-xl text-xs text-[#11261F] dark:text-[#E8F3EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="inline-flex p-1 bg-white dark:bg-[#0D1A16] border border-[#E8ECE9] dark:border-[#1E3B32] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'ALL'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            All ({journeys.length})
          </button>
          <button
            onClick={() => setFilterStatus('IN_PROGRESS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'IN_PROGRESS'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            In Progress ({journeys.filter((j) => j.completedSteps < j.totalSteps).length})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === 'COMPLETED'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Completed ({journeys.filter((j) => j.completedSteps === j.totalSteps && j.totalSteps > 0).length})
          </button>
        </div>
      </div>

      {/* Journeys Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJourneys.map((item) => {
          const Icon = getCategoryIcon(item.category, item.title);
          const total = item.totalSteps || (item.steps ? item.steps.length : 0) || 1;
          const completed = item.completedSteps || 0;
          const percentage = Math.min(100, Math.round((completed / total) * 100));
          const isDone = completed === total && total > 0;

          return (
            <div
              key={item.id}
              onClick={() => onSelectJourney(item.id)}
              className="group bg-white dark:bg-[#0D1A16] border border-[#E8ECE9] dark:border-[#1E3B32] hover:border-[#1B4D3E] dark:hover:border-[#22C55E] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Progress bar accent on top edge */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-[#1B4D3E] dark:bg-[#22C55E]'
                    }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div>
                {/* Header: Icon, Category & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F0EB] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        {item.category || 'Civic Procedure'}
                      </span>
                      <span className="text-xs text-[#1B4D3E] dark:text-[#6EE7B7] font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {item.location || 'India'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isDone
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                  >
                    {isDone ? 'Completed' : `${percentage}% Done`}
                  </span>
                </div>

                {/* Journey Goal / Task Title */}
                <h3 className="text-base font-bold text-[#11261F] dark:text-[#E8F3EE] group-hover:text-[#1B4D3E] dark:group-hover:text-[#6EE7B7] transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>

                {/* Progress Bar & Percentage details */}
                <div className="mt-3 mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#11261F] dark:text-gray-200">
                      Progress: <span className="text-[#1B4D3E] dark:text-[#6EE7B7] font-bold">{percentage}%</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                      {completed} of {total} steps
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#1B4D3E] to-[#2E7D32] dark:from-[#22C55E] dark:to-[#10B981]'
                        }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Documents & Milestones Summary */}
                <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-gray-50 dark:bg-[#12231E] border border-gray-100 dark:border-[#1E3B32] text-xs text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#22C55E]" />
                    <span>{completed}/{total} Steps</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{item.readyDocuments || 0} Docs Ready</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-[#1E3B32] flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.lastUpdated || 'Recently active'}
                </span>

                <div className="flex items-center gap-2">
                  {onDeleteJourney && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${item.title}"?`)) {
                          onDeleteJourney(item.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete Journey"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] group-hover:translate-x-0.5 transition-transform">
                    <span>Open Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Start New Journey Card Tile */}
        <div
          onClick={handleStartNewJourney}
          className="border-2 border-dashed border-[#E8ECE9] dark:border-[#1E3B32] hover:border-[#1B4D3E] dark:hover:border-[#22C55E] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-white/50 dark:bg-[#0D1A16]/50 hover:bg-white dark:hover:bg-[#0D1A16] transition-all duration-200 cursor-pointer min-h-[260px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E6F0EB] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#11261F] dark:text-white text-sm">
              Start Another Journey
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
              Add a new business, property, permit, or civic goal in any Indian city.
            </p>
          </div>
          <span className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] px-3 py-1.5 rounded-lg bg-[#E6F0EB] dark:bg-[#18392F] mt-2">
            + New Procedure
          </span>
        </div>
      </div>
    </div>
  );
};

