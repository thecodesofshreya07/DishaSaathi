import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { HeroBanner } from '../components/HeroBanner';
import { CivicJourneyPipeline } from '../components/CivicJourneyPipeline';
import { RoadmapFlowchart } from '../components/RoadmapFlowchart';
import { CitizenHomeDashboard } from '../components/CitizenHomeDashboard';
import {
  ExploreView,
  ServicesView,
  DocumentsView,
  UpdatesView,
  DeadlinesView,
  PassportView,
  SavedView,
  SettingsView
} from '../components/SidebarPages';
import { StepDetailModal } from '../components/StepDetailModal';
import { ReactFlowGraphModal } from '../components/ReactFlowGraphModal';
import { ChangeDetectionModal } from '../components/ChangeDetectionModal';
import { AdminValidationModal } from '../components/AdminValidationModal';
import { AiAssistantModal } from '../components/AiAssistantModal';
import { SourceExcerptModal } from '../components/SourceExcerptModal';
import { CivicCopilot } from '../components/CivicCopilot';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CivicJourney, GovernmentUpdate, ProcedureStep, StepStatus, CivicDocumentStatus } from '../types';
import { useRoadmap } from '../context/RoadmapContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { generateRoadmapPdf } from '../utils/pdfGenerator';

export const RoadmapPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    journey,
    setJourney,
    updates,
    setUpdates,
    intake,
    generateRoadmap,
    updateStepStatus: updateStepStatusContext,
    updateDocumentStatus,
    applyUpdate: applyUpdateContext,
    hasSavedProgress,
    resumeSavedProgress,
    resetToDefault,
    isCopilotOpen,
    setIsCopilotOpen
  } = useRoadmap();

  // Active Tab: 'home' | 'journeys' | 'services' | 'updates' | 'documents' | 'deadlines' | 'saved' | 'passport' | 'settings'
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [selectedStep, setSelectedStep] = useState<ProcedureStep | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<GovernmentUpdate | null>(null);
  const [selectedExcerptUpdate, setSelectedExcerptUpdate] = useState<GovernmentUpdate | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiFocusStepId, setAiFocusStepId] = useState<string | undefined>(undefined);

  // Handle Natural Language Search
  const handleSearch = async (goal: string) => {
    setLoading(true);
    try {
      const generated = await generateRoadmap({ goal });
      if (generated) {
        setJourney(generated);
        setActiveTab('journeys');
      }
    } catch (err) {
      console.error('Failed to interpret task', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step status change (Item 9: closes card on submit)
  const handleUpdateStepStatus = async (
    stepId: string,
    status: StepStatus
  ) => {
    const result = await updateStepStatusContext(stepId, status);
    if (!result.success && result.blocked) {
      alert(`🔒 Step Blocked: ${result.message}`);
      return;
    }
    // Item 9: Close the card after doing submitted
    setSelectedStep(null);
  };

  // Apply change to roadmap
  const handleApplyUpdateToRoadmap = async (updateId: string) => {
    await applyUpdateContext(updateId);
    setSelectedUpdate(null);
  };

  const handleAdminApprove = async (updateId: string) => {
    await handleApplyUpdateToRoadmap(updateId);
  };

  const handleAdminReject = async (updateId: string) => {
    try {
      await fetch(`/api/updates/${updateId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Reject' })
      });
      const resU = await fetch('/api/updates');
      if (resU.ok) {
        const dataU = await resU.json();
        if (dataU.updates) setUpdates(dataU.updates);
      }
    } catch (err) {
      console.error('Error rejecting update', err);
    }
  };

  const handleResetJourney = async () => {
    try {
      const res = await fetch('/api/journey/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setJourney(data.journey || null);
      }
    } catch (err) {
      console.error('Failed to reset journey', err);
    }
  };

  // Item 14: Download Roadmap in PDF Format
  const handleDownloadRoadmap = () => {
    if (!activeJourney) return;
    generateRoadmapPdf(activeJourney, user?.name || 'Citizen');
  };

  // Safe fallback if journey hasn't loaded yet
  const activeJourney: CivicJourney = journey || {
    id: '',
    title: intake.goal || '',
    query: intake.goal || '',
    location: intake.city ? `${intake.city}, ${intake.state}` : '',
    category: '',
    totalSteps: 0,
    completedSteps: 0,
    pendingDocuments: 0,
    lastUpdated: '',
    status: 'In Progress',
    steps: []
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#08120F] font-sans text-[#11261F] dark:text-[#E8F3EE] antialiased transition-colors">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onSearch={handleSearch}
        unreadCount={updates.filter((u) => u.reviewStatus === 'Pending Review').length}
        onOpenNotifications={() => {
          if (updates.length > 0) setSelectedUpdate(updates[0]);
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />


      {/* 2. Main 2-Column Layout (Item 15: right sidebar removed, full screen width) */}
      <div className="flex max-w-[1720px] mx-auto min-h-[calc(100vh-100px)]">
        {/* Left Sidebar (Item 11: clean navigation) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'updates' && updates.length > 0) {
              setSelectedExcerptUpdate(updates[0]);
            }
          }}
          updatesCount={updates.filter((u) => u.reviewStatus === 'Pending Review').length}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto">
          {/* Phase 4 Resume Experience Banner */}
          {hasSavedProgress && activeTab === 'home' && (
            <div className="mb-5 bg-[#EAF2ED] dark:bg-[#10271F] border-2 border-[#1B4D3E]/30 dark:border-[#22C55E]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] dark:bg-[#1B4D3E] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#11261F] dark:text-white text-sm flex items-center gap-1.5">
                    Continue your saved progress
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 dark:bg-[#22C55E]/10 text-[#1B4D3E] dark:text-[#6EE7B7] font-bold">
                      Saved
                    </span>
                  </h4>
                  <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC]">
                    You completed {activeJourney.completedSteps} of {activeJourney.totalSteps} steps and have {activeJourney.readyDocuments || 0} of {activeJourney.totalDocuments || 0} documents ready.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resumeSavedProgress();
                  setActiveTab('journeys');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#1B4D3E] hover:bg-[#153D31] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer text-center"
              >
                Continue Roadmap
              </button>
            </div>
          )}

          {/* TAB 1: Item 12: HOME SHOWS HERO BANNER, FLOWCHART, METRICS AND WELCOME BACK */}
          {activeTab === 'home' && (
            <CitizenHomeDashboard
              journey={activeJourney}
              updates={updates}
              onGoToJourney={() => setActiveTab('journeys')}
              onGoToTab={(tab) => setActiveTab(tab)}
              onDownloadPdf={handleDownloadRoadmap}
              onOpenAiCopilot={() => setIsCopilotOpen(true)}
              onSearch={handleSearch}
              isLoading={loading}
              onSelectStep={(step) => setSelectedStep(step)}
              selectedStepId={selectedStep?.id}
            />
          )}

          {/* TAB 2: Item 13 & Flowchart: IN JOURNEY SHOW THE ROADMAP */}
          {activeTab === 'journeys' && (
            <div className="space-y-6">
              {/* Hero Banner for Natural Language Search */}
              <HeroBanner
                onSearch={handleSearch}
                isLoading={loading}
              />

              {/* MOST IMPORTANT: FLOWCHART WITH ONLY SMALL STEPS */}
              <RoadmapFlowchart
                journey={activeJourney}
                onSelectStep={(step) => setSelectedStep(step)}
                selectedStepId={selectedStep?.id}
              />

              {/* AND THEN THE ALREADY GIVEN FLOW.. DONT CHANGE IT */}
              <ErrorBoundary fallbackTitle="Interactive Civic Roadmap Unavailable">
                <CivicJourneyPipeline
                  journey={activeJourney}
                  onSelectStep={(step) => setSelectedStep(step)}
                  onOpenGraphView={() => setIsGraphModalOpen(true)}
                  onOpenAiAssistant={(stepId) => {
                    setAiFocusStepId(stepId);
                    setIsCopilotOpen(true);
                  }}
                  selectedStepId={selectedStep?.id}
                  onQuickSearch={handleSearch}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB: EXPLORE VIEW (Requirement 5) */}
          {activeTab === 'explore' && (
            <ExploreView
              onStartProcedure={(query) => {
                handleSearch(query);
                setActiveTab('journeys');
              }}
              onExploreService={() => setActiveTab('services')}
            />
          )}

          {/* TAB 3: Item 11: EXPLORE SERVICES VIEW */}
          {activeTab === 'services' && (
            <ServicesView
              onStartProcedure={(query) => handleSearch(query)}
            />
          )}

          {/* TAB 4: Item 11 & Item 8: DOCUMENT LOCKER VIEW */}
          {activeTab === 'documents' && (
            <DocumentsView
              journey={activeJourney}
              onUpdateDocumentStatus={async (stepId, docId, status) => {
                await updateDocumentStatus(stepId, docId, status);
              }}
            />
          )}

          {/* TAB 5: Item 11 & Item 7: GOVERNMENT GAZETTE UPDATES VIEW */}
          {activeTab === 'updates' && (
            <UpdatesView
              updates={updates}
              onInspectExcerpt={(u) => setSelectedExcerptUpdate(u)}
            />
          )}

          {/* TAB 6: DEADLINES VIEW */}
          {activeTab === 'deadlines' && (
            <DeadlinesView />
          )}

          {/* TAB 7: CIVIC PASSPORT VIEW */}
          {activeTab === 'passport' && (
            <PassportView journey={activeJourney} />
          )}

          {/* TAB 8: SAVED VIEW */}
          {activeTab === 'saved' && (
            <SavedView
              journey={activeJourney}
              onGoToJourney={() => setActiveTab('journeys')}
            />
          )}

          {/* TAB 9: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <SettingsView
              onResetRoadmap={() => resetToDefault()}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      {/* A. Step Detail Modal with "Why do I need this?" and Source Evidence */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep}
          journey={activeJourney}
          onClose={() => setSelectedStep(null)}
          onUpdateStatus={handleUpdateStepStatus}
          onUpdateDocumentStatus={async (stepId: string, docId: string, status: CivicDocumentStatus) => {
            await updateDocumentStatus(stepId, docId, status);
            if (selectedStep && selectedStep.id === stepId) {
              setSelectedStep((prev) => {
                if (!prev) return null;
                const updatedDocs = prev.documents.map((d) =>
                  d.id === docId ? { ...d, status } : d
                );
                return { ...prev, documents: updatedDocs };
              });
            }
          }}
          onNavigateToStep={(id) => {
            const found = activeJourney.steps.find((s) => s.id === id);
            if (found) setSelectedStep(found);
          }}
          onOpenAiAssistant={(stepId) => {
            setAiFocusStepId(stepId);
            setIsAiModalOpen(true);
          }}
        />
      )}

      {/* B. Full React Flow Graph View */}
      {isGraphModalOpen && (
        <ReactFlowGraphModal
          journey={activeJourney}
          onClose={() => setIsGraphModalOpen(false)}
          onSelectStep={(step) => {
            setIsGraphModalOpen(false);
            setSelectedStep(step);
          }}
        />
      )}

      {/* C. Change Detection "What Changed?" Modal */}
      {selectedUpdate && (
        <ChangeDetectionModal
          update={selectedUpdate}
          onClose={() => setSelectedUpdate(null)}
          onApplyToRoadmap={handleApplyUpdateToRoadmap}
          onOpenAdmin={() => {
            setSelectedUpdate(null);
            setIsAdminModalOpen(true);
          }}
        />
      )}

      {/* D. Human-in-the-Loop Admin Review Modal */}
      {isAdminModalOpen && (
        <AdminValidationModal
          updates={updates}
          onClose={() => setIsAdminModalOpen(false)}
          onApproveUpdate={handleAdminApprove}
          onRejectUpdate={handleAdminReject}
          onResetJourney={handleResetJourney}
          onUpdatesReceived={(newUpdates) => setUpdates(newUpdates)}
        />
      )}

      {/* E. AI Assistant Modal */}
      {isAiModalOpen && (
        <AiAssistantModal
          journey={activeJourney}
          onClose={() => {
            setIsAiModalOpen(false);
            setAiFocusStepId(undefined);
          }}
          focusStepId={aiFocusStepId}
        />
      )}

      {/* F. Item 7: AI Official Source Statutory Excerpt Modal */}
      {selectedExcerptUpdate && (
        <SourceExcerptModal
          isOpen={!!selectedExcerptUpdate}
          onClose={() => setSelectedExcerptUpdate(null)}
          title={selectedExcerptUpdate.title}
          authority={selectedExcerptUpdate.type || 'Official Gazette'}
          sourceUrl={selectedExcerptUpdate.sourceUrl}
          stepTitle={selectedExcerptUpdate.title}
          query={selectedExcerptUpdate.description}
        />
      )}


      {/* G. Civic Copilot Drawer */}
      <ErrorBoundary fallbackTitle="Civic Copilot Error">
        <CivicCopilot
          journey={activeJourney}
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          focusStepId={aiFocusStepId}
        />
      </ErrorBoundary>
    </div>
  );
};

export default RoadmapPage;
