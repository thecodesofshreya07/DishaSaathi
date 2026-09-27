import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, FileCheck2, Send, CheckCircle2, Building2,
  TrendingUp, Clock, BookOpen, ShieldCheck, ChevronRight, Play
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ImpactMetrics {
  totalProcedures: number;
  visitsSaved: number;
  hoursSaved: number;
  verifiedProcedures: number;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

/* ── Ashoka Chakra SVG watermark ── */
const AshokaChakaWatermark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="6" fill="none"/>
    <circle cx="100" cy="100" r="14" fill="currentColor"/>
    <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="3" fill="none"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      const rad = (angle * Math.PI) / 180;
      const x1 = 100 + 16 * Math.cos(rad);
      const y1 = 100 + 16 * Math.sin(rad);
      const x2 = 100 + 70 * Math.cos(rad);
      const y2 = 100 + 70 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>;
    })}
  </svg>
);

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/metrics/impact`)
      .then(r => r.json())
      .then(data => { if (data.success) setMetrics(data.metrics); })
      .catch(() => setMetrics({ totalProcedures: 18, visitsSaved: 22, hoursSaved: 77, verifiedProcedures: 18 }));
  }, []);

  // Cycle through pipeline steps for animation
  useEffect(() => {
    const id = setInterval(() => setActiveStep(p => (p + 1) % 5), 2200);
    return () => clearInterval(id);
  }, []);

  const pipeline = [
    { label: 'Goal', icon: Sparkles, saffron: true },
    { label: 'Documents', icon: FileCheck2, saffron: false },
    { label: 'Apply', icon: Send, saffron: false },
    { label: 'Approval', icon: Building2, saffron: false },
    { label: 'Done', icon: CheckCircle2, saffron: false },
  ];

  const stats = [
    {
      value: metrics ? `${metrics.visitsSaved}+` : '22+',
      label: t.impactVisits,
      description: t.impactVisitsDesc || 'Avoided redundant trips to municipal ward offices & departments',
      icon: TrendingUp,
      color: '#FF9933',
      bg: '#FFF4E6'
    },
    {
      value: metrics ? `${metrics.hoursSaved}+` : '77+',
      label: t.impactHours,
      description: t.impactHoursDesc || 'Estimated citizen time saved navigating confusing queues and paperwork',
      icon: Clock,
      color: '#138808',
      bg: '#E8F5E9'
    },
    {
      value: metrics ? `${metrics.totalProcedures}` : '18',
      label: t.impactProcedures,
      description: t.impactProceduresDesc || 'Civic procedures mapped across municipal, state & central ministries',
      icon: BookOpen,
      color: '#000080',
      bg: '#E8EAF6'
    },
    {
      value: metrics ? `${metrics.verifiedProcedures}/${metrics.totalProcedures}` : '18/18',
      label: t.impactVerified,
      description: t.impactVerifiedDesc || '100% verified against active gazettes, statutory acts and official .gov.in portals',
      icon: ShieldCheck,
      color: '#138808',
      bg: '#E8F5E9'
    },
  ];

  const goals = [
    '"I want to open a restaurant in Pune"',
    '"I want to register my startup in Delhi"',
    '"I want a birth certificate in Mumbai"',
    '"I want a trade license in Bengaluru"',
  ];
  const [goalIdx, setGoalIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGoalIdx(p => (p + 1) % goals.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAFCF9]">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Ashoka Chakra watermark */}
        <AshokaChakaWatermark className="absolute -right-20 top-8 w-[400px] h-[400px] text-[#000080] opacity-[0.03]"/>
      </div>

      {/* ── TRICOLOR TOP STRIPE ── */}
      <div className="relative z-10 flex h-[3px]">
        <div className="flex-1 bg-[#FF9933]"/>
        <div className="flex-1 bg-white border-y border-[#E2E8E4]"/>
        <div className="flex-1 bg-[#138808]"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 lg:pt-20 lg:pb-12">

        {/* ────────────────── HERO CENTER TEXT ────────────────── */}
        <div className="text-center max-w-4xl mx-auto">

          {/* Badge with Ashoka mini-chakra */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#D5E2DB] bg-white mb-7 shadow-xs">
            <svg viewBox="0 0 20 20" className="w-5 h-5 flex-shrink-0" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#000080" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="2" fill="#000080"/>
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i * 360) / 24, r = (a * Math.PI) / 180;
                return <line key={i} x1={10 + 2.5 * Math.cos(r)} y1={10 + 2.5 * Math.sin(r)}
                  x2={10 + 7 * Math.cos(r)} y2={10 + 7 * Math.sin(r)}
                  stroke="#000080" strokeWidth="0.8" strokeLinecap="round"/>;
              })}
            </svg>
            <span className="text-xs font-bold text-[#1B4D3E] tracking-wide">
              🇮🇳 AI-Powered Civic Guidance for Every Indian Citizen
            </span>
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"/>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black text-[#0D1F1A] tracking-tight leading-[1.08] mb-6">
            <span className="block text-[#0D1F1A]">सरकारी काम</span>
            <span className="block mt-1 text-[#1B4D3E]">
              आसान हो जाए।
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-3 text-[#2D6A4F] font-bold">
              We'll show you exactly how.
            </span>
          </h1>

          {/* Animated goal preview */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-[#E0E8E4] shadow-xs min-w-[340px] justify-center">
              <div className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-pulse flex-shrink-0"/>
              <span className="text-sm font-semibold text-[#1B4D3E] italic transition-all duration-500">
                {goals[goalIdx]}
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#4A5D54] leading-relaxed font-normal max-w-2xl mx-auto mb-10">
            DishaSaathi converts your natural-language civic goal into a verified, dependency-aware, jurisdiction-specific roadmap — powered by official .gov.in sources.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button onClick={() => navigate('/create')}
              className="group w-full sm:w-auto px-8 py-4 rounded-full text-white text-base font-bold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg bg-[#1B4D3E] hover:bg-[#133A2E] active:scale-98 cursor-pointer">
              <span>Create My Civic Roadmap</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"/>
            </button>

            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#D5E2DB] bg-white text-[#1B4D3E] text-base font-bold flex items-center justify-center gap-2 hover:bg-[#F3F7F5] transition-all cursor-pointer">
              <Play className="w-4 h-4 fill-[#1B4D3E]"/>
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust dots */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#6C8075]">
            {['No jargon needed', 'Ward-level municipal rules', 'Official .gov.in sources', 'Free · No signup'].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? '#FF9933' : '#138808' }}/>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ────────────────── IMPACT STAT STRIP ────────────────── */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-[#E0EBE4] bg-white shadow-md overflow-hidden">
            {/* Tricolor top strip */}
            <div className="flex h-1">
              <div className="flex-1" style={{ background: '#FF9933' }}/>
              <div className="flex-1 bg-[#000080]"/>
              <div className="flex-1 bg-[#138808]"/>
            </div>
            <div className="px-6 py-5">
              <p className="text-[11px] font-black uppercase tracking-widest text-center text-[#7C6534] mb-5">
                ✦ Impact at a Glance ✦
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex flex-col items-center text-center gap-1.5 p-3.5 sm:p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-2xs"
                      style={{ background: s.bg }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }}/>
                      <span className="text-2xl sm:text-3xl font-black leading-none" style={{ color: s.color }}>
                        {s.value}
                      </span>
                      <span className="text-xs font-bold text-[#11261F] leading-tight">
                        {s.label}
                      </span>
                      <p className="text-[10px] sm:text-[11px] text-[#556960] leading-snug font-medium mt-0.5">
                        {s.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────── ANIMATED PIPELINE CARD ────────────────── */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-[#E0EBE4] bg-white shadow-xs p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C6534]">
                  Civic Pipeline
                </p>
                <h3 className="text-lg sm:text-xl font-black text-[#0D1F1A] mt-0.5">
                  Your Goal → Verified Civic Roadmap
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#FF9933]/40 text-[#B85C00] bg-[#FFF4E6] self-start sm:self-auto whitespace-nowrap">
                5-Stage AI Process
              </span>
            </div>

            {/* Animated pipeline steps */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {pipeline.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === activeStep;
                const isPast = idx < activeStep;
                return (
                  <div key={step.label} className="flex flex-col items-center gap-2 relative">
                    {/* Connector line */}
                    {idx < pipeline.length - 1 && (
                      <div className="absolute top-6 left-[calc(50%+18px)] w-[calc(100%-36px)] h-0.5 rounded-full transition-all duration-500"
                        style={{ background: isPast ? '#138808' : '#E5ECE8' }}/>
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                      isActive
                        ? 'scale-115 shadow-md border-[#1B4D3E] bg-[#1B4D3E]'
                        : isPast
                          ? 'border-[#138808] bg-[#138808]'
                          : 'border-[#E2ECE7] bg-[#F5FAF7]'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'text-white' : isPast ? 'text-white' : 'text-[#8C9B94]'
                      }`}/>
                    </div>
                    <span className={`text-[11px] font-bold text-center transition-all duration-300 leading-tight ${
                      isActive ? 'text-[#E07B00]' : isPast ? 'text-[#138808]' : 'text-[#8C9B94]'
                    }`}>
                      {step.label}
                    </span>
                    <span className={`text-[10px] font-extrabold rounded-full px-1.5 py-0.5 transition-all ${
                      isActive ? 'bg-[#FFF4E6] text-[#B85C00]' : isPast ? 'bg-[#E8F5E9] text-[#138808]' : 'bg-[#F0F4F2] text-[#8C9B94]'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 pt-4 border-t border-[#EDF2EE] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#6C8075] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse"/>
                <span>Live Engine: <strong className="text-[#0D1F1A]">Statutory Procedure Resolution</strong> → Multi-department sequential dependencies mapped</span>
              </p>
              <button onClick={() => navigate('/create')}
                className="text-xs font-bold text-[#138808] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Try your goal <ChevronRight className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── WAVE DIVIDER (saffron → white) ── */}
      <div className="relative z-10 w-full overflow-hidden leading-none mt-4" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path d="M0,0 C360,60 1080,0 1440,60 L1440,60 L0,60 Z" fill="#fff"/>
        </svg>
      </div>
    </section>
  );
};
