import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  FileText,
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Car,
  Store,
  Home,
  Briefcase,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { initialDefaultJourneys } from '../../data/defaultJourneys';
import { CivicJourney } from '../../types';

const journeyImages: Record<string, string> = {
  'journey-demo-bakery': '/images/bakery-roadmap.jpg',
  'journey-demo-driving': '/images/driving-license.jpg',
  'journey-demo-startup': '/images/startup-roadmap.jpg',
  'journey-demo-property': '/images/property-mutation.jpg'
};

const journeyTags: Record<string, string[]> = {
  'journey-demo-bakery': ['BMC Gumasta', 'FSSAI Food License', 'NOC Fire/Health'],
  'journey-demo-driving': ['Parivahan Sarathi', 'LL Slot Booking', 'Biometric & Test'],
  'journey-demo-startup': ['MCA SPICe+', 'DIN & PAN/TAN', 'Startup India DPIIT'],
  'journey-demo-property': ['MCD Property Tax', 'Sub-Registrar', 'NOC & Mutation']
};

export const PopularRoadmapsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { selectJourney } = useRoadmap();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All Roadmaps' },
    { id: 'Business & Commerce', label: 'Business & Food', icon: Store },
    { id: 'Licensing & Transport', label: 'Driving & RTO', icon: Car },
    { id: 'Property & Municipal', label: 'Property & Municipal', icon: Home },
  ];

  const filteredJourneys = initialDefaultJourneys.filter((journey) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Licensing & Transport' && journey.category.includes('Transport')) return true;
    return journey.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleOpenJourney = (journey: CivicJourney) => {
    selectJourney(journey.id);
    navigate('/roadmap');
  };

  return (
    <section id="roadmaps" className="py-20 sm:py-28 bg-[#F4F8F5] relative overflow-hidden border-b border-[#E2E8F0]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1B4D3E]/20 text-xs font-bold text-[#1B4D3E] mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Pre-Compiled Statutory Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0D1F1A]">
            Explore Verified <span className="text-[#1B4D3E]">Civic Blueprints</span>
          </h2>
          <p className="mt-4 text-base text-[#4A5D54] leading-relaxed max-w-2xl mx-auto font-medium">
            Grounded in active municipal gazettes and statutory acts. Select any blueprint to inspect sequenced steps, mandatory forms, and official government fees.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#1B4D3E] text-white shadow-md'
                    : 'bg-white text-[#4A5D54] hover:bg-[#EAF2ED] hover:text-[#1B4D3E] border border-[#DCE4DF]'
                }`}
              >
                {cat.icon && <cat.icon className="w-4 h-4" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Roadmaps Bento Grid with Real Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredJourneys.map((journey) => {
            const totalSteps = journey.steps.length;
            const imgSrc = journeyImages[journey.id] || '/images/bakery-roadmap.jpg';
            const tags = journeyTags[journey.id] || ['Statutory Pathway', 'Verified Gates'];

            return (
              <div
                key={journey.id}
                className="group bg-white rounded-3xl border border-[#D8E4DC] hover:border-[#1B4D3E]/40 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* High-Resolution Photographic Header */}
                  <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-900">
                    <img
                      src={imgSrc}
                      alt={journey.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1B4D3E] shadow-sm">
                        {journey.category}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                        <Building2 className="w-3.5 h-3.5 text-[#6EE7B7]" />
                        <span>{journey.location || 'India'}</span>
                      </span>
                    </div>

                    {/* Title in Header */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                        {journey.title}
                      </h3>
                      <p className="text-xs text-slate-200 mt-1 line-clamp-1 italic">
                        "{journey.query}"
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7">
                    {/* Statutory Tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#F2F8F5] text-[#1B4D3E] border border-[#D1E6DC]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Sequenced Milestones */}
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#6C8075] mb-2.5 flex items-center justify-between">
                      <span>Sequenced Milestones</span>
                      <span className="text-[11px] font-semibold text-[#1B4D3E]">{totalSteps} Total Stages</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      {journey.steps.slice(0, 3).map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF9] border border-[#E8ECE9] text-xs hover:bg-white hover:border-[#CBD5E1] transition-all"
                        >
                          <div className="flex items-center gap-3 truncate max-w-[72%]">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                step.status === 'Completed'
                                  ? 'bg-emerald-600 text-white'
                                  : step.status === 'In Progress'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {step.stepNumber}
                            </span>
                            <span className="font-bold text-[#0D1F1A] truncate">
                              {step.title.replace(/^\d+\.\s*/, '')}
                            </span>
                          </div>
                          <span className="font-extrabold text-[#1B4D3E] text-[11px] shrink-0 bg-white px-2 py-0.5 rounded-md border border-[#E0EBE4]">
                            {step.fee?.amount || '₹0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-[#EDF2EE] flex items-center justify-between gap-4 flex-wrap bg-[#FAFCF9]">
                  <div className="flex items-center gap-3.5 text-xs text-[#5A6D64] font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1B4D3E]" />
                      <span>{'2-4 Weeks'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#FF9933]" />
                      <span>{journey.totalDocuments || 4} Docs</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#10B981]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenJourney(journey)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Inspect Pathway</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Goal Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-[#D8E4DC] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center shrink-0 border border-[#1B4D3E]/20">
              <Zap className="w-7 h-7 text-[#10B981]" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-[#0D1F1A]">
                Need a roadmap for a different business or citizen procedure?
              </h4>
              <p className="text-xs sm:text-sm text-[#4A5D54] mt-1">
                Type any goal in plain words — from municipal trade licenses to state subsidies — and DishaSaathi will synthesize a verified roadmap in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="shrink-0 px-7 py-3.5 rounded-2xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Generate Custom Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
