import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

import { useAuth } from './AuthContext';
import { initialDefaultJourneys } from '../data/defaultJourneys';

interface RoadmapContextType {
  intake: GoalIntake;
  setIntake: React.Dispatch<React.SetStateAction<GoalIntake>>;
  updateIntakeField: (field: keyof GoalIntake, value: string) => void;
  journey: CivicJourney | null;
  setJourney: React.Dispatch<React.SetStateAction<CivicJourney | null>>;
  journeys: CivicJourney[];
  setJourneys: React.Dispatch<React.SetStateAction<CivicJourney[]>>;
  activeJourneyId: string | null;
  setActiveJourneyId: React.Dispatch<React.SetStateAction<string | null>>;
  selectJourney: (journeyId: string) => void;
  deleteJourney: (journeyId: string) => Promise<void>;
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
  refineGoal: (params: { goal?: string; city?: string; state?: string; additionalContext?: string; journey?: CivicJourney }) => Promise<{ success: boolean; diff?: RoadmapDiff; message?: string }>;
  recheckRoadmap: () => Promise<{ success: boolean; message: string }>;
  isCopilotOpen: boolean;
  setIsCopilotOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadDemoJourneys: () => void;
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
  if (!data.id || !data.title || !Array.isArray(data.steps) || data.steps.length === 0) {
    return null;
  }
  return { ...data, dataVersion: DATA_VERSION } as CivicJourney;
}

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user || null;
  const token = auth?.token || null;

  // Initialize clean intake
  const [intake, setIntake] = useState<GoalIntake>(defaultIntake);

  // User-scoped journeys collection
  const [journeys, setJourneys] = useState<CivicJourney[]>(() => {
    try {
      const userKey = user?.id ? `dishasaathi_journeys_${user.id}` : 'dishasaathi_guest_journeys';
      const raw = localStorage.getItem(userKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.map(validateStoredJourney).filter(Boolean) as CivicJourney[];
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.warn('Could not load user journeys from local cache', e);
    }
    // Brand new or logged-in citizens start with an empty workspace; guests see initial default journeys
    return user ? [] : initialDefaultJourneys;
  });

  // Active Journey ID
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(() => {
    if (user?.id) {
      try {
        const raw = localStorage.getItem(`dishasaathi_journeys_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
        }
      } catch {}
      return null;
    }
    return initialDefaultJourneys.length > 0 ? initialDefaultJourneys[0].id : null;
  });

  // Currently active journey
  const [journey, setJourney] = useState<CivicJourney | null>(() => {
    if (user?.id) {
      try {
        const raw = localStorage.getItem(`dishasaathi_journeys_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.map(validateStoredJourney).filter(Boolean) as CivicJourney[];
            if (valid.length > 0) return valid[0];
          }
        }
      } catch {}
      return null;
    }
    return initialDefaultJourneys.length > 0 ? initialDefaultJourneys[0] : null;
  });

  const handleSetJourney: React.Dispatch<React.SetStateAction<CivicJourney | null>> = (action) => {
    setJourney((prev) => {
      const newJourney = typeof action === 'function' ? (action as (prevState: CivicJourney | null) => CivicJourney | null)(prev) : action;
      if (newJourney) {
        setActiveJourneyId(newJourney.id);
        setJourneys((prevList) => {
          const exists = prevList.some((j) => j.id === newJourney.id);
          const nextList = exists
            ? prevList.map((j) => (j.id === newJourney.id ? newJourney : j))
            : [newJourney, ...prevList];
          try {
            const userKey = user?.id ? `dishasaathi_journeys_${user.id}` : 'dishasaathi_guest_journeys';
            localStorage.setItem(userKey, JSON.stringify(nextList));
            localStorage.setItem(user?.id ? `dishasaathi_saved_journey_${user.id}` : 'dishasaathi_saved_journey', JSON.stringify(newJourney));
          } catch (e) {
            console.warn('Cache write error:', e);
          }
          return nextList;
        });

        if (user && token) {
          fetch('/api/user/journey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ journey: newJourney })
          }).catch((err) => console.warn('Background journey sync error:', err));
        }
      }
      return newJourney;
    });
  };

  const [updates, setUpdates] = useState<GovernmentUpdate[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [generationStages, setGenerationStages] = useState<GenerationStage[]>(defaultStages);
  const [hasSavedProgress, setHasSavedProgress] = useState<boolean>(false);
  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState<ActionRecommendation | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Sync active journey when activeJourneyId or journeys changes
  useEffect(() => {
    if (activeJourneyId) {
      const matched = journeys.find((j) => j.id === activeJourneyId);
      if (matched) {
        setJourney(matched);
      } else if (journeys.length > 0) {
        setActiveJourneyId(journeys[0].id);
        setJourney(journeys[0]);
      } else {
        setJourney(null);
      }
    } else if (journeys.length > 0) {
      setActiveJourneyId(journeys[0].id);
      setJourney(journeys[0]);
    } else {
      setJourney(null);
    }
  }, [activeJourneyId, journeys]);

  // Track currently active user ID and hydration status to prevent cross-user leakage
  const currentLoadedUserIdRef = React.useRef<string | null>(user?.id || null);
  const isHydratedRef = React.useRef<boolean>(false);

  // Load user-specific journeys from Database on login / account switch
  useEffect(() => {
    const currentUserId = user?.id || null;

    // Detect user change (login, logout, switch account)
    if (currentLoadedUserIdRef.current !== currentUserId) {
      currentLoadedUserIdRef.current = currentUserId;
      isHydratedRef.current = false;

      if (!currentUserId) {
        // Switched to Guest: load guest journeys or default template
        try {
          const guestRaw = localStorage.getItem('dishasaathi_guest_journeys');
          if (guestRaw) {
            const parsed = JSON.parse(guestRaw);
            if (Array.isArray(parsed)) {
              const valid = parsed.map(validateStoredJourney).filter(Boolean) as CivicJourney[];
              if (valid.length > 0) {
                setJourneys(valid);
                setActiveJourneyId(valid[0].id);
                setJourney(valid[0]);
                isHydratedRef.current = true;
                return;
              }
            }
          }
        } catch {}
        setJourneys(initialDefaultJourneys);
        setActiveJourneyId(initialDefaultJourneys[0]?.id || null);
        setJourney(initialDefaultJourneys[0] || null);
        isHydratedRef.current = true;
        return;
      } else {
        // Switched to a logged-in user:
        // Try local storage for THIS SPECIFIC user first
        let localFound = false;
        try {
          const userRaw = localStorage.getItem(`dishasaathi_journeys_${currentUserId}`);
          if (userRaw) {
            const parsed = JSON.parse(userRaw);
            if (Array.isArray(parsed)) {
              const valid = parsed.map(validateStoredJourney).filter(Boolean) as CivicJourney[];
              if (valid.length > 0) {
                setJourneys(valid);
                setActiveJourneyId(valid[0].id);
                setJourney(valid[0]);
                localFound = true;
              }
            }
          }
        } catch {}

        if (!localFound) {
          // Immediately set clean empty state for new user while fetching DB (do NOT show old user's journey)
          setJourneys([]);
          setActiveJourneyId(null);
          setJourney(null);
        }
      }
    }

    // Now fetch fresh data from DB for the logged-in user
    if (user && token) {
      fetch('/api/user/journeys', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch user journeys from database');
        })
        .then((data) => {
          // Guard: make sure user didn't change while fetch was running
          if (currentLoadedUserIdRef.current !== user.id) return;

          const loadedJourneys = (data.success && Array.isArray(data.journeys)) ? data.journeys : [];
          if (loadedJourneys.length > 0) {
            const valid = loadedJourneys.map(validateStoredJourney).filter(Boolean) as CivicJourney[];
            setJourneys(valid);
            localStorage.setItem(`dishasaathi_journeys_${user.id}`, JSON.stringify(valid));
            setActiveJourneyId(valid[0].id);
            setJourney(valid[0]);
          } else {
            // Brand new citizen account: exactly 0 journeys (clean workspace, never copy others)
            setJourneys([]);
            localStorage.setItem(`dishasaathi_journeys_${user.id}`, JSON.stringify([]));
            setActiveJourneyId(null);
            setJourney(null);
          }
          isHydratedRef.current = true;
        })
        .catch((err) => {
          console.warn('Backend user journeys sync:', err);
          isHydratedRef.current = true;
        });
    } else {
      isHydratedRef.current = true;
    }
  }, [user?.id, token]);

  // Select a specific journey
  const selectJourney = (journeyId: string) => {
    const target = journeys.find((j) => j.id === journeyId);
    if (target) {
      setActiveJourneyId(target.id);
      setJourney(target);
    }
  };

  // Delete a journey
  const deleteJourney = async (journeyId: string) => {
    const updated = journeys.filter((j) => j.id !== journeyId);
    setJourneys(updated);
    if (activeJourneyId === journeyId) {
      if (updated.length > 0) {
        setActiveJourneyId(updated[0].id);
        setJourney(updated[0]);
      } else {
        setActiveJourneyId(null);
        setJourney(null);
      }
    }

    if (user?.id) {
      localStorage.setItem(`dishasaathi_journeys_${user.id}`, JSON.stringify(updated));
    }

    if (token) {
      try {
        await fetch(`/api/user/journeys/${journeyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Cloud DB delete error:', err);
      }
    }
  };

  // Load demo sample roadmap for citizen if requested
  const loadDemoJourneys = () => {
    setJourneys(initialDefaultJourneys);
    if (initialDefaultJourneys.length > 0) {
      setActiveJourneyId(initialDefaultJourneys[0].id);
      setJourney(initialDefaultJourneys[0]);
      if (user?.id) {
        localStorage.setItem(`dishasaathi_journeys_${user.id}`, JSON.stringify(initialDefaultJourneys));
        if (token) {
          fetch('/api/user/journeys', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ journeys: initialDefaultJourneys })
          }).catch((err) => console.warn('Demo journeys sync error:', err));
        }
      }
    }
  };

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

  // Sync journeys to DB & local storage ONLY when user has modified journeys (never during account switch)
  useEffect(() => {
    // CRITICAL: Only sync if hydration has finished and this is the active user
    if (!isHydratedRef.current) return;
    if (user?.id && currentLoadedUserIdRef.current === user.id) {
      localStorage.setItem(`dishasaathi_journeys_${user.id}`, JSON.stringify(journeys));
      if (token) {
        fetch('/api/user/journeys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ journeys })
        }).catch((err) => console.warn('Cloud DB multi-journey sync error:', err));
      }
    } else if (!user) {
      localStorage.setItem('dishasaathi_guest_journeys', JSON.stringify(journeys));
    }
  }, [journeys]);

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
    if (journey && user?.id) {
      try {
        const toSave: CivicJourney = { ...journey, dataVersion: DATA_VERSION };
        sessionStorage.setItem('dishasaathi_journey', JSON.stringify(toSave));
        localStorage.setItem(`dishasaathi_journey_${user.id}`, JSON.stringify(toSave));
      } catch (e) {
        console.warn('Could not save journey to storage', e);
      }
    }
  }, [journey, user?.id]);

  // Load updates on mount
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const resUpdates = await fetch('/api/updates');
        if (resUpdates.ok) {
          const dataU = await resUpdates.json();
          if (dataU.updates) setUpdates(dataU.updates);
        }
      } catch (err) {
        console.warn('Backend updates sync:', err);
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
          const generatedJourney: CivicJourney = {
            ...data.journey,
            id: data.journey.id || `journey-${Date.now()}`,
            dataVersion: DATA_VERSION
          };
          setJourney(generatedJourney);
          setActiveJourneyId(generatedJourney.id);
          setJourneys((prev) => {
            const index = prev.findIndex(
              (j) => j.id === generatedJourney.id || (j.title && j.title.toLowerCase() === generatedJourney.title.toLowerCase())
            );
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = generatedJourney;
              return updated;
            }
            return [generatedJourney, ...prev];
          });
          setIsGenerating(false);
          return generatedJourney;
        }
      }
      throw new Error('Failed to generate journey from backend');
    } catch (err) {
      console.error('Error during roadmap generation:', err);
      setGenerationStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
      setIsGenerating(false);
      return null;
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
    if (!journey) return { success: false, message: 'No active roadmap' };

    const step = journey.steps.find((s) => s.id === stepId);
    if (!step) return { success: false, message: 'Step not found' };

    // 1. Client-Side Prerequisite & Dependency Check
    if (status === 'Completed') {
      const prereqs = step.prerequisites || step.dependsOn || [];
      const uncompletedPrereqs = prereqs.filter((prereqId) => {
        const p = journey.steps.find(
          (s) =>
            s.id === prereqId ||
            s.id === `step-${prereqId}` ||
            String(s.stepNumber) === String(prereqId) ||
            prereqId === `step-${s.stepNumber}`
        );
        return p && p.status !== 'Completed';
      });

      if (uncompletedPrereqs.length > 0) {
        const prereqTitles = uncompletedPrereqs.map((prereqId) => {
          const p = journey.steps.find(
            (s) =>
              s.id === prereqId ||
              s.id === `step-${prereqId}` ||
              String(s.stepNumber) === String(prereqId) ||
              prereqId === `step-${s.stepNumber}`
          );
          return p ? p.title.replace(/^\d+\.\s*/, '') : prereqId;
        });

        return {
          success: false,
          blocked: true,
          message: `Prerequisite steps must be completed first: ${prereqTitles.join(', ')}`
        };
      }
    }

    // 2. Immediate Optimistic State Update
    const updatedSteps = journey.steps.map((s) => (s.id === stepId ? { ...s, status } : s));
    const completedCount = updatedSteps.filter((s) => s.status === 'Completed').length;
    const updatedJourney: CivicJourney = {
      ...journey,
      steps: updatedSteps,
      completedSteps: completedCount,
      status: completedCount === updatedSteps.length && updatedSteps.length > 0 ? 'Completed' : 'In Progress'
    };

    setJourney(updatedJourney);
    setActiveJourneyId(updatedJourney.id);
    setJourneys((prev) => {
      const exists = prev.some((j) => j.id === updatedJourney.id);
      return exists ? prev.map((j) => (j.id === updatedJourney.id ? updatedJourney : j)) : [updatedJourney, ...prev];
    });

    try {
      localStorage.setItem('dishasaathi_saved_journey', JSON.stringify(updatedJourney));
      const userKey = user?.id ? `dishasaathi_journeys_${user.id}` : 'dishasaathi_guest_journeys';
      const currentList = journeys.map((j) => (j.id === updatedJourney.id ? updatedJourney : j));
      const exists = currentList.some((j) => j.id === updatedJourney.id);
      const listToSave = exists ? currentList : [updatedJourney, ...currentList];
      localStorage.setItem(userKey, JSON.stringify(listToSave));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    // 3. Sync to Backend in Background
    try {
      fetch(`/api/journey/steps/${stepId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status, journeyId: journey.id })
      }).catch((err) => console.warn('Background status sync:', err));
    } catch {
      // Offline fallback
    }

    return { success: true };
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

      const updatedJourney: CivicJourney = {
        ...journey,
        steps: updatedSteps,
        totalDocuments: totalDocs,
        readyDocuments: readyDocs,
        pendingDocuments: pendingDocs
      };

      setJourney(updatedJourney);
      setJourneys((prev) => prev.map((j) => (j.id === updatedJourney.id ? updatedJourney : j)));
    }

    // 2. Sync to Backend
    try {
      const res = await fetch(`/api/journey/steps/${stepId}/documents/${docId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status, journeyId: journey?.id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.journey && (!user || data.journey.id === journey?.id)) {
          setJourney(data.journey);
          setJourneys((prev) => prev.map((j) => (j.id === data.journey.id ? data.journey : j)));
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
        if (data.journey) {
          setJourney(data.journey);
          setJourneys((prev) => prev.map((j) => (j.id === data.journey.id ? data.journey : j)));
        }
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

  const resetToDefault = (_force?: boolean): boolean => {
    setIntake(defaultIntake);
    sessionStorage.removeItem('dishasaathi_intake');
    return true;
  };

  const resumeSavedProgress = () => {
    try {
      const key = user?.id ? `dishasaathi_saved_journey_${user.id}` : 'dishasaathi_saved_journey';
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as CivicJourney;
        if (parsed) {
          setJourney(parsed);
          setActiveJourneyId(parsed.id);
          setHasSavedProgress(false);
        }
      }
    } catch (e) {
      console.error('Could not resume saved progress', e);
    }
  };

  const refineGoal = async (params: { goal?: string; city?: string; state?: string; additionalContext?: string; journey?: CivicJourney }) => {
    try {
      const targetJourney = params.journey || journey;
      const res = await fetch('/api/journey/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          journey: targetJourney
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) {
          setJourney(data.journey);
          setJourneys((prev) => prev.map((j) => (j.id === data.journey.id ? data.journey : j)));
          if (data.recommendation) setAdaptiveRecommendation(data.recommendation);
          return { success: true, diff: data.diff };
        }
      }
      const errData = await res.json().catch(() => null);
      return { success: false, message: errData?.error || 'Server could not refine roadmap' };
    } catch (err: any) {
      console.error('Failed to refine goal', err);
      return { success: false, message: err?.message || 'Failed to refine goal' };
    }
  };

  const recheckRoadmap = async () => {
    try {
      const res = await fetch('/api/journey/recheck', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.journey) {
          setJourney(data.journey);
          setJourneys((prev) => prev.map((j) => (j.id === data.journey.id ? data.journey : j)));
        }
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
        setJourney: handleSetJourney,
        journeys,
        setJourneys,
        activeJourneyId,
        setActiveJourneyId,
        selectJourney,
        deleteJourney,
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
        setIsCopilotOpen,
        loadDemoJourneys
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

const defaultRoadmapValue: RoadmapContextType = {
  intake: defaultIntake,
  setIntake: () => {},
  updateIntakeField: () => {},
  journey: initialDefaultJourneys[0] || null,
  setJourney: () => {},
  journeys: initialDefaultJourneys,
  setJourneys: () => {},
  activeJourneyId: initialDefaultJourneys[0]?.id || null,
  setActiveJourneyId: () => {},
  selectJourney: () => {},
  deleteJourney: async () => {},
  updates: [],
  setUpdates: () => {},
  isGenerating: false,
  activeStageIndex: 0,
  generationStages: defaultStages,
  generateRoadmap: async () => null,
  updateStepStatus: async () => ({ success: false }),
  updateDocumentStatus: async () => ({ success: false }),
  applyUpdate: async () => {},
  resetToDefault: () => false,
  hasSavedProgress: false,
  resumeSavedProgress: () => {},
  adaptiveRecommendation: null,
  refineGoal: async () => ({ success: false }),
  recheckRoadmap: async () => ({ success: false, message: '' }),
  isCopilotOpen: false,
  setIsCopilotOpen: () => {},
  loadDemoJourneys: () => {}
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  return context || defaultRoadmapValue;
};

