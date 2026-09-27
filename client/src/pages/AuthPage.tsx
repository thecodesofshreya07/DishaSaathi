import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignupRoute = location.pathname === '/signup' || searchParams.get('mode') === 'signup';
  const [mode, setMode] = useState<'login' | 'signup'>(isSignupRoute ? 'signup' : 'login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register, logout, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Synchronize mode if query/path changes
  React.useEffect(() => {
    if (location.pathname === '/signup' || searchParams.get('mode') === 'signup') {
      setMode('signup');
    } else if (location.pathname === '/login' || searchParams.get('mode') === 'login') {
      setMode('login');
    }
  }, [location.pathname, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password, phone);
        if (res.success) {
          navigate('/roadmap');
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          navigate('/roadmap');
        } else {
          setError(res.error || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between font-sans text-[#11261F]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E2EBE5] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E0EBE4] p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
            <img src="/images/logo.png" alt="DishaSaathi Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#11261F] block leading-tight">
              DishaSaathi
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6C8075]">
              National Civic Navigation Portal
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4D3E] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#D5E3DB] shadow-xl overflow-hidden">
          
          {/* Left Hero / Brand Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1B4D3E] via-[#153D31] to-[#0E2820] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/20 mb-6 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified Citizen Access</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                One Account.<br />
                Every Verified<br />
                Civic Procedure.
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 mt-3 leading-relaxed">
                Log in to securely track your business licenses, permits, statutory documents, and automated gazette compliance alerts across all 18 mapped municipal services.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-emerald-50">
                  Persistent progress across devices
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-emerald-50">
                  Document locker with direct application links
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-emerald-50">
                  100% verified against statutory gazettes
                </span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {/* Active Session Notification if logged in */}
            {isAuthenticated && user && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900 font-medium">
                    Logged in as <strong>{user.name}</strong> ({user.email})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/roadmap')}
                    className="px-3 py-1 rounded-lg bg-[#1B4D3E] text-white text-[11px] font-bold hover:bg-[#143B2F] cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-[11px] font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tabs Toggle */}
            <div className="flex bg-[#F1F6F3] p-1 rounded-2xl border border-[#DCE8E0] mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#1B4D3E] shadow-2xs'
                    : 'text-[#5C7066] hover:text-[#11261F]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#1B4D3E] shadow-2xs'
                    : 'text-[#5C7066] hover:text-[#11261F]'
                }`}
              >
                Register Citizen Account
              </button>
            </div>

            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-[#11261F]">
                {mode === 'login' ? 'Welcome Back, Citizen' : 'Create Your Citizen Account'}
              </h3>
              <p className="text-xs text-[#6C8075] mt-1">
                {mode === 'login'
                  ? 'Enter your credentials to resume your active bureaucratic journey'
                  : 'Get instant access to personalized civic roadmaps and statutory guidance'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-[#7E9388]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#FAFCFB]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#7E9388]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@domain.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#FAFCFB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7E9388]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#FAFCFB]"
                  />
                </div>
                {mode === 'signup' && (
                  <span className="text-[10px] text-[#7E9388] mt-1 block">
                    Minimum 6 characters
                  </span>
                )}
              </div>

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#FAFCFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11261F] mb-1.5">
                      Jurisdiction / City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-[#FAFCFB]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to DishaSaathi' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[#6C8075]">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                  >
                    Register free
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-[#7E9388] border-t border-[#E2EBE5]">
        DishaSaathi • Built for Indian Municipal & Central Statutory Compliance • Verified Against Active Gazettes
      </footer>
    </div>
  );
};

export default AuthPage;
