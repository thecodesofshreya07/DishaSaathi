import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, LogOut } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { AdminValidationModal } from '../components/AdminValidationModal';
import { useRoadmap } from '../context/RoadmapContext';
import { useAuth } from '../context/AuthContext';
import { GovernmentUpdate } from '../types';

export const AdminValidationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { updates, setUpdates, applyUpdate, resetToDefault } = useRoadmap();
  const [localUpdates, setLocalUpdates] = useState<GovernmentUpdate[]>(updates);

  useEffect(() => {
    setLocalUpdates(updates);
  }, [updates]);

  const handleApproveUpdate = async (updateId: string) => {
    // 1. Instantly update local state to Approved
    setLocalUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, reviewStatus: 'Approved' } : u))
    );
    setUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, reviewStatus: 'Approved' } : u))
    );

    // 2. Persist to server / roadmap
    try {
      await applyUpdate(updateId);
    } catch (err) {
      console.error('Failed to apply update to roadmap:', err);
    }
  };

  const handleRejectUpdate = (updateId: string) => {
    setLocalUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, reviewStatus: 'Rejected' } : u))
    );
    setUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, reviewStatus: 'Rejected' } : u))
    );
  };

  const handleResetJourney = () => {
    resetToDefault(true);
    navigate('/roadmap');
  };

  const handleUpdatesReceived = (newUpdates: GovernmentUpdate[]) => {
    setLocalUpdates(newUpdates);
    setUpdates(newUpdates);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#08120F] text-[#11261F] dark:text-[#E8F1EC] flex flex-col font-sans">
      {/* Standard Navbar (Always present) */}
      <Navbar />

      {/* Main Admin Console Body (Dedicated Full Page Review Console) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Top Breadcrumb & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0D1A16] p-4 sm:p-5 rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#11261F] dark:text-white">
                  Government Gazetted Rule & AI Verification Console
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Officer Mode
                </span>
              </div>
              <p className="text-xs text-[#5C7066] dark:text-[#8C9B94] mt-0.5">
                Logged in as <strong>{user?.name || 'Chief Validation Officer'}</strong> ({user?.email || 'admin@dishasaathi.gov.in'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* Dedicated Admin Full-Page Console */}
        <div className="w-full">
          <AdminValidationModal
            updates={localUpdates}
            onClose={() => {}}
            onApproveUpdate={handleApproveUpdate}
            onRejectUpdate={handleRejectUpdate}
            onUpdatesReceived={handleUpdatesReceived}
            isPageMode={true}
          />
        </div>

      </main>
    </div>
  );
};

export default AdminValidationPage;
