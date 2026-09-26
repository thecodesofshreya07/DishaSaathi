import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { GenerationLoader } from '../components/GenerationLoader';

export const GoalIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    intake,
    updateIntakeField,
    generateRoadmap,
    isGenerating,
    generationStages
  } = useRoadmap();

  const [errors, setErrors] = useState<{ goal?: string; location?: string }>({});

  const stateCityMap: Record<string, string[]> = {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Navi Mumbai', 'Aurangabad (Chhatrapati Sambhajinagar)'],
    Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
    'Uttar Pradesh': ['Lucknow', 'Noida', 'Kanpur', 'Varanasi', 'Agra'],
    'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur']
  };

  const quickPills = [
    'I want to start a small bakery in Mumbai.',
    'I want to construct a house on my property.',
    'I want to register a new vehicle.',
    'I need to apply for a government certificate.',
    'I want to open a small food business.'
  ];

  const handleStateChange = (newState: string) => {
    updateIntakeField('state', newState);
    const availableCities = stateCityMap[newState] || ['Mumbai'];
    updateIntakeField('city', availableCities[0]);
    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { goal?: string; location?: string } = {};

    if (!intake.goal.trim()) {
      newErrors.goal = "Tell us what you'd like to accomplish.";
    }

    if (!intake.state.trim() || !intake.city.trim()) {
      newErrors.location = 'Add your location so we can build a relevant roadmap.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const generated = await generateRoadmap(intake);
      if (generated) {
        navigate('/roadmap');
      }
    } catch (err) {
      console.error('Failed to generate roadmap', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-between font-sans text-[#11261F]">
      {/* 1. Header */}
      <header className="bg-white border-b border-[#E8ECE9] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-[#4A5D54] hover:text-[#11261F] text-xs font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black text-[#11261F] tracking-tight">
              DishaSaathi
            </span>
          </Link>

          <div className="text-xs text-[#6C8075] font-semibold hidden sm:block">
            Step 1 of 2: Goal Intake
          </div>
        </div>
      </header>

      {/* 2. Main Intake Card */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="bg-white rounded-3xl border border-[#D5E3DB] p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2ED] text-[#1B4D3E] text-[11px] font-bold mb-3 border border-[#CDE3D7]">
            <Sparkles className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span>Procedural Intake & Jurisdiction Mapping</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#11261F] tracking-tight">
            What do you want to accomplish?
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#4A5D54] leading-relaxed font-normal">
            You can describe your goal in your own words. No need to know department names, license codes, or government legal terminology.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Section 1: Main Goal Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="goal-input" className="text-xs font-extrabold uppercase tracking-wider text-[#11261F]">
                  Your Civic or Commercial Goal <span className="text-[#C53929]">*</span>
                </label>
                <span className="text-[11px] text-[#6C8075]">Natural language</span>
              </div>

              <div className="relative">
                <textarea
                  id="goal-input"
                  rows={3}
                  value={intake.goal}
                  onChange={(e) => {
                    updateIntakeField('goal', e.target.value);
                    if (errors.goal) setErrors((prev) => ({ ...prev, goal: undefined }));
                  }}
                  placeholder="Example: I want to start a small bakery in Mumbai."
                  className={`w-full p-4 rounded-2xl border text-sm sm:text-base font-medium text-[#11261F] placeholder-[#8C9B94] focus:outline-none transition-all resize-none ${
                    errors.goal
                      ? 'border-[#C53929] bg-[#FDF0ED]/30 ring-2 ring-[#C53929]/20'
                      : 'border-[#D0DDD5] bg-[#FAFDFB] focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/15'
                  }`}
                />
              </div>

              {/* Inline Validation Error */}
              {errors.goal && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#C53929] animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.goal}</span>
                </div>
              )}

              {/* Quick Preset Goal Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#6C8075]">Quick suggestions:</span>
                {quickPills.map((pill) => (
                  <button
                    type="button"
                    key={pill}
                    onClick={() => {
                      updateIntakeField('goal', pill);
                      if (errors.goal) setErrors((prev) => ({ ...prev, goal: undefined }));
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F3F7F5] hover:bg-[#E6F0EB] text-[#1B4D3E] border border-[#D5E3DB] transition-all cursor-pointer"
                  >
                    + {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Location Selection */}
            <div className="pt-6 border-t border-[#EDF2EE]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#11261F] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B4D3E]" />
                  <span>Where are you planning to do this? <span className="text-[#C53929]">*</span></span>
                </label>
              </div>

              <p className="text-xs text-[#6C8075] mb-3 leading-relaxed">
                Civic procedures, ward bylaws, and municipal fees depend heavily on your local jurisdiction.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State Dropdown */}
                <div>
                  <label htmlFor="state-select" className="block text-[11px] font-bold text-[#4A5D54] mb-1">
                    State
                  </label>
                  <select
                    id="state-select"
                    value={intake.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#D0DDD5] bg-[#FAFDFB] text-xs sm:text-sm font-semibold text-[#11261F] focus:outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/15 cursor-pointer"
                  >
                    {Object.keys(stateCityMap).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Dropdown */}
                <div>
                  <label htmlFor="city-select" className="block text-[11px] font-bold text-[#4A5D54] mb-1">
                    City / Municipal Corporation
                  </label>
                  <select
                    id="city-select"
                    value={intake.city}
                    onChange={(e) => {
                      updateIntakeField('city', e.target.value);
                      if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                    }}
                    className="w-full p-3 rounded-2xl border border-[#D0DDD5] bg-[#FAFDFB] text-xs sm:text-sm font-semibold text-[#11261F] focus:outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/15 cursor-pointer"
                  >
                    {(stateCityMap[intake.state] || ['Mumbai']).map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errors.location && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#C53929] animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.location}</span>
                </div>
              )}
            </div>

            {/* Section 3: Optional Context */}
            <div className="pt-6 border-t border-[#EDF2EE]">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="context-input" className="text-xs font-extrabold uppercase tracking-wider text-[#11261F]">
                  Anything else we should know? <span className="text-[#6C8075] text-[10px] font-semibold">(Optional)</span>
                </label>
                <span className="text-[11px] text-[#6C8075]">Minimum input → maximum guidance</span>
              </div>

              <p className="text-xs text-[#6C8075] mb-2 leading-relaxed">
                Mention details like estimated staff count, home-based vs commercial premises, or specific licenses you already hold.
              </p>

              <textarea
                id="context-input"
                rows={2}
                value={intake.additionalContext || ''}
                onChange={(e) => updateIntakeField('additionalContext', e.target.value)}
                placeholder="Example: This will be a small home-based bakery with under 5 employees."
                className="w-full p-3.5 rounded-2xl border border-[#D0DDD5] bg-[#FAFDFB] text-xs sm:text-sm font-medium text-[#11261F] placeholder-[#8C9B94] focus:outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/15 transition-all resize-none"
              />
            </div>

            {/* Section 4: Primary CTA Button */}
            <div className="pt-6 border-t border-[#EDF2EE] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6C8075]">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D3E]" />
                <span>Zero signup required • Free instant roadmap generation</span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <span>Generate My Roadmap</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="py-6 border-t border-[#E8ECE9] text-center text-xs text-[#6C8075] bg-white">
        DishaSaathi • Municipal & State Civic Path Visualizer • Verified Procedural Guidance
      </footer>

      {/* 4. Generation Screen Overlay (shows when generating) */}
      {isGenerating && (
        <GenerationLoader
          goal={intake.goal}
          city={intake.city}
          state={intake.state}
          stages={generationStages}
        />
      )}
    </div>
  );
};

export default GoalIntakePage;
