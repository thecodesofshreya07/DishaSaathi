import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoadmapProvider } from './context/RoadmapContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import GoalIntakePage from './pages/GoalIntakePage';
import RoadmapPage from './pages/RoadmapPage';
import AuthPage from './pages/AuthPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RoadmapProvider>
            <BrowserRouter>
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Goal Intake & Jurisdiction Mapping */}
                <Route path="/create" element={<GoalIntakePage />} />

                {/* Generated Civic Roadmap Visualization & Hub */}
                <Route path="/roadmap" element={<RoadmapPage />} />

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
