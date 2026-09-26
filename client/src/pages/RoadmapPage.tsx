import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, RotateCcw, Clock, Tv } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { RightSidebar } from '../components/RightSidebar';
import { HeroBanner } from '../components/HeroBanner';
import { CivicJourneyPipeline } from '../components/CivicJourneyPipeline';
import { FeatureCards } from '../components/FeatureCards';
import { StepDetailModal } from '../components/StepDetailModal';
import { ReactFlowGraphModal } from '../components/ReactFlowGraphModal';
import { ChangeDetectionModal } from '../components/ChangeDetectionModal';
import { AdminValidationModal } from '../components/AdminValidationModal';
import { AiAssistantModal } from '../components/AiAssistantModal';
import { DemoModeToolbar } from '../components/DemoModeToolbar';
import { CivicCopilot } from '../components/CivicCopilot';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CivicJourney, GovernmentUpdate, ProcedureStep, StepStatus, CivicDocumentStatus } from '../types';
import { useRoadmap } from '../context/RoadmapContext';

export const RoadmapPage: React.FC = () => {
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
    isPresentationMode,
    setIsPresentationMode,
    isCopilotOpen,
    setIsCopilotOpen
  } = useRoadmap();

  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [selectedStep, setSelectedStep] = useState<ProcedureStep | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<GovernmentUpdate | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiFocusStepId, setAiFocusStepId] = useState<string | undefined>(undefined);

  // Handle Natural Language Search right from the roadmap hero bar
  const handleSearch = async (goal: string) => {
    setLoading(true);
    try {
      const generated = await generateRoadmap({ goal });
      if (generated) {
        setJourney(generated);
      }
    } catch (err) {
      console.error('Failed to interpret task', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step status change (with prerequisite enforcement)
  const handleUpdateStepStatus = async (
    stepId: string,
    status: StepStatus
  ) => {
    const result = await updateStepStatusContext(stepId, status);
    if (!result.success && result.blocked) {
      alert(`🔒 Step Blocked: ${result.message}`);
      return;
    }

    if (journey) {
      const updated = journey.steps.find((s: ProcedureStep) => s.id === stepId);
      if (updated) setSelectedStep({ ...updated, status });
    }
  };

  // Apply change to roadmap
  const handleApplyUpdateToRoadmap = async (updateId: string) => {
    await applyUpdateContext(updateId);
    setSelectedUpdate(null);
  };

  // Admin Approve update
  const handleAdminApprove = async (updateId: string) => {
    await handleApplyUpdateToRoadmap(updateId);
  };

  // Admin Reject update
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

  // Reset Demo Baseline
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/journey/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) setJourney(data.journey);
        alert('Demo state reset to clean baseline.');
      }
    } catch (err) {
      console.error('Failed to reset demo', err);
    }
  };

  const handleDownloadRoadmap = () => {
    if (!journey) return;
    const roadmapText = `DISHASAATHI CIVIC ROADMAP\n\nTask: ${journey.title}\nLocation: ${journey.location}\nStatus: ${journey.status}\nCompleted: ${journey.completedSteps}/${journey.totalSteps}\n\n` +
      journey.steps.map(s => `${s.stepNumber}. ${s.title} [${s.status}]\n   Department: ${s.department}\n   Fee: ${s.fee?.amount}\n   Docs: ${s.documents.map(d => d.name).join(', ')}\n   URL: ${s.applicationUrl}\n`).join('\n');

    const blob = new Blob([roadmapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dishasaathi-${journey.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Safe fallback if journey hasn't loaded yet
  const activeJourney: CivicJourney = journey || {
    id: 'journey-default',
    title: intake.goal || 'Register a Small Business',
    query: intake.goal || 'Register a small business in Mumbai',
    location: `${intake.city}, ${intake.state}`,
    category: 'Business & Commercial Permitting',
    totalSteps: 5,
    completedSteps: 1,
    pendingDocuments: 3,
    lastUpdated: 'Updated today',
    status: 'In Progress',
    steps: []
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-[#11261F] antialiased">
      {/* Phase 5 Hackathon Demo Mode Toolbar (Section 27, 28, 29, 30) */}
      <DemoModeToolbar />

      {!isPresentationMode && (
        <>
          {/* Phase 2 Context Sub-Bar */}
          <div className="bg-[#EAF2ED] border-b border-[#D5E3DB] px-4 py-2 text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 font-bold text-[#1B4D3E] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Goal Intake</span>
                </Link>
                <span className="text-[#8C9B94]">•</span>
                <span className="text-[#4A5D54] font-medium">
                  Active Roadmap for: <strong className="text-[#11261F]">"{activeJourney.title}"</strong> ({activeJourney.location})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (resetToDefault()) {
                      window.location.href = '/create';
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#8C3A27] font-bold border border-[#E9C3BA] hover:bg-[#FDF3F1] transition-all shadow-2xs cursor-pointer text-xs"
                  title="Reset current roadmap after confirmation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Start New Roadmap</span>
                </button>

                <Link
                  to="/create"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#1B4D3E] font-bold border border-[#CDE3D7] hover:bg-[#F2F8F5] transition-all shadow-2xs"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Create New Roadmap</span>
                </Link>

                <Link
                  to="/"
                  className="text-[#4A5D54] hover:text-[#11261F] font-semibold"
                >
                  Landing Page
                </Link>
              </div>
            </div>
          </div>

          {/* 1. Global Navigation Bar */}
          <Navbar
            onSearch={handleSearch}
            unreadCount={updates.filter((u) => u.reviewStatus === 'Pending Review').length}
            onOpenNotifications={() => {
              if (updates.length > 0) setSelectedUpdate(updates[0]);
            }}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        </>
      )}

      {/* 2. Main 3-Column Layout (Optimized for Presentation Mode when active) */}
      <div className={`flex max-w-[1720px] mx-auto ${isPresentationMode ? 'justify-center' : ''}`}>
        {/* Left Sidebar (hidden in Presentation Mode) */}
        {!isPresentationMode && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'updates' && updates.length > 0) {
                setSelectedUpdate(updates[0]);
              }
            }}
            updatesCount={updates.filter((u) => u.reviewStatus === 'Pending Review').length}
          />
        )}

        {/* Center Main Stage Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-7 min-w-0 ${isPresentationMode ? 'max-w-[1380px]' : 'max-w-[1140px]'}`}>
          {/* Presentation Mode Notice Banner */}
          {isPresentationMode && (
            <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-amber-700" />
                <span className="font-semibold">
                  Presentation Mode Active — Max visibility for projectors and pitches.
                </span>
              </div>
              <button
                onClick={() => setIsPresentationMode(false)}
                className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold transition-colors cursor-pointer text-xs"
              >
                Exit Presentation Mode
              </button>
            </div>
          )}

          {/* Phase 4 Resume Experience Banner */}
          {hasSavedProgress && !isPresentationMode && (
            <div className="mb-4 bg-[#EAF2ED] border-2 border-[#1B4D3E]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#11261F] text-sm flex items-center gap-1.5">
                    Continue your roadmap
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] font-bold">
                      Saved Progress
                    </span>
                  </h4>
                  <p className="text-xs text-[#4A5D54]">
                    You completed {activeJourney.completedSteps} of {activeJourney.totalSteps} steps and have {activeJourney.readyDocuments || 0} of {activeJourney.totalDocuments || 0} documents ready.
                  </p>
                </div>
              </div>
              <button
                onClick={resumeSavedProgress}
                className="w-full sm:w-auto px-4 py-2 bg-[#1B4D3E] hover:bg-[#153D31] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer text-center"
              >
                Continue Roadmap
              </button>
            </div>
          )}

          {/* Hero Banner with Gateway of India Monument Artwork (hidden in Presentation Mode for max compact focus) */}
          {!isPresentationMode && (
            <HeroBanner
              onSearch={handleSearch}
              isLoading={loading}
            />
          )}

          {/* Core Interactive Roadmap Pipeline */}
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

          {/* 4 Feature Cards (hidden in Presentation Mode) */}
          {!isPresentationMode && (
            <FeatureCards
              onOpenAiAssistant={() => {
                setAiFocusStepId(undefined);
                setIsCopilotOpen(true);
              }}
              onExploreServices={() => setIsGraphModalOpen(true)}
              onHowItWorks={() => setIsGraphModalOpen(true)}
              onWhyDishaSaathi={() => {
                if (updates.length > 0) setSelectedUpdate(updates[0]);
              }}
            />
          )}
        </main>

        {/* Right Sidebar: Progress, Updates, Quick Actions (hidden in Presentation Mode) */}
        {!isPresentationMode && (
          <RightSidebar
            completedSteps={activeJourney.completedSteps}
            totalSteps={activeJourney.totalSteps}
            updates={updates}
            onSelectUpdate={(u) => setSelectedUpdate(u)}
            onViewAllUpdates={() => {
              if (updates.length > 0) setSelectedUpdate(updates[0]);
            }}
            onDownloadRoadmap={handleDownloadRoadmap}
            onExploreServices={() => setIsGraphModalOpen(true)}
          />
        )}
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
          onResetDemo={handleResetDemo}
          onUpdatesReceived={(newUpdates) => setUpdates(newUpdates)}
        />
      )}

      {/* E. DishaSaathi AI Assistant Modal (Legacy trigger support) */}
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

      {/* F. Phase 5 Civic Copilot Drawer (Section 1, 2, 4) */}
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
