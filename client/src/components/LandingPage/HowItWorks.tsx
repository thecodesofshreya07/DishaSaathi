import React from 'react';
import { MessageSquare, GitFork, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    num: '01',
    title: 'Tell Us Your Goal',
    description: 'Describe what you want in plain language — no department jargon, no code names. Just write what you want to accomplish.',
    icon: MessageSquare,
    accent: '#FF9933',
    bg: '#FFF8F0',
    border: '#FFD199',
    badgeBg: '#FFF0DC',
    badgeText: '#B85C00',
  },
  {
    num: '02',
    title: 'AI Maps the Procedure',
    description: 'The civic engine analyzes your goal against official municipal bylaws, identifying required registrations, documents, fees, and prerequisite sequences.',
    icon: GitFork,
    accent: '#000080',
    bg: '#F0F2FF',
    border: '#C5C9F0',
    badgeBg: '#E8EAF6',
    badgeText: '#000080',
  },
  {
    num: '03',
    title: 'Follow Your Roadmap',
    description: 'Receive an ordered, actionable sequence. Track progress, view documents, visit official portals, and get alerts when statutory rules change.',
    icon: CheckCircle,
    accent: '#138808',
    bg: '#F0FFF0',
    border: '#A8D5A8',
    badgeBg: '#E8F5E9',
    badgeText: '#0D6B05',
  },
];

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]"/>
          <div className="flex-1 bg-[#000080]"/>
          <div className="flex-1 bg-[#138808]"/>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1B4D3E]/20 bg-[#F3F7F5] text-xs font-bold text-[#1B4D3E] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E]"/>
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D1F1A] tracking-tight mt-2">
            How <span className="text-[#1B4D3E]">DishaSaathi</span> Works
          </h2>
          <p className="mt-4 text-base text-[#4A5D54] leading-relaxed max-w-2xl mx-auto">
            From a simple civic goal to an official, dependency-aware roadmap — in under 10 seconds.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line on desktop */}
          <div className="absolute top-12 left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-0.5 bg-[#E0EBE4] hidden md:block"/>

          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="relative rounded-3xl p-7 flex flex-col justify-between hover:shadow-md transition-all group border bg-white"
                style={{ borderColor: s.border }}>
                {/* Step number + icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs border bg-[#F8FAF9]"
                      style={{ borderColor: s.border }}>
                      <Icon className="w-7 h-7" style={{ color: s.accent }}/>
                    </div>
                    <span className="text-5xl font-black opacity-20 leading-none font-mono"
                      style={{ color: s.accent }}>
                      {s.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#0D1F1A] tracking-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#4A5D54] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button onClick={() => navigate('/create')}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg transition-all bg-[#1B4D3E] hover:bg-[#133A2E] active:scale-98 cursor-pointer">
            <span>Start with your civic goal</span>
            <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </section>
  );
};
