import React from 'react';
import { LandingNavbar } from '../components/LandingPage/LandingNavbar';
import { LandingHero } from '../components/LandingPage/LandingHero';
import { CivicProblemSolution } from '../components/LandingPage/CivicProblemSolution';
import { HowItWorks } from '../components/LandingPage/HowItWorks';
import { CivicRuleChanges } from '../components/LandingPage/CivicRuleChanges';
import { LandingFeatures } from '../components/LandingPage/LandingFeatures';
import { CivicComparisonLanguage } from '../components/LandingPage/CivicComparisonLanguage';
import { CivicMilestonePathway } from '../components/LandingPage/CivicMilestonePathway';
import { CivicFAQSection } from '../components/LandingPage/CivicFAQSection';
import { LandingFooter } from '../components/LandingPage/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAF8] font-sans text-[#0D1F1A] antialiased flex flex-col justify-between selection:bg-[#1B4D3E] selection:text-white">
      <div>
        <LandingNavbar />
        <main>
          {/* 1. Hero with Converging Sources Diagram & Trust Pillars */}
          <LandingHero />

          {/* 2. "Government information is everywhere. The right path isn't." (6 Pills + Citizen Laptop Artwork + How DishaSaathi solves it) */}
          <CivicProblemSolution />

          {/* 3. "The DishaSaathi Experience" (4-Step Cards: 1, 2, 3, 4) */}
          <HowItWorks />

          {/* 4. "Government rules change. Your roadmap should too." (Before ➔ After ➔ Alert 3 Connected Cards) */}
          <CivicRuleChanges />

          {/* 5. "Powerful features for a smoother journey" (4 Columns: Clear Roadmaps, Verified Information, Stay Updated, Your Civic Journey) */}
          <LandingFeatures />

          {/* 6. Frequently Asked Questions (Comprehensive FAQs) */}
          <CivicFAQSection />
        </main>
      </div>

      {/* 9. CTA Banner ("Start with what you need to do") & Clean Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;


