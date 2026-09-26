import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoadmapProvider } from './context/RoadmapContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import GoalIntakePage from './pages/GoalIntakePage';
import RoadmapPage from './pages/RoadmapPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <RoadmapProvider>
        <BrowserRouter>
          <Routes>
            {/* Phase 2: Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Phase 2: Goal Intake & Jurisdiction Mapping */}
            <Route path="/create" element={<GoalIntakePage />} />

            {/* Phase 2: Generated Civic Roadmap Visualization */}
            <Route path="/roadmap" element={<RoadmapPage />} />

            {/* Fallback to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RoadmapProvider>
    </LanguageProvider>
  );
};

export default App;
