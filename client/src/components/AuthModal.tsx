import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  // auth handled via direct API calls (no RoadmapContext dependency)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        }).then(r => r.json());
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to register account');
        }
      } else {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }).then(r => r.json());
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bhumika@dishasaathi.gov.in', password: 'citizen123' })
      }).then(r => r.json());
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B4D3E] to-[#143B2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {isRegisterMode ? 'Create Citizen Account' : 'Sign in to DishaSaathi'}
              </h3>
              <p className="text-xs text-emerald-200">
                Sync roadmaps across devices with persistent SQLite storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Login Pill for Hackathon Judges */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full p-3 rounded-2xl bg-[#EAF2ED] border border-[#CDE3D7] hover:bg-[#DEEFE5] text-[#1B4D3E] text-xs font-bold flex items-center justify-between transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-[#1B4D3E]" />
              <div>
                <span className="block font-extrabold">1-Click Hackathon Demo Login</span>
                <span className="text-[11px] text-[#4A5D54] font-normal">Bhumika Sharma (bhumika@dishasaathi.gov.in)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1B4D3E] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Or {isRegisterMode ? 'Register' : 'Sign In'} with Email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-[#11261F] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#6C8075]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bhumika Sharma"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#11261F] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#6C8075]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#11261F] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#6C8075]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#F8FAF9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#153D31] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : isRegisterMode ? 'Create Account & Sync' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
