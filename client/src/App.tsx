import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoadmapProvider } from './context/RoadmapContext';
import { LanguageProvider, useLanguage, triggerGoogleTranslate } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import GoalIntakePage from './pages/GoalIntakePage';
import RoadmapPage from './pages/RoadmapPage';
import AuthPage from './pages/AuthPage';
import WardLocatorPage from './pages/WardLocatorPage';
import EvolutionTimelinePage from './pages/EvolutionTimelinePage';
import AdminValidationPage from './pages/AdminValidationPage';

import PublicJourneyVerificationPage from './pages/PublicJourneyVerificationPage';

/**
 * Ensures Google Translate stays in sync when user navigates between routes
 */
const RouteLanguageSync: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    if (language !== 'en') {
      const timer = setTimeout(() => {
        triggerGoogleTranslate(language);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, language]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RoadmapProvider>
            <BrowserRouter>
              <RouteLanguageSync />
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Goal Intake & Jurisdiction Mapping */}
                <Route path="/create" element={<GoalIntakePage />} />

                {/* Generated Civic Roadmap Visualization & Hub */}
                <Route path="/roadmap" element={<RoadmapPage />} />

                {/* Dedicated Officer Admin Console */}
                <Route path="/admin" element={<AdminValidationPage />} />

                {/* Public QR Journey Verification & Status Page */}
                <Route path="/verify/:journeyId" element={<PublicJourneyVerificationPage />} />
                <Route path="/verify" element={<PublicJourneyVerificationPage />} />

                {/* Interactive Municipal Ward & Jurisdiction Map (Item 28) */}
                <Route path="/ward-locator" element={<WardLocatorPage />} />
                <Route path="/ward-map" element={<WardLocatorPage />} />

                {/* Government Journey Replay & Evolution Timeline (Items 22, 54) */}
                <Route path="/evolution" element={<EvolutionTimelinePage />} />
                <Route path="/timeline" element={<EvolutionTimelinePage />} />

                {/* Authentication: Login & Sign Up (Item 10) */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />

                {/* Fallback to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </RoadmapProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
