import React from 'react';
import { LandingNavbar } from '../components/LandingPage/LandingNavbar';
import { LandingHero } from '../components/LandingPage/LandingHero';
import { HowItWorks } from '../components/LandingPage/HowItWorks';
import { LandingFeatures } from '../components/LandingPage/LandingFeatures';
import { LandingFooter } from '../components/LandingPage/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFCF9] font-sans text-[#0D1F1A] antialiased flex flex-col justify-between">
      <div>
        <LandingNavbar />
        <main>
          <LandingHero />
          <HowItWorks />
          <LandingFeatures />
        </main>
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
