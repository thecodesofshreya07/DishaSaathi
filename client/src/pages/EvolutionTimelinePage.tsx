import React from 'react';
import { LandingNavbar } from '../components/LandingPage/LandingNavbar';
import { LandingFooter } from '../components/LandingPage/LandingFooter';
import { EvolutionTimelineView } from '../components/EvolutionTimelineView';

export const EvolutionTimelinePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#08120F] text-[#11261F] dark:text-[#E8F1EC] flex flex-col font-sans transition-colors selection:bg-[#1B4D3E]/20">
      <LandingNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EvolutionTimelineView />
      </main>
      <LandingFooter />
    </div>
  );
};

export default EvolutionTimelinePage;
