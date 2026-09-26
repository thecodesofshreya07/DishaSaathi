import React from 'react';
import { Network, ShieldCheck, Building, RefreshCw, FileText, Clock } from 'lucide-react';

const features = [
  {
    title: 'Prerequisite Dependency Trees',
    description: 'Never get rejected due to missing prior approvals. DishaSaathi sequences steps so you know what comes before what.',
    icon: Network,
    color: '#FF9933',
    bg: '#FFF8F0',
    border: '#FFD199',
    tag: 'Core Intelligence'
  },
  {
    title: 'Official .gov.in Verification',
    description: 'Every step links directly to verified national and state portals (FoSCoS, Udyam, GSTN, MCA) with gazette citations.',
    icon: ShieldCheck,
    color: '#138808',
    bg: '#F0FFF0',
    border: '#A8D5A8',
    tag: 'Trust Layer'
  },
  {
    title: 'Ward-Level Municipal Precision',
    description: 'Handles BMC Mumbai, Delhi MCD, Bengaluru BBMP, Pune PMC and all state statutory nuances in one engine.',
    icon: Building,
    color: '#000080',
    bg: '#F0F2FF',
    border: '#C5C9F0',
    tag: 'Jurisdiction AI'
  },
  {
    title: 'Regulatory Change Detection',
    description: 'When official fees, forms or requirements change, your active roadmap updates automatically in real time.',
    icon: RefreshCw,
    color: '#FF9933',
    bg: '#FFF8F0',
    border: '#FFD199',
    tag: 'Live Updates'
  },
  {
    title: 'Actionable Document Checklists',
    description: 'Get comprehensive document checklists before any ward office visit, eliminating costly repeat trips.',
    icon: FileText,
    color: '#138808',
    bg: '#F0FFF0',
    border: '#A8D5A8',
    tag: 'Docs Engine'
  },
  {
    title: 'Realistic Turnaround Timelines',
    description: 'Understand statutory Right-to-Service SLA timelines and government fees for realistic planning.',
    icon: Clock,
    color: '#000080',
    bg: '#F0F2FF',
    border: '#C5C9F0',
    tag: 'Time Planner'
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 relative overflow-hidden bg-[#FAFCF9]">
      {/* Decorative diagonal tricolor block */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#FF9933]"/>
        <div className="flex-1 bg-[#000080]"/>
        <div className="flex-1 bg-[#138808]"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#000080]/30 bg-[#F0F2FF] text-xs font-bold text-[#000080] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#000080]"/>
            Why DishaSaathi
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D1F1A] tracking-tight mt-2">
            Engineered for{' '}
            <span className="relative text-[#1B4D3E]">
              Indian Civic Realities
              {/* Underline */}
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
                <path d="M0 5 C75 0 225 10 300 5" stroke="#FF9933" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="mt-5 text-base text-[#4A5D54] leading-relaxed max-w-2xl mx-auto">
            Government information shouldn't require hiring an agent. DishaSaathi bridges the gap with intelligent civic technology built for India.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feat => {
            const Icon = feat.icon;
            return (
              <div key={feat.title}
                className="group relative p-7 rounded-3xl border hover:shadow-md transition-all duration-300 cursor-default overflow-hidden bg-white"
                style={{ borderColor: feat.border }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                    style={{ background: `${feat.color}15`, borderColor: `${feat.color}40` }}>
                    <Icon className="w-6 h-6" style={{ color: feat.color }}/>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                    style={{ color: feat.color, borderColor: `${feat.color}40`, background: `${feat.color}10` }}>
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0D1F1A] tracking-tight mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#4A5D54] leading-relaxed">
                  {feat.description}
                </p>

                {/* Bottom color bar */}
                <div className="mt-6 h-0.5 rounded-full opacity-30 group-hover:opacity-70 transition-opacity"
                  style={{ background: feat.color }}/>
              </div>
            );
          })}
        </div>

        {/* Bottom banner */}
        <div className="mt-16 rounded-3xl overflow-hidden shadow-lg bg-[#11261F] border border-[#1B4D3E]/30 text-white">
          <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
                Ready to navigate your civic journey?
              </h3>
              <p className="text-sm text-[#A8D5C2] max-w-lg">
                Join thousands of citizens who have already simplified their government procedures with DishaSaathi.
              </p>
            </div>
            <a href="/create"
              className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#11261F] text-sm font-bold shadow-md hover:bg-[#F3F7F5] transition-all">
              <span>Start Free</span>
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
