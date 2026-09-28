import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, Scale, ShieldAlert, X, Mail, AlertOctagon, Layers } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { HeroBanner } from '../components/HeroBanner';
import { JourneyCardsView } from '../components/JourneyCardsView';
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
import { ProcedureSimulatorModal } from '../components/ProcedureSimulatorModal';
import { CompareProceduresModal } from '../components/CompareProceduresModal';
import { StepDetailModal } from '../components/StepDetailModal';
import { ReactFlowGraphModal } from '../components/ReactFlowGraphModal';
import { ChangeDetectionModal } from '../components/ChangeDetectionModal';
import { AdminValidationModal } from '../components/AdminValidationModal';
import { AiAssistantModal } from '../components/AiAssistantModal';
import { SourceExcerptModal } from '../components/SourceExcerptModal';
import { SlaEscalationModal } from '../components/SlaEscalationModal';
import { EmailRoadmapModal } from '../components/EmailRoadmapModal';
import { CivicOnboardingTour } from '../components/CivicOnboardingTour';
import { CivicCopilot } from '../components/CivicCopilot';
import { WardLocatorView } from '../components/WardLocatorView';
import { EvolutionTimelineView } from '../components/EvolutionTimelineView';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CivicJourney, GovernmentUpdate, ProcedureStep, StepStatus, CivicDocumentStatus } from '../types';
import { useRoadmap } from '../context/RoadmapContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { generateRoadmapPdf } from '../utils/pdfGenerator';
import { calculateTotalJourneyCost } from '../utils/costCalculator';

