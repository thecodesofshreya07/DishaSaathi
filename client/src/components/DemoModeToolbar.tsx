import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Tv,
  MessageSquare,
  ChevronDown,
  Store,
  Bike,
  Home,
  Award
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

export const DemoModeToolbar: React.FC = () => {
  const {
    activeScenarioId,
    loadDemoScenario,
    isPresentationMode,
    setIsPresentationMode,
    isCopilotOpen,
    setIsCopilotOpen
  } = useRoadmap();

  const scenarios = [
    { id: 'bakery-mumbai', label: 'Bakery in Mumbai (Primary Demo)', icon: Store },
    { id: 'vehicle-mumbai', label: 'Vehicle Registration (Transport)', icon: Bike },
    { id: 'property-construction', label: 'Residential Construction (Urban)', icon: Home },
    { id: 'certificate-income', label: 'Government Certificate (Revenue)', icon: Award }
  ];

  const handleScenarioChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    await loadDemoScenario(selectedId);
  };

  const handleReset = async () => {
    try {
      await fetch('/api/journey/reset', { method: 'POST' });
      await loadDemoScenario(activeScenarioId || 'bakery-mumbai');
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  return (
    <div className="bg-[#11261F] text-white px-4 py-2 text-xs border-b border-[#1B4D3E]/40 shadow-xs z-40">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon Judge Badge & Scenario Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B4D3E] text-emerald-300 font-extrabold text-[10px] tracking-wide uppercase border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Hackathon Demo Mode</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[#8C9B94] font-medium hidden sm:inline">Scenario:</span>
            <div className="relative">
              <select
                value={activeScenarioId}
                onChange={handleScenarioChange}
                className="appearance-none bg-[#1A382E] text-white font-bold text-xs pl-2.5 pr-7 py-1 rounded-lg border border-[#2D5A46] hover:border-emerald-400 focus:outline-hidden cursor-pointer"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-[#11261F] text-white">
                    {sc.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C9B94] absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Quick Controls: Reset, Presentation Mode, Copilot Launcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1A382E] hover:bg-[#23483B] text-emerald-200 font-bold border border-[#2D5A46] transition-colors cursor-pointer text-[11px]"
            title="Reset active scenario to initial baseline"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer text-[11px] ${
              isPresentationMode
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-[#1A382E] text-white hover:bg-[#23483B] border-[#2D5A46]'
            }`}
            title="Toggle presentation view for projectors"
          >
            <Tv className="w-3 h-3" />
            <span>{isPresentationMode ? 'Exit Presentation' : 'Presentation View'}</span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-xs ${
              isCopilotOpen
                ? 'bg-emerald-400 text-[#11261F]'
                : 'bg-[#2D6A56] hover:bg-[#347A63] text-white border border-emerald-400/40'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>{isCopilotOpen ? 'Close Copilot' : 'Open Civic Copilot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
