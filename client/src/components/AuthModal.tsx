import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
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
        const res = await register(name.trim(), email.trim(), password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to register account');
        }
      } else {
        const res = await login(email.trim(), password);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B4D3E] to-[#143B2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center border border-white/20 overflow-hidden shadow-xs">
              <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {isRegisterMode ? 'Create Citizen Account' : 'Sign in to DishaSaathi'}
              </h3>
              <p className="text-xs text-emerald-200">
                Sync roadmaps across devices with persistent account storage
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