export const RoadmapPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    journey,
    setJourney,
    journeys,
    selectJourney,
    deleteJourney,
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
  const [activeTab, setActiveTab] = useState<string>(() => (location.state as any)?.tab || 'home');
  // Journey View Mode: 'cards' (list all journeys) | 'detail' (view current roadmap)
  const [journeyViewMode, setJourneyViewMode] = useState<'cards' | 'detail'>(() => (location.state as any)?.viewMode || 'cards');
  const [loading, setLoading] = useState(false);

  // Sync state when navigating in with location.state (e.g., from GoalIntakePage or Search)
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state as any;
      if (stateObj.tab) setActiveTab(stateObj.tab);
      if (stateObj.viewMode) setJourneyViewMode(stateObj.viewMode);
      if (stateObj.journeyId) selectJourney(stateObj.journeyId);
    }
  }, [location.state]);

  // Modals state
  const [selectedStep, setSelectedStep] = useState<ProcedureStep | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<GovernmentUpdate | null>(null);
  const [selectedExcerptUpdate, setSelectedExcerptUpdate] = useState<GovernmentUpdate | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [activeSlaStep, setActiveSlaStep] = useState<ProcedureStep | null>(null);
  const [aiFocusStepId, setAiFocusStepId] = useState<string | undefined>(undefined);
  const [blockedStepError, setBlockedStepError] = useState<string | null>(null);

  // Read state for notifications & deadlines so badge '1' disappears once opened/read
  const [readUpdateIds, setReadUpdateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_read_updates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasReadDeadlines, setHasReadDeadlines] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dishasaathi_read_deadlines') === 'true';
    } catch {
      return false;
    }
  });

  const markAllUpdatesAsRead = () => {
    if (updates.length > 0) {
      const allIds = Array.from(new Set([...readUpdateIds, ...updates.map((u) => u.id)]));
      setReadUpdateIds(allIds);
      localStorage.setItem('dishasaathi_read_updates', JSON.stringify(allIds));
    }
  };

  const markDeadlinesAsRead = () => {
    setHasReadDeadlines(true);
    localStorage.setItem('dishasaathi_read_deadlines', 'true');
  };

  // When user is on 'updates' tab or opens modal, automatically mark updates as read
  React.useEffect(() => {
    if (activeTab === 'updates' || selectedUpdate || selectedExcerptUpdate) {
      markAllUpdatesAsRead();
    } else if (activeTab === 'deadlines') {
      markDeadlinesAsRead();
    }
  }, [activeTab, selectedUpdate, selectedExcerptUpdate, updates]);

  // Compute live unread counts
  const unreadUpdatesCount = activeTab === 'updates' || selectedUpdate || selectedExcerptUpdate
    ? 0
    : updates.filter((u) => u.reviewStatus === 'Pending Review' && !readUpdateIds.includes(u.id)).length;

  const unreadDeadlinesCount = activeTab === 'deadlines' || hasReadDeadlines ? 0 : 1;

  // Handle Natural Language Search
  const handleSearch = async (goal: string) => {
    setLoading(true);
    try {
      const generated = await generateRoadmap({ goal });
      if (generated) {
        setJourney(generated);
        setActiveTab('journeys');
        setJourneyViewMode('detail');
      }
    } catch (err) {
      console.error('Failed to interpret task', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step status change
  const handleUpdateStepStatus = async (
    stepId: string,
    status: StepStatus
  ) => {
    const result = await updateStepStatusContext(stepId, status);
    if (!result.success && result.blocked) {
      setBlockedStepError(result.message || 'Prerequisite procedure steps must be completed first.');
      return;
    }
    // Keep live selectedStep in sync with active journey
    setSelectedStep((prev) => (prev && prev.id === stepId ? { ...prev, status } : prev));
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
        unreadCount={unreadUpdatesCount}
        onOpenNotifications={() => {
          markAllUpdatesAsRead();
          if (updates.length > 0) {
            setSelectedUpdate(updates[0]);
          } else {
            setActiveTab('updates');
          }
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />


      {/* 2. Main 2-Column Layout (Item 15: right sidebar removed, full screen width) */}
      <div className="flex max-w-[1720px] mx-auto min-h-[calc(100vh-100px)]">
        {/* Left Sidebar (Item 11: clean navigation) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'compare') {
              setIsCompareOpen(true);
              return;
            }
            setActiveTab(tab);
            if (tab === 'updates') {
              markAllUpdatesAsRead();
              if (updates.length > 0) {
                setSelectedExcerptUpdate(updates[0]);
              }
            } else if (tab === 'deadlines') {
              markDeadlinesAsRead();
            }
          }}
          updatesCount={unreadUpdatesCount}
          deadlinesCount={unreadDeadlinesCount}
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
              onGoToJourney={() => {
                setActiveTab('journeys');
                setJourneyViewMode(journey ? 'detail' : 'cards');
              }}
              onGoToTab={(tab) => setActiveTab(tab)}
              onDownloadPdf={handleDownloadRoadmap}
              onOpenAiCopilot={() => setIsCopilotOpen(true)}
              onSearch={handleSearch}
              isLoading={loading}
              onSelectStep={(step) => setSelectedStep(step)}
              selectedStepId={selectedStep?.id}
            />
          )}

          {/* TAB 2: IN JOURNEY SHOW CARDS LIST OR THE SELECTED ROADMAP (NO HERO BANNER HERE) */}
          {activeTab === 'journeys' && (
            <div className="space-y-6">
              {journeyViewMode === 'cards' ? (
                <JourneyCardsView
                  journeys={journeys}
                  onSelectJourney={(id) => {
                    selectJourney(id);
                    setJourneyViewMode('detail');
                  }}
                  onCreateNewJourney={async (goal) => {
                    await handleSearch(goal);
                    setJourneyViewMode('detail');
                  }}
                  onDeleteJourney={deleteJourney}
                  isLoading={loading}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top Navigation Bar: Back to All Journeys & Action Toolbar */}
                  <div className="bg-white dark:bg-[#0D1A16] border border-[#E2EAE5] dark:border-[#1E3B32] rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 shadow-2xs">

                    {/* Left: Journey Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => setJourneyViewMode('cards')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F5F2] hover:bg-[#E2EBE5] dark:bg-[#142A22] dark:hover:bg-[#1A382D] text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] transition-all shrink-0 cursor-pointer"
                        title="Back to all saved journeys"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">All Journeys</span>
                      </button>

                      <div className="h-5 w-px bg-[#E2EAE5] dark:bg-[#1E3B32] shrink-0" />

                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#11261F] dark:text-white tracking-tight truncate">
                          {activeJourney.title}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px]">
                          <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#EBF5EF] text-[#1B4D3E] dark:bg-[#17382D] dark:text-[#6EE7B7]">
                            {activeJourney.totalSteps > 0
                              ? `${Math.round(((activeJourney.completedSteps || 0) / activeJourney.totalSteps) * 100)}% Complete (${activeJourney.completedSteps || 0}/${activeJourney.totalSteps || 0})`
                              : 'In Progress'}
                          </span>
                          <span className="font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#784D13] dark:bg-[#211B10] dark:text-amber-300 border border-[#EADFC7] dark:border-[#382E1E]">
                            Fees: {calculateTotalJourneyCost(activeJourney.steps).label}
                          </span>
                          <span className="text-[#65786E] dark:text-[#9FB7AC]">
                            • {activeJourney.location || 'Municipal Guidance'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Clean, Unified Action Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0 w-full lg:w-auto justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#EEF3F0] dark:border-[#1A332B]">
                      <button
                        type="button"
                        onClick={() => setIsCompareOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F2F7F4] dark:bg-[#10221B] dark:hover:bg-[#163328] border border-[#D0DDD5] dark:border-[#224A3E] text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
                        title="Compare statutory routes and procedures side-by-side"
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>Compare Options</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSimulatorOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F2F7F4] dark:bg-[#10221B] dark:hover:bg-[#163328] border border-[#D0DDD5] dark:border-[#224A3E] text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
                        title="Check consequences of skipping or omitting any step"
                      >
                        <Scale className="w-3.5 h-3.5 shrink-0" />
                        <span>What If I Skip a Step?</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const stepToEscalate = (activeJourney.steps && activeJourney.steps.length > 0)
                            ? activeJourney.steps[0]
                            : null;
                          if (stepToEscalate) {
                            setActiveSlaStep(stepToEscalate);
                            setIsSlaModalOpen(true);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] dark:bg-[#151E19] dark:hover:bg-[#201D14] border border-[#E0D8C5] dark:border-[#38301B] text-[#784D13] dark:text-amber-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
                        title="Application taking too long? Generate a formal legal complaint letter."
                      >
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#8C5819]" />
                        <span>SLA Escalation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsEmailModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0F5FA] dark:bg-[#101E22] dark:hover:bg-[#142A30] border border-[#CAD8E2] dark:border-[#1E3B48] text-[#1E5276] dark:text-sky-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
                        title="Send this complete civic roadmap to your email address"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#1E5276]" />
                        <span>Email</span>
                      </button>
                    </div>

                  </div>

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
                      onUpdateStatus={handleUpdateStepStatus}
                      selectedStepId={selectedStep?.id}
                      onQuickSearch={handleSearch}
                    />
                  </ErrorBoundary>
                </div>
              )}
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

          {/* TAB: MUNICIPAL WARD & RTO LOCATOR (Item 28) */}
          {(activeTab === 'ward-map' || activeTab === 'ward-locator') && (
            <WardLocatorView />
          )}

          {/* TAB: GOVERNMENT EVOLUTION & REPLAY TIMELINE (Items 22, 54) */}
          {(activeTab === 'evolution' || activeTab === 'timeline') && (
            <EvolutionTimelineView />
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
              onViewImpactDiff={(u) => setSelectedUpdate(u)}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
            />
          )}

          {/* TAB 6: DEADLINES VIEW */}
          {activeTab === 'deadlines' && (
            <DeadlinesView journey={activeJourney} />
          )}

          {/* TAB 7: CIVIC VERIFICATION QR & PORTFOLIO VIEW */}
          {activeTab === 'passport' && (
            <PassportView
              journey={activeJourney}
              journeys={journeys}
              onSelectJourney={(id) => selectJourney(id)}
            />
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
          step={activeJourney.steps.find((s) => s.id === selectedStep.id) || selectedStep}
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

      {/* H. Themed In-App Blocked Step Alert Modal */}
      {blockedStepError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1A16] border border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Statutory Prerequisite Check
                  </span>
                  <h4 className="text-base font-extrabold text-[#11261F] dark:text-white">
                    Step Cannot Be Marked Ready
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setBlockedStepError(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18392F] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4A5D54] dark:text-[#A2B9AE] leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
              {blockedStepError}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setBlockedStepError(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Understood, Review Dependencies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* H. Item 57: Procedure Simulator & What-If Sandbox Modal */}
      {isSimulatorOpen && (
        <ProcedureSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          journey={activeJourney}
        />
      )}

      {/* I. Brevo Email Roadmap Digest Modal */}
      {isEmailModalOpen && (
        <EmailRoadmapModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          journey={activeJourney}
        />
      )}

      {/* J. "Stuck? Here's What to Do" SLA Escalation & Grievance Modal */}
      {isSlaModalOpen && activeSlaStep && (
        <SlaEscalationModal
          isOpen={isSlaModalOpen}
          onClose={() => {
            setIsSlaModalOpen(false);
            setActiveSlaStep(null);
          }}
          step={activeSlaStep}
          journey={activeJourney}
        />
      )}

      {/* K. Item 73: Side-by-Side Compare Procedures Tool */}
      {isCompareOpen && (
        <CompareProceduresModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          activeJourney={activeJourney}
          onSwitchJourney={(newJourney) => setJourney(newJourney)}
        />
      )}

      {/* L. First-Time User Guided Orientation Tour with Skip option */}
      <CivicOnboardingTour />
    </div>
  );
};

export default RoadmapPage;
