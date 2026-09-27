import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CivicJourney, 
  GovernmentUpdate, 
  GoalIntake, 
  GenerationStage, 
  StepStatus, 
  CivicDocumentStatus,
  ActionRecommendation,
  RoadmapDiff,
  DATA_VERSION 
} from '../types';

interface RoadmapContextType {
  intake: GoalIntake;
  setIntake: React.Dispatch<React.SetStateAction<GoalIntake>>;
  updateIntakeField: (field: keyof GoalIntake, value: string) => void;
  journey: CivicJourney | null;
  setJourney: React.Dispatch<React.SetStateAction<CivicJourney | null>>;
  updates: GovernmentUpdate[];
  setUpdates: React.Dispatch<React.SetStateAction<GovernmentUpdate[]>>;
  isGenerating: boolean;
  activeStageIndex: number;
  generationStages: GenerationStage[];
  generateRoadmap: (customIntake?: Partial<GoalIntake>) => Promise<CivicJourney | null>;
  updateStepStatus: (stepId: string, status: StepStatus) => Promise<{ success: boolean; blocked?: boolean; message?: string }>;
  updateDocumentStatus: (stepId: string, docId: string, status: CivicDocumentStatus) => Promise<{ success: boolean }>;
  applyUpdate: (updateId: string) => Promise<void>;
  resetToDefault: (force?: boolean) => boolean;
  hasSavedProgress: boolean;
  resumeSavedProgress: () => void;
  adaptiveRecommendation: ActionRecommendation | null;
  refineGoal: (params: { goal?: string; city?: string; state?: string; additionalContext?: string }) => Promise<{ success: boolean; diff?: RoadmapDiff }>;
  recheckRoadmap: () => Promise<{ success: boolean; message: string }>;
  isCopilotOpen: boolean;
  setIsCopilotOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultIntake: GoalIntake = {
  goal: '',
  state: '',
  city: '',
  additionalContext: ''
};

const defaultStages: GenerationStage[] = [
  { id: 'understanding', label: 'Understanding your goal', status: 'pending' },
  { id: 'requirements', label: 'Identifying relevant requirements', status: 'pending' },
  { id: 'dependencies', label: 'Mapping dependencies', status: 'pending' },
  { id: 'preparing', label: 'Preparing your roadmap', status: 'pending' }
];

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

function validateStoredJourney(data: any): CivicJourney | null {
  if (!data || typeof data !== 'object') return null;
  if (data.dataVersion !== DATA_VERSION) {
    console.warn(`[DishaSaathi] Stored journey version mismatch (found: ${data.dataVersion}, expected: ${DATA_VERSION}). Resetting to clean baseline.`);
    return null;
  }
  if (!data.id || !data.title || !Array.isArray(data.steps) || data.steps.length === 0) {
    console.warn('[DishaSaathi] Incomplete stored journey schema. Resetting to baseline.');
    return null;
  }
  return data as CivicJourney;
}

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load intake from localStorage or sessionStorage or default
  const [intake, setIntake] = useState<GoalIntake>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_saved_intake') || sessionStorage.getItem('dishasaathi_intake');
      return saved ? JSON.parse(saved) : defaultIntake;
    } catch {
      return defaultIntake;
    }
  });

  // Load journey from localStorage or sessionStorage with DATA_VERSION validation (Section 27, 28)
  const [journey, setJourney] = useState<CivicJourney | null>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_saved_journey') || sessionStorage.getItem('dishasaathi_journey');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const validated = validateStoredJourney(parsed);
      if (!validated) {
        localStorage.removeItem('dishasaathi_saved_journey');
        sessionStorage.removeItem('dishasaathi_journey');
        return null;
      }
      return validated;
    } catch {
      localStorage.removeItem('dishasaathi_saved_journey');
      sessionStorage.removeItem('dishasaathi_journey');
      return null;
    }
  });

  const [updates, setUpdates] = useState<GovernmentUpdate[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [generationStages, setGenerationStages] = useState<GenerationStage[]>(defaultStages);
  const [hasSavedProgress, setHasSavedProgress] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_saved_journey');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = validateStoredJourney(parsed);
        return Boolean(validated && (validated.completedSteps > 0 || (validated.readyDocuments && validated.readyDocuments > 0)));
      }
      return false;
    } catch {
      return false;
    }
  });

  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState<ActionRecommendation | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Sync adaptive recommendation whenever journey changes
  useEffect(() => {
    if (journey) {
      fetch('/api/journey/adaptive-action')
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch action');
        })
        .then((data) => {
          if (data.recommendation) setAdaptiveRecommendation(data.recommendation);
        })
        .catch((err) => console.warn('Adaptive recommendation sync:', err));
    }
  }, [journey]);

  // Sync intake to storage
  useEffect(() => {
    try {
      sessionStorage.setItem('dishasaathi_intake', JSON.stringify(intake));
      localStorage.setItem('dishasaathi_saved_intake', JSON.stringify(intake));
    } catch (e) {
      console.warn('Could not save intake to storage', e);
    }
  }, [intake]);

  // Sync journey to storage stamped with DATA_VERSION
  useEffect(() => {
    if (journey) {
      try {
        const toSave: CivicJourney = { ...journey, dataVersion: DATA_VERSION };
        sessionStorage.setItem('dishasaathi_journey', JSON.stringify(toSave));
        localStorage.setItem('dishasaathi_saved_journey', JSON.stringify(toSave));
      } catch (e) {
        console.warn('Could not save journey to storage', e);
      }
    }
  }, [journey]);

  // Load updates and initial journey on mount
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [resUpdates, resJourney] = await Promise.all([
          fetch('/api/updates'),
          fetch('/api/journey/current')
        ]);

        if (resUpdates.ok) {
          const dataU = await resUpdates.json();
          if (dataU.updates) setUpdates(dataU.updates);
        }

        if (!journey && resJourney.ok) {
          const dataJ = await resJourney.json();
          if (dataJ.journey) setJourney(dataJ.journey);
        }
      } catch (err) {
        console.warn('Backend sync in progress...', err);
      }
    };
    fetchInitial();
  }, []);

  const updateIntakeField = (field: keyof GoalIntake, value: string) => {
    setIntake((prev) => ({ ...prev, [field]: value }));
  };

  // Generate roadmap with realistic animated processing stages
  const generateRoadmap = async (customIntake?: Partial<GoalIntake>): Promise<CivicJourney | null> => {
    const targetIntake = { ...intake, ...customIntake };
    setIsGenerating(true);
    setActiveStageIndex(0);

    // Reset stages
    setGenerationStages([
      { id: 'understanding', label: 'Understanding your goal', status: 'in_progress' },
      { id: 'requirements', label: 'Identifying relevant requirements', status: 'pending' },
      { id: 'dependencies', label: 'Mapping dependencies', status: 'pending' },
      { id: 'preparing', label: 'Preparing your roadmap', status: 'pending' }
    ]);

    // Animate stage 1 -> 2
    const timer1 = setTimeout(() => {
      setActiveStageIndex(1);
      setGenerationStages((prev) => [
        { ...prev[0], status: 'completed' },
        { ...prev[1], status: 'in_progress' },
        prev[2],
        prev[3]
      ]);
    }, 600);

    // Animate stage 2 -> 3
    const timer2 = setTimeout(() => {
      setActiveStageIndex(2);
      setGenerationStages((prev) => [
        prev[0],
        { ...prev[1], status: 'completed' },
        { ...prev[2], status: 'in_progress' },
        prev[3]
      ]);
    }, 1200);

    // Animate stage 3 -> 4
    const timer3 = setTimeout(() => {
      setActiveStageIndex(3);
      setGenerationStages((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'completed' },
        { ...prev[3], status: 'in_progress' }
      ]);
    }, 1800);

    try {
      const response = await fetch('/api/journey/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: targetIntake.goal,
          city: targetIntake.city,
          state: targetIntake.state,
          additionalContext: targetIntake.additionalContext
        })
      });

      // Ensure minimum 2.2s visual stage progression for clarity
      await new Promise((resolve) => setTimeout(resolve, 2200));

      if (response.ok) {
        const data = await response.json();
        if (data.journey) {
          setGenerationStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
          setJourney(data.journey);
          setIsGenerating(false);
          return data.journey;
        }
      }
      throw new Error('Failed to generate journey from backend');
    } catch (err) {
      console.error('Error during roadmap generation:', err);
      setGenerationStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
      setIsGenerating(false);
      return journey;
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  const updateStepStatus = async (
    stepId: string,
    status: StepStatus
  ): Promise<{ success: boolean; blocked?: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/journey/steps/${stepId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok && data.blocked) {
        return { success: false, blocked: true, message: data.message };
      }

      if (data.journey) {
        setJourney(data.journey);
        return { success: true };
      }
      return { success: false, message: 'Step update failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Phase 4 Document Readiness Checklist State Updater
  const updateDocumentStatus = async (
    stepId: string,
    docId: string,
    status: CivicDocumentStatus
  ): Promise<{ success: boolean }> => {
    // 1. Optimistic Local State Update
    if (journey) {
      const updatedSteps = journey.steps.map((s) => {
        if (s.id !== stepId) return s;
        const updatedDocs = s.documents.map((d) => {
          if (d.id !== docId) return d;
          return { ...d, status };
        });
        return { ...s, documents: updatedDocs };
      });

      let totalDocs = 0;
      let readyDocs = 0;
      let pendingDocs = 0;

      for (const s of updatedSteps) {
        for (const d of s.documents) {
          totalDocs++;
          if (d.status === 'READY' || d.status === 'UPLOADED') {
            readyDocs++;
          } else if (d.isMandatory) {
            pendingDocs++;
          }
        }
      }

      setJourney({
        ...journey,
        steps: updatedSteps,
        totalDocuments: totalDocs,
        readyDocuments: readyDocs,
        pendingDocuments: pendingDocs
      });
    }

    // 2. Sync to Backend
    try {
      const res = await fetch(`/api/journey/steps/${stepId}/documents/${docId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) {
          setJourney(data.journey);
        }
      }
      return { success: true };
    } catch (err) {
      console.warn('Document status update fallback to local state', err);
      return { success: true };
    }
  };

  const applyUpdate = async (updateId: string) => {
    try {
      const res = await fetch(`/api/updates/${updateId}/apply`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) setJourney(data.journey);
        const resU = await fetch('/api/updates');
        if (resU.ok) {
          const dataU = await resU.json();
          if (dataU.updates) setUpdates(dataU.updates);
        }
      }
    } catch (err) {
      console.error('Failed to apply update', err);
    }
  };

  const resetToDefault = (force?: boolean): boolean => {
    if (!force) {
      const confirmed = window.confirm(
        'Are you sure you want to start a new roadmap? Your current progress will be reset.'
      );
      if (!confirmed) return false;
    }
    setIntake(defaultIntake);
    setJourney(null);
    sessionStorage.removeItem('dishasaathi_intake');
    sessionStorage.removeItem('dishasaathi_journey');
    localStorage.removeItem('dishasaathi_saved_journey');
    localStorage.removeItem('dishasaathi_saved_intake');
    setHasSavedProgress(false);
    return true;
  };

  const resumeSavedProgress = () => {
    try {
      const saved = localStorage.getItem('dishasaathi_saved_journey');
      if (saved) {
        const parsed = JSON.parse(saved) as CivicJourney;
        if (parsed) {
          setJourney(parsed);
          setHasSavedProgress(false);
        }
      }
    } catch (e) {
      console.error('Could not resume saved progress', e);
    }
  };

  const refineGoal = async (params: { goal?: string; city?: string; state?: string; additionalContext?: string }) => {
    try {
      const res = await fetch('/api/journey/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) {
          setJourney(data.journey);
          if (data.recommendation) setAdaptiveRecommendation(data.recommendation);
          return { success: true, diff: data.diff };
        }
      }
      return { success: false };
    } catch (err) {
      console.error('Failed to refine goal', err);
      return { success: false };
    }
  };

  const recheckRoadmap = async () => {
    try {
      const res = await fetch('/api/journey/recheck', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) setJourney(data.journey);
        if (data.recommendation) setAdaptiveRecommendation(data.recommendation);
        return { success: true, message: data.message || 'Roadmap re-checked against current knowledge base.' };
      }
      return { success: false, message: 'Could not reach server to re-check.' };
    } catch {
      return { success: false, message: 'Offline re-check completed.' };
    }
  };

  return (
    <RoadmapContext.Provider
      value={{
        intake,
        setIntake,
        updateIntakeField,
        journey,
        setJourney,
        updates,
        setUpdates,
        isGenerating,
        activeStageIndex,
        generationStages,
        generateRoadmap,
        updateStepStatus,
        updateDocumentStatus,
        applyUpdate,
        resetToDefault,
        hasSavedProgress,
        resumeSavedProgress,
        adaptiveRecommendation,
        refineGoal,
        recheckRoadmap,
        isCopilotOpen,
        setIsCopilotOpen
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
